module.exports = {
  apps: [{
    name: 'sentry-production-monitor',
    script: 'index.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      SENTRY_DSN: process.env.SENTRY_DSN,
      RELEASE_VERSION: process.env.RELEASE_VERSION || 'production-1.0.0'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
      SENTRY_DSN: process.env.SENTRY_DSN,
      RELEASE_VERSION: process.env.RELEASE_VERSION || 'production-1.0.0'
    },
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    error_file: '/var/log/pm2/sentry-production-monitor-error.log',
    out_file: '/var/log/pm2/sentry-production-monitor-out.log',
    log_file: '/var/log/pm2/sentry-production-monitor-combined.log',
    time: true
  }]
};