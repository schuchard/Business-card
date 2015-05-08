var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    indexController = require('./server/controllers/index.js'),
    cardController = require('./server/controllers/card.js'),
    linkedInController = require('./server/controllers/linkedIn.js'),
    auth = require('./server/controllers/authenticate.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ombudapp');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/client/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


// Index route
app.get('/', indexController.index);

// Authenticate user through LinkedIn
app.post('/auth/linkedin', linkedInController.authorize);

// Card API
app.get('/api/v1/detail', cardController.getAll);

// Save user card to database
app.post('/api/v1/detail', auth.isAuthenticated, cardController.create);

// Delete card from database and user account
app.delete('/api/v1/detail', auth.isAuthenticated, cardController.delete);

// Populate virtual business card
app.get('/api/v1/build', auth.isAuthenticated, cardController.build);

// Template routes
app.get('/templates/:templateid', indexController.getTemplate);


var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});
