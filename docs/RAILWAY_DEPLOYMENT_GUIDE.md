# ShareAMeal v2.0.0 - Railway Deployment Guide

## 🚀 Why Railway?

- ✅ **Completely Free** - $5/month credit (covers small apps)
- ✅ **MySQL Included** - Free database with 5GB storage
- ✅ **Auto-scaling** - Scales with demand
- ✅ **GitHub Integration** - Auto-deploy on push
- ✅ **No Credit Card Hold** - Simple billing
- ✅ **Fast Deploy** - ~2 minutes from push to live

---

## Prerequisites

1. **GitHub Account** - Code pushed to GitHub (public or private)
2. **Railway Account** - Free at https://railway.app
3. No need to set up external MySQL - Railway provides it!

---

## Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start for Free"**
3. Sign up with GitHub (recommended)
4. Authorize Railway to access your GitHub account
5. Accept terms

---

## Step 2: Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Authorize Railway if prompted
4. Select your **ShareAMeal** repository
5. Select the correct branch (main)
6. Click **"Deploy"**

Railway will automatically:

- Detect Node.js project
- Install dependencies
- Run migrations
- Start the app

---

## Step 3: Add MySQL Database

1. In your Railway project dashboard
2. Click **"Create Services"** or **"+ New"**
3. Select **"MySQL"** from templates
4. Click **"Deploy"**
5. Railway creates MySQL automatically

---

## Step 4: Connect App to Database

Railway **automatically creates environment variables**. Your app can access:

```
DATABASE_URL=mysql://user:password@host:3306/railway
RAILWAy_DATABASE_URL=mysql://user:password@host:3306/railway
```

Update your `.env` or modify `src/config/db.js` to use `DATABASE_URL`:

**Option A: Update .env (Simple)**

```bash
DB_HOST=${{ DATABASE_URL will be injected }}
```

**Option B: Update db.js (Better)**

```javascript
const dbUrl = process.env.DATABASE_URL || process.env.RAILWAY_DATABASE_URL;
// Parse connection string if needed
```

---

## Step 5: Set Application Secrets

In Railway project dashboard, go to **Variables** tab:

1. Add these environment variables:

```
NODE_ENV              production
JWT_SECRET            (generate secure random string)
ADMIN_SECRET          (generate secure random string)
PORT                  3000
```

**Generate secure secrets:**

```bash
# In terminal:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 6: Configure Start Command

In Railway project settings:

1. Find your **app service**
2. Go to **"Settings"** tab
3. In **"Start Command"**, set:
   ```
   npm run migrate && npm start
   ```
4. This runs migrations before starting app

---

## Step 7: Enable Auto-Deploy

Railway auto-deploys by default. Verify:

1. In project dashboard
2. Click your app service
3. Go to **"Settings"**
4. Ensure **"Automatic Deployments"** is **ON**
5. Now every GitHub push auto-deploys!

---

## Step 8: Verify Deployment

1. In Railway dashboard, click your app
2. Go to **"Deployments"** tab
3. Wait for build to complete (2-3 minutes)
4. Once deployed, click **"View Logs"**
5. Look for: `✅ Server running on port 3000`

---

## Step 9: Get Your API URL

1. In Railway project dashboard
2. Click your app service
3. Look for **"Public URL"** or **"Domain"**
4. Example: `https://sharemeal-api-prod.up.railway.app`

Test it:

```bash
curl https://sharemeal-api-prod.up.railway.app/
```

---

## Step 10: Test API Endpoints

### Get Swagger Docs

```
https://your-railway-url.up.railway.app/api-docs
```

### Test Registration

```bash
curl -X POST https://your-railway-url.up.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test123!",
    "role": "sme",
    "organization_name": "Test Org"
  }'
```

### Expected Response

```json
{
	"message": "User registered successfully",
	"userId": 1,
	"email": "test@example.com"
}
```

---

## Monitoring & Logs

### View Real-Time Logs

1. Railway dashboard → Your app
2. Click **"Logs"** tab
3. See all activity in real-time

### Common Issues

**503 Service Unavailable**

- App still starting (wait 30 seconds)
- Check logs for errors
- Verify DATABASE_URL is set

**502 Bad Gateway**

- Database not connected
- Check DATABASE_URL variable
- Verify MySQL service running

**Migrations Failed**

- Database not ready yet
- Check MySQL service is running
- Manually run `npm run migrate` in Railway shell

