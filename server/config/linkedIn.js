var request = require('request'),
    jwt = require('jwt-simple'),
    config = require('./secret.js'),
    Auth = require('./authenticate.js'),
    User = require('../models/user.js');


var linkedInController = {
  // Authorize user with LinkedIn credentials
  authorize : function(req, res) {
    var accessTokenUrl = 'https://www.linkedin.com/uas/oauth2/accessToken';
    var peopleApiUrl = 'https://api.linkedin.com/v1/people/~:(id,first-name,last-name,email-address,picture-url)';
    var params = {
      code: req.body.code,
      client_id: req.body.clientId,
      client_secret: config.clientSecret,
      redirect_uri: req.body.redirectUri,
      grant_type: 'authorization_code'
    };

    // Exchange authorization code for access token.
    request.post(accessTokenUrl, { form: params, json: true },
      function(err, response, body) {
      if (response.statusCode !== 200) {
        return res.status(response.statusCode).send({ message: body.error_description });
      }
      var params = {
        oauth2_access_token: body.access_token,
        format: 'json'
      };

      // Retrieve profile information about the current user.
      request.get({ url: peopleApiUrl, qs: params, json: true }, function(err, response, profile) {

          // Create a new user account or return an existing one.
          User.findOne({ authID: profile.id }, function(err, existingUser) {
            // User found, send user object
            if (existingUser) {
              var existingUserToken = Auth.createToken(existingUser);
              res.send({
                token:  existingUserToken,
                data: existingUser
               });
            }

            // User not found, create user
            else {
              var user = new User();
              user.authID = profile.id;
              user.accessToken = params.oauth2_access_token;
              user.image = profile.pictureUrl;
              user.formattedName = profile.firstName + ' ' + profile.lastName;
              user.save(function() {
                var newUserToken = Auth.createToken(user);
                res.send({
                  token: newUserToken,
                  data: user
                });
              }); /* -  user.save */
            } /* -----  else */
          }); /* -----  User.findOne */
      }); /* ---------  request.get */
    }); /* -----------  request.post */
  } /* ---------------  authorize */
};

module.exports = linkedInController;