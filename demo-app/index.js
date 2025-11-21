const Sentry = require('@sentry/node');

// Initialize Sentry
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.GITHUB_SHA || 'local-dev',
  tracesSampleRate: 1.0,
});

console.log('🚀 Demo app starting...');
console.log('📊 Sentry DSN configured:', process.env.SENTRY_DSN ? 'YES' : 'NO');
console.log('🔖 Release version:', process.env.GITHUB_SHA || 'local-dev');

// Simulate some application logic
function processData(data) {
  console.log('📝 Processing data...');
  
  // This will intentionally throw an error for Sentry testing
  if (!data || !data.user) {
    throw new Error('Missing required user data - this is an intentional test error');
  }
  
  return data.user.name.toUpperCase();
}

// Main application flow
async function main() {
  try {
    console.log('✅ Application initialized successfully');
    
    // Wait a moment to ensure Sentry is ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // This will trigger the error
    console.log('🔥 Triggering intentional error for Sentry testing...');
    processData(null);
    
  } catch (error) {
    console.error('❌ Error caught:', error.message);
    
    // Capture the error with Sentry
    Sentry.captureException(error);
    
    // Flush Sentry to ensure the error is sent
    await Sentry.flush(2000);
    
    console.log('📤 Error sent to Sentry');
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught Exception:', error);
  Sentry.captureException(error);
  Sentry.flush(2000).then(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('🚫 Unhandled Rejection at:', promise, 'reason:', reason);
  Sentry.captureException(reason);
  Sentry.flush(2000).then(() => process.exit(1));
});

// Start the application
main();