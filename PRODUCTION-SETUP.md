# Production Sentry Monitoring Setup

This guide sets up continuous Sentry monitoring using our existing infrastructure.

## 🎯 Architecture Overview

**Hybrid Approach:**
- **GitHub Actions:** Handle deployments + Sentry releases (existing + new)
- **Production Service:** Runs 24/7 with continuous Sentry monitoring (new)

## 📋 TASK 1 — Server Setup (Using Existing Infrastructure)

Since we already have Node.js and Sentry CLI, we only need PM2:

```bash
# SSH to your existing server
ssh -i ~/web-server-key-pem.pem ubuntu@18.133.194.49

# Install PM2 globally (only new requirement)
sudo npm install -g pm2

# Create production app directory with correct permissions
sudo mkdir -p /var/www/production-app
sudo chown ubuntu:ubuntu /var/www/production-app

# Create PM2 log directory
sudo mkdir -p /var/log/pm2
sudo chown ubuntu:ubuntu /var/log/pm2
```

## 📋 TASK 2 — Production App Files Created

The following files have been created in `/production-app/`:

### `package.json`
- Express server for HTTP endpoints
- Sentry Node.js SDK integration
- Production-ready dependencies

### `index.js`
- Continuous Sentry monitoring
- Express server with health check endpoint
- Periodic error simulation (every 2 minutes)
- Proper error handling and context
- Graceful shutdown handling

### `ecosystem.config.js`
- PM2 configuration
- Environment variables
- Logging configuration
- Auto-restart settings

### `.env.example`
- Template for environment variables
- Uses your existing Sentry DSN

## 📋 TASK 3 — Deployment Workflow

New workflow created: `.github/workflows/deploy-production.yml`

**What it does:**
1. Creates Sentry release (like existing workflow)
2. Deploys production app to `/var/www/production-app`
3. Installs dependencies
4. Starts/restarts PM2 process
5. Verifies deployment
6. Finalizes Sentry release

## 📋 TASK 4 — Manual Server Commands

After pushing the code, run these commands on your server:

```bash
# SSH to server
ssh -i ~/web-server-key-pem.pem ubuntu@18.133.194.49

# Install PM2 (one-time setup)
sudo npm install -g pm2

# Create directories
sudo mkdir -p /var/www/production-app /var/log/pm2
sudo chown ubuntu:ubuntu /var/www/production-app /var/log/pm2

# The deployment workflow will handle the rest automatically
```

## 📋 TASK 5 — Verification Steps

### After Deployment:

1. **Check PM2 Status:**
```bash
pm2 status
pm2 logs sentry-production-monitor
```

2. **Test Health Endpoint:**
```bash
curl http://localhost:3000/health
```

3. **Test Error Endpoint:**
```bash
curl http://localhost:3000/test-error
```

4. **Check Sentry Dashboard:**
- New release should appear
- Errors should start appearing within 2 minutes
- Health check logs should show continuous monitoring

### Expected Behavior:

- ✅ App runs continuously via PM2
- ✅ Errors sent to Sentry every ~2 minutes (30% chance)
- ✅ Health endpoint responds on port 3000
- ✅ PM2 auto-restarts on crash
- ✅ PM2 auto-starts on server reboot
- ✅ GitHub Actions deploys and creates releases

## 📋 TASK 6 — Monitoring Commands

```bash
# View real-time logs
pm2 logs sentry-production-monitor --lines 50

# Check app status
pm2 status

# Restart app manually
pm2 restart sentry-production-monitor

# Stop app
pm2 stop sentry-production-monitor

# View PM2 startup configuration
pm2 startup

# Save current PM2 processes
pm2 save
```

## 📋 TASK 7 — Troubleshooting

### App Not Starting:
```bash
# Check PM2 logs
pm2 logs sentry-production-monitor

# Check if port 3000 is available
sudo netstat -tlnp | grep :3000

# Restart PM2 daemon
pm2 kill
pm2 resurrect
```

### Sentry Not Receiving Events:
```bash
# Check environment variables
pm2 env sentry-production-monitor

# Test Sentry CLI connection
sentry-cli info

# Check app logs for Sentry messages
pm2 logs sentry-production-monitor | grep -i sentry
```

### Permission Issues:
```bash
# Fix ownership
sudo chown -R ubuntu:ubuntu /var/www/production-app
sudo chown -R ubuntu:ubuntu /var/log/pm2

# Check file permissions
ls -la /var/www/production-app
```

## 🎉 Success Criteria

When everything is working:

1. **PM2 Status:** Shows `sentry-production-monitor` as `online`
2. **Health Check:** `curl http://localhost:3000/health` returns JSON
3. **Sentry Dashboard:** Shows continuous error events every few minutes
4. **GitHub Actions:** Deployment workflow succeeds
5. **Auto-Recovery:** App restarts automatically if killed

## 🔗 Key URLs

- **Health Check:** http://18.133.194.49:3000/health
- **Test Error:** http://18.133.194.49:3000/test-error
- **Sentry Dashboard:** https://federal-university-of-techn-ll.sentry.io/projects/node-3i/
- **GitHub Actions:** https://github.com/A-zook/sentry-monitoring-test/actions

---

**Result:** You now have both deployment automation AND continuous production monitoring with Sentry!