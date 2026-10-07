import { createServer } from 'node:http'
import { createReadStream, existsSync, mkdirSync, statSync } from 'node:fs'
import { resolve, extname, join, normalize } from 'node:path'
import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto'
import { DatabaseSync } from 'node:sqlite'
import { fileURLToPath } from 'node:url'

const root = resolve(fileURLToPath(new URL('.', import.meta.url)))
const publicDir = join(root, 'dist')
const dataDir = resolve(process.env.DATA_DIR || join(root, '.data'))
const port = Number(process.env.PORT || 3000)
const production = process.env.NODE_ENV === 'production'
const sessionDays = 7

mkdirSync(dataDir, { recursive: true })
const db = new DatabaseSync(join(dataDir, 'cap-mco.sqlite'))
db.exec(`
  PRAGMA journal_mode = WAL;
  PRAGMA foreign_keys = ON;
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('teacher', 'student')),
    password_hash TEXT NOT NULL,
    salt TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS sessions (
    token_hash TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at INTEGER NOT NULL
  );
  CREATE TABLE IF NOT EXISTS progress (
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id INTEGER NOT NULL CHECK(chapter_id BETWEEN 1 AND 15),
    course INTEGER NOT NULL DEFAULT 0,
    score INTEGER,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, chapter_id)
  );
`)

const normalizeEmail = (value) => String(value || '').trim().toLowerCase()
const validEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 180
const passwordHash = (password, salt) => scryptSync(password, salt, 64).toString('hex')
const tokenHash = (token) => createHash('sha256').update(token).digest('hex')

function createUser({ email, name, password, role = 'student' }) {
  email = normalizeEmail(email)
  name = String(name || '').trim()
  if (!validEmail(email)) throw new HttpError(400, 'Adresse e-mail invalide.')
  if (name.length < 2 || name.length > 100) throw new HttpError(400, 'Le nom doit contenir entre 2 et 100 caractères.')
  if (String(password).length < 10 || String(password).length > 200) throw new HttpError(400, 'Le mot de passe doit contenir au moins 10 caractères.')
  const salt = randomBytes(16).toString('hex')
  try {
    return db.prepare('INSERT INTO users (email, name, role, password_hash, salt) VALUES (?, ?, ?, ?, ?) RETURNING id, email, name, role').get(email, name, role, passwordHash(String(password), salt), salt)
  } catch (error) {
    if (String(error).includes('UNIQUE')) throw new HttpError(409, 'Un compte utilise déjà cette adresse e-mail.')
    throw error
  }
}

const teacherCount = db.prepare("SELECT COUNT(*) AS count FROM users WHERE role = 'teacher'").get().count
if (teacherCount === 0) {
  const email = normalizeEmail(process.env.TEACHER_EMAIL)
  const password = process.env.TEACHER_PASSWORD
  const name = String(process.env.TEACHER_NAME || 'Espace enseignante').trim()
  if (validEmail(email) && password?.length >= 10) createUser({ email, name, password, role: 'teacher' })
  else console.warn('Configuration initiale requise : définir TEACHER_EMAIL et TEACHER_PASSWORD (10 caractères minimum).')
}

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status }
}

const loginAttempts = new Map()
function checkLoginLimit(key) {
  const now = Date.now()
  const current = loginAttempts.get(key)
  if (!current || current.reset < now) {
    loginAttempts.set(key, { count: 1, reset: now + 15 * 60_000 })
    return
  }
  current.count += 1
  if (current.count > 8) throw new HttpError(429, 'Trop de tentatives. Réessayez dans quelques minutes.')
}

const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' }
const sendJson = (res, status, data) => { res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }); res.end(JSON.stringify(data)) }

async function readJson(req) {
  let body = ''
  for await (const chunk of req) {
    body += chunk
    if (body.length > 32_768) throw new HttpError(413, 'Requête trop volumineuse.')
  }
  try { return body ? JSON.parse(body) : {} } catch { throw new HttpError(400, 'Données invalides.') }
}

function cookies(req) {
  return Object.fromEntries(String(req.headers.cookie || '').split(';').map((part) => part.trim().split('=').map(decodeURIComponent)).filter(([key]) => key))
}

