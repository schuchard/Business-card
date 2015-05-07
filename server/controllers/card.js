var Card = require('../models/card.js'),
    request = require('request'),
    config = require('../config/secret.js'),
    jwt = require('jwt-simple');

var cardController = {

  /* Get individual card or all */
  getAll: function (req, res) {
    /* If there's a query parameter for _id,
    get the individual item */
    if(req.query._id){
      Card.findById(req.query._id, function(err, results){
        if(err){
          console.log('error find findById Card: ', err);
        }
        res.send(results);
      });
    }
    /* Else get all cards */
    else {
      Card.find({}, function(err, results){
        res.send(results);
        console.log('send all');
      });
    }
  },

  /* Save card to DB */
  create: function(req, res){
    var newCard = new Card(req.body);
    newCard.save(function(err, results){
      res.send(results);
    });
  },

  /* Pull data from LinkedIN to build virtual card */
  build: function(req, res){
    console.log(req.headers.authorization);
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    console.log('payload: ', payload);
    var LinkedInUrl = 'https://api.linkedin.com/v1/people/~:(formatted-name,summary,positions,skills,location,picture-url,public-profile-url,industry)';
    var params = {
      oauth2_access_token: payload.authToken,
      format: 'json'
    };

    request.get({url: LinkedInUrl, qs: params, json: true},
      function(err, response, profile){
      res.send(profile);
      });
  }
};

module.exports = cardController;