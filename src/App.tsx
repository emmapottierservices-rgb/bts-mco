import { useEffect, useMemo, useState } from 'react'
import { chapters, type Chapter, type VideoSlide } from './data'
import teacherAvatar from './assets/avatar-professeure.webp'

type Page = 'dashboard' | 'chapters' | 'progress' | 'students'
type Progress = Record<number, { course: boolean; score?: number }>
type User = { id: number; email: string; name: string; role: 'teacher' | 'student' }
type Student = { id: number; email: string; name: string; active: number; chapters_started: number; quizzes_finished: number }
const demoMode = import.meta.env.VITE_DEMO_MODE === 'true'

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(path, { ...options, credentials: 'same-origin', headers: { ...(options.body ? { 'Content-Type': 'application/json' } : {}), ...options.headers } })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.error || 'Une erreur est survenue.')
  return data
}

function Logo() {
  return <div className="logo"><span className="logo-mark">M</span><span><b>CAP MCO</b><small>Gestion opérationnelle</small></span></div>
}

function ProgressRing({ value, size = 'large' }: { value: number; size?: 'large' | 'small' }) {
  return <div className={`progress-ring ${size}`} style={{ '--progress': `${value * 3.6}deg` } as React.CSSProperties}>
    <div><strong>{value}%</strong>{size === 'large' && <span>complété</span>}</div>
  </div>
}

function LoginScreen({ onLogin }: { onLogin: (user: User) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await apiRequest<{ user: User }>('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
      onLogin(result.user)
    } catch (issue) { setError(issue instanceof Error ? issue.message : 'Connexion impossible.') }
    finally { setLoading(false) }
  }

  return <main className="login-page">
    <section className="login-visual"><Logo /><div><span className="eyebrow">VOTRE ESPACE PRIVÉ</span><h1>Réviser, progresser,<br />prendre confiance.</h1><p>Des cours, des vidéos et des quiz pour réussir la gestion opérationnelle en BTS MCO.</p></div><span className="login-orbit">MCO</span></section>
    <section className="login-panel"><form className="login-card" onSubmit={submit}><span className="login-mobile-logo"><Logo /></span><span className="eyebrow">CONNEXION SÉCURISÉE</span><h2>Bienvenue !</h2><p>Connectez-vous avec les identifiants fournis par votre enseignante.</p><label>Adresse e-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="prenom.nom@exemple.fr" /></label><label>Mot de passe<input type="password" autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} required minLength={10} placeholder="Votre mot de passe" /></label>{error && <div className="login-error" role="alert">{error}</div>}<button className="primary login-submit" disabled={loading}>{loading ? 'Connexion…' : 'Se connecter →'}</button><small>Votre progression est enregistrée dans votre espace personnel.</small></form></section>
  </main>
}

function App() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  useEffect(() => {
    if (demoMode) setUser({ id: 0, email: '', name: 'Espace découverte', role: 'student' })
    else apiRequest<{ user: User }>('/api/me').then((result) => setUser(result.user)).catch(() => setUser(null))
  }, [])
  if (user === undefined) return <div className="auth-loading"><Logo /><span>Chargement de votre espace…</span></div>
  if (!user) return <LoginScreen onLogin={setUser} />
  return <LearningApp user={user} onLogout={() => setUser(null)} demo={demoMode} />
}

