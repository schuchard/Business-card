var express = require('express'),
    routes = require('./routes/routes.js'),
    UserHandler = require('./server/UserHandler.js'),
    AuthHandler = require('./server/AuthHandler.js'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    bodyParser = require('body-parser'),
    indexController = require('./controllers/index.js'),
    cardController = require('./controllers/card.js'),
    mongoose = require('mongoose');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ombudapp');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

// Template routes
app.get('/templates/:templateid', indexController.getTemplate);

// Card API
app.get('/api/v1/view', cardController.getAll);
app.post('/api/v1/view', cardController.create);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
