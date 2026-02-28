# Tax & Price Manager

A professional tool for calculating product profitability, tax obligations (IVA/IBUA), and optimal pricing strategies based on Colombian tax regulations.

## ⚠️ CRITICAL: Why you see a "White Page"
If you simply upload these files to GitHub and turn on GitHub Pages, **it will not work**. You will see a white page. This is because browsers cannot run `.tsx` files directly. 

**You MUST build the app first.** You have two ways to do this:

### Option 1: The "Automatic" Way (Recommended)
1. Upload all these files to your GitHub repository.
2. Go to your repository **Settings** > **Pages**.
3. Under **Build and deployment** > **Source**, change it to **"GitHub Actions"**.
4. GitHub will now automatically build and publish your app. Wait 2 minutes and it will be live.

### Option 2: The "Manual" Way (Uploading the 'dist' folder)
1. On your computer, open a terminal in this folder.
2. Run `npm install` and then `npm run build`.
3. A new folder named **`dist`** will appear.
4. **ONLY upload the contents of the `dist` folder** to your GitHub repository.
5. In **Settings** > **Pages**, set the source to your branch and folder `/ (root)`.

---

## 🚀 Deployment Steps

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
