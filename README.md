# Sentry Monitoring Test with GitHub Actions Self-Hosted Runner

Complete setup for testing Sentry monitoring in GitHub Actions using a self-hosted runner.

## 📌 TASK 1 — SERVER SETUP (SELF-HOSTED RUNNER)

### 1.1 Server Requirements

**Recommended OS:** Ubuntu 22.04 LTS
**Minimum Hardware:**
- 2 CPU cores
- 4GB RAM
- 20GB storage
- Outbound HTTPS access (port 443)

**Cloud Providers:**
- AWS EC2: t3.medium or larger
- GCP: e2-medium or larger  
- Azure: Standard_B2s or larger
- DigitalOcean: 2GB/2CPU droplet or larger

### 1.2 Install Required Tools

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install basic tools
sudo apt install curl wget git build-essential -y


# Install Node.js 20 (current LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs


# Verify installation
node --version
npm --version

# Install Sentry CLI globally
sudo npm install -g @sentry/cli

# Verify Sentry CLI
sentry-cli --version
```

### 1.3 Install GitHub Self-Hosted Runner

```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download the Linux runner (not Windows)
curl -o actions-runner-linux-x64-2.329.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.329.0/actions-runner-linux-x64-2.329.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.329.0.tar.gz

# Configure with your repo and token
./config.sh --url https://github.com/A-zook/sentry-monitoring-test --token ASOM4AXM7U2M7C3RKJIXNALJECFXY

# Install as service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start


# Check status
sudo ./svc.sh status
```

**To get the runner token:**
1. Go to your GitHub repository
2. Settings → Actions → Runners
3. Click "New self-hosted runner"
4. Copy the token from the configuration command

## 📌 TASK 2 — DEMO APPLICATION

The demo application is located in `/demo-app/` with these files:

- `package.json` - Node.js dependencies
- `index.js` - Main application with Sentry integration
- `sentry.properties` - Sentry configuration (template)

## 📌 TASK 3 — SENTRY SETUP

### 3.1 Create Sentry Account
1. Go to https://sentry.io/
2. Sign up for a free account
3. Verify your email

### 3.2 Create Project
1. Click "Create Project"
2. Select "Node.js" platform
3. Name your project (e.g., "sentry-monitoring-test")
4. Click "Create Project"

### 3.3 Retrieve Required Values

**DSN:** Found on project settings page or setup guide
**ORG Slug:** In URL: `https://sentry.io/organizations/YOUR_ORG_SLUG/`
**PROJECT Slug:** In URL: `https://sentry.io/organizations/YOUR_ORG/projects/YOUR_PROJECT/`

**Auth Token:**
1. Go to Settings → Account → API → Auth Tokens
2. Click "Create New Token"
3. Select scopes: `project:read`, `project:releases`, `org:read`
4. Copy the token

### 3.4 Update sentry.properties

Edit `demo-app/sentry.properties`:
```
defaults.url=https://sentry.io/
defaults.org=YOUR_ORG_SLUG
defaults.project=YOUR_PROJECT_SLUG
auth.token=YOUR_AUTH_TOKEN
```

## 📌 TASK 4 — CONFIGURE GITHUB SECRETS

Add these secrets in GitHub:
1. Go to your repository
2. Settings → Secrets and variables → Actions
3. Click "New repository secret"

**Required secrets:**
- `SENTRY_AUTH_TOKEN` - Your Sentry auth token
- `SENTRY_ORG` - Your Sentry organization slug
- `SENTRY_PROJECT` - Your Sentry project slug  
- `SENTRY_DSN` - Your Sentry DSN

## 📌 TASK 5 — GITHUB ACTIONS PIPELINE

The workflow is in `.github/workflows/sentry-test.yml` and will:
- Run on your self-hosted runner
- Install dependencies
- Create a Sentry release
- Run the app and trigger an error
- Send the error to Sentry

## 📌 TASK 6 — VERIFICATION

### In GitHub Actions:
1. Push code to trigger workflow
2. Check Actions tab for workflow run
3. Verify all steps complete successfully
4. Look for "Error sent to Sentry" message

### In Sentry Dashboard:
1. Go to your Sentry project
2. Check "Issues" tab for new error
3. Check "Releases" tab for new release entry
4. Verify error details and stack trace

## 📌 TASK 7 — TROUBLESHOOTING

### Runner Connection Issues:
```bash
# Check runner status
sudo ./svc.sh status

# View runner logs
sudo journalctl -u actions.runner.* -f

# Restart runner
sudo ./svc.sh stop
sudo ./svc.sh start
```

### Sentry CLI Issues:
```bash
# Test Sentry connectivity
sentry-cli info

# Test authentication
sentry-cli releases list

# Debug mode
export SENTRY_LOG_LEVEL=debug
sentry-cli releases new test-release
```

### Verify Secrets:
1. Check GitHub repository secrets are set
2. Verify secret names match workflow file
3. Test DSN format: `https://KEY@sentry.io/PROJECT_ID`

### Test Connectivity:
```bash
# Test Sentry.io connectivity
curl -I https://sentry.io/

# Test with auth token
curl -H "Authorization: Bearer YOUR_TOKEN" https://sentry.io/api/0/
```

## 📌 TASK 8 — OPTIONAL IMPROVEMENTS

### Slack Alerts:
1. In Sentry: Settings → Integrations → Slack
2. Configure alert rules for error notifications

### GitHub Integration:
1. In Sentry: Settings → Integrations → GitHub
2. Link commits to releases automatically

### Release Tagging:
```yaml
# Add to workflow
- name: Create Git Tag
  run: |
    git tag "release-${{ github.sha }}"
    git push origin "release-${{ github.sha }}"
```

### Error Grouping:
Configure in Sentry project settings → Processing → Grouping Rules

## 🚀 Quick Start

1. Set up your server with the commands above
2. Fork/clone this repository
3. Configure your Sentry project and secrets
4. Push to trigger the workflow
5. Check Sentry dashboard for the error event

## 📋 Checklist

- [ ] Server provisioned and updated
- [ ] Node.js and Sentry CLI installed
- [ ] GitHub runner configured and running
- [ ] Sentry project created
- [ ] GitHub secrets configured
- [ ] Workflow triggered successfully
- [ ] Error appears in Sentry dashboard