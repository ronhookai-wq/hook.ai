# Deploy Hook.ai to Vercel

## Quick Start (5 minutes)

### Option 1: Deploy via Vercel Dashboard (Easiest)

1. **Sign up for Vercel**
   - Go to https://vercel.com/signup
   - Sign up with GitHub, GitLab, or Bitbucket

2. **Push your code to Git**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```

3. **Import Project to Vercel**
   - Go to https://vercel.com/new
   - Click "Import Project"
   - Select your Git repository
   - Vercel will auto-detect Vite configuration

4. **Add Environment Variables**
   In Vercel project settings, add these environment variables:
   ```
   VITE_SUPABASE_URL=https://frpjdlksccqgffyawmmg.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZycGpkbGtzY2NxZ2ZmeWF3bW1nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1OTcxNzcsImV4cCI6MjA3ODE3MzE3N30.btYoXFTml7Yfk4gfqnMmWVxIbcMV8LKjCOS5L1P0_1I
   VITE_GEMINI_API_KEY=AIzaSyDVPLwoigg76Tqpa8DwuGc-_rxuKECeASc
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes for build to complete
   - Your app will be live at `https://your-project.vercel.app`

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```
   - Follow the prompts
   - Add environment variables when prompted

4. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Post-Deployment Steps

### 1. Update Supabase Redirect URLs
Add your Vercel domain to Supabase:
- Go to Supabase Dashboard → Authentication → URL Configuration
- Add to Redirect URLs:
  - `https://your-project.vercel.app`
  - `https://your-project.vercel.app/**`

### 2. Configure Custom Domain (Optional)
- Go to Vercel project → Settings → Domains
- Add your custom domain
- Follow DNS setup instructions

### 3. Enable Analytics (Optional)
- Vercel provides free analytics
- Enable in project settings

## Automatic Deployments

Once connected to Git:
- Every push to `main` branch → automatic production deployment
- Every pull request → automatic preview deployment
- Zero configuration needed

## Environment Variables Management

**Add/Update variables:**
1. Go to Vercel project → Settings → Environment Variables
2. Add new variables
3. Redeploy for changes to take effect

**Never commit `.env` file to Git** - it's already in `.gitignore`

## Troubleshooting

**Build fails?**
- Check environment variables are set correctly
- Ensure all dependencies are in `package.json`
- Check build logs in Vercel dashboard

**App shows blank page?**
- Check browser console for errors
- Verify environment variables are set
- Ensure Supabase URLs are correct

**Authentication doesn't work?**
- Verify redirect URLs are added in Supabase
- Check that Supabase URL and keys are correct

## Your App is Ready!

After deployment, your app will be available at:
- Production: `https://your-project.vercel.app`
- Preview: Automatic URL for each pull request

Vercel provides:
- Free SSL certificate
- Global CDN
- Automatic HTTPS
- 100GB bandwidth/month (free tier)
- Unlimited deployments
