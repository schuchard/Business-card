var Card = require('../models/card.js');

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

  build: function(req, res){

  }
};

module.exports = cardController;