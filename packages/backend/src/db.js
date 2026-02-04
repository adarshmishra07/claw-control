/**
 * @fileoverview Database compatibility layer (DEPRECATED).
 * 
 * This file is kept for backward compatibility with legacy scripts that use pool.query().
 * New code should use db-adapter.js directly:
 *   const dbAdapter = require('./db-adapter');
 * 
 * @deprecated Use db-adapter.js instead
 * @module db
 */

const dbAdapter = require('./db-adapter');

module.exports = {
  query: dbAdapter.query,
  end: dbAdapter.close,
};
