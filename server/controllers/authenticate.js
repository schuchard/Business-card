var User = require('../models/user.js'),
    jwt = require('jwt-simple'),
    moment = require('moment'),
    config = require('../config/secret.js');

var authController = {

  // Check if authenticated
  isAuthenticated: function (req, res, next) {
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
  },

  // Generate a token
  createToken: function (user) {
    var payload = {
      exp: moment().add(14, 'days').unix(),
      iat: moment().unix(),
      id: user._id,
      authToken: user.accessToken
    };

    return jwt.encode(payload, config.tokenSecret);
  }

};

module.exports = authController;