function currentUser(req) {
  const token = cookies(req).cap_mco_session
  if (!token) return null
  return db.prepare(`SELECT users.id, users.email, users.name, users.role
    FROM sessions JOIN users ON users.id = sessions.user_id
    WHERE sessions.token_hash = ? AND sessions.expires_at > ? AND users.active = 1`).get(tokenHash(token), Date.now()) || null
}

function requireUser(req, role) {
  const user = currentUser(req)
  if (!user) throw new HttpError(401, 'Connexion requise.')
  if (role && user.role !== role) throw new HttpError(403, 'Accès réservé à l’enseignante.')
  return user
}

function checkOrigin(req) {
  if (!['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) return
  const origin = req.headers.origin
  if (!origin) return
  if (process.env.APP_ORIGIN) {
    if (origin !== process.env.APP_ORIGIN) throw new HttpError(403, 'Origine refusée.')
    return
  }
  try {
    if (new URL(origin).host !== req.headers.host) throw new HttpError(403, 'Origine refusée.')
  } catch (error) {
    if (error instanceof HttpError) throw error
    throw new HttpError(403, 'Origine refusée.')
  }
}

async function api(req, res, url) {
  checkOrigin(req)
  if (req.method === 'GET' && url.pathname === '/api/health') return sendJson(res, 200, { ok: true })

  if (req.method === 'POST' && url.pathname === '/api/login') {
    const body = await readJson(req)
    const email = normalizeEmail(body.email)
    const key = `${req.socket.remoteAddress}:${email}`
    checkLoginLimit(key)
    const record = db.prepare('SELECT * FROM users WHERE email = ? AND active = 1').get(email)
    const supplied = passwordHash(String(body.password || ''), record?.salt || '00000000000000000000000000000000')
    const expected = record?.password_hash || '0'.repeat(128)
    const correct = supplied.length === expected.length && timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
    if (!record || !correct) throw new HttpError(401, 'Adresse e-mail ou mot de passe incorrect.')
    loginAttempts.delete(key)
    const token = randomBytes(32).toString('base64url')
    const expires = Date.now() + sessionDays * 86_400_000
    db.prepare('DELETE FROM sessions WHERE expires_at <= ?').run(Date.now())
    db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(tokenHash(token), record.id, expires)
    const cookie = `cap_mco_session=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${sessionDays * 86400}${production ? '; Secure' : ''}`
    res.setHeader('Set-Cookie', cookie)
    return sendJson(res, 200, { user: { id: record.id, email: record.email, name: record.name, role: record.role } })
  }

  if (req.method === 'POST' && url.pathname === '/api/logout') {
    const token = cookies(req).cap_mco_session
    if (token) db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(tokenHash(token))
    res.setHeader('Set-Cookie', `cap_mco_session=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${production ? '; Secure' : ''}`)
    return sendJson(res, 200, { ok: true })
  }

  if (req.method === 'GET' && url.pathname === '/api/me') return sendJson(res, 200, { user: requireUser(req) })

  if (req.method === 'GET' && url.pathname === '/api/progress') {
    const user = requireUser(req)
    const rows = db.prepare('SELECT chapter_id, course, score FROM progress WHERE user_id = ?').all(user.id)
    return sendJson(res, 200, { progress: Object.fromEntries(rows.map((row) => [row.chapter_id, { course: Boolean(row.course), ...(row.score === null ? {} : { score: row.score }) }])) })
  }

  const progressMatch = url.pathname.match(/^\/api\/progress\/(\d+)$/)
  if (req.method === 'PUT' && progressMatch) {
    const user = requireUser(req)
    const chapterId = Number(progressMatch[1])
    if (chapterId < 1 || chapterId > 15) throw new HttpError(400, 'Chapitre invalide.')
    const body = await readJson(req)
    const existing = db.prepare('SELECT course, score FROM progress WHERE user_id = ? AND chapter_id = ?').get(user.id, chapterId)
    const course = body.course === undefined ? Boolean(existing?.course) : Boolean(body.course)
    const score = body.score === undefined ? (existing?.score ?? null) : Number(body.score)
    if (score !== null && (!Number.isInteger(score) || score < 0 || score > 20)) throw new HttpError(400, 'Résultat invalide.')
    db.prepare(`INSERT INTO progress (user_id, chapter_id, course, score) VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, chapter_id) DO UPDATE SET course = excluded.course, score = excluded.score, updated_at = CURRENT_TIMESTAMP`).run(user.id, chapterId, course ? 1 : 0, score)
    return sendJson(res, 200, { progress: { course, ...(score === null ? {} : { score }) } })
  }

  if (req.method === 'GET' && url.pathname === '/api/students') {
    requireUser(req, 'teacher')
    const students = db.prepare(`SELECT users.id, users.email, users.name, users.active,
      COUNT(progress.chapter_id) AS chapters_started,
      SUM(CASE WHEN progress.score IS NOT NULL THEN 1 ELSE 0 END) AS quizzes_finished
      FROM users LEFT JOIN progress ON progress.user_id = users.id
      WHERE users.role = 'student' GROUP BY users.id ORDER BY users.name`).all()
    return sendJson(res, 200, { students })
  }

  if (req.method === 'POST' && url.pathname === '/api/students') {
    requireUser(req, 'teacher')
    const body = await readJson(req)
    return sendJson(res, 201, { student: createUser({ email: body.email, name: body.name, password: body.password }) })
  }

  const studentMatch = url.pathname.match(/^\/api\/students\/(\d+)$/)
  if (req.method === 'PATCH' && studentMatch) {
    requireUser(req, 'teacher')
    const body = await readJson(req)
    const id = Number(studentMatch[1])
    const existing = db.prepare("SELECT id FROM users WHERE id = ? AND role = 'student'").get(id)
    if (!existing) throw new HttpError(404, 'Étudiant introuvable.')
    db.prepare('UPDATE users SET active = ? WHERE id = ?').run(body.active ? 1 : 0, id)
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id)
    return sendJson(res, 200, { ok: true })
  }

  const passwordMatch = url.pathname.match(/^\/api\/students\/(\d+)\/password$/)
  if (req.method === 'PUT' && passwordMatch) {
    requireUser(req, 'teacher')
    const body = await readJson(req)
    if (String(body.password || '').length < 10) throw new HttpError(400, 'Le mot de passe doit contenir au moins 10 caractères.')
    const id = Number(passwordMatch[1])
    const salt = randomBytes(16).toString('hex')
    const result = db.prepare("UPDATE users SET password_hash = ?, salt = ? WHERE id = ? AND role = 'student'").run(passwordHash(String(body.password), salt), salt, id)
    if (!result.changes) throw new HttpError(404, 'Étudiant introuvable.')
    db.prepare('DELETE FROM sessions WHERE user_id = ?').run(id)
    return sendJson(res, 200, { ok: true })
  }

  throw new HttpError(404, 'Adresse introuvable.')
}

function serveStatic(req, res, url) {
  if (!existsSync(publicDir)) throw new HttpError(503, 'Le site doit être construit avant son démarrage.')
  const requested = decodeURIComponent(url.pathname)
  const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, '')
  let file = join(publicDir, safePath)
  if (!file.startsWith(publicDir)) throw new HttpError(403, 'Chemin refusé.')
  if (!existsSync(file) || statSync(file).isDirectory()) file = join(publicDir, 'index.html')
  const extension = extname(file)
  res.writeHead(200, { 'Content-Type': mimeTypes[extension] || 'application/octet-stream', 'Cache-Control': extension === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable' })
  createReadStream(file).pipe(res)
}

const server = createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Referrer-Policy', 'same-origin')
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  res.setHeader('Content-Security-Policy', "default-src 'self'; img-src 'self' data:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'")
  try {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    if (url.pathname.startsWith('/api/')) await api(req, res, url)
    else serveStatic(req, res, url)
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500
    if (status === 500) console.error(error)
    if (!res.headersSent) sendJson(res, status, { error: status === 500 ? 'Une erreur inattendue est survenue.' : error.message })
    else res.end()
  }
})

server.listen(port, '0.0.0.0', () => console.log(`Cap MCO prêt sur le port ${port}`))
