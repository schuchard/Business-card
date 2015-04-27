var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    session = require('express-session'),
    request = require('request'),
    User = require('./models/user.js'),
    LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
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
  console.log('serialU: ', user.id);
  next(null, user);
});

passport.deserializeUser(function(id, next){
  User.findById(id, function(err, user){
    next(err, user);
  });
});


app.get('/', indexController.index);

passport.use(new LinkedInStrategy({
  clientID: LINKEDIN_API_KEY,
  clientSecret: LINKEDIN_SECRET_KEY,
  callbackURL: LINKEDIN_CALLBACK,
  scope: ['r_emailaddress', 'r_fullprofile', 'r_contactinfo'],
}, function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log(profile._json.id);
    var account = profile;
  User.findOne({linkedInID: profile.id}, function(err, user){
          console.log(profile._json.id);

      if(user){
        // User found, allow access
        console.log('found user');
        // res.render('templates/view');
      }

      else {
        console.log('creating user:');
        console.log(profile);

        // User not found, save and allow acces
        var userProfile = new User({
          linkedInID: profile._json.id,
          firstName: profile._json.firstName,
          lastName: profile._json.lastName,
          formattedName: profile._json.formattedName,
          email: profile._json.emailAddress,
          phoneNumber: '123-456-7890',
          headline: profile._json.headline,
          description: profile._json.summary,
          industry: profile._json.industry,
          location: profile._json.location.name,
          image: profile._json.pictureUrl,
          created: Date.now()
        });

        console.log('new user saved');
        userProfile.save(function(err, user){
          if(err){
            console.log(err);
            throw err;
          }
        });
      }
      return done(null, profile);
  });

  });
}));

app.get('/auth/linkedin',
  passport.authenticate('linkedin', {state: '888xxx888'}),
  function(req, res){
    // function will not be called.
  });

app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
  successRedirect: '/templates/view',
  failureRedirect: '/failed'
}));


// app.get('/auth/linkedin', function(req, res){
//   Linkedin.auth.authorize(res, [
//     'r_fullprofile'
//     ]);
// });

// app.get('/auth/linkedin/callback', indexController.callback);

app.get('/view', ensureAuthenticated, function(req, res){
  res.render('templates/view');
});


// Template routes
app.get('/templates/:templateid', indexController.getTemplate);

// Card API
app.get('/api/v1/view', cardController.getAll);
app.post('/api/v1/view', cardController.create);

app.get('/logout', function (req, res){
  req.logout();
  req.session.destroy();
  res.render('#/');
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()) { return next();}
  res.render('/failed');
}
