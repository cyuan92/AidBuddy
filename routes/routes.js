
/* Route for main page of the application */
var getMain = function(req, res) {
	res.render('main.ejs');
};

var routes = {
	get_main: getMain
};

module.exports = routes;