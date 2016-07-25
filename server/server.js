var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

//**** Dashboard Integration code
 app.use(loopback.context());
 app.use(loopback.token());
 app.use(function setCurrentUser(req, res, next) {
  if (!req.accessToken) {
    return next();
  } else {
    var loopbackContext = loopback.getCurrentContext();
    if (loopbackContext) {
      loopbackContext.set('accessToken', req.accessToken);
    }
    next();
  }
});

 // boot scripts mount components like REST API

 var express = require('express');
 var path = require('path');

 app.use(express.static(path.join(__dirname.replace('server',''), 'client')));

 console.log(path.join(__dirname.replace('server',''), 'client'));

 app.set('views', path.join(__dirname, 'views'));
 app.set('view engine', 'jade');

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};
//**** Dashboard Integration code

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});


