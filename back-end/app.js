var path = require('path')
var express = require('express')
var bodyParser = require('body-parser')
var fs = require('fs')
var error = require('./funciones/error')
var admin = require('firebase-admin')
var sdk = require('./adminsdk.json')
var cors = require('cors')


admin.initializeApp({
  credential: admin.credential.cert(sdk),
  databaseURL: 'https://melqui-227ec.firebaseio.com'
})

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors())

app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'vistas'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// Api plataforma
fs.readdirSync(path.join(__dirname, 'rutas')).forEach((file) => {
  var name = file.substr(0, file.indexOf('.'))

  if (name == "index") {
    const func = require(`./rutas/${name}`).default
    app.use('/', func)
  } else {
    const func = require(`./rutas/${name}`).default
    app.use('/' + name, func)
  }
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('No encontrado');
  err.status = 404;

  // respond with json
  if (req.headers['content-type'] == 'application/json') {
    res.status(404).send({ error: true, mensaje: 'No encontrado' });
    return;
  } else {
    next(err);
  }


});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);

  if (req.headers['content-type'] == 'application/json') {
    res.send({ error: true, mensaje: err.message });
    return;
  } else{
    res.render('error');
  }
  
});

process.on('uncaughtException', (err) => {
  console.log(err);
  process.exit(1);
});

module.exports = app
