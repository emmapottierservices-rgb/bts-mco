export type Question = {
  question: string
  answers: string[]
  correct: number
  explanation: string
}

export type CourseSection = {
  title: string
  paragraphs: string[]
  formula?: string
  note?: string
}

export type VideoSlide = {
  kicker: string
  title: string
  bullets: string[]
  narration: string
  visual: 'intro' | 'flows' | 'commercial-cycle' | 'industrial-cycle' | 'bfr' | 'days' | 'value' | 'actions'
}

export type Chapter = {
  id: number
  year: 1 | 2
  title: string
  subtitle: string
  duration: string
  color: string
  icon: string
  points: string[]
  definition: string
  example: string
  questions: Question[]
  courseSections?: CourseSection[]
  videoSlides?: VideoSlide[]
}

const genericQuestions = (title: string): Question[] => [
  {
    question: `Quel est le premier réflexe avant de prendre une décision concernant « ${title} » ?`,
    answers: ['Analyser les données disponibles', 'Décider au hasard', 'Copier un concurrent', 'Attendre la fin de l’année'],
    correct: 0,
    explanation: 'Une décision de gestion se fonde d’abord sur des informations fiables et des indicateurs adaptés.',
  },
  {
    question: 'À quoi sert principalement un indicateur de gestion ?',
    answers: ['Décorer un rapport', 'Mesurer et piloter une activité', 'Remplacer toutes les décisions', 'Classer les salariés'],
    correct: 1,
    explanation: 'Un indicateur permet de mesurer une situation, de la comparer à un objectif et d’agir.',
  },
  {
    question: 'Après avoir constaté un écart avec l’objectif, que faut-il faire ?',
    answers: ['L’ignorer', 'Modifier les chiffres', 'Chercher la cause et agir', 'Supprimer l’objectif'],
    correct: 2,
    explanation: 'L’écart doit être expliqué afin de choisir une action corrective pertinente.',
  },
]

