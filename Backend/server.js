const http = require('http');
const index = require('./index');

const port = 27017;

const server = http.createServer(index);

server.listen(port);