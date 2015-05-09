var indexController = {

  /* Load index page */
  index: function(req, res) {
		res.render('index');
	},

  /* Get templates */
  getTemplate: function(req,res){
    res.render('templates/' + req.params.templateid);
  }
};

module.exports = indexController;