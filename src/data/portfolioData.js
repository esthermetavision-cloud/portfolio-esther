// ====================================================================================
// FICHIER CENTRALISÉ DES DONNÉES DU PORTFOLIO
// Modifie uniquement ce fichier pour ajouter tes futurs projets, diplômes, labs ou skills.
// ====================================================================================

export const PROFILE_CONFIG = {
  monogram: 'T',
  brandTitle: 'Tommy',
  protocolLabel: 'ARCHIVES // PROTOCOL',
  systemId: 'SYSTEM ID : 0x7F_ESTHER // SECURE MODE',
  roleTitle: 'Fullstack & Ingénierie Cloud/DevOps',
  quote: "« Ceux qui maîtrisent l'informatique façonnent les règles du nouveau monde. »",
  subtitle:
    'Conception d’architectures web résilientes, automatisation cloud et sécurisation de bout en bout.',
  typewriterPhrases: [
    'Initialisation du protocole de défense...',
    'Évaluation des vulnérabilités terminée. Aucun exploit détecté.',
    'Tous les systèmes répondent sous chiffrement de bout en bout.',
    'Bienvenue dans les archives techniques. Consultez les dossiers.',
  ],
  cv: {
    subtitle: 'CV_TOMMY_RAMIANDRASOA',
    targetRoles: ['Fullstack Junior', 'Ingénieur Cloud', 'Ingénieur DevOps'],
    // DESIGN VERROUILLÉ : 3 lignes empilées verticalement validées par l'utilisateur
    details: [
      { label: 'Formation Supérieure :', value: 'Bac+2 / Informatique', highlight: true },
      { label: 'Alternance :', value: '2027 - 2028', highlight: false },
      { label: 'Études :', value: 'Cycle ingénieur informatique à Lille', highlight: false },
    ],
    canvaUrl: 'https://canva.link/bawrfd8slky3tpz',
    // Dépose ton fichier PDF dans le dossier "public/" puis renseigne son nom ci-dessous (ex: 'CV_Tommy_RAMIANDRASOA.pdf')
    pdfFile: '',
  },
  socials: {
    github: 'https://github.com/esthermetavision-cloud',
    linkedin: 'https://www.linkedin.com/in/esthermetavision/',
    email: 'mailto:esthermetavision@gmail.com',
  },
};

/*
  ====================================================================================
  MODÈLE (TEMPLATE) PRÊT À COPIER-COLLER POUR AJOUTER UN NOUVEAU PROJET :
  Copie le bloc ci-dessous et colle-le dans le tableau `PROJECTS_DATA` juste en dessous.
  - `category` doit être : 'security', 'fullstack' ou 'backend'
  - `statusVariant` doit être : 'crimson' (Déployé), 'blue' (Actif), 'green' (Validé) ou 'yellow' (Verrouillé)
  - `demoUrl` est optionnel : laisse '' si tu n'as pas de lien de démo en ligne, ou mets 'https://...'
  ====================================================================================

  {
    id: '05',
    code: 'DOSSIER #05 // DÉPLOYÉ',
    status: 'Déployé',
    statusVariant: 'crimson',
    category: 'fullstack',
    title: 'Nom de ton nouveau projet',
    summary: 'Description courte et percutante affichée sur la carte du projet (2-3 lignes max).',
    detailedDescription:
      'Description technique complète affichée dans la fenêtre Inspecter (architecture, choix techniques, résultats).',
    stack: ['React', 'Node.js', 'Docker', 'AWS'],
    repoUrl: 'https://github.com/esthermetavision-cloud/nom-du-repo',
    demoUrl: 'https://demo.esthercloud.fr',
    locked: false,
  },
*/

