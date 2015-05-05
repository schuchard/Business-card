var User = require('../models/user.js');
var Linkedin = require('node-linkedin')('78bd02tirqtsi2','VdML73gw8al6UMqB', 'http://localhost:3000/auth/linkedin/callback');

var indexController = {
	/* Load index page */
  index: function(req, res) {
		res.render('index');
	},

  /* Get templates */
  getTemplate: function(req,res){
    res.render('templates/' + req.params.templateid);
  },

  /* View Card */
  viewProfile: function(req, res){
    console.log('req: ',req.query);
    if(req.query._id){
      User.findOne({linkedInID: profile.id}, function(err, results){
        if(err){
          console.log(err);
          throw err;
        }
        res.send(results);
      });
    }
  }
};

module.exports = indexController;