function LearningApp({ user, onLogout, demo = false }: { user: User; onLogout: () => void; demo?: boolean }) {
  const [page, setPage] = useState<Page>('dashboard')
  const [selected, setSelected] = useState<Chapter | null>(null)
  const [progress, setProgress] = useState<Progress>({})
  const [search, setSearch] = useState('')
  const [year, setYear] = useState<'all' | 1 | 2>('all')
  const [menu, setMenu] = useState(false)

  useEffect(() => {
    if (demo) {
      try { setProgress(JSON.parse(localStorage.getItem('cap-mco-demo-progress') || '{}')) } catch { setProgress({}) }
    } else apiRequest<{ progress: Progress }>('/api/progress').then((result) => setProgress(result.progress)).catch(() => undefined)
  }, [demo])

  const updateProgress = (chapterId: number, data: { course?: boolean; score?: number }) => {
    setProgress((old) => {
      const next = { ...old, [chapterId]: { ...old[chapterId], ...data } }
      if (demo) localStorage.setItem('cap-mco-demo-progress', JSON.stringify(next))
      return next
    })
    if (!demo) apiRequest(`/api/progress/${chapterId}`, { method: 'PUT', body: JSON.stringify(data) }).catch(() => undefined)
  }

  const logout = async () => {
    await apiRequest('/api/logout', { method: 'POST' }).catch(() => undefined)
    onLogout()
  }

  const completed = Object.values(progress).filter((item) => item.course && item.score !== undefined).length
  const globalPercent = Math.round((completed / chapters.length) * 100)
  const openChapter = (chapter: Chapter) => { setSelected(chapter); setMenu(false); window.scrollTo(0, 0) }
  const go = (next: Page) => { setPage(next); setSelected(null); setMenu(false); window.scrollTo(0, 0) }

  return <div className="app-shell">
    <aside className={menu ? 'sidebar open' : 'sidebar'}>
      <Logo />
      {demo && <div className="demo-badge">Démonstration publique</div>}
      <nav aria-label="Navigation principale">
        <button className={page === 'dashboard' && !selected ? 'active' : ''} onClick={() => go('dashboard')}><span>⌂</span> Tableau de bord</button>
        <button className={page === 'chapters' || selected ? 'active' : ''} onClick={() => go('chapters')}><span>▦</span> Les chapitres</button>
        <button className={page === 'progress' ? 'active' : ''} onClick={() => go('progress')}><span>↗</span> Ma progression</button>
        {user.role === 'teacher' && <button className={page === 'students' ? 'active' : ''} onClick={() => go('students')}><span>♙</span> Mes étudiants</button>}
      </nav>
      <div className="sidebar-card">
        <span className="bulb">✦</span>
        <b>Le conseil du jour</b>
        <p>Révisez 20 minutes régulièrement plutôt que 3 heures d’un coup.</p>
      </div>
      <div className="sidebar-profile"><span>{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><div><b>{user.name}</b><small>{demo ? 'Version de démonstration' : user.role === 'teacher' ? 'Espace enseignante' : 'Étudiant BTS MCO'}</small></div>{!demo && <button onClick={logout} aria-label="Se déconnecter">↪</button>}</div>
    </aside>

    <main className="main-content">
      <header className="mobile-header"><button onClick={() => setMenu(!menu)} aria-label="Ouvrir le menu">☰</button><Logo /></header>
      {selected ? <ChapterView chapter={selected} saved={progress[selected.id]} onBack={() => setSelected(null)} onUpdate={(data) => updateProgress(selected.id, data)} />
        : page === 'dashboard' ? <Dashboard progress={progress} percent={globalPercent} completed={completed} onOpen={openChapter} onSeeAll={() => go('chapters')} />
        : page === 'chapters' ? <ChaptersView progress={progress} search={search} setSearch={setSearch} year={year} setYear={setYear} onOpen={openChapter} />
        : page === 'progress' ? <ProgressView progress={progress} percent={globalPercent} onOpen={openChapter} />
        : <StudentsView />}
    </main>
  </div>
}

function Dashboard({ progress, percent, completed, onOpen, onSeeAll }: { progress: Progress; percent: number; completed: number; onOpen: (c: Chapter) => void; onSeeAll: () => void }) {
  const last = chapters.find((c) => progress[c.id]?.course && progress[c.id]?.score === undefined) || chapters[0]
  const recent = chapters.slice(0, 4)
  return <div className="page dashboard-page">
    <section className="welcome">
      <div><span className="eyebrow">VOTRE ESPACE DE RÉVISION</span><h1>Bonjour ! Prêt à progresser ? <span>👋</span></h1><p>Révisez la gestion opérationnelle à votre rythme et prenez confiance pour l’examen.</p></div>
      <div className="welcome-shape"><span>✓</span><i>✦</i></div>
    </section>
    <section className="overview-grid">
      <div className="card progress-card"><ProgressRing value={percent} /><div><span className="eyebrow">PROGRESSION GLOBALE</span><h2>{completed} chapitre{completed > 1 ? 's' : ''} terminé{completed > 1 ? 's' : ''}</h2><p>Continuez, chaque étape vous rapproche de votre objectif.</p></div></div>
      <button className="card continue-card" onClick={() => onOpen(last)}>
        <div className={`chapter-icon ${last.color}`}>{last.icon}</div><div><span className="eyebrow">À CONTINUER</span><h2>{last.title}</h2><p>{last.subtitle}</p></div><span className="round-arrow">→</span>
      </button>
    </section>
    <section className="section-heading"><div><span className="eyebrow">AU PROGRAMME</span><h2>Choisissez votre prochain chapitre</h2></div><button className="text-button" onClick={onSeeAll}>Voir tous les chapitres →</button></section>
    <div className="chapter-grid">{recent.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} saved={progress[chapter.id]} onOpen={onOpen} />)}</div>
    <section className="exam-banner"><div className="exam-icon">✎</div><div><span className="eyebrow">OBJECTIF EXAMEN</span><h2>Entraînez-vous avec des quiz</h2><p>Testez vos connaissances à la fin de chaque chapitre et suivez vos résultats.</p></div><button onClick={() => onOpen(chapters[0])}>Commencer un quiz <span>→</span></button></section>
  </div>
}

