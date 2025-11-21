# Complete Sentry Monitoring Setup Guide

This document contains the exact steps we followed to set up end-to-end Sentry monitoring with GitHub Actions and a self-hosted runner.

## 🎯 What We Built

A complete monitoring system that:
- Runs on a self-hosted Ubuntu server (AWS EC2)
- Uses GitHub Actions to build and deploy
- Integrates with Sentry for error monitoring
- Creates releases and tracks errors automatically

## 📋 Final Configuration Values

**Server Details:**
- IP: `18.133.194.49`
- OS: Ubuntu 22.04 LTS
- Runner Name: `sentry-runner`

**Sentry Project:**
- DSN: `https://21e9b2a0ae32451b51cbe9cff8009a9d@o523145768093.ingest.de.sentry.io/12435679845626`
- Org Slug: `A-zook-Daddy-ll`
- Project Slug: `node-3`
- Auth Token: `sntryu_3gf9a7d43210ad01e845612f24cb726f579b148eaaa386a9a6cce25caa845672`

## 🚀 Step-by-Step Setup Process

### 1. Server Setup (Ubuntu 22.04)

```bash
# System update
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install curl wget git build-essential -y

# Install Node.js 18 (we got deprecation warning, but it works)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installations
node --version  # v18.19.1
npm --version   # 10.8.2

# Install Sentry CLI globally (needed sudo)
sudo npm install -g @sentry/cli

# Verify Sentry CLI
sentry-cli --version
```

### 2. GitHub Runner Setup

```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download Linux runner (v2.329.0)
curl -o actions-runner-linux-x64-2.329.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.329.0/actions-runner-linux-x64-2.329.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.329.0.tar.gz

# Configure runner with our repo and token
./config.sh --url https://github.com/A-zook/sentry-monitoring-test --token BSON5AXM7X2M8C6RNUDGTYSABCED

# Runner configuration choices:
# - Runner group: Default (pressed Enter)
# - Runner name: sentry-runner
# - Labels: default (pressed Enter)
# - Work folder: _work (pressed Enter)

# Install as service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Verify status
sudo ./svc.sh status
# Result: Active (running) and "Listening for Jobs"
```

### 3. Sentry Project Setup

**Account Creation:**
1. Went to https://sentry.io/
2. Signed up with email
3. Verified email

**Project Creation:**
1. Selected "Node.js" platform
2. Project name: `node-3` (auto-generated)
3. Team: `#A-zook-Daddy`
4. Alert settings: "Alert me on high priority issues"
5. Framework: "Vanilla" (no framework)

**Values Retrieved:**
- **DSN:** From the SDK configuration page
- **Org Slug:** From URL `A-zook-Daddy-ll`
- **Project Slug:** `node-3`

**Auth Token Creation:**
1. Settings → Account → API → Personal Tokens
2. Click "Create New Token"
3. Name: "GitHub Actions"
4. Permissions set:
   - Project: Read
   - Release: Admin
   - Organization: Read
   - Team: Read
   - Issue & Event: Read
   - Member: Read
   - Alerts: Read
5. Generated token: `sntryu_3gf9a7d43210ad01e845612f24cb726f579b148eaaa386a9a6cce25caa845672`

### 4. GitHub Secrets Configuration

Added 4 repository secrets at: `Settings → Secrets and variables → Actions`

1. **SENTRY_DSN**
   ```
 https://21e9b2a0ae32451b51cbe9cff8009a9d@o523145768093.ingest.de.sentry.io/12435679845626
   ```

2. **SENTRY_ORG**
   ```
   A-zook-Daddy-ll
   ```

3. **SENTRY_PROJECT**
   ```
   node-3
   ```

4. **SENTRY_AUTH_TOKEN**
   ```
   sntryu_3gf9a7d43210ad01e845612f24cb726f579b148eaaa386a9a6cce25caa845672
   ```

### 5. Project Structure Created

