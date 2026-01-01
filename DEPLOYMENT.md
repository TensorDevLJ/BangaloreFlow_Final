# 🚀 Deployment Guide

## Deploy to Production (Free Hosting)

This guide will help you deploy BangaloreFlow to production using free hosting services.

## Prerequisites

- GitHub account (for code repository)
- MongoDB Atlas account (for database)
- Render account (for backend)
- Vercel/Netlify account (for frontend)

---

## Step 1: Prepare Code for Production

### 1.1 Create GitHub Repository

```bash
cd bangaloreflow
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/bangaloreflow.git
git push -u origin main
```

### 1.2 Update Environment Files

Ensure `.env.example` files are committed but actual `.env` files are in `.gitignore`.

---

## Step 2: Deploy Backend (Render.com)

### 2.1 Create Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +"
4. Select "Web Service"

### 2.2 Configure Service
- **Repository**: Connect your GitHub repo
- **Name**: `bangaloreflow-api`
- **Region**: Choose closest to India (Singapore recommended)
- **Branch**: `main`
- **Root Directory**: `backend`
- **Runtime**: Node
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### 2.3 Add Environment Variables

In Render dashboard, add these environment variables:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/bangaloreflow
FRONTEND_URL=https://your-frontend-url.vercel.app
GOOGLE_MAPS_API_KEY=your_key_here (optional)
WEATHER_API_KEY=your_key_here (optional)
```

### 2.4 Deploy

- Click "Create Web Service"
- Wait 3-5 minutes for deployment
- Copy your backend URL: `https://bangaloreflow-api.onrender.com`

### 2.5 Test Backend

Visit: `https://your-backend-url.onrender.com/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "BangaloreFlow API is running"
}
```

---

## Step 3: Deploy Frontend (Vercel)

### 3.1 Build Frontend Locally First

```bash
cd frontend
npm install
npm run build
```

This creates a `dist` folder. Test it works:
```bash
npm run preview
```

### 3.2 Deploy to Vercel

#### Option A: Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy from frontend directory
cd frontend
vercel
```

Follow prompts:
- Set up and deploy: `Y`
- Which scope: Choose your account
- Link to existing project: `N`
- Project name: `bangaloreflow`
- Directory: `./`
- Override settings: `N`

#### Option B: Vercel Dashboard

1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

### 3.3 Add Environment Variable

In Vercel dashboard:
1. Go to Project Settings → Environment Variables
2. Add:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
3. Redeploy (Vercel will auto-deploy on variable change)

### 3.4 Test Frontend

Visit your Vercel URL: `https://bangaloreflow.vercel.app`

---

## Step 4: Update CORS in Backend

After frontend is deployed, update backend's CORS settings:

