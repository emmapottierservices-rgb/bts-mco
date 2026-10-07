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
  [1, 1, 'Le cycle d’exploitation', 'Comprendre les flux de l’unité commerciale', '25 min', 'emerald', '↻', ['Les opérations d’achat et de vente', 'Les flux physiques et financiers', 'Le besoin en fonds de roulement'], 'Le cycle d’exploitation regroupe toutes les opérations courantes, de l’achat des marchandises jusqu’à l’encaissement des ventes.', 'Une boutique achète un stock, le vend puis encaisse ses clients : ces trois moments forment son cycle d’exploitation.'],
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
  title: 'Le cycle d’exploitation et le BFR',
  subtitle: 'Comprendre les décalages entre les flux et calculer le besoin de financement',
  duration: '45 min',
  points: [
    'Comprendre le cycle d’exploitation et sa durée',
    'Distinguer les flux physiques et les flux financiers',
    'Identifier une ressource ou un besoin de financement',
    'Calculer le BFR en jours et en valeur',
  ],
  definition: 'Le cycle d’exploitation représente les opérations liées à l’activité de l’entreprise, depuis l’achat jusqu’à l’encaissement des biens ou services vendus. Sa durée varie selon qu’il s’agit d’une entreprise commerciale, industrielle ou de services.',
  example: 'Une entreprise commerciale stocke ses marchandises pendant 15 jours, vend au comptant et paie ses fournisseurs à 30 jours. Son cycle dure 30 jours et son BFR est de −15 jours : elle dispose d’une ressource de financement.',
  courseSections: [
    {
      title: '1. Comprendre le cycle d’exploitation',
      paragraphs: [
        'Le cycle commence au moment où l’entreprise achète les marchandises ou les matières premières. Il se termine lorsque les ventes sont encaissées et les fournisseurs payés.',
        'Dans une entreprise industrielle, il est généralement plus long car il faut ajouter la transformation des matières premières et une seconde période de stockage des produits finis.',
      ],
      note: 'Entreprise commerciale : cycle de 30 jours dans l’exemple. Entreprise industrielle : 30 + 15 + 15 = 60 jours.',
    },
    {
      title: '2. Distinguer les flux',
      paragraphs: [
        'Les flux physiques correspondent aux transferts de biens ou de services : achats, livraisons et ventes.',
        'Ils ont pour contrepartie des flux financiers : décaissements vers les fournisseurs et encaissements reçus des clients. Les bons de commande, bons de livraison et factures encadrent ces transactions.',
      ],
    },
    {
      title: '3. Identifier le besoin en fonds de roulement',
      paragraphs: [
        'Si l’entreprise doit payer ses fournisseurs avant d’avoir vendu ou encaissé ses clients, elle doit avancer de la trésorerie : elle a un besoin en fonds de roulement.',
        'Si elle vend et encaisse avant de payer ses fournisseurs, elle bénéficie d’une ressource en fonds de roulement.',
      ],
      formula: 'BFR = créances d’exploitation + stocks − dettes d’exploitation',
      note: 'BFR positif = besoin à financer. BFR négatif = ressource de financement.',
    },
    {
      title: '4. Calculer le BFR en jours',
      paragraphs: [
        'Exemple commercial : créances clients 0 jour + stockage 15 jours − dettes fournisseurs 30 jours = −15 jours. Le BFR négatif constitue une ressource confortable.',
        'Exemple industriel : créances clients 15 jours + stockage 45 jours − dettes fournisseurs 30 jours = 30 jours. L’entreprise doit financer un décalage de trésorerie de 30 jours.',
      ],
      formula: 'BFR en jours = délai clients + durée de stockage − délai fournisseurs',
    },
    {
      title: '5. Calculer le BFR en valeur',
      paragraphs: [
        'Pour une entreprise sans bilan antérieur, les créances et les dettes peuvent être estimées à partir du chiffre d’affaires, des achats et des délais de règlement, sur la base d’une année de 360 jours.',
        'Avec 800 000 € de chiffre d’affaires TTC, des achats égaux à 30 % du chiffre d’affaires, 60 jours de stock, 15 jours de délai client et 60 jours de délai fournisseur : les créances valent 33 333,33 €, les stocks 33 333,33 € HT et les dettes 40 000 €.',
      ],
      formula: 'BFR = 33 333,33 + 33 333,33 − 40 000 = 26 666,67 €',
      note: 'Pour réduire le BFR : encaisser les clients plus vite, limiter les stocks et négocier des délais fournisseurs plus longs.',
    },
  ],
  questions: [
    {
      question: 'Que représente le cycle d’exploitation ?',
      answers: ['Les opérations de l’achat jusqu’à l’encaissement des ventes', 'Uniquement la période de stockage', 'La durée de vie de l’entreprise', 'Uniquement le paiement des fournisseurs'],
      correct: 0,
      explanation: 'Le cycle regroupe toutes les opérations courantes, depuis l’achat jusqu’à l’encaissement des biens ou services vendus.',
    },
    {
      question: 'Lequel de ces éléments est un flux financier ?',
      answers: ['La livraison des marchandises', 'Le stockage des produits', 'Le règlement d’un fournisseur', 'La transformation des matières premières'],
      correct: 2,
      explanation: 'Le règlement du fournisseur correspond à une sortie d’argent, donc à un flux financier.',
    },
    {
      question: 'Dans l’exemple industriel du cours, quelle est la durée du cycle d’exploitation ?',
      answers: ['15 jours', '30 jours', '45 jours', '60 jours'],
      correct: 3,
      explanation: 'Le cycle dure 30 jours de stockage des matières, 15 jours de stockage des produits finis et 15 jours de délai client, soit 60 jours.',
    },
    {
      question: 'Que signifie un BFR négatif ?',
      answers: ['L’entreprise est forcément en perte', 'L’entreprise dispose d’une ressource de financement', 'Les stocks sont nuls', 'Les clients ne paient jamais'],
      correct: 1,
      explanation: 'Lorsque le BFR est négatif, les encaissements arrivent avant certains décaissements : l’exploitation génère une ressource.',
    },
    {
      question: 'Une entreprise a 15 jours de stock, aucun délai client et paie ses fournisseurs à 30 jours. Quel est son BFR en jours ?',
      answers: ['+45 jours', '+15 jours', '−15 jours', '−30 jours'],
      correct: 2,
      explanation: 'Le calcul est : 0 jour de créances + 15 jours de stock − 30 jours de dettes = −15 jours.',
    },
  ],
  videoSlides: [
    {
      kicker: 'CHAPITRE 1',
      title: 'Comprendre le cycle d’exploitation et le BFR',
      bullets: ['Des achats jusqu’aux encaissements', 'Des exemples commerciaux et industriels', 'Un calcul en jours puis en euros'],
      narration: 'Bienvenue dans ce chapitre consacré au cycle d’exploitation et au besoin en fonds de roulement. Nous allons suivre le trajet de l’argent dans l’entreprise, comprendre les décalages de paiement, puis apprendre à calculer le BFR en jours et en euros.',
      visual: 'intro',
    },
    {
      kicker: 'ÉTAPE 1',
      title: 'Deux familles de flux',
      bullets: ['Flux physiques : achats, livraisons, ventes', 'Flux financiers : décaissements et encaissements', 'Documents : bon de commande, bon de livraison, facture'],
      narration: 'L’activité crée deux familles de flux. Les flux physiques correspondent aux biens ou services qui circulent. En contrepartie, les flux financiers correspondent à l’argent encaissé auprès des clients ou décaissé pour payer les fournisseurs. Des documents commerciaux encadrent chaque opération.',
      visual: 'flows',
    },
    {
      kicker: 'EXEMPLE COMMERCIAL',
      title: 'Un cycle de 30 jours',
      bullets: ['15 jours de stockage', 'Vente et encaissement au comptant', 'Fournisseur payé à 30 jours'],
      narration: 'Prenons une entreprise commerciale. Elle achète des marchandises, les stocke pendant quinze jours, puis les vend au comptant. Son fournisseur est payé trente jours après l’achat. Ici, le paiement du fournisseur marque la fin du cycle : sa durée est donc de trente jours.',
      visual: 'commercial-cycle',
    },
    {
      kicker: 'EXEMPLE INDUSTRIEL',
      title: 'Un cycle plus long : 60 jours',
      bullets: ['30 jours de matières premières', '15 jours de produits finis', '15 jours de délai client'],
      narration: 'Dans une entreprise industrielle, le cycle est plus long. Il faut stocker les matières premières, les transformer, stocker les produits finis, puis attendre le règlement du client. Dans notre exemple, trente plus quinze plus quinze donnent un cycle de soixante jours.',
      visual: 'industrial-cycle',
    },
    {
      kicker: 'LE DÉCALAGE À FINANCER',
      title: 'Besoin ou ressource ?',
      bullets: ['Paiement avant encaissement : besoin', 'Encaissement avant paiement : ressource', 'Le signe du résultat donne le diagnostic'],
      narration: 'Les encaissements et les décaissements n’arrivent pas toujours au même moment. Si l’entreprise paie avant d’encaisser, elle doit trouver une avance de trésorerie. Elle a un besoin. Si elle encaisse avant de payer, elle dispose au contraire d’une ressource.',
      visual: 'bfr',
    },
    {
      kicker: 'CALCUL EN JOURS',
      title: 'BFR = clients + stocks − fournisseurs',
      bullets: ['Exemple commercial : 0 + 15 − 30 = −15 jours', 'Exemple industriel : 15 + 45 − 30 = 30 jours'],
      narration: 'En jours, on additionne le délai accordé aux clients et la durée de stockage, puis on retire le délai obtenu des fournisseurs. Moins quinze jours correspond à une ressource. Plus trente jours correspond à un besoin de trésorerie.',
      visual: 'days',
    },
    {
      kicker: 'CALCUL EN EUROS',
      title: 'Prévoir la trésorerie nécessaire',
      bullets: ['Créances : 33 333,33 € TTC', 'Stocks : 33 333,33 € HT', 'Dettes : 40 000 € TTC', 'BFR : 26 666,67 €'],
      narration: 'Le BFR en valeur permet de prévoir l’avance de trésorerie nécessaire. Dans l’exemple du cours, les créances et les stocks totalisent soixante-six mille six cent soixante-six euros. Après retrait des quarante mille euros de dettes, le besoin est de vingt-six mille six cent soixante-six euros et soixante-sept centimes.',
      visual: 'value',
    },
    {
      kicker: 'À RETENIR',
      title: 'Comment faire baisser le BFR ?',
      bullets: ['Encaisser les clients plus rapidement', 'Réduire la durée de stockage', 'Négocier des délais fournisseurs plus longs', 'Recalculer le BFR à chaque évolution importante'],
      narration: 'Pour réduire le besoin en fonds de roulement, l’entreprise peut encaisser ses clients plus rapidement, limiter ses stocks et négocier des délais fournisseurs plus longs. Le BFR doit être anticipé au démarrage puis recalculé régulièrement. Vous êtes maintenant prêt à tester vos connaissances.',
      visual: 'actions',
    },
  ],
})
