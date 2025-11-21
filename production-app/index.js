const Sentry = require('@sentry/node');
const express = require('express');

// Initialize Sentry FIRST
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'production',
  release: process.env.RELEASE_VERSION || 'production-1.0.0',
  tracesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app: express() }),
  ],
});

const app = express();
const PORT = process.env.PORT || 3000;

// Sentry request handler must be first middleware
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

console.log('🚀 Production Sentry Monitor starting...');
console.log('📊 Sentry DSN configured:', process.env.SENTRY_DSN ? 'YES' : 'NO');
console.log('🔖 Release version:', process.env.RELEASE_VERSION || 'production-1.0.0');
console.log('🌍 Environment:', process.env.NODE_ENV || 'production');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'production',
    release: process.env.RELEASE_VERSION || 'production-1.0.0'
  });
});

// Test error endpoint
app.get('/test-error', (req, res) => {
  console.log('🔥 Manual error triggered via /test-error endpoint');
  throw new Error('Manual test error triggered from production app');
});

// Simulate business logic with potential errors
function simulateBusinessLogic() {
  const scenarios = [
    () => {
      // Simulate database connection error
      throw new Error('Database connection timeout - simulated error');
    },
    () => {
      // Simulate API call failure
      throw new Error('External API returned 500 - simulated error');
    },
    () => {
      // Simulate validation error
      throw new Error('Invalid user input detected - simulated error');
    },
    () => {
      // Simulate memory issue
      throw new Error('Memory allocation failed - simulated error');
    }
  ];

  const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];
  randomScenario();
}

// Periodic error simulation (every 2 minutes for demo)
setInterval(() => {
  try {
    console.log('📝 Running periodic business logic check...');
    
    // 30% chance of triggering an error for demo purposes
    if (Math.random() < 0.3) {
      simulateBusinessLogic();
    } else {
      console.log('✅ Business logic check completed successfully');
    }
  } catch (error) {
    console.error('❌ Business logic error:', error.message);
    
    // Send to Sentry with additional context
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'business_logic');
      scope.setContext('business_context', {
        operation: 'periodic_check',
        timestamp: new Date().toISOString(),
        server_uptime: process.uptime()
      });
      Sentry.captureException(error);
    });
    
    console.log('📤 Error sent to Sentry with business context');
  }
}, 120000); // Every 2 minutes

// Sentry error handler must be after all controllers
app.use(Sentry.Handlers.errorHandler());

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'uncaught_exception');
    Sentry.captureException(error);
  });
  
  // Give Sentry time to send the error before exiting
  setTimeout(() => {
    console.log('🔄 Restarting due to uncaught exception...');
    process.exit(1);
  }, 1000);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.withScope((scope) => {
    scope.setTag('error_type', 'unhandled_rejection');
    scope.setContext('rejection_context', {
      promise: promise.toString(),
      reason: reason.toString()
    });
    Sentry.captureException(reason);
  });
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 Received SIGTERM, shutting down gracefully...');
  Sentry.flush(2000).then(() => {
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('📴 Received SIGINT, shutting down gracefully...');
  Sentry.flush(2000).then(() => {
    process.exit(0);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🌐 Production app running on port ${PORT}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
  console.log(`🔥 Test error: http://localhost:${PORT}/test-error`);
  console.log('📊 Continuous Sentry monitoring active');
  
  // Send startup event to Sentry
  Sentry.addBreadcrumb({
    message: 'Production app started successfully',
    level: 'info',
    data: {
      port: PORT,
      environment: process.env.NODE_ENV || 'production',
      release: process.env.RELEASE_VERSION || 'production-1.0.0'
    }
  });
});