function ChapterCard({ chapter, saved, onOpen }: { chapter: Chapter; saved?: { course: boolean; score?: number }; onOpen: (c: Chapter) => void }) {
  const state = saved?.score !== undefined ? 'Terminé' : saved?.course ? 'En cours' : 'À découvrir'
  return <button className="chapter-card" onClick={() => onOpen(chapter)}>
    <div className="chapter-top"><div className={`chapter-icon ${chapter.color}`}>{chapter.icon}</div><span className={`status ${state === 'Terminé' ? 'done' : ''}`}>{state}</span></div>
    <span className="chapter-number">CHAPITRE {String(chapter.id).padStart(2, '0')}</span><h3>{chapter.title}</h3><p>{chapter.subtitle}</p>
    <div className="card-footer"><span>◷ {chapter.duration}</span><span>{saved?.score !== undefined ? `${saved.score}/${chapter.questions.length} au quiz` : 'Découvrir →'}</span></div>
  </button>
}

function ChaptersView({ progress, search, setSearch, year, setYear, onOpen }: { progress: Progress; search: string; setSearch: (s: string) => void; year: 'all' | 1 | 2; setYear: (y: 'all' | 1 | 2) => void; onOpen: (c: Chapter) => void }) {
  const filtered = useMemo(() => chapters.filter((c) => (year === 'all' || c.year === year) && `${c.title} ${c.subtitle}`.toLowerCase().includes(search.toLowerCase())), [search, year])
  return <div className="page"><div className="page-title"><span className="eyebrow">15 CHAPITRES POUR RÉUSSIR</span><h1>Les chapitres</h1><p>Choisissez un sujet et avancez à votre rythme.</p></div>
    <div className="filters"><label>⌕<input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un chapitre…" /></label><div className="filter-buttons"><button className={year === 'all' ? 'active' : ''} onClick={() => setYear('all')}>Tous</button><button className={year === 1 ? 'active' : ''} onClick={() => setYear(1)}>1re année</button><button className={year === 2 ? 'active' : ''} onClick={() => setYear(2)}>2e année</button></div></div>
    <p className="result-count">{filtered.length} chapitre{filtered.length > 1 ? 's' : ''}</p><div className="chapter-grid wide">{filtered.map((chapter) => <ChapterCard key={chapter.id} chapter={chapter} saved={progress[chapter.id]} onOpen={onOpen} />)}</div>
  </div>
}

