# Production Environment Template

## Backend (.env.production)

Copy this to `backend/.env` and fill in production values:

```env
# Application
NODE_ENV=production
PORT=3000

# Database (Aiven MySQL)
DB_HOST=your-service.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=your_aiven_password_here
DB_NAME=sharemeal

# Authentication
JWT_SECRET=generate_a_long_random_string_here_at_least_32_chars
JWT_EXPIRES_IN=24h
ADMIN_SECRET=generate_another_random_string_here
SERVICE_TOKEN=for_ai_service_another_random_string

# CORS
CORS_ORIGIN=https://sharemeal.vercel.app

# Logging (optional)
LOG_LEVEL=info
```

## Frontend (.env.production)

Copy this to `frontend/.env` and fill in production values:

```env
VITE_API_URL=https://sharemeal-app.onrender.com
```

---

## Aiven MySQL Setup Commands

### 1. Connect to Aiven Database

```bash
mysql -h sharemeal-xxx.aivencloud.com \
  -u avnadmin \
  -p \
  -e "SHOW DATABASES;"
```

### 2. Initialize Database

```bash
cd backend

# Option 1: Using mysql CLI
mysql -h sharemeal-xxx.aivencloud.com \
  -u avnadmin \
  -p[PASSWORD] \
  sharemeal < db/migrations/shareAMeal.sql

# Option 2: Run migration script
npm run migrate
```

### 3. Verify Tables

```bash
mysql -h sharemeal-xxx.aivencloud.com \
  -u avnadmin \
  -p[PASSWORD] \
  sharemeal -e "SHOW TABLES;"
```

---

## Render.com Deployment Steps

### 1. Create Web Service

1. Login to https://render.com
2. Dashboard → New + → Web Service
3. Connect GitHub repo
4. Configuration:
   - **Name:** sharemeal-api
   - **Runtime:** Node
   - **Region:** Pick closest to users
   - **Branch:** main
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
   - **Instance Type:** Free (sufficient for MVP)

### 2. Set Environment Variables

1. Web Service → Environment
2. Add the following (copy from backend/.env.production):

```
NODE_ENV=production
DB_HOST=sharemeal-xxx.aivencloud.com
DB_PORT=3306
DB_USER=avnadmin
DB_PASSWORD=xxx
DB_NAME=sharemeal
JWT_SECRET=xxx
ADMIN_SECRET=xxx
SERVICE_TOKEN=xxx
CORS_ORIGIN=https://sharemeal.vercel.app
```

3. Click "Deploy"

### 3. Note Your Backend URL

From Render dashboard:

- **URL:** `https://sharemeal-xxx.onrender.com`
- Copy this for frontend configuration

---

## Vercel Deployment Steps

### 1. Import Project

1. Login to https://vercel.com
2. Add New → Project
3. Import Git Repository → `shareAMeal`
4. Project Settings:
   - **Framework:** Vite
   - **Root Directory:** ./frontend
   - **Build Command:** `npm run build`
   - **Output Directory:** dist
   - **Install Command:** `npm install`

### 2. Set Environment Variables

1. Project → Settings → Environment Variables
2. Add:

```
VITE_API_URL=https://sharemeal-xxx.onrender.com
```

3. Click "Deploy"

### 3. Note Your Frontend URL

From Vercel dashboard:

- **Domain:** `sharemeal-xxx.vercel.app` (or custom domain)

---

## GitHub Actions Secrets Setup

Add these to GitHub repository settings (Settings → Secrets and Variables → Actions):

```
RENDER_SERVICE_ID=srv-xxxxxxxx
RENDER_DEPLOY_KEY=your_key_here

VERCEL_TOKEN=your_vercel_token
VERCEL_ORG_ID=your_org_id
VERCEL_PROJECT_ID=your_project_id
```

To get these:

- **Render:** Web Service → Settings → API ID
- **Vercel:** Account Settings → Tokens

---

## Post-Deployment Checks

### 1. Health Check

```bash
curl https://sharemeal-xxx.onrender.com
# Should return 200 OK
```

### 2. API Test

```bash
curl https://sharemeal-xxx.onrender.com/auth/register \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!","name":"Test"}'
```

### 3. Frontend Test

Visit: https://sharemeal-xxx.vercel.app

- Should load without errors
- Check browser console for API errors

### 4. Database Test

Try login → should create session in database

---

## Possible Issues & Solutions

### Backend not starting

- Check Render logs: Logs tab
- Verify all environment variables are set
- Ensure database is accessible from Render IP

### Frontend shows blank page

- Check Vercel build logs
- Verify VITE_API_URL is set correctly
- Browser DevTools → Console for errors

### Database connection refused

- Verify Aiven credentials
- Check firewall rules: Aiven → Service → Settings → Network
- Allow all IPs or add Render's IP

### CORS errors

- Verify CORS_ORIGIN matches frontend URL
- Check browser console for actual request URL

---

## Monitoring & Maintenance

### Set Up Error Tracking

1. Register at https://sentry.io
2. Create Node.js project
3. Add to backend:
   ```bash
   npm install @sentry/node
   ```

### Enable Database Backups

- Aiven: Backups → Daily (automatic)

### Monitor Performance

- Render: Metrics tab
- Vercel: Insights tab
- Aiven: Monitoring tab

---

## Scaling for Production

When you need to scale:

1. **Database:** Upgrade Aiven plan (easy horizontal scaling)
2. **Backend:** Upgrade Render instance (pay-as-you-go)
3. **Frontend:** Vercel handles auto-scaling
4. **Add CDN:** Vercel has built-in CDN
5. **Caching:** Add Redis (Aiven offers)

---

## Cost Estimates (Monthly)

- **Aiven MySQL:** $19-99 (depending on size)
- **Render Backend:** $7 (if paid plan) or free
- **Vercel Frontend:** Free or $20+ (Pro)
- **Total:** ~$27-150+

For MVP: Stay on free tiers initially, scale as needed!