---

## Database Connection

### MySQL Details

In Railway dashboard:

1. Click MySQL service
2. Go to **"Logs"** or **"Connect"** tab
3. Get connection details:
   - **Host:** Railway provides (internal)
   - **User:** root
   - **Password:** Shown in variables
   - **Database:** railway (default)

### Connect Locally to Production Database

```bash
# From your computer (not recommended for testing, only for debugging)
mysql -h railway-host.railway.app \
       -u root \
       -p'password' \
       -D railway
```

---

## Database Backups

Railway automatically backs up MySQL:

1. Daily snapshots
2. 30-day retention
3. Restore from Railway dashboard

To manually backup:

```bash
# Export database
mysqldump -h host -u root -p database_name > backup.sql
```

---

## Scaling & Performance

### Current Setup

- 1 app instance
- Shared MySQL (free tier)
- Good for ~100 concurrent users

### When to Upgrade

If you need more:

- **More concurrent users** → Add paid plan ($7+/month)
- **More database storage** → Upgrade MySQL ($5+/month)
- **Multiple app instances** → Railway Pro ($20+/month)

---

## Cost Breakdown

| Service        | Cost      | Notes             |
| -------------- | --------- | ----------------- |
| Railway Credit | $5.00     | Free monthly      |
| App Service    | $0.00     | Covered by credit |
| MySQL Database | $0.00     | Covered by credit |
| **Total**      | **$0.00** | Completely FREE!  |

---

## Available Commands

```bash
# Local development
npm run dev              # Runs with nodemon

# Production (Railway)
npm start               # Start app
npm run migrate         # Run database migrations
npm test                # Run test suite
npm run test:watch     # Watch mode tests
npm run test:coverage  # Coverage report
```

---

## Troubleshooting

### App Won't Deploy

**Check logs:**

1. Railway dashboard → Deployments
2. Click failed build → View logs
3. Common errors:
   - Missing `package.json`
   - Syntax errors in code
   - Missing environment variables

**Fix:**

```bash
# Verify locally first
npm install
npm start
npm test
```

### Database Not Connecting

**Verify DATABASE_URL:**

1. Railway dashboard → Variables tab
2. Ensure `DATABASE_URL` exists
3. Check format: `mysql://user:pass@host/db`

**Check MySQL service:**

1. Click MySQL service in project
2. Verify status is "Running"
3. Check logs for errors

### Migrations Not Running

**Manual migration:**

1. Railway dashboard → App service
2. Click **"Shell"** tab
3. Run: `npm run migrate`

**Check migration output:**

- Look for "✅ Database schema migration completed"
- If error, verify database is running

---

## Next Steps

### Immediate

1. ✅ Deploy on Railway ($0)
2. ✅ Test all 43 endpoints
3. ✅ Update frontend API URL

### This Week

1. Set up monitoring (UptimeRobot free tier)
2. Configure error notifications
3. Test high load scenarios

### Production Ready

1. Enable CloudFlare for CDN (free)
2. Set up email notifications
3. Daily backup verification
4. Monitor database size

---

## Useful Links

- **Railway Dashboard:** https://railway.app/dashboard
- **Railway Docs:** https://docs.railway.app
- **Railway Status:** https://status.railway.app
- **Project URL:** Check in Railway dashboard

---

## Support

Railway includes:

- Documentation: https://docs.railway.app
- Community Discord: Railway Discord channel
- Email support: For all plans

---

## Comparison: Railway vs Render vs AWS

| Feature                | Railway    | Render   | AWS RDS   |
| ---------------------- | ---------- | -------- | --------- |
| **Cost**               | FREE       | $7/mo    | FREE 12mo |
| **Setup Time**         | 5 min      | 20 min   | 30 min    |
| **Auto-scale**         | Yes        | Limited  | Yes       |
| **MySQL**              | Included   | Separate | Separate  |
| **GitHub Auto-deploy** | Yes        | Yes      | No        |
| **Ease of Use**        | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐      |

---

## Migration from Render

Already migrated! Just:

1. ✅ Docker setup stays same
2. ✅ Code unchanged
3. ✅ Migrations work same way
4. ✅ Just different deployment config

---

**Generated:** February 23, 2026  
**Project:** ShareAMeal v2.0.0  
**Platform:** Railway.app  
**Cost:** 🆓 Completely FREE
