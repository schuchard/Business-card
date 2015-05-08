var Card = require('../models/card.js'),
    User = require('../models/user.js'),
    request = require('request'),
    config = require('../config/secret.js'),
    jwt = require('jwt-simple');

var cardController = {

  /* Get individual card or Users saved cards */
  getAll: function (req, res) {


    // If request query _id, return single card
    if(req.query._id) {
      console.log('req: ', req.query._id);
      Card.findById(req.query._id, function(err,results){
        console.log('err: ', err);
        console.log('new results:');
        res.send(results);
      });
    }


    // Otherwise send User's saved cards
    else {
      var header = req.headers.authorization.split(' ');
      var token = header[1];
      var payload = jwt.decode(token, config.tokenSecret);

      if(payload.id) {
        User.find(payload.id)
          .populate('cards')
          .exec(function(err, results){
            if (err){ console.log(err); }
            else {
              console.log('pop results:');
              res.send(results);
            }
          });
      }
      else {
        console.log('User not authorized');
      }
  }


  },

  /* Save card to DB */
  create: function(req, res){
    var newCard = new Card(req.body.cardData);
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
    console.log('payload: ', payload);

    newCard.save(function(err, results){
      if(err){
        console.log(err);
      }
      else {
        console.log('saved new card:');
        User.findByIdAndUpdate(
          payload.id,
          {
            $push:{
              "cards": newCard._id
            }
          }, {safe:true, upsert:true},
          function(err, results){
            if (err) {console.log(err);}
            res.send('success');
          }
        );
      }
    });

  },


  /* Pull data from LinkedIN to build virtual card */
  build: function(req, res){
    var header = req.headers.authorization.split(' ');
    var token = header[1];
    var payload = jwt.decode(token, config.tokenSecret);
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