```
sentry-monitoring-test/
├── .github/workflows/
│   └── sentry-test.yml          # GitHub Actions workflow
├── demo-app/
│   ├── package.json             # Node.js dependencies
│   ├── index.js                 # Main app with Sentry integration
│   └── sentry.properties        # Sentry config template
├── README.md                    # Complete documentation
├── SETUP-COMMANDS.md            # Quick command reference
├── COMPLETE-SETUP-GUIDE.md      # This file
└── .gitignore                   # Git ignore rules
```

### 6. Demo Application Features

**File: `demo-app/index.js`**
- Initializes Sentry with environment variables
- Includes proper error handling
- Triggers intentional error for testing
- Captures and sends errors to Sentry
- Handles uncaught exceptions and promise rejections

**File: `demo-app/package.json`**
- Includes `@sentry/node` dependency
- Simple start script

### 7. GitHub Actions Workflow

**File: `.github/workflows/sentry-test.yml`**
- Runs on `self-hosted` runner
- Installs Node.js and Sentry CLI
- Creates Sentry releases
- Builds and runs the application
- Triggers intentional error
- Sends error data to Sentry

## 🔧 Troubleshooting Issues Encountered

### Issue 1: SSH Key Permissions
**Problem:** SSH key had wrong permissions on WSL
**Solution:** 
```bash
cp your-server-key-pem.pem ~/your-server-key-pem.pem
chmod 600 ~/your-server-key-pem.pem
ssh -i ~/your-server-key-pem.pem ubuntu@18.133.194.49
```

### Issue 2: NPM Global Install Permissions
**Problem:** `npm install -g @sentry/cli` failed with EACCES
**Solution:** Used `sudo npm install -g @sentry/cli`

### Issue 3: Node.js Version Deprecation
**Problem:** Node.js 18 showed deprecation warning
**Solution:** Continued with Node.js 18 (still works fine for demo)

### Issue 4: Finding Sentry Auth Tokens
**Problem:** Couldn't find API tokens in organization settings
**Solution:** Found in personal account settings: Settings → Account → API → Personal Tokens

## ✅ Verification Steps

1. **Runner Status:** Check that runner shows "Online" in GitHub repo settings
2. **Secrets:** Verify all 4 secrets are configured in GitHub
3. **Workflow:** Push code to trigger workflow execution
4. **Sentry:** Check Sentry dashboard for error events and releases

## 🎉 Success Criteria

When everything is working correctly:
- GitHub Actions workflow runs on self-hosted runner
- Sentry release is created automatically
- Demo app runs and triggers intentional error
- Error appears in Sentry dashboard with full stack trace
- Email alert is sent (if configured)

## 📚 Key Learnings

1. **Self-hosted runners** require proper service setup with `sudo ./svc.sh install`
2. **Sentry auth tokens** need specific scopes: `project:read`, `release:admin`, `org:read`
3. **GitHub secrets** must match exactly with workflow environment variables
4. **WSL file permissions** can cause SSH key issues - copy to home directory
5. **Node.js global packages** may need sudo on Ubuntu

## 🔗 Important URLs

- **GitHub Repository:** https://github.com/A-zook/sentry-monitoring-test
- **GitHub Actions:** https://github.com/A-zook/sentry-monitoring-test/actions
- **GitHub Secrets:** https://github.com/A-zook/sentry-monitoring-test/settings/secrets/actions
- **Sentry Dashboard:** https://A-zook-Daddy-ll.sentry.io/
- **Sentry Project:** https://A-zook-Daddy-ll.sentry.io/projects/node-3/

## 🚀 Next Steps

1. Push this documentation to trigger the workflow
2. Monitor GitHub Actions for successful execution
3. Check Sentry dashboard for error events
4. Verify email alerts are working
5. Optionally set up Slack integration for alerts

---

**Setup completed on:** November 21, 2025  
**Total setup time:** ~2 hours  
**Status:** ✅ Ready for production monitoring