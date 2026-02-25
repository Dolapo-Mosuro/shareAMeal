# Production Deployment Guide

## Overview

This guide covers deploying ShareAMeal to production using:

- **Database:** Aiven MySQL
- **Backend:** Render.com
- **Frontend:** Vercel
- **CI/CD:** GitHub Actions

---

## Step 1: Set Up Aiven MySQL Database

### 1. Create Aiven Account

1. Go to https://aiven.io
2. Sign up for free account
3. Create a new MySQL service:
   - Service name: `sharemeal-mysql`
   - Cloud: Choose closest to your users
   - Plan: Business-4 (free tier with 20GB)

### 2. Get Connection Details

From Aiven dashboard, copy:

- **Host:** `sharemeal-xxx.aivencloud.com`
- **Port:** `3306`
- **User:** `avnadmin`
- **Password:** Save securely
- **Database:** `defaultdb` (rename or create `sharemeal`)

### 3. Initialize Database

1. Use a MySQL client to connect
2. Run migration script:
   ```bash
   mysql -h [HOST] -u [USER] -p[PASSWORD] [DATABASE] < backend/db/migrations/shareAMeal.sql
   ```

---

## Step 2: Deploy Backend to Render.com

### 1. Create Render Account

1. Go to https://render.com
2. Sign up (connect GitHub)
3. Click "New +" → "Web Service"

### 2. Connect GitHub Repository

1. Select: `https://github.com/[YourUsername]/shareAMeal`
2. Choose branch: `main`
3. Runtime: `Node`
4. Build command: `cd backend && npm install`
5. Start command: `cd backend && npm start`

### 3. Set Environment Variables

In Render dashboard → Environment:

```env
NODE_ENV=production
PORT=3000
DB_HOST=sharemeal-xxx.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=[YOUR_AIVEN_PASSWORD]
DB_NAME=sharemeal
JWT_SECRET=[GENERATE_NEW_RANDOM_STRING]
ADMIN_SECRET=[GENERATE_NEW_RANDOM_STRING]
SERVICE_TOKEN=[GENERATE_NEW_RANDOM_STRING]
CORS_ORIGIN=https://yourdomain.vercel.app
```

### 4. Deploy

Click "Create Web Service" - Render will auto-deploy!

**Backend URL:** `https://sharemeal-[random].onrender.com`

---

## Step 3: Deploy Frontend to Vercel

### 1. Create Vercel Account

1. Go to https://vercel.com
2. Sign up with GitHub

### 2. Import Project

1. Click "Add New" → "Project"
2. Select your GitHub repo
3. Framework: `Vite`
4. Root Directory: `./frontend`
5. Build Command: `npm run build`
6. Output Directory: `dist`

### 3. Set Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```env
VITE_API_URL=https://sharemeal-[random].onrender.com
```

### 4. Deploy

Click "Deploy" - Vercel handles everything!

**Frontend URL:** `https://sharemeal-[random].vercel.app`

---

## Step 4: Set Up GitHub Actions CI/CD

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: "18"

      - name: Install dependencies
        run: cd backend && npm install

      - name: Run tests
        run: cd backend && npm test

  deploy:
    needs: test-backend
    runs-on: ubuntu-latest
    if: success()
    steps:
      - name: Trigger Render deploy
        run: curl -X POST "https://api.render.com/deploy/srv-[SERVICE-ID]?key=[DEPLOY-KEY]"
```

---

## Step 5: Custom Domain (Optional)

### Using Vercel Domain

1. Go to Vercel → Project Settings → Domains
2. Add custom domain: `sharemeal.com`
3. Follow DNS instructions

### Update Backend CORS

In Render environment variables:

```env
CORS_ORIGIN=https://sharemeal.com
```

---

## Production Checklist

- [ ] Aiven MySQL database created and initialized
- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] GitHub Actions workflow created
- [ ] API endpoints tested in production
- [ ] Frontend connects to production API
- [ ] Database backups enabled (Aiven)
- [ ] SSL certificates active (auto with Render/Vercel)
- [ ] Custom domain configured (optional)
- [ ] Monitoring/logging set up (Sentry, DataDog, etc.)

---

## Testing Production

1. **Test API:**

   ```bash
   curl https://sharemeal-[random].onrender.com
   ```

2. **Test Frontend:**
   Visit `https://sharemeal-[random].vercel.app`

3. **Test Auth Flow:**
   - Register user
   - Login
   - Create meal
   - Make claim

---

## Troubleshooting

### Backend won't start

- Check environment variables in Render
- Check database connection
- View logs: Render → Logs tab

### Frontend shows "Cannot reach API"

- Verify `VITE_API_URL` in Vercel
- Check CORS settings in backend
- Verify Aiven IP whitelist includes Render

### Database connection fails

- Verify credentials are correct
- Check Aiven IP whitelist (allow all IPs for now)
- Ensure database is created

---

## Next Steps

1. Monitor logs daily
2. Set up error tracking (Sentry)
3. Add uptime monitoring
4. Plan database backups
5. Create disaster recovery plan
