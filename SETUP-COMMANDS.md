# Complete Setup Commands

## Server Setup (Ubuntu 22.04)

```bash
# System update
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install curl wget git build-essential -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install Sentry CLI
npm install -g @sentry/cli

# Verify installations
node --version
npm --version
sentry-cli --version
```

## GitHub Runner Setup

```bash
# Create runner directory
mkdir actions-runner && cd actions-runner

# Download latest runner (check GitHub for current version)
curl -o actions-runner-linux-x64-2.311.0.tar.gz -L https://github.com/actions/runner/releases/download/v2.311.0/actions-runner-linux-x64-2.311.0.tar.gz

# Extract
tar xzf ./actions-runner-linux-x64-2.311.0.tar.gz

# Configure (replace with your values)
./config.sh --url https://github.com/YOUR_USERNAME/YOUR_REPO --token YOUR_RUNNER_TOKEN

# Install as service
sudo ./svc.sh install

# Start service
sudo ./svc.sh start

# Verify status
sudo ./svc.sh status
```

## Sentry CLI Commands

```bash
# Test Sentry connection
sentry-cli info

# Create release
sentry-cli releases new v1.0.0

# Upload source maps (example)
sentry-cli releases files v1.0.0 upload-sourcemaps ./dist

# Finalize release
sentry-cli releases finalize v1.0.0

# List releases
sentry-cli releases list
```

## Testing Commands

```bash
# Test the demo app locally
cd demo-app
npm install
SENTRY_DSN="YOUR_DSN_HERE" npm start

# Check runner logs
sudo journalctl -u actions.runner.* -f

# Restart runner if needed
sudo ./svc.sh restart
```

## Troubleshooting Commands

```bash
# Check system resources
free -h
df -h
top

# Check network connectivity
curl -I https://sentry.io/
curl -I https://github.com/

# Check Node.js and npm
which node
which npm
npm config list

# Check Sentry CLI config
sentry-cli info
cat ~/.sentryclirc
```