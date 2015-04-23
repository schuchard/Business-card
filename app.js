var express = require('express');
var bodyParser = require('body-parser');
var indexController = require('./controllers/index.js');

var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/ombudapp');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: false}));

app.get('/', indexController.index);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
	console.log('Express server listening on port ' + server.address().port);
});