const raw = [
  [1, 1, 'Les documents commerciaux', 'De la commande au règlement, avec les calculs essentiels', '50 min', 'emerald', '▤', ['La chaîne des documents commerciaux', 'La facture et ses mentions obligatoires', 'Les pourcentages, remises et majorations', 'Les calculs autour de la TVA'], 'Les documents commerciaux sécurisent chaque étape de la vente, tandis que les pourcentages et la TVA permettent de calculer correctement les montants facturés.', 'Une facture de 50 € HT soumise à 20 % de TVA comporte 10 € de TVA et un total de 60 € TTC.'],
  [2, 1, 'La gestion des stocks', 'Éviter la rupture et le surstockage', '30 min', 'orange', '▦', ['Le stock minimum et le stock de sécurité', 'La rotation des stocks', 'Le coût de stockage'], 'Gérer un stock consiste à disposer de la bonne quantité de produits, au bon moment, tout en limitant les coûts.', 'Un magasin augmente son stock de sécurité avant Noël pour faire face à une hausse prévisible de la demande.'],
  [3, 1, 'Les approvisionnements', 'Commander au bon moment et au bon prix', '25 min', 'blue', '⇣', ['La sélection des fournisseurs', 'Le calendrier des commandes', 'Le suivi des livraisons'], 'L’approvisionnement couvre le choix des fournisseurs, la commande, la réception et le contrôle des produits.', 'Comparer le prix, les délais et la fiabilité de trois fournisseurs aide à choisir l’offre la plus adaptée.'],
  [4, 1, 'Les coûts et les charges', 'Identifier ce que l’activité coûte réellement', '35 min', 'violet', '€', ['Les charges fixes et variables', 'Le coût d’achat', 'Le coût de revient'], 'Une charge est une dépense supportée par l’entreprise pour assurer son activité.', 'Le loyer est une charge fixe ; les emballages évoluent avec les ventes et constituent une charge variable.'],
  [5, 1, 'La fixation du prix', 'Construire un prix de vente cohérent', '30 min', 'rose', '%', ['La marge commerciale', 'Le taux de marque', 'La TVA et le prix TTC'], 'Le prix de vente doit couvrir les coûts, contribuer à la rentabilité et rester acceptable pour le client.', 'Un produit acheté 40 € HT et vendu 60 € HT dégage une marge commerciale de 20 € HT.'],
  [6, 1, 'Le seuil de rentabilité', 'Savoir quand l’activité devient rentable', '40 min', 'yellow', '◎', ['La marge sur coût variable', 'Le seuil de rentabilité', 'Le point mort'], 'Le seuil de rentabilité correspond au chiffre d’affaires à partir duquel l’entreprise couvre toutes ses charges.', 'Si le seuil est atteint en septembre, les ventes réalisées ensuite contribuent au bénéfice.'],
  [7, 1, 'La trésorerie', 'Suivre les encaissements et décaissements', '30 min', 'teal', '≈', ['Le budget de trésorerie', 'Les décalages de paiement', 'Les solutions de financement court terme'], 'La trésorerie représente l’argent disponible pour régler les dépenses immédiates de l’entreprise.', 'Une entreprise rentable peut manquer de trésorerie si ses clients paient après ses propres échéances.'],
  [8, 1, 'Les budgets', 'Prévoir et contrôler les dépenses', '35 min', 'blue', '▤', ['La construction d’un budget', 'Les prévisions de ventes', 'L’analyse des écarts'], 'Un budget traduit en chiffres les objectifs et les moyens prévus pour une période donnée.', 'Comparer chaque mois les dépenses réelles au budget permet de réagir rapidement à un dépassement.'],
  [9, 2, 'Les investissements', 'Choisir un projet créateur de valeur', '40 min', 'violet', '↗', ['Le coût d’un investissement', 'La rentabilité attendue', 'Le délai de récupération'], 'Un investissement est une dépense engagée aujourd’hui pour obtenir des avantages durables dans le futur.', 'L’achat de nouvelles caisses automatiques doit être évalué au regard du temps gagné et des ventes attendues.'],
  [10, 2, 'Le financement', 'Trouver les ressources adaptées', '30 min', 'orange', '◇', ['L’autofinancement', 'L’emprunt bancaire', 'Le crédit-bail'], 'Financer consiste à réunir les ressources nécessaires pour couvrir un besoin ou réaliser un investissement.', 'Pour acheter un véhicule, l’unité commerciale peut utiliser sa trésorerie, emprunter ou recourir au crédit-bail.'],
  [11, 2, 'Les tableaux de bord', 'Piloter avec les bons indicateurs', '35 min', 'emerald', '▥', ['Le choix des indicateurs', 'La présentation des résultats', 'Les actions correctives'], 'Le tableau de bord rassemble des indicateurs utiles pour suivre les résultats et faciliter la décision.', 'Un responsable suit chaque semaine le chiffre d’affaires, le panier moyen et le taux de transformation.'],
  [12, 2, 'La performance commerciale', 'Mesurer l’efficacité des ventes', '30 min', 'rose', '★', ['Le chiffre d’affaires', 'Le panier moyen', 'Le taux de transformation'], 'La performance commerciale mesure la capacité de l’unité à atteindre ses objectifs de vente et de clientèle.', 'Si 120 visiteurs sur 400 achètent, le taux de transformation est de 30 %.'],
  [13, 2, 'La performance financière', 'Lire la santé économique de l’activité', '40 min', 'teal', '⌁', ['La rentabilité', 'La solvabilité', 'Les principaux ratios'], 'La performance financière apprécie la capacité de l’entreprise à générer des résultats et à honorer ses engagements.', 'Une hausse du chiffre d’affaires n’améliore pas forcément la rentabilité si les charges augmentent davantage.'],
  [14, 2, 'La gestion des risques', 'Anticiper les difficultés', '30 min', 'yellow', '△', ['L’identification des risques', 'La prévention', 'Le plan de continuité'], 'La gestion des risques consiste à repérer les événements pouvant nuire à l’activité et à préparer des réponses.', 'Diversifier ses fournisseurs limite les conséquences d’une rupture de livraison chez l’un d’eux.'],
  [15, 2, 'Le pilotage de l’activité', 'Décider, agir et progresser', '45 min', 'emerald', '⌁', ['Le diagnostic de l’activité', 'La prise de décision', 'Le suivi des actions'], 'Piloter une unité commerciale consiste à fixer des objectifs, mesurer les résultats et ajuster les actions.', 'Face à une baisse du panier moyen, le responsable analyse les causes puis teste une offre complémentaire.'],
] as const

