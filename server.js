//Basic Node.js Server using Connect and Serve Static

var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8090);
console.log('Server available at http://localhost:8080');