1. Go to Render dashboard
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://bangaloreflow.vercel.app
   ```
3. Or set to `*` for public API (less secure):
   ```
   FRONTEND_URL=*
   ```
4. Click "Save Changes" (will auto-redeploy)

---

## Alternative Frontend: Netlify

### Deploy to Netlify

#### Option A: Drag and Drop

```bash
cd frontend
npm run build
```

1. Go to https://netlify.com
2. Drag `dist` folder to Netlify
3. Click "Site settings" → "Environment variables"
4. Add `VITE_API_URL` with your backend URL
5. Redeploy

#### Option B: Netlify CLI

```bash
npm install -g netlify-cli
cd frontend
netlify login
netlify deploy --prod
```

---

## Step 5: Setup Custom Domain (Optional)

### For Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### For Render:
1. Go to Service Settings → Custom Domain
2. Add your domain
3. Update DNS records

---

## Step 6: MongoDB Atlas Setup for Production

### 6.1 Optimize for Production

1. In MongoDB Atlas dashboard:
2. Go to "Network Access"
3. Remove "0.0.0.0/0" if set
4. Add Render's IP addresses or keep "0.0.0.0/0" for simplicity

### 6.2 Create Database User

1. Go to "Database Access"
2. Add new database user
3. Use strong password
4. Grant read/write to `bangaloreflow` database

### 6.3 Update Connection String

Get production connection string and update in Render environment variables.

---

## Step 7: Enable Auto-Deploy

### GitHub Integration

Both Render and Vercel support auto-deploy on git push:

1. Push to main branch
2. Services automatically rebuild and deploy
3. No manual deployment needed

```bash
git add .
git commit -m "Update feature"
git push origin main
```

---

## Monitoring & Logs

### Render Logs
- Dashboard → Logs tab
- View real-time logs
- Check for errors

### Vercel Logs
- Dashboard → Deployments
- Click on deployment
- View build logs

### MongoDB Monitoring
- Atlas Dashboard → Metrics
- View connections and queries
- Set up alerts

---

## Performance Optimization

### Backend (Render)

1. **Keep Service Awake** (Free tier sleeps after 15 min):
   - Use services like UptimeRobot to ping every 14 minutes
   - Or upgrade to paid plan

2. **Enable Caching**:
   ```javascript
   // In server.js
   const cache = new Map();
   // Cache responses for 5 minutes
   ```

### Frontend (Vercel)

1. **Already Optimized**: Vercel automatically:
   - Serves from CDN
   - Compresses assets
   - Enables HTTP/2

2. **Further Optimization**:
   ```bash
   # Analyze bundle size
   npm run build -- --report
   ```

---

## Cost Breakdown (Free Tiers)

| Service | Free Tier Limits | Upgrade Cost |
|---------|------------------|--------------|
| **Render** | 750 hours/month, sleeps after 15min | $7/month |
| **Vercel** | 100GB bandwidth, unlimited requests | $20/month |
| **MongoDB Atlas** | 512MB storage, shared cluster | $9/month |
| **Total** | **$0/month** | $36/month |

Free tier is perfect for:
- Personal projects
- Portfolio demos
- Low to medium traffic
- Learning and development

---

## Troubleshooting Production

### Issue: Backend timeout on first request

**Cause**: Render free tier sleeps after 15 minutes
**Solution**: 
- First request takes 30-60 seconds (cold start)
- Set up UptimeRobot to keep service awake
- Or add loading message: "Waking up server..."

### Issue: CORS errors

**Cause**: Frontend URL not whitelisted in backend
**Solution**: 
```env
# In Render, set:
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Issue: MongoDB connection timeout

**Cause**: IP not whitelisted or wrong connection string
**Solution**:
1. Check MongoDB Atlas Network Access
2. Verify connection string in Render env vars
3. Ensure cluster is active

### Issue: Environment variables not working

**Cause**: Variables set but not deployed
**Solution**:
1. In Render/Vercel dashboard
2. Save environment variables
3. Manually trigger redeploy

---

## Security Checklist for Production

- [ ] Use strong MongoDB password
- [ ] Enable MongoDB Atlas IP whitelist (if possible)
- [ ] Don't commit `.env` files
- [ ] Use HTTPS for all connections (automatic on Render/Vercel)
- [ ] Set `NODE_ENV=production`
- [ ] Rate limit API endpoints (optional)
- [ ] Monitor error logs regularly

---

## Backup Strategy

### MongoDB Backups (Free Tier)

MongoDB Atlas automatically backs up data on M10+ clusters. For M0 (free):
1. Regularly export data:
   ```bash
   mongodump --uri="your-connection-string"
   ```
2. Store backups on GitHub or cloud storage

### Code Backups

- Use Git and GitHub
- Push regularly
- Tag releases: `git tag v1.0.0`

---

## Success! 🎉

Your BangaloreFlow is now live at:
- **Frontend**: https://bangaloreflow.vercel.app
- **Backend API**: https://bangaloreflow-api.onrender.com

Share your project:
- Add to portfolio
- Share on LinkedIn
- Submit to product listings

---

## Next Steps

1. Add custom domain
2. Set up monitoring (UptimeRobot)
3. Add Google Analytics
4. Implement rate limiting
5. Add more features
6. Optimize performance
7. Collect user feedback

Good luck with your deployment! 🚀
