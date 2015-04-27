var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    request = require('request'),
    User = require('./models/user.js'),
    // LinkedInStrategy = require('passport-linkedin').Strategy,
    Linkedin = require('node-linkedin')(LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY, LINKEDIN_CALLBACK),
    indexController = require('./controllers/index.js'),
    cardController = require('./controllers/card.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ombudapp');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.session());


var LINKEDIN_API_KEY = '78bd02tirqtsi2';
var LINKEDIN_SECRET_KEY = 'VdML73gw8al6UMqB';
var LINKEDIN_RESPONSE = 'code';
var LINKEDIN_CALLBACK = 'http://localhost:3000/auth/linkedin/callback';
var ACCESS_TOKEN;


passport.serializeUser(function(user, next){
  next(null, user._id);
});

passport.deserializeUser(function(id, next){
  User.findById(id, function(err, user){
    next(err, user);
  });
});


app.get('/', indexController.index);

app.get('/auth/linkedin', function(req, res){
  Linkedin.auth.authorize(res, [
    'r_fullprofile'
    ]);
});

app.get('/auth/linkedin/callback', indexController.callback);

app.get('/view', function(req, res){
  res.render('templates/view');
});


// Template routes
app.get('/templates/:templateid', indexController.getTemplate);

// Card API
app.get('/api/v1/view', cardController.getAll);
app.post('/api/v1/view', cardController.create);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) { return next();}
  res.redirect('/');
}
