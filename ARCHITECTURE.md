# ARCHITECTURE TECHNIQUE — ARCHIVES // KIRA (`portfolio-kira-vscode`)

Ce document décrit l'architecture logicielle, les règles de conception verrouillées et les protocoles de sécurité du portfolio. Toute IA ou développeur intervenant sur ce dépôt doit respecter scrupuleusement ces spécifications.

---

## 1. Arborescence du projet

```text
portfolio-kira-vscode/
├── .vscode/
│   ├── extensions.json            # Extensions recommandées (Tailwind IntelliSense, ESLint, Prettier)
│   └── settings.json              # Formatage automatique à la sauvegarde
├── public/
│   └── _headers                   # En-têtes de sécurité HTTP (CSP, HSTS, X-Frame-Options) + Cache-Control
├── .env                           # Clé locale Web3Forms (ignoré par Git)
├── .env.example                   # Modèle de variables d'environnement (versionné)
├── .gitignore                     # Exclusion stricte de .env, node_modules et dist
├── ARCHITECTURE.md                # Ce document d'architecture
├── README.md                      # Guide d'installation, ajout de projets, Cloudflare Pages & AWS S3/CloudFront
├── index.html                     # Point d'entrée HTML + métadonnées SEO/Referrer + Google Fonts
├── package.json                   # Dépendances : React 18, Vite 6, Tailwind CSS 3, Lucide React
├── postcss.config.js              # Pipeline PostCSS (Tailwind + Autoprefixer)
├── tailwind.config.js             # Palette chromatique Death Note / Cyber (#060608, #0f0f13, #9e0d1d)
├── vite.config.js                 # Configuration build production (sourcemaps off, chunk splitting)
└── src/
    ├── main.jsx                   # Montage de <App /> dans #root
    ├── index.css                  # Effets visuels sur mesure (CRT scanlines, égaliseur audio, bouton Death Note)
    ├── App.jsx                    # Orchestration des sections & chargement différé (React.lazy) des modales
    ├── data/
    │   └── portfolioData.js       # SOURCE UNIQUE DE VÉRITÉ (profil, projets, diplômes, labs, arsenal, liens)
    ├── hooks/
    │   └── usePianoAudio.js       # Synthétiseur WAV PCM en mémoire + gestion non-bloquante de l'autoplay
    └── components/
        ├── Navbar.jsx             # Barre de navigation sticky + menu tiroir latéral responsive (< 1280px)
        ├── HeroTacticalCanvas.jsx # Scène 3D tactique inspirée MW2 / MW3 (Canvas 2D + projection 3D)
        ├── TiltCard.jsx           # Effet d'inclinaison 3D + reflet spéculaire carmin au survol
        ├── ContactSection.jsx     # Formulaire de contact Web3Forms + Honeypot + cooldown anti-flood
        ├── SocialLinksRow.jsx     # Boutons GitHub, LinkedIn et Email Direct
        └── Modals.jsx             # ProjectModal (inspection d'architecture) & CvModal (aperçu + PDF)
```

---

## 2. Flux de données (`Data-Driven Architecture`)

Toutes les données textuelles et structurelles sont centralisées dans **`src/data/portfolioData.js`** :
- **`PROFILE_CONFIG`** : identité (`monogram`, `brandTitle`, `roleTitle`, `quote`, `subtitle`), phrases de la machine à écrire, configuration du CV (`targetRoles`, `details`, `canvaUrl`, `pdfFile`) et liens sociaux (`github`, `linkedin`, `email`).
- **`PROJECTS_DATA`** : liste des dossiers techniques affichés dans `#dossiers` et filtrables par catégorie (`all`, `security`, `fullstack`, `backend`). Chaque objet supporte un lien `repoUrl` et un lien optionnel `demoUrl`.
- **`CREDENTIALS_DATA`** : diplômes et certifications dans `#credentials`.
- **`LABS_DATA`** : cartes R&D / veille active dans `#credentials`.
- **`ARSENAL_DATA`** : colonnes de compétences techniques dans `#arsenal`.
- **`MISSION_TYPES`** : options du menu déroulant personnalisé du formulaire `#transmission`.

**Règle d'or :** Ne jamais coder en dur des textes personnels dans les composants JSX ; toujours passer par `src/data/portfolioData.js`.

---

## 3. Moteur 3D (`HeroTacticalCanvas.jsx`) & Audio (`usePianoAudio.js`)

### Scène 3D MW2 / MW3 (`HeroTacticalCanvas.jsx`)
- **Projection 3D temps réel :** Globe terrestre filaire (méridiens, parallèles, anneau orbital incliné), arcs balistiques intercontinentaux animés, nœuds tactiques radar (`LILLE`, `DC-09`, `TYO-02`, etc.) et onde sismique harmonique traversant l'écran.
- **Zéro clignotement au redimensionnement :** Les nouvelles dimensions (`pendingW`, `pendingH`) sont mesurées via `ResizeObserver` et appliquées au buffer `<canvas>` **synchroniquement dans `requestAnimationFrame` juste avant le tracé**, évitant toute frame vide.
- **Stabilité mobile :** Ignore les variations verticales `< 95px` à largeur constante provoquées par le masquage/affichage de la barre d'adresse mobile au scroll.
- **Économie d'énergie & Accessibilité :**
  - Écoute `document.addEventListener('visibilitychange', ...)` pour mettre la boucle en pause dès que l'onglet est masqué.
  - Écoute `prefers-reduced-motion: reduce` pour afficher une frame statique nette si l'utilisateur demande la réduction des animations.
  - Nettoie les listeners et remet `canvas.width = 0; canvas.height = 0` au démontage.

### Moteur Audio Piano (`usePianoAudio.js`)
- Génère une piste WAV PCM 16-bit mono de 24 secondes en mémoire via `Blob` + `URL.createObjectURL` (zéro fichier MP3 externe à héberger).
- Utilise `preload="metadata"` et diffère la synthèse via `requestIdleCallback` afin de ne pas bloquer le chargement initial de la page.
- Gère silencieusement les restrictions d'autoplay des navigateurs (Brave/Chrome/Safari) et débloque la lecture au premier geste utilisateur ou au clic sur l'égaliseur 5 barres de la barre de navigation.

---

## 4. Règles de sécurité (AppSec / SOC) & Design Verrouillé

### Sécurité
1. **En-têtes HTTP (`public/_headers`) :**
   - `Content-Security-Policy` stricte autorisant uniquement `'self'`, Google Fonts (`fonts.googleapis.com` / `fonts.gstatic.com`), les médias `blob:` (synthétiseur audio) et `https://api.web3forms.com` (formulaire de contact).
   - `Strict-Transport-Security`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`.
2. **Protection des secrets :** `.env` est exclu dans `.gitignore` et les sourcemaps sont désactivées en production (`sourcemap: false` dans `vite.config.js`).
3. **Protection du formulaire (`ContactSection.jsx`) :** Champ piège invisible `botcheck` (Honeypot), cooldown anti-flood de 15 secondes, validation stricte des champs et longueur maximale bornée (`3000` caractères).
4. **Liens externes :** Tous les liens externes `http(s)` utilisent `target="_blank" rel="noopener noreferrer"`.

### Contraintes de design à ne jamais altérer
- **Navbar :** Logo `K` libre sans cadre ; bouton fréquence audio à 5 barres d'égaliseur **sans texte** ; bascule responsive synchronisée à `xl:` (`1280px`).
- **Cartes 3D (`TiltCard`) :** Effet d'inclinaison 3D présent sur les cartes Projets, Accréditations et Labs Techniques.
- **Modale CV (`CvModal`) :** Aucune barre de défilement visible (`.no-scrollbar`), 3 lignes d'informations empilées verticalement, et bouton `Ouvrir sur Canva` avec icône collée au texte (`whitespace-nowrap`).
