# PastureAI - Render Deployment Guide

## Quick Setup (5 minutes)

Your code is ready on GitHub with `render.yaml` configuration. Here's how to deploy:

### Option 1: Using Render Dashboard (Recommended)

1. **Go to** [https://dashboard.render.com](https://dashboard.render.com)
2. **Click "New +" → "Web Service"**
3. **Connect GitHub**
   - Select repository: `Hope0351/PastureAI`
   - Branch: `main`
4. **Configure Settings:**
   - **Name:** `pastureai`
   - **Runtime:** Node.js
   - **Build Command:** `npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free ($0/month)
   - **Region:** Oregon (US) or Frankfurt (EU)
5. **Click "Create Web Service"**

Render will automatically:
- Install dependencies from `package.json`
- Build the Next.js application
- Start the server on port 10000 (default)
- Provide you with a `*.onrender.com` URL

### Option 2: Using render.yaml (Automatic)

Since your repo has a `render.yaml` file:

1. Go to [https://dashboard.render.com](https://dashboard.render.com)
2. Click **"New +" → "Blueprint"**
3. Connect your GitHub repo: `Hope0351/PastureAI`
4. Render will read the `render.yaml` and configure everything automatically

## Environment Variables (Optional)

Add these in Render dashboard under "Environment":

```env
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

## What's Configured

✅ **Next.js 16** with TypeScript  
✅ **Tailwind CSS 4** for styling  
✅ **Chart.js** for data visualizations  
✅ **Leaflet** for interactive maps  
✅ **Client-side authentication** (demo users)  
✅ **8 Dashboard panels** fully functional  

## Demo Login Credentials

Once deployed, use these credentials:
- **User:** user@pastureai.et / user12345
- **NGO:** ngo@pastureai.et / ngo12345
- **Government:** gov@pastureai.et / gov12345
- **Admin:** admin@pastureai.et / admin12345

## Post-Deployment

1. **Get your URL:** Render will provide `https://pastureai-xxxx.onrender.com`
2. **Test the app:** Login and explore all dashboard panels
3. **Custom domain (optional):** 
   - Go to Settings → Custom Domains
   - Add `pastureai.is-best.net` if you want to keep your domain

## Troubleshooting

### Build fails?
- Check that `node_modules` is in `.gitignore` ✅
- Ensure `package.json` has correct scripts ✅

### Blank page after deployment?
- Check logs in Render dashboard
- Verify `startCommand` is `npm start`

### Want a custom domain?
1. In Render dashboard, go to your service
2. Settings → Custom Domains
3. Add your domain (e.g., `pastureai.is-best.net`)
4. Update DNS records as instructed by Render

## Benefits of Render vs InfinityFree

| Feature | InfinityFree | Render |
|---------|-------------|--------|
| Node.js Support | ❌ No | ✅ Full support |
| API Routes | ❌ No | ✅ Works |
| Server-side Rendering | ❌ Static only | ✅ Full SSR |
| Auto Deployments | ❌ Manual FTP | ✅ Git push triggers |
| SSL Certificate | ✅ Basic | ✅ Automatic |
| Custom Domain | ✅ | ✅ Easy setup |
| Database | MySQL limited | ✅ PostgreSQL free |

## Cost

- **Free Plan:** $0/month (sufficient for development)
- **Starter Plan:** $7/month (more power, sleep disabled)
- Your $100 credit will last ~14 months on Starter plan!

---

**Your app will be live at:** `https://pastureai-xxxx.onrender.com` within 5-10 minutes of setup! 🚀
