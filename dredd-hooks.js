const hooks = require('hooks');

hooks.beforeEach((transaction) => {
  // Adjust header checks only for the health endpoint
  if (transaction.request.uri.includes('health')) {
    delete transaction.expected.headers['Content-Type'];
  }
});
