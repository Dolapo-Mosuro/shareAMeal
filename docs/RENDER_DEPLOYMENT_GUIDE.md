# ShareAMeal v2.0.0 - Render Deployment Guide

## Prerequisites

Before deploying to Render, you need:

1. **GitHub Repository** - Code pushed to GitHub (public or private)
2. **Render Account** - Free or paid tier at render.com
3. **MySQL Database** - External MySQL service (choose one):
   - **PlanetScale** (Recommended - free tier, MySQL-compatible)
   - **AWS RDS** (Amazon Relational Database Service)
   - **DigitalOcean Managed MySQL**
   - **Heroku Postgres** (requires code changes for PostgreSQL)
   - **Any MySQL 8.0+ server**

---

## Step 1: Set Up External MySQL Database

### Option A: PlanetScale (Recommended for Free Tier)

1. Go to https://planetscale.com
2. Create free account
3. Create new database:
   - Name: `sharemeal`
   - Region: Choose closest to your users
4. Get connection details:
   - Host: `*.planetscale.com`
   - User: `root`
   - Password: Generate password
5. Copy these for later use

### Option B: AWS RDS

1. Go to AWS Console → RDS
2. Create database:
   - Engine: MySQL 8.0.33
   - Instance class: db.t3.micro (free tier eligible)
   - Storage: 20 GB (free tier)
   - Public accessibility: Yes
3. Get endpoint, master username, password
4. Note the security group - add inbound rule for port 3306

### Option C: DigitalOcean

1. Go to DigitalOcean → Managed Databases
2. Create MySQL cluster (3 nodes recommended)
3. Get connection details from connection panel

---

## Step 2: Prepare GitHub Repository

1. Ensure code is pushed to GitHub:

   ```bash
   git add .
   git commit -m "Add Docker and Render deployment files"
   git push origin main
   ```

2. Files needed in repo:
   - ✅ `Dockerfile` - Container configuration
   - ✅ `docker-compose.yml` - Local testing
   - ✅ `.dockerignore` - Excluded files
   - ✅ `render.yaml` - Render deployment config
   - ✅ `.env.example` - Environment template
   - ✅ `scripts/migrate.js` - Database migration
   - ✅ `package.json` - Updated with migrate script

---

## Step 3: Deploy to Render

### 3a. Create Web Service

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect GitHub repository (authorize if needed)
4. Select **ShareAMeal** repository
5. Configure service:
   - **Name:** `sharemeal-api`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Standard ($7/month) or higher
   - **Region:** Choose based on location

### 3b. Set Environment Variables

In Render dashboard, add these variables:

```
NODE_ENV                production
DB_HOST                 your-mysql-host.com
DB_PORT                 3306 (or PlanetScale port)
DB_USER                 root (or your user)
DB_PASSWORD             your-secure-password
DB_NAME                 sharemeal
JWT_SECRET              (generate random 32+ char string)
ADMIN_SECRET            (generate random 16+ char string)
```

**How to generate secure secrets:**

```bash
# In terminal, run:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3c. Deploy

1. Click **"Create Web Service"**
2. Render will automatically build and deploy
3. Wait for build to complete (~2-3 minutes)
4. Service URL will appear (e.g., `https://sharemeal-api.onrender.com`)

---

## Step 4: Run Database Migration

After first deployment:

1. Go to Render dashboard
2. Click on your service
3. Open **"Shell"** tab
4. Run migration:
   ```bash
   npm run migrate
   ```
5. Check output for success message

Or run in **build/deploy hook** (automatic):

1. In service settings, go to **"Build & Deploy"**
2. Add to **"Pre-deployment command"**:
   ```bash
   npm run migrate
   ```
3. This runs automatically before each deployment

---

## Step 5: Verify Deployment

1. Test health check:

   ```bash
   curl https://sharemeal-api.onrender.com/
   ```

   Expected response:

   ```json
   {
   	"status": "Server is running",
   	"message": "Welcome to ShareAMeal API v2.0.0"
   }
   ```

2. Check Swagger docs:

   ```
   https://sharemeal-api.onrender.com/api-docs
   ```

3. Test API with sample request:
   ```bash
   curl -X POST https://sharemeal-api.onrender.com/auth/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Test User",
       "email": "test@example.com",
       "password": "Test123!",
       "role": "sme",
       "organization_name": "Test Org"
     }'
   ```