function StudentsView() {
  const [students, setStudents] = useState<Student[]>([])
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const load = () => apiRequest<{ students: Student[] }>('/api/students').then((result) => setStudents(result.students)).catch((issue) => setError(issue.message))
  useEffect(() => { void load() }, [])

  const generatePassword = () => {
    const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#'
    const bytes = crypto.getRandomValues(new Uint8Array(14))
    setForm((old) => ({ ...old, password: Array.from(bytes, (value) => alphabet[value % alphabet.length]).join('') }))
  }

  const addStudent = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(''); setMessage('')
    try {
      await apiRequest('/api/students', { method: 'POST', body: JSON.stringify(form) })
      setMessage(`Le compte de ${form.name} a été créé. Pensez à lui transmettre son mot de passe de façon privée.`)
      setForm({ name: '', email: '', password: '' })
      await load()
    } catch (issue) { setError(issue instanceof Error ? issue.message : 'Création impossible.') }
  }

  const toggleStudent = async (student: Student) => {
    setError(''); setMessage('')
    try {
      await apiRequest(`/api/students/${student.id}`, { method: 'PATCH', body: JSON.stringify({ active: !student.active }) })
      setMessage(student.active ? `Le compte de ${student.name} est désactivé.` : `Le compte de ${student.name} est réactivé.`)
      await load()
    } catch (issue) { setError(issue instanceof Error ? issue.message : 'Modification impossible.') }
  }

  return <div className="page students-page"><div className="page-title"><span className="eyebrow">ESPACE ENSEIGNANTE</span><h1>Mes étudiants</h1><p>Créez les accès et suivez l’avancement de chaque étudiant.</p></div><section className="student-layout"><form className="card add-student" onSubmit={addStudent}><span className="eyebrow">NOUVEL ACCÈS</span><h2>Ajouter un étudiant</h2><label>Nom et prénom<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required minLength={2} placeholder="Camille Dupont" /></label><label>Adresse e-mail<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required placeholder="camille@exemple.fr" /></label><label>Mot de passe temporaire<div className="password-row"><input value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required minLength={10} placeholder="10 caractères minimum" /><button type="button" onClick={generatePassword}>Générer</button></div></label><button className="primary">Créer le compte</button><small>Le mot de passe n’est jamais affiché dans la liste. Transmettez-le directement à l’étudiant.</small></form><section className="card student-list"><div className="student-list-head"><div><span className="eyebrow">VOTRE CLASSE</span><h2>{students.length} étudiant{students.length > 1 ? 's' : ''}</h2></div></div>{error && <div className="login-error" role="alert">{error}</div>}{message && <div className="success-message" role="status">{message}</div>}{students.length === 0 ? <div className="empty-students"><span>♙</span><b>Aucun étudiant pour le moment</b><p>Créez le premier compte avec le formulaire.</p></div> : <div className="student-rows">{students.map((student) => <div className={student.active ? 'student-row' : 'student-row inactive'} key={student.id}><span className="student-avatar">{student.name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()}</span><div className="student-identity"><b>{student.name}</b><small>{student.email}</small></div><div className="student-stat"><b>{student.chapters_started || 0}</b><small>chapitres commencés</small></div><div className="student-stat"><b>{student.quizzes_finished || 0}</b><small>quiz terminés</small></div><button className="student-toggle" onClick={() => toggleStudent(student)}>{student.active ? 'Désactiver' : 'Réactiver'}</button></div>)}</div>}</section></section></div>
}

function ChapterView({ chapter, saved, onBack, onUpdate }: { chapter: Chapter; saved?: { course: boolean; score?: number }; onBack: () => void; onUpdate: (data: { course?: boolean; score?: number }) => void }) {
  const [tab, setTab] = useState<'course' | 'video' | 'quiz'>('course')
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(chapter.questions.map(() => null))
  const [finished, setFinished] = useState(false)
  const question = chapter.questions[current]
  const score = answers.reduce<number>((total, answer, index) => total + (answer === chapter.questions[index].correct ? 1 : 0), 0)
  const choose = (answer: number) => setAnswers((old) => old.map((value, index) => index === current ? answer : value))
  const finish = () => { setFinished(true); onUpdate({ course: true, score }) }
  const resetQuiz = () => { setAnswers(chapter.questions.map(() => null)); setCurrent(0); setFinished(false) }
  const passed = score >= Math.ceil(chapter.questions.length * .6)
  return <div className="page chapter-page">
    <button className="back" onClick={onBack}>← Retour aux chapitres</button>
    <section className="chapter-hero"><div className={`chapter-icon ${chapter.color}`}>{chapter.icon}</div><div><span className="eyebrow">CHAPITRE {String(chapter.id).padStart(2, '0')} · {chapter.year === 1 ? '1RE' : '2E'} ANNÉE</span><h1>{chapter.title}</h1><p>{chapter.subtitle}</p></div><div className="chapter-meta"><span>◷ {chapter.duration}</span><span>{chapter.questions.length} questions</span></div></section>
    <div className="tabs"><button className={tab === 'course' ? 'active' : ''} onClick={() => setTab('course')}>▤ Points de cours</button><button className={tab === 'video' ? 'active' : ''} onClick={() => setTab('video')}>▷ Vidéo</button><button className={tab === 'quiz' ? 'active' : ''} onClick={() => setTab('quiz')}>✓ Quiz</button></div>
    {tab === 'course' && <section className="lesson-layout"><article className="lesson card"><span className="eyebrow">L’ESSENTIEL À RETENIR</span><h2>{chapter.title}</h2><p className="definition">{chapter.definition}</p><h3>Les points clés</h3><ol>{chapter.points.map((point, index) => <li key={point}><span>{index + 1}</span><div><b>{point}</b><p>{chapter.courseSections?.[index]?.paragraphs[0] || 'Comprendre cette notion vous aidera à analyser une situation et à justifier vos décisions.'}</p></div></li>)}</ol>{chapter.courseSections && <div className="course-sections">{chapter.courseSections.map((section) => <section key={section.title}><h3>{section.title}</h3>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.formula && <div className="formula">{section.formula}</div>}{section.note && <div className="course-note">À retenir · {section.note}</div>}</section>)}</div>}<div className="example"><span>💡</span><div><b>Exemple concret</b><p>{chapter.example}</p></div></div><button className="primary" onClick={() => { onUpdate({ course: true }); setTab('quiz'); window.scrollTo(0, 0) }}>{saved?.course ? 'Revoir le quiz' : 'J’ai compris, passer au quiz'} →</button></article><aside className="lesson-summary card"><span className="eyebrow">VOTRE AVANCEMENT</span><h3>{saved?.course ? 'Cours consulté' : 'Cours à découvrir'}</h3><div className="mini-progress"><i style={{ width: saved?.course ? '100%' : '20%' }} /></div><p>{saved?.score !== undefined ? `Meilleur résultat : ${saved.score}/${chapter.questions.length}` : 'Terminez le cours puis testez vos connaissances.'}</p></aside></section>}
    {tab === 'video' && (chapter.videoSlides ? <VideoLesson slides={chapter.videoSlides} onComplete={() => onUpdate({ course: true })} /> : <section className="video-card card"><div className="video-placeholder"><button aria-label="Lire la future vidéo">▶</button><span>Vidéo explicative à venir</span></div><h2>Le cours en vidéo</h2><p>Une vidéo courte pourra être ajoutée ici pour expliquer les notions avec des exemples concrets.</p><button className="secondary" onClick={() => setTab('course')}>Consulter les points de cours</button></section>)}
    {tab === 'quiz' && <section className="quiz card">{finished ? <div className="quiz-result"><span className="result-icon">{passed ? '✓' : '↻'}</span><span className="eyebrow">QUIZ TERMINÉ</span><h2>{passed ? 'Bravo, c’est acquis !' : 'Encore un petit effort'}</h2><div className="score">{score}<small>/ {chapter.questions.length}</small></div><p>{passed ? 'Vous maîtrisez les notions essentielles de ce chapitre.' : 'Relisez les points de cours puis essayez à nouveau.'}</p><div><button className="secondary" onClick={() => setTab('course')}>Revoir le cours</button><button className="primary" onClick={resetQuiz}>Recommencer</button></div></div> : <><div className="quiz-head"><div><span className="eyebrow">TESTEZ VOS CONNAISSANCES</span><h2>Question {current + 1} sur {chapter.questions.length}</h2></div><span>{Math.round(((current + 1) / chapter.questions.length) * 100)}%</span></div><div className="quiz-progress"><i style={{ width: `${((current + 1) / chapter.questions.length) * 100}%` }} /></div><h3 className="question">{question.question}</h3><div className="answers">{question.answers.map((answer, index) => <button key={answer} className={answers[current] === index ? 'selected' : ''} onClick={() => choose(index)}><span>{String.fromCharCode(65 + index)}</span>{answer}</button>)}</div>{answers[current] !== null && <div className={`feedback ${answers[current] === question.correct ? 'correct' : ''}`}><b>{answers[current] === question.correct ? 'Bonne réponse !' : 'Pas tout à fait.'}</b> {question.explanation}</div>}<div className="quiz-actions"><button className="secondary" disabled={current === 0} onClick={() => setCurrent(current - 1)}>← Précédent</button>{current < chapter.questions.length - 1 ? <button className="primary" disabled={answers[current] === null} onClick={() => setCurrent(current + 1)}>Question suivante →</button> : <button className="primary" disabled={answers[current] === null} onClick={finish}>Voir mon résultat →</button>}</div></>}</section>}
  </div>
}

