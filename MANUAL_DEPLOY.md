# Simple Deployment for GitHub Interface Users

If you prefer to upload your files manually and let GitHub handle the publishing, follow these instructions:

### Option A: Uploading Source Code (Recommended)
This method lets you upload your code (the files you see here) and has GitHub automatically build and publish the app.

1. **Upload your files** to a new GitHub repository.
2. **Add the Workflow File**: Ensure the file `.github/workflows/deploy.yml` (which I just created for you) is included in your upload.
3. **Enable GitHub Actions Pages**:
   - Go to your repo **Settings** > **Pages**.
   - Under **Build and deployment** > **Source**, change it to **"GitHub Actions"**.
4. **Push/Upload**: Every time you upload or push code, GitHub will automatically build and update your site.

### Option B: Uploading the "dist" Folder Manually
If you run `npm run build` on your computer and want to upload the result:

1. **Run Build**: Open your terminal and run `npm run build`.
2. **Locate "dist"**: A folder named `dist` will appear in your project.
3. **Upload Contents**: Upload **only the contents** of the `dist` folder directly to your repository's `main` branch (or a specific branch).
4. **Settings**:
   - Go to **Settings** > **Pages**.
   - Set **Source** to **"Deploy from a branch"**.
   - Select your branch and folder `/ (root)`.

### Why "base: './'" is important
In `vite.config.ts`, I have set `base: './'`. This is crucial for manual uploads because it tells the browser to look for assets in the same folder as the `index.html`, regardless of your repository name.
