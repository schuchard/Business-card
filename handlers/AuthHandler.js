var AuthHandler = function(){
  this.linkedInSignIn = linkedInSignIn;
  this.linkedInSignInCallback = linkedInSignInCallback;
};

function linkedInSignIn (req, res, next) {
  passport = req._passport.instance;
}


module.exports = AuthHandler;