---

## Step 6: Set Up Automatic Deployments

Enable auto-deploy from GitHub:

1. In Render dashboard, go to service settings
2. Find **"GitHub > Deploy Commit"**
3. Enable **"Auto-deploy"**
4. Now every push to main branch auto-deploys

---

## Database Migration Options

### Option 1: Auto-migrate on Deploy (Recommended)

1. In Render service settings
2. Go to **"Build & Deploy"** tab
3. Set **"Pre-deployment command"**:
   ```bash
   npm run migrate
   ```
4. This runs before each deployment

### Option 2: Manual Migration

1. Open Render Shell
2. Run:
   ```bash
   npm run migrate
   ```

### Option 3: Direct MySQL Connection

1. Use MySQL client to connect to your database
2. Run SQL from `db/migrations/shareAMeal.sql`

---

## Monitoring & Logs

### View Logs

In Render dashboard:

1. Click on service
2. Open **"Logs"** tab
3. See real-time application logs

### Common Issues

**Container fails to start:**

- Check logs for error messages
- Verify environment variables are set
- Check database connection string

**Database migration fails:**

- Verify DB_HOST, DB_USER, DB_PASSWORD are correct
- Check database exists
- Run migration manually in Shell

**Port binding error:**

- Render assigns PORT automatically
- Ensure app uses `process.env.PORT`
- (Already configured in app.js)

---

## Performance Optimization

### Cold Starts (First Request Slow)

Render spins down idle services. To prevent:

- Upgrade to **Pro plan** ($12/month)
- Add health check (already included in Dockerfile)
- Keep-alive ping service (use UptimeRobot)

### Database Connection Pooling

Already configured in `src/config/db.js`:

- Connection pool: 10-20 connections
- Idle timeout: 30 seconds

### Caching Layer (Optional)

Consider adding Redis for:

- Session storage
- Rate limit counters
- Cache meal listings

---

## Security Checklist

- ✅ Use HTTPS (Render auto-enables)
- ✅ Set strong JWT_SECRET (32+ characters)
- ✅ Set strong ADMIN_SECRET (16+ characters)
- ✅ Set strong DB_PASSWORD
- ✅ Enable database SSL/TLS (if available)
- ✅ Restrict database IP access (if available)
- ✅ Use environment variables (don't hardcode secrets)
- ✅ Keep dependencies updated

---

## Cost Estimation (Monthly)

| Service            | Tier      | Cost    |
| ------------------ | --------- | ------- |
| Render Web Service | Standard  | $7.00   |
| Render Web Service | Pro       | $12.00  |
| PlanetScale MySQL  | Free      | $0.00   |
| PlanetScale MySQL  | Paid      | $39.00+ |
| AWS RDS MySQL      | Free tier | $0.00   |
| AWS RDS MySQL      | Paid      | $15.00+ |

**Minimum setup:** Render $7 + PlanetScale Free = **$7/month**

---

## Troubleshooting

### "Cannot GET /api-docs"

- API deployed but Swagger not loading
- Solution: Hard refresh browser, clear cache

### "Connection refused"

- App can't reach database
- Check: DB_HOST, DB_USER, DB_PASSWORD in environment
- Verify database is running and accessible

### "504 Gateway Timeout"

- Request taking too long
- Check database queries for n+1 issues
- Check logs for errors
- Consider upgrading Render plan

### "502 Bad Gateway"

- App crashed or failed to start
- Check logs for crash reason
- Verify all environment variables set

---

## Next Steps

1. **Frontend Integration:**
   - Update frontend API base URL to: `https://sharemeal-api.onrender.com`
   - Test all API endpoints
   - Implement error handling

2. **Production Hardening:**
   - Enable database backups
   - Set up monitoring/alerting
   - Configure CORS for frontend domain
   - Rate limiting tuning

3. **Scaling:**
   - Monitor performance metrics
   - Plan for increased load
   - Consider database read replicas
   - Add caching layer (Redis)

---

## Support & Monitoring

- **Render Docs:** https://render.com/docs
- **Render Status:** https://status.render.com
- **Application Logs:** In Render dashboard
- **Database Logs:** In your database provider dashboard

---

**Generated:** February 23, 2026  
**Project:** ShareAMeal v2.0.0  
**Status:** Ready for Production Deployment
