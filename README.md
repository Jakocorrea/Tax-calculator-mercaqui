# Tax & Price Manager

A professional tool for calculating product profitability, tax obligations (IVA/IBUA), and optimal pricing strategies based on Colombian tax regulations.

## 🚀 Deployment to GitHub Pages

To deploy this application to your own GitHub repository and host it on GitHub Pages, follow these steps:

### 1. Initialize Git and Push to GitHub
1. Create a new repository on GitHub (e.g., `tax-price-manager`).
2. In your local terminal (after downloading the code):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

### 2. Update Configuration
Before deploying, you **MUST** update two files with your GitHub details:

#### `package.json`
Update the `homepage` field:
```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPO_NAME/"
```

#### `vite.config.ts`
Update the `base` field:
```typescript
base: '/YOUR_REPO_NAME/'
```
*Note: If you are using a custom domain or hosting at the root of your GitHub Pages site (e.g., `username.github.io`), set `base: '/'`.*

### 3. Deploy
Run the following command to build and deploy to the `gh-pages` branch:
```bash
npm run deploy
```

### 4. Enable GitHub Pages
1. Go to your repository on GitHub.
2. Navigate to **Settings > Pages**.
3. Under **Build and deployment > Branch**, ensure the source is set to `gh-pages` and the folder is `/ (root)`.

## 🛠 Features
- **Dual Calculation Modes**: Margin-based or Fixed Price-based.
- **Tax Analysis**: Automatic calculation of IVA generated and net tax to DIAN.
- **Multi-Product List**: Save multiple analyses to a summary table.
- **Excel Export**: Download all saved data to a `.xlsx` file.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion.

## 📦 Installation
```bash
npm install
npm run dev
```
