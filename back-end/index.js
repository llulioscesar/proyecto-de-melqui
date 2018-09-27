require('babel-core/register');
var app = require('./app'); 
var http = require('http');
var debug = require('debug')('express-sequelize');
var db = require('./database');

//process.env.PORT
var port = normalizePort(process.env.PORT || '3000');
var server_ip_address = process.env.IP || '0.0.0.0'
app.set('port', port);
app.set('ipaddress', server_ip_address)

var server = http.createServer(app)

server.listen(port, server_ip_address, () => {
  console.log( "Listening on " + server_ip_address + ", port " + port )
  db.sequelize.sync({ force: false}).then(() => {
    console.log('MARIADB RUNNING');
  }).catch(err => {
    console.log(err);
  })
})

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
})

server.on('listening', () => {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
});
