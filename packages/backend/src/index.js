/**
 * @fileoverview Entry point for the Claw Control backend server.
 * 
 * This module bootstraps the Fastify server by invoking the start function
 * from the server module. All configuration and route setup is handled there.
 * 
 * @module index
 */

const { start } = require('./server');

start();