function ProgressView({ progress, percent, onOpen }: { progress: Progress; percent: number; onOpen: (c: Chapter) => void }) {
  const attempted = chapters.filter((c) => progress[c.id]?.score !== undefined)
  const average = attempted.length ? Math.round(attempted.reduce((sum, c) => sum + (progress[c.id]?.score || 0) / c.questions.length * 100, 0) / attempted.length) : 0
  return <div className="page"><div className="page-title"><span className="eyebrow">VOTRE PARCOURS</span><h1>Ma progression</h1><p>Visualisez vos efforts et choisissez la prochaine étape.</p></div><section className="stats"><div className="card"><ProgressRing value={percent} /><div><span>Programme complété</span><b>{Object.values(progress).filter((p) => p.score !== undefined).length} / 15 chapitres</b></div></div><div className="card stat"><span className="stat-icon">★</span><strong>{average}%</strong><small>Moyenne aux quiz</small></div><div className="card stat"><span className="stat-icon">✓</span><strong>{attempted.length}</strong><small>Quiz réalisés</small></div></section><section className="progress-list card"><div className="section-heading"><div><span className="eyebrow">DÉTAIL DU PARCOURS</span><h2>Tous les chapitres</h2></div></div>{chapters.map((chapter) => { const item = progress[chapter.id]; return <button key={chapter.id} onClick={() => onOpen(chapter)}><div className={`chapter-icon ${chapter.color}`}>{chapter.icon}</div><div><b>{chapter.title}</b><small>{item?.score !== undefined ? `Quiz terminé · ${item.score}/${chapter.questions.length}` : item?.course ? 'Cours consulté · quiz à faire' : 'Pas encore commencé'}</small></div><span className={item?.score !== undefined ? 'check done' : 'check'}>{item?.score !== undefined ? '✓' : '→'}</span></button>})}</section></div>
}

function SlideVisual({ slide }: { slide: VideoSlide }) {
  if (slide.visual === 'intro') return <div className="visual-intro"><span className="orbit orbit-one">€</span><span className="orbit orbit-two">↻</span><strong>BFR</strong></div>
  if (slide.visual === 'flows') return <div className="visual-flows"><div><span>▦</span><b>Biens</b><small>Flux physiques</small></div><i>⇄</i><div><span>€</span><b>Argent</b><small>Flux financiers</small></div></div>
  if (slide.visual === 'commercial-cycle') return <div className="visual-timeline"><div><span>J0</span><b>Achat</b></div><i /><div><span>J15</span><b>Vente comptant</b></div><i /><div><span>J30</span><b>Paiement fournisseur</b></div></div>
  if (slide.visual === 'industrial-cycle') return <div className="visual-timeline industrial"><div><span>J0</span><b>Matières</b></div><i /><div><span>J30</span><b>Transformation</b></div><i /><div><span>J45</span><b>Vente</b></div><i /><div><span>J60</span><b>Encaissement</b></div></div>
  if (slide.visual === 'bfr') return <div className="visual-balance"><div className="need"><b>BESOIN</b><span>Payer avant d’encaisser</span></div><div className="balance-bar">↔</div><div className="resource"><b>RESSOURCE</b><span>Encaisser avant de payer</span></div></div>
  if (slide.visual === 'days') return <div className="visual-calculation"><span>Clients</span><b>+</b><span>Stocks</span><b>−</b><span>Fournisseurs</span><b>=</b><strong>BFR</strong></div>
  if (slide.visual === 'value') return <div className="visual-value"><div><small>Créances + stocks</small><b>66 666,66 €</b></div><span>− 40 000 €</span><strong>26 666,67 €</strong><small>de besoin à financer</small></div>
  return <div className="visual-actions"><span>1<b>Clients</b><small>Encaisser plus vite</small></span><span>2<b>Stocks</b><small>Réduire la durée</small></span><span>3<b>Fournisseurs</b><small>Négocier les délais</small></span></div>
}

