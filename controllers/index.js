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
  /* LinkedIn Callback - Login or Save new USer */
  /*
  callback: function(req, res){
    Linkedin.auth.getAccessToken(res, req.query.code,
      function(err, results){
        if(err)
          return console.error(err);
        var linkedin = Linkedin.init(results.access_token);

        linkedin.people.me(function (err, $in){

        User.findOne({linkedInID: $in.id}, function(err, user){
          if(user){
            // User found, allow access
            console.log('found user');
            res.render('templates/view');
          }

          else {
           console.log('creating user:');

            // User not found, save and allow acces
            var profile = new User({
              linkedInID: $in.id,
              firstName: $in.firstName,
              lastName: $in.lastName,
              formattedName: $in.formattedName,
              // email: $in.email,
              // phoneNumber: '222-222-2222',
              headline: $in.headline,
              description: $in.summary,
              industry: $in.industry,
              positions: $in.positions.values,
              skills: $in.skills.values,
              location: $in.location.name,
              image: $in.pictureUrl,
              created: Date.now()
            });

            console.log('new user saved');
            profile.save(function(err, user){
              if(err){
                throw err;
              }
            });

          }
        });
      });


      res.render('templates/view');
    });
  }
*/
};

module.exports = indexController;