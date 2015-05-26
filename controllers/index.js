var indexController = {
	index: function(req, res) {
		res.render('index');
	}, 

    login: function (req, res) {
        res.render('login');
    }
};

module.exports = indexController;