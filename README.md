# ARCHIVES // KIRA — Portfolio Fullstack, Cloud/DevOps & Cybersécurité

Portfolio interactif développé avec **React 18**, **Vite** et **Tailwind CSS**, optimisé pour la performance, la sécurité (AppSec) et la portabilité multi-cloud (Cloudflare Pages, AWS S3 + CloudFront).

---

## 1. Installation, Développement & Build de Production

Ouvre le dossier `portfolio-kira-vscode` dans **Visual Studio Code**, ouvre le terminal intégré (`Ctrl + ` ` ou `Cmd + J`), puis exécute :

```bash
# 1. Installer les dépendances (à faire une seule fois)
npm install

# 2. Lancer le serveur de développement local (http://localhost:5173)
npm run dev

# 3. Générer le dossier de production optimisé (dist/)
npm run build

# 4. Prévisualiser localement le build de production avant mise en ligne
npm run preview
```

### Configuration du formulaire de contact (Web3Forms)
1. Crée une clé gratuite sur [web3forms.com](https://web3forms.com) avec l'adresse **`esthermetavision@gmail.com`**.
2. Copie `.env.example` en `.env` à la racine du projet et renseigne ta clé :
   ```env
   VITE_WEB3FORMS_ACCESS_KEY=ta-cle-web3forms
   ```

---

## 2. Comment ajouter un nouveau projet (en 30 secondes)

Tu n'as **aucun composant React à modifier**. Tout se passe dans **`src/data/portfolioData.js`** :

1. Ouvre `src/data/portfolioData.js` dans VS Code.
2. Descends jusqu'au tableau `export const PROJECTS_DATA = [ ... ]`.
3. Copie le modèle (template) situé juste au-dessus en commentaire et colle-le dans `PROJECTS_DATA` :

```javascript
  {
    id: '05',
    code: 'DOSSIER #05 // DÉPLOYÉ',
    status: 'Déployé',
    statusVariant: 'crimson', // 'crimson' | 'blue' | 'green' | 'yellow'
    category: 'fullstack',    // 'security' | 'fullstack' | 'backend'
    title: 'Mon Nouveau Projet Cloud',
    summary: 'Description courte affichée sur la carte du portfolio.',
    detailedDescription: 'Architecture détaillée affichée lorsqu’on clique sur Inspecter.',
    stack: ['React', 'Docker', 'AWS S3', 'Terraform'],
    repoUrl: 'https://github.com/esthermetavision-cloud/mon-projet',
    demoUrl: 'https://mon-projet.pages.dev', // Optionnel : laisser '' si pas de démo
    locked: false,
  },
```
4. Sauvegarde (`Cmd + S` / `Ctrl + S`) : le projet apparaît immédiatement avec ses filtres, sa carte 3D et sa fenêtre d'inspection.

---

## 3. Déploiement gratuit sur Cloudflare Pages

1. **Pousse ton code sur GitHub :**
   - Crée un dépôt privé ou public sur [github.com/esthermetavision-cloud](https://github.com/esthermetavision-cloud).
   - Initialise Git dans `portfolio-kira-vscode` et pousse tes fichiers (le fichier `.gitignore` protège automatiquement ton `.env`) :
     ```bash
     git init
     git add .
     git commit -m "Initial commit: Kira Archives Portfolio"
     git branch -M main
     git remote add origin https://github.com/esthermetavision-cloud/ton-repo.git
     git push -u origin main
     ```
2. **Connecte Cloudflare Pages :**
   - Connecte-toi sur [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
   - Sélectionne ton dépôt GitHub.
3. **Paramètres de build Cloudflare Pages :**
   - **Framework preset :** `Vite`
   - **Build command :** `npm run build`
   - **Build output directory :** `dist`
4. **Variable d'environnement :**
   - Dans **Settings → Environment variables**, ajoute `VITE_WEB3FORMS_ACCESS_KEY` avec ta clé Web3Forms.
   - Déploie : Cloudflare appliquera automatiquement le fichier `public/_headers` (CSP, HSTS, X-Frame-Options, cache immutable).
   - Pense à remplacer `localhost` par ton URL `.pages.dev` (ou ton nom de domaine personnalisé) dans les réglages de ton formulaire sur Web3Forms.

---

## 4. Migration du dossier `dist/` vers AWS (S3 + CloudFront)

Le site est 100 % statique : aucune modification de code n'est requise pour migrer vers AWS.

1. **Génère le build de production :**
   ```bash
   npm run build
   ```
   Tout le site prêt à héberger se trouve dans le dossier **`dist/`**.
2. **Hébergement sur Amazon S3 :**
   - Crée un bucket S3 (ex. `portfolio-kira-prod`) avec **Block all public access** activé (accès sécurisé uniquement via CloudFront OAC).
   - Uploade le contenu de `dist/` dans le bucket (`aws s3 sync dist/ s3://portfolio-kira-prod --delete`).
3. **Distribution CDN & HTTPS via Amazon CloudFront :**
   - Crée une distribution CloudFront pointant vers ton bucket S3 avec **Origin Access Control (OAC)**.
   - Configure **Default root object** sur `index.html`.
   - Dans **Error pages**, redirige les erreurs `403` et `404` vers `/index.html` avec le code HTTP `200` (routage SPA propre).
   - Crée une **Response Headers Policy** dans CloudFront en reprenant les en-têtes définis dans `public/_headers` (`Strict-Transport-Security`, `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy` et `Content-Security-Policy`).
