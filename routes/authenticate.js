var express = require('express');
var router = express.Router();
var passport = require('passport');
router.get('/', function(req, res){
  res.render('login', {
    title: 'login'
  });
});

router.get(
  '/linkedin',
  passport.authenticate(
    'linkedin', {
      scope: ['r_emailaddress', 'r_fullprofile']
    }
  )
);

module.exports = router;