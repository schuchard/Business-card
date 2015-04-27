var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    request = require('request'),
    User = require('./models/user.js'),
    OAuth2Strategy = require('passport-oauth').OAuth2Strategy,
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
var ACCESS_TOKEN;


passport.use('linkedin', new OAuth2Strategy({
  response_type: LINKEDIN_RESPONSE,
  authorizationURL: 'https://www.linkedin.com/uas/oauth2/authorization',
  clientID: LINKEDIN_API_KEY,
  tokenURL: 'https://www.linkedin.com/uas/oauth2/accessToken',
  clientSecret: LINKEDIN_SECRET_KEY,
  callbackURL: 'http://localhost:3000/auth/linkedin/callback',
  state: "ricuteznabumsifxyyfi",
  scope: 'r_emailaddress',

}, function(accessToken, refreshToken, profile, next) {
    console.log('profile: ', profile);
  process.nextTick(function () {
    ACCESS_TOKEN = accessToken;
    console.log('accessToken: ', accessToken);
    User.findOne({liID: profile.id}, function(err, user){
      if(user){
        // User found, allow access
        console.log('found user');
        next(null, user);
      } else {
        // User not found, save and allow acces
        var newUser = new User({
          liID: profile.id,
          name: profile.firstName,
          created: Date.now()
        });
        console.log('new user saved');
        newUser.save(function(err, user){
          if(err){
            throw err;
          }
          next(null, user);
        });
      }
    });
  });

}));

// SERIALIZATION:
//  This small subset of code will take a user object, used
//  in our JS, and convert it into a small, unique, string
//  which is represented by the id, and store it into the
//  session.
passport.serializeUser(function(user, next){
  next(null, user._id);
});

// DESERIALIZATION:
//  Essentially the inverse of above. This will take a user
//  id out of the session and convert it into an actual
//  user object.
passport.deserializeUser(function(id, next){
  User.findById(id, function(err, user){
    next(err, user);
  });
});


app.get('/', indexController.index);

app.get('/view', function(req, res){
  request.get('https://api.linkedin.com/v1/people/~:(id,num-connections,picture-url)?format=json')
    .auth(null, null, true, ACCESS_TOKEN)
    .on('response', function (response){
      res.render('templates/view');
  });
});

app.get('/auth/linkedin', passport.authenticate('linkedin'),
  function(req, res){
  });

app.get('/auth/linkedin/callback', passport.authenticate('linkedin',
  {
    successRedirect: '/view',
    failureRedirect: '#/login'
}));


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