function VideoLesson({ slides, onComplete }: { slides: VideoSlide[]; onComplete: () => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [voice, setVoice] = useState(true)
  const slide = slides[index]
  const last = index === slides.length - 1

  useEffect(() => {
    if (!playing) return
    if (voice && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const speech = new SpeechSynthesisUtterance(slide.narration)
      const availableVoices = window.speechSynthesis.getVoices()
      const preferredNames = /audrey|amelie|amélie|denise|hortense|julie|virginie|marie|female|femme/i
      speech.voice = availableVoices.find((item) => item.lang.toLowerCase().startsWith('fr') && preferredNames.test(item.name))
        || availableVoices.find((item) => item.lang.toLowerCase().startsWith('fr'))
        || null
      speech.lang = 'fr-FR'
      speech.rate = .94
      speech.pitch = 1.06
      window.speechSynthesis.speak(speech)
    }
    const seconds = Math.max(12, Math.ceil(slide.narration.split(' ').length / 2.4))
    const timer = window.setTimeout(() => {
      if (last) { setPlaying(false); onComplete() }
      else setIndex((current) => current + 1)
    }, seconds * 1000)
    return () => {
      window.clearTimeout(timer)
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    }
  }, [index, playing, voice, slide, last, onComplete])

  const move = (next: number) => {
    setIndex(Math.min(Math.max(next, 0), slides.length - 1))
    if (next >= slides.length - 1) onComplete()
  }

  return <section className="video-lesson card">
    <div className="video-stage">
      <div className="video-copy"><span className="slide-kicker">{slide.kicker}</span><h2>{slide.title}</h2><ul>{slide.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul></div>
      <div className={`slide-visual visual-${slide.visual}`}><SlideVisual slide={slide} /></div>
      <img className="teacher-avatar" src={teacherAvatar} alt="Votre professeure présente le chapitre" />
      <div className="slide-count">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</div>
    </div>
    <div className="video-progress"><i style={{ width: `${((index + 1) / slides.length) * 100}%` }} /></div>
    <div className="video-controls"><button onClick={() => move(index - 1)} disabled={index === 0} aria-label="Diapositive précédente">‹</button><button className="play" onClick={() => setPlaying(!playing)} aria-label={playing ? 'Mettre en pause' : 'Lire la vidéo'}>{playing ? 'Ⅱ' : '▶'}</button><button onClick={() => move(index + 1)} disabled={last} aria-label="Diapositive suivante">›</button><button className={voice ? 'voice active' : 'voice'} onClick={() => setVoice(!voice)} aria-label={voice ? 'Couper la voix temporaire' : 'Activer la voix temporaire'}>{voice ? '🔊 Voix féminine temporaire' : '🔇 Voix coupée'}</button></div>
    <div className="captions"><span>Sous-titres</span><p>{slide.narration}</p></div>
    <div className="video-note"><span>✦</span><p><b>Première version de démonstration.</b> Une voix artificielle française lit les sous-titres. Elle pourra être remplacée plus tard par votre véritable voix.</p></div>
  </section>
}

export default App
