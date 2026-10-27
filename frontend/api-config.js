/*
 * Set this to the public HTTPS URL of the STACKLY FastAPI backend when it is
 * deployed. Leave empty to use the local development API on localhost.
 */
window.STACKLY_API_BASE_URL = window.STACKLY_API_BASE_URL || (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
    ? 'http://127.0.0.1:8000'
    : ''
);
