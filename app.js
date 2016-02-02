var express = require('express');
var routes = require('./routes/routes.js');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.bodyParser());
app.use(express.logger('default'));

/* Enable sessions and cookies */
app.use(express.cookieParser());
app.use(express.session({secret: '20160202'}));

/* Define the application's routes */
app.get('/', routes.get_main);

/* Start the server */
var port = 8080;
app.listen(port);
console.log('Server running on port ' + port);