var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    mongoose = require('mongoose'),
    cors = require('cors'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    passport = require('passport'),
    session = require('express-session'),
    request = require('request'),
    config = require('./server/config/secret.js'),
    User = require('./server/models/user.js'),
    // LinkedInStrategy = require('passport-linkedin-oauth2').Strategy,
    // Linkedin = require('node-linkedin')(LINKEDIN_API_KEY, LINKEDIN_SECRET_KEY, LINKEDIN_CALLBACK),
    indexController = require('./server/controllers/index.js'),
    cardController = require('./server/controllers/card.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ombudapp');

var app = express();

app.set('view engine', 'jade');
app.set('views', __dirname + '/client/views');
app.use(express.static(__dirname + '/client'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(passport.initialize());
app.use(session({
  secret: 'secret',
  saveUninitialized: true,
  resave: true
}));
app.use(passport.session());


// var LINKEDIN_API_KEY = '78bd02tirqtsi2';
// var LINKEDIN_SECRET_KEY = 'VdML73gw8al6UMqB';
// var LINKEDIN_RESPONSE = 'code';
// var LINKEDIN_CALLBACK = 'http://localhost:3000/auth/linkedin/callback';
// var ACCESS_TOKEN;


// passport.serializeUser(function(user, next){
//   console.log('serialU: ', user.id);
//   next(null, user);
// });

// passport.deserializeUser(function(id, next){
//   console.log('deserial: ', id);
//   User.findById(id, function(err, user){
//     next(err, user);
//   });
// });


app.get('/', indexController.index);

// app.get('/auth/linkedin',
//   passport.authenticate('linkedin', {state: '888xxx888'}),
//   function(req, res){
//     // function will not be called.
//   });

// app.get('/auth/linkedin/callback', passport.authenticate('linkedin', {
//   successRedirect: '/#/detail',
//   failureRedirect: '/failed'
// }));


// app.get('/auth/linkedin', function(req, res){
//   Linkedin.auth.authorize(res, [
//     'r_fullprofile'
//     ]);
// });

// app.get('/auth/linkedin/callback', indexController.callback);


app.post('/auth/linkedin', function(req, res) {
  console.log('here');
  var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
  var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
  var params = {
    code: req.body.code,
    client_id: req.body.clientId,
    client_secret: config.clientSecret,
    redirect_uri: req.body.redirectUri,
    grant_type: 'authorization_code'
  };

  // Step 1. Exchange authorization code for access token.
  request.post(accessTokenUrl, { form: params, json: true },
    function(err, response, body) {
    if (response.statusCode !== 200) {
      return res.status(response.statusCode).send({ message: body.error_description });
    }
    var params = {
      oauth2_access_token: body.access_token,
      format: 'json'
    };

    // Step 2. Retrieve profile information about the current user.
    request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {
      console.log(profile);
/*
      // Step 3a. Link user accounts.
      if (req.headers.authorization) {
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.status(409).send({ message: 'There is already a LinkedIn account that belongs to you' });
          }
          var token = req.headers.authorization.split(' ')[1];
          var payload = jwt.decode(token, config.TOKEN_SECRET);
          User.findById(payload.sub, function(err, user) {
            if (!user) {
              return res.status(400).send({ message: 'User not found' });
            }
            user.linkedin = profile.id;
            user.picture = user.picture || profile.pictureUrl;
            user.displayName = user.displayName || profile.firstName + ' ' + profile.lastName;
            user.save(function() {
              var token = createToken(user);
              res.send({ token: token });
            });
          });
        });
      } else {
        // Step 3b. Create a new user account or return an existing one.
        User.findOne({ linkedin: profile.id }, function(err, existingUser) {
          if (existingUser) {
            return res.send({ token: createToken(existingUser) });
          }
          var user = new User();
          user.linkedin = profile.id;
          user.picture = profile.pictureUrl;
          user.displayName = profile.firstName + ' ' + profile.lastName;
          user.save(function() {
            var token = createToken(user);
            res.send({ token: token });
          });
        });
      }
*/
    });
  });
});





// Card API
app.get('/api/v1/user', indexController.viewProfile);
app.get('/api/v1/detail', cardController.getAll);
app.post('/api/v1/detail', cardController.create);

app.get('/logout', function (req, res){
  req.logOut();
  req.session.destroy(function(err){
    if(err){
      console.log(err);
    }
    else {
    res.render('templates/login');
    }
  });
});

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('Express server listening on port ' + server.address().port);
});

// Check if authenticated
function isAuthenticated(req, res, next) {
  if (!(req.headers && req.headers.authorization)) {
    return res.status(400).send({ message: 'You did not provide a JSON Web Token in the Authorization header.' });
  }

  var header = req.headers.authorization.split(' ');
  var token = header[1];
  var payload = jwt.decode(token, config.tokenSecret);
  var now = moment().unix();

  if (now > payload.exp) {
    return res.status(401).send({ message: 'Token has expired.' });
  }

  User.findById(payload.id, function(err, user) {
    if (!user) {
      return res.status(400).send({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  });
}

// Generate a token
function createToken(user) {
  var payload = {
    exp: moment().add(14, 'days').unix(),
    iat: moment().unix(),
    id: user._id
  };

  return jwt.encode(payload, config.tokenSecret);
}

// Template routes
app.get('/templates/:templateid', indexController.getTemplate);

/*
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
*/