export const chapters: Chapter[] = raw.map(([id, year, title, subtitle, duration, color, icon, points, definition, example]) => ({
  id,
  year,
  title,
  subtitle,
  duration,
  color,
  icon,
  points: [...points],
  definition,
  example,
  questions: genericQuestions(title),
}))

Object.assign(chapters[0], {
  title: 'Les documents commerciaux',
  subtitle: 'Suivre une vente et maîtriser les pourcentages, les remises et la TVA',
  duration: '50 min',
  points: [
    'Reconnaître le rôle de chaque document commercial',
    'Contrôler une livraison et réagir en cas d’anomalie',
    'Lire, vérifier et calculer une facture',
    'Appliquer un pourcentage, une remise ou une majoration',
    'Passer du HT au TTC et retrouver le HT',
  ],
  definition: 'Le devis, le bon de commande, le bon de livraison, la facture et le règlement se suivent et se complètent. Chacun remplit une fonction précise et permet de sécuriser la relation entre le vendeur et l’acheteur.',
  example: 'Pour un article à 30 € HT soumis à 20 % de TVA : TVA = 30 × 20 % = 6 €, puis prix TTC = 30 + 6 = 36 €. On peut aussi calculer directement 30 × 1,20 = 36 €.',
  courseSections: [
    {
      title: '1. La chaîne des documents commerciaux',
      paragraphs: [
        'Le devis est une proposition chiffrée du vendeur. Lorsqu’il est daté, signé et accompagné de la mention « bon pour accord », le client accepte l’offre et le vendeur s’engage à livrer.',
        'Le bon de commande officialise la commande. Le bon de livraison prouve que la marchandise a été livrée. La facture demande le paiement, puis le règlement correspond au paiement effectué par le client.',
      ],
      formula: 'Devis → devis accepté → bon de commande → bon de livraison → facture → règlement',
      note: 'Les conditions générales de vente précisent notamment les conditions de paiement, les délais de livraison, les pénalités de retard, les garanties et les retours.',
    },
    {
      title: '2. Contrôler la livraison',
      paragraphs: [
        'À la réception, il faut contrôler l’état des colis et des emballages, rechercher les produits abîmés, cassés ou manquants, puis vérifier la conformité visuelle.',
        'Les références, quantités et désignations reçues doivent correspondre au bon de livraison, qui doit lui-même correspondre au bon de commande.',
      ],
      note: 'En cas d’anomalie, prévenir rapidement le fournisseur et inscrire des réserves écrites et précises sur le bon de livraison. Un avoir pourra ensuite corriger la facturation si nécessaire.',
    },
    {
      title: '3. La facture et ses mentions obligatoires',
      paragraphs: [
        'Une facture comporte notamment sa date d’émission, un numéro unique, l’identité complète du vendeur et du client, le numéro de TVA intracommunautaire lorsqu’il est nécessaire, ainsi que la désignation et la quantité des biens ou services.',
        'Elle indique aussi les prix unitaires HT, les remises éventuelles, le taux de TVA, les montants HT, TVA et TTC, les conditions de paiement, l’escompte éventuel et la date d’échéance.',
      ],
      note: 'Un bon de livraison valorisé peut indiquer des prix et des montants, mais il ne remplace pas la facture : seule la facture demande le paiement.',
    },
    {
      title: '4. Construire les montants d’une facture',
      paragraphs: [
        'Pour chaque ligne, on calcule d’abord le montant brut HT : quantité × prix unitaire HT. On retire ensuite la remise pour obtenir le montant net HT de la ligne.',
        'Dans l’exemple fourni, les trois lignes donnent 247 €, 502,55 € et 57 €, soit un total HT de 806,55 €. La TVA à 20 % vaut 161,31 € et le total TTC atteint 967,86 €.',
      ],
      formula: 'Montant brut HT = quantité × prix unitaire HT • Net HT = brut HT − remise',
    },
    {
      title: '5. Remise commerciale et escompte',
      paragraphs: [
        'La remise commerciale réduit le prix d’un article. Par exemple, 5 % de remise sur 20 € représente 1 €, donc le prix net HT est de 19 €. Pour 13 articles : 19 × 13 = 247 € HT.',
        'L’escompte est une réduction accordée lorsque le client paie avant une date fixée. Dans l’exemple de la fiche, 2 % de 967,86 € représentent 19,36 €, soit un net à payer de 948,50 € si le paiement intervient dans le délai.',
      ],
      note: 'Après la date prévue, l’escompte ne s’applique plus. En cas de retard, les pénalités prévues dans les conditions générales de vente peuvent s’appliquer.',
    },
    {
      title: '6. Comprendre et appliquer un pourcentage',
      paragraphs: [
        'Un pourcentage est une fraction sur 100 : 20 % = 20/100 = 0,20. Pour calculer 20 % de 100 €, on multiplie 0,20 par 100, ce qui donne 20 €.',
        'Pour appliquer directement une remise de 20 %, on conserve 80 % du prix : 150 × (1 − 0,20) = 120 €. Pour une majoration de 20 %, on calcule 20 000 × (1 + 0,20) = 24 000 €.',
      ],
      formula: 'Part = taux × valeur • Après remise : valeur × (1 − taux) • Après majoration : valeur × (1 + taux)',
    },
    {
      title: '7. Calculer un taux d’évolution',
      paragraphs: [
        'Le taux d’évolution compare une valeur d’arrivée à une valeur de départ. L’écart est toujours rapporté à la valeur de départ.',
        'Entre un chiffre d’affaires de 20 000 € en 2021 et de 25 000 € en 2022 : (25 000 − 20 000) ÷ 20 000 × 100 = +25 %. Le chiffre d’affaires a augmenté de 25 %.',
      ],
      formula: 'Taux d’évolution = (valeur d’arrivée − valeur de départ) ÷ valeur de départ × 100',
    },
    {
      title: '8. Les calculs autour de la TVA',
      paragraphs: [
        'La TVA est un impôt indirect payé par le consommateur et collecté par les entreprises. Les principaux taux en France métropolitaine sont 20 %, 10 %, 5,5 % et 2,1 %, selon la nature du bien ou du service.',
        'La TVA se calcule sur le prix HT. Pour passer du HT au TTC : TVA = HT × taux, puis TTC = HT + TVA. On peut aussi multiplier directement le HT par 1 + taux.',
        'Pour retrouver le HT à partir du TTC, on divise le TTC par 1 + taux, puis on calcule TVA = TTC − HT. On ne calcule pas 20 % du TTC, car le taux de TVA s’applique à la base HT.',
      ],
      formula: 'TVA = HT × taux • TTC = HT × (1 + taux) • HT = TTC ÷ (1 + taux)',
      note: 'Exemple : 60 € TTC à 20 % → HT = 60 ÷ 1,20 = 50 €, puis TVA = 60 − 50 = 10 €.',
    },
    {
      title: '9. TVA collectée et TVA déductible',
      paragraphs: [
        'L’entreprise collecte la TVA facturée à ses clients pour le compte de l’État. Lorsqu’elle paie de la TVA à ses fournisseurs, cette TVA est en principe déductible.',
        'La TVA collectée n’est pas un gain et la TVA déductible n’est pas un coût. Elle intervient dans la trésorerie, mais les calculs de rentabilité sont généralement réalisés avec des valeurs HT.',
      ],
    },
  ],
  questions: [
    {
      question: 'Quel document officialise la commande passée par le client ?',
      answers: ['Le bon de commande', 'Le bon de livraison', 'La facture', 'Le règlement'],
      correct: 0,
      explanation: 'Le bon de commande officialise l’engagement du client à commander auprès du vendeur.',
    },
    {
      question: 'À quoi sert principalement le bon de livraison ?',
      answers: ['À proposer un prix', 'À prouver et contrôler la livraison', 'À demander le paiement', 'À accorder un escompte'],
      correct: 1,
      explanation: 'Le bon de livraison atteste la remise des produits et permet de contrôler références, quantités et désignations.',
    },
    {
      question: 'Que faut-il faire lorsqu’une marchandise est abîmée à la livraison ?',
      answers: ['La payer sans rien signaler', 'Modifier soi-même la facture', 'Écrire des réserves précises et prévenir le fournisseur', 'Jeter le bon de livraison'],
      correct: 2,
      explanation: 'Des réserves écrites et précises permettent de constater l’anomalie et de demander sa correction.',
    },
    {
      question: 'Laquelle de ces informations doit figurer sur une facture ?',
      answers: ['La météo du jour', 'Le numéro unique de la facture', 'Le nombre de salariés', 'Le chiffre d’affaires annuel'],
      correct: 1,
      explanation: 'La facture doit notamment comporter une date d’émission et un numéro unique.',
    },
    {
      question: 'Quel est le prix après une remise de 20 % sur 150 € ?',
      answers: ['30 €', '120 €', '130 €', '180 €'],
      correct: 1,
      explanation: 'Une remise de 20 % laisse 80 % du prix : 150 × 0,80 = 120 €.',
    },
    {
      question: 'Un chiffre d’affaires passe de 20 000 € à 25 000 €. Quel est son taux d’évolution ?',
      answers: ['+5 %', '+20 %', '+25 %', '+125 %'],
      correct: 2,
      explanation: '(25 000 − 20 000) ÷ 20 000 × 100 = +25 %.',
    },
    {
      question: 'Un article coûte 30 € HT avec une TVA de 20 %. Quel est son prix TTC ?',
      answers: ['32 €', '36 €', '40 €', '50 €'],
      correct: 1,
      explanation: 'TVA = 30 × 20 % = 6 €, donc TTC = 30 + 6 = 36 €.',
    },
    {
      question: 'Un article coûte 60 € TTC avec une TVA de 20 %. Quel est son prix HT ?',
      answers: ['40 €', '48 €', '50 €', '52 €'],
      correct: 2,
      explanation: 'Le HT se retrouve en divisant le TTC par 1,20 : 60 ÷ 1,20 = 50 €.',
    },
    {
      question: 'Pourquoi ne faut-il pas calculer 20 % du TTC pour retrouver la TVA ?',
      answers: ['Parce que la TVA est toujours nulle', 'Parce que le taux s’applique à la base HT', 'Parce que le TTC ne contient pas de TVA', 'Parce que seule la quantité compte'],
      correct: 1,
      explanation: 'Le taux de TVA est appliqué au prix HT. À partir du TTC, il faut d’abord retrouver le HT.',
    },
  ],
  videoSlides: [
    {
      kicker: 'CHAPITRE 1',
      title: 'Documents commerciaux, pourcentages et TVA',
      bullets: ['Suivre une vente de bout en bout', 'Vérifier une facture', 'Réussir les calculs indispensables'],
      narration: 'Pourquoi utilise-t-on autant de documents pour une seule vente ? Et pourquoi une remise de vingt pour cent ne se calcule-t-elle pas comme un retour du TTC vers le HT ? Nous allons répondre à ces questions à partir d’une situation simple, comme si nous contrôlions ensemble une vraie commande.',
      visual: 'intro',
    },
    {
      kicker: 'LA CHAÎNE LOGIQUE',
      title: 'Chaque document a un rôle précis',
      bullets: ['Devis : proposer', 'Commande : s’engager', 'Livraison : prouver et contrôler', 'Facture : demander le paiement'],
      narration: 'Imaginez qu’un client demande treize plaques à vingt euros. Le vendeur commence par chiffrer son offre dans un devis. Le client accepte, puis commande. Au moment de la livraison, un nouveau document prouve ce qui a réellement été reçu. Ce n’est qu’après cette vérification que la facture peut demander le paiement.',
      visual: 'commercial-cycle',
    },
    {
      kicker: 'À LA LIVRAISON',
      title: 'On vérifie tout, immédiatement',
      bullets: ['État des colis et des produits', 'Références, quantités et désignations', 'Réserves précises en cas d’anomalie'],
      narration: 'Le client avait commandé treize plaques, mais il n’en reçoit que douze. Signer sans précision reviendrait à reconnaître une livraison conforme. Il faut donc compter, vérifier l’état et les références, puis écrire clairement « une plaque manquante ». Cette réserve permettra au fournisseur de corriger la livraison et, si besoin, la facture.',
      visual: 'industrial-cycle',
    },
    {
      kicker: 'LA FACTURE',
      title: 'Le document qui demande le paiement',
      bullets: ['Numéro, dates et identités', 'Produits, quantités et prix HT', 'Remises, TVA, TTC et échéance'],
      narration: 'Supposons maintenant que la livraison soit conforme. Le vendeur envoie la facture. Pour la contrôler, on relie chaque information à une question : qui vend, qui achète, quoi, combien, à quel prix et pour quelle date de paiement ? Même s’il affiche des prix, le bon de livraison reste une preuve de livraison, pas une demande de paiement.',
      visual: 'bfr',
    },
    {
      kicker: 'LE POURCENTAGE',
      title: 'Toujours ramener le taux sur 100',
      bullets: ['20 % = 20 ÷ 100 = 0,20', 'Part = taux × valeur', '20 % de 150 € = 30 €'],
      narration: 'Vingt pour cent signifie vingt parts sur cent. Sur un prix de cent cinquante euros, on cherche donc vingt centièmes de ce prix : zéro virgule vingt multiplié par cent cinquante donne trente euros. Attention, ces trente euros sont le montant de la remise, pas encore le prix remisé.',
      visual: 'flows',
    },
    {
      kicker: 'REMISE OU MAJORATION',
      title: 'Utiliser le bon coefficient',
      bullets: ['Remise de 20 % : multiplier par 0,80', 'Majoration de 20 % : multiplier par 1,20', 'Taux d’évolution : écart ÷ valeur de départ'],
      narration: 'Une remise de vingt pour cent enlève trente euros à notre prix de cent cinquante euros : il reste cent vingt euros. Le raccourci consiste à conserver quatre-vingts pour cent et à multiplier par zéro virgule huit. Pour une hausse de vingt pour cent, on conserve les cent pour cent de départ et on ajoute vingt pour cent : le coefficient devient un virgule deux.',
      visual: 'days',
    },
    {
      kicker: 'LA TVA',
      title: 'Passer du HT au TTC… et revenir',
      bullets: ['TVA = HT × taux', 'TTC = HT × (1 + taux)', 'HT = TTC ÷ (1 + taux)', '60 € TTC à 20 % = 50 € HT'],
      narration: 'Partons de cinquante euros hors taxe. La TVA de vingt pour cent vaut dix euros : le client paie donc soixante euros. Pour revenir en arrière, le piège serait de retirer vingt pour cent de soixante. C’est faux, car le taux portait sur cinquante. On divise donc le TTC par un virgule deux et on retrouve cinquante euros hors taxe.',
      visual: 'value',
    },
    {
      kicker: 'À RETENIR',
      title: 'Trois réflexes pour réussir',
      bullets: ['Suivre l’ordre des documents', 'Contrôler chaque information', 'Identifier la base avant tout calcul'],
      narration: 'Avant le quiz, retenez surtout le raisonnement. Chaque document répond à une étape précise. Chaque contrôle compare ce qui était prévu à ce qui s’est réellement passé. Et chaque pourcentage s’applique à une base qu’il faut identifier. Si la base est correcte, le calcul devient beaucoup plus simple.',
      visual: 'actions',
    },
  ],
})