export const PROJECTS_DATA = [
  {
    id: '01',
    code: 'DOSSIER #01 // ANIME',
    status: 'Déployé',
    statusVariant: 'crimson',
    category: 'security',
    title: 'Anime : Site Streaming',
    summary:
      "Plateforme de streaming d'anime avec architecture défensive multi-nœuds, conteneurisation isolée et monitoring temps réel.",
    detailedDescription:
      "Architecture défensive multi-nœuds avec conteneurisation isolée pour capture d'exploits zero-day et monitoring temps réel.",
    stack: ['Python', 'Docker', 'IPTables', 'Telegram Bot API'],
    repoUrl: 'https://github.com/esthermetavision-cloud',
    demoUrl: '',
    locked: false,
  },
  {
    id: '02',
    code: 'DOSSIER #02 // RECHERCHE',
    status: 'Actif',
    statusVariant: 'blue',
    category: 'fullstack',
    title: 'Lexicon Death Note : Journal Audit',
    summary:
      "Plateforme collaborative d'audit et de traçabilité immuable (append-only) avec signature cryptographique ECDSA de chaque modification.",
    detailedDescription:
      "Journal d'événements immuables avec vérification cryptographique des blocs et interface sombre réactive.",
    stack: ['React', 'Node.js', 'PostgreSQL', 'Web Crypto'],
    repoUrl: 'https://github.com/esthermetavision-cloud',
    demoUrl: '',
    locked: false,
  },
  {
    id: '03',
    code: 'DOSSIER #03 // INFRA',
    status: 'Validé',
    statusVariant: 'green',
    category: 'backend',
    title: 'Nexus Engine : API Gateway & Auth Guard',
    summary:
      "Passerelle d'API distribuée avec rotation dynamique de clés JWT, limitation stricte de débit (Token Bucket) et mitigation anti-bruteforce.",
    detailedDescription:
      'Microservices gateway gérant plus de 10 000 requêtes/sec avec cache Redis et isolation sécurisée.',
    stack: ['Java / Spring Boot', 'Redis', 'OAuth2'],
    repoUrl: 'https://github.com/esthermetavision-cloud',
    demoUrl: '',
    locked: false,
  },
  {
    id: '04',
    code: 'DOSSIER #04 // EN ATTENTE',
    status: 'Verrouillé',
    statusVariant: 'yellow',
    category: 'security',
    title: '[Emplacement Réservé : Projet Réseaux & Cryptographie]',
    summary:
      "Emplacement prêt à recevoir vos prochains déploiements majeurs (projets d'école, projets personnels ou plateformes en entreprise).",
    detailedDescription: '',
    stack: [],
    repoUrl: '',
    demoUrl: '',
    locked: true,
  },
];

export const CREDENTIALS_DATA = [
  {
    icon: 'graduation-cap',
    badge: '2024 - 2026',
    badgeVariant: 'neutral',
    title: 'Formation Supérieure en Informatique & Réseaux',
    subtitle: 'BTS CIEL / SNIR / Ingénierie Logicielle',
    description:
      "Maîtrise de l'administration systèmes Linux, développement logiciel orienté objet, routage, protocoles IP et architectures distribuées.",
    tags: ['C++ / Java', 'Linux Kernel / Bash', 'Cisco Packet Tracer'],
  },
  {
    icon: 'shield',
    badge: 'Vérifié',
    badgeVariant: 'green',
    title: 'Certifications Cybersécurité & Fondations Web',
    subtitle: 'ANSSI SecNumAcadémie / Cisco / FreeCodeCamp',
    description:
      'Sensibilisation approfondie aux vulnérabilités OWASP Top 10, hygiène informatique des organisations, cryptographie asymétrique et sécurisation réseau.',
    tags: ['OWASP Top 10', 'TLS/SSL', 'Hardening Linux'],
  },
  {
    icon: 'cloud',
    badge: 'En Préparation',
    badgeVariant: 'yellow',
    title: 'Cloud Practitioner / Solutions Architect',
    subtitle: 'AWS / Azure Fundamentals',
    description:
      "Déploiement d'environnements virtualisés scalables, conteneurisation Docker, gestion des IAM et isolation réseau par VPC.",
    tags: ['VPC / Security Groups', 'Docker CI/CD'],
  },
  {
    icon: 'plus-circle',
    badge: 'Futur Titre',
    badgeVariant: 'neutral',
    title: 'Accréditation Spécialisée (À Compléter)',
    subtitle: 'Certification Professionnelle',
    description:
      "Cet espace est prêt à recevoir vos futures certifications professionnelles (ex: CompTIA Security+, CEH, HashiCorp Terraform ou certifications d'école).",
    tags: [],
    footerNote: 'Attestation vérifiable via identifiant cryptographique.',
  },
];

