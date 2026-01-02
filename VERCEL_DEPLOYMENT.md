# Deploying DIGITL to Vercel

This guide will walk you through deploying your DIGITL web application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com) if you don't have one)
2. Git repository with your code (GitHub, GitLab, or Bitbucket)
3. Node.js installed locally (for testing builds)

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Prepare Your Repository

1. Make sure your `web-react` folder is in a Git repository
2. Push your code to GitHub, GitLab, or Bitbucket
3. Ensure all files are committed and pushed

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect your project settings

### Step 3: Configure Build Settings

Vercel should auto-detect these settings, but verify:

- **Framework Preset**: Vite
- **Root Directory**: `web-react` (if your repo root is the parent folder) or leave blank if `web-react` is the repo root
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

### Step 4: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 1-2 minutes)
3. Your site will be live at a URL like `your-project.vercel.app`

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Navigate to Project Directory

```bash
cd web-react
```

### Step 4: Deploy

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Enter a name or press Enter for default)
- Directory? **./** (current directory)
- Override settings? **No**

### Step 5: Production Deployment

For production deployment:

```bash
vercel --prod
```

## Configuration Files

The project includes a `vercel.json` file with the following configuration:

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Rewrites**: All routes redirect to `index.html` for client-side routing

This ensures that:
- The privacy policy page at `/privacy-policy` works correctly
- All routes are handled by React Router
- The SPA (Single Page Application) routing works properly

## Custom Domain (Optional)

1. Go to your project settings in Vercel
2. Click **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## Environment Variables

If you need environment variables:

1. Go to Project Settings → Environment Variables
2. Add your variables
3. Redeploy for changes to take effect

## Continuous Deployment

Vercel automatically deploys when you push to your main branch:
- Every push to `main`/`master` = Production deployment
- Pull requests = Preview deployments

## Troubleshooting

### Build Fails

1. Check build logs in Vercel dashboard
2. Test build locally: `npm run build`
3. Ensure all dependencies are in `package.json`

### Routes Not Working

- Verify `vercel.json` exists with rewrites configuration
- Check that React Router is properly configured
- Ensure all routes redirect to `index.html`

### Assets Not Loading

- Check that asset paths are relative (not absolute)
- Verify `vite.config.ts` has correct base path (if needed)

## Testing Production Build Locally

Before deploying, test your production build:

```bash
npm run build
npm run preview
```

Visit `http://localhost:4173` to preview the production build.

## Support

For Vercel-specific issues, check:
- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Community](https://github.com/vercel/vercel/discussions)