export const LABS_DATA = [
  {
    code: 'LAB #01 // CLOUD & IAC',
    dotColor: 'bg-yellow-400',
    title: 'Terraform & AWS Hardening',
    description:
      'Automatisation du provisionnement de VPC isolés, passerelles NAT sécurisées et gestion stricte des IAM policies par code.',
    tags: ['HCL', 'AWS VPC', 'TFLint'],
  },
  {
    code: 'LAB #02 // DEVOPS & CI/CD',
    dotColor: 'bg-green-400',
    title: 'Pipelines CI/CD & Scan Snyk',
    description:
      "Intégration de tests unitaires automatisés, scans de vulnérabilités conteneurs et signatures d'images via Cosign.",
    tags: ['GitHub Actions', 'Docker', 'Snyk / Trivy'],
  },
  {
    code: 'LAB #03 // ARCHITECTURE',
    dotColor: 'bg-blue-400',
    title: 'Event-Driven & Spring Cloud',
    description:
      "Expérimentation de microservices asynchrones avec files d'attente distribuées, résilience et traçabilité OpenTelemetry.",
    tags: ['Java 21', 'Kafka / RabbitMQ', 'Spring Boot 3'],
  },
];

// Niveau représenté par une jauge tactique uniforme à 5 segments (`rating`: 1 à 5)
export const ARSENAL_DATA = [
  {
    category: 'Langages',
    icon: 'code',
    skills: [
      { name: 'Java (OOP / Concurrency)', rating: 4, tier: 'high' },
      { name: 'Python (Scraping / Sec)', rating: 4, tier: 'high' },
      { name: 'JavaScript / TypeScript', rating: 3, tier: 'base' },
      { name: 'C / C++ (Fondations)', rating: 3, tier: 'base' },
      { name: 'SQL (Postgres, MariaDB)', rating: 4, tier: 'high' },
    ],
  },
  {
    category: 'Backend & Données',
    icon: 'server',
    skills: [
      { name: 'Spring Boot / REST APIs', rating: 4, tier: 'high' },
      { name: 'FastAPI / Flask', rating: 4, tier: 'high' },
      { name: 'Node.js / Express', rating: 3, tier: 'base' },
      { name: 'Redis (Cache / Rate limit)', rating: 3, tier: 'base' },
      { name: 'Prisma / Hibernate ORM', rating: 3, tier: 'base' },
    ],
  },
  {
    category: 'Sécurité & Défense',
    icon: 'shield-alert',
    skills: [
      { name: 'OWASP Mitigation (XSS, SQLi)', rating: 5, tier: 'top' },
      { name: 'JWT / OAuth2 / Argon2', rating: 4, tier: 'high' },
      { name: 'Chiffrement (AES-GCM, RSA)', rating: 4, tier: 'high' },
      { name: 'En-têtes HTTP (CSP, HSTS)', rating: 3, tier: 'base' },
      { name: 'Audit de vulnérabilités (Snyk)', rating: 3, tier: 'base' },
    ],
  },
  {
    category: 'Systèmes & Réseaux',
    icon: 'cpu',
    skills: [
      { name: 'Linux (Debian / Arch / Bash)', rating: 5, tier: 'top' },
      { name: 'Docker & Docker Compose', rating: 4, tier: 'high' },
      { name: 'Protocoles (TCP/IP, DNS, SSH)', rating: 3, tier: 'base' },
      { name: 'Nginx / Reverse Proxy', rating: 3, tier: 'base' },
      { name: 'Git / GitHub Actions', rating: 3, tier: 'base' },
    ],
  },
];

export const MISSION_TYPES = [
  { value: 'recruitment', label: 'Recrutement / Alternance / CDI' },
  { value: 'freelance', label: 'Mission Fullstack & Architecture' },
  { value: 'audit', label: 'Audit de Sécurité / Code Review' },
  { value: 'classified', label: 'Autre / Échange technique' },
];
