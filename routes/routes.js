/* Load all the dependencies */
var db = require('../models/simpleDB.js');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');

/* Route for main page of the application */
var getMain = function(req, res) {
	var org = null;

	/* Check whether a user is logged in */
	if (req.session.user) {
		org = req.session.user;
	}

	res.render('main.ejs', {message: null, organization: org});
};

var postLogin = function(req, res) {
	var username = req.body.username;
	var password = req.body.password;

	/* Username and password must be entered */
	if (!username || !password) {
		req.session.message = "Please fill in all login fields";
		res.send({organization: null, err: req.session.message});
	} else {
		db.lookup(username, function (err, data) {
			if (err) {
				console.log("err: " + err);
				req.session.message = err;
				res.send({organization: null, err: req.session.message});
			} else {
				var organization = "";
				var dbPassword = null;
				for (var i = 0; i < data.length; i++) {
					if (data[i].Name == 'organization') organization = data[i].Value;
					if (data[i].Name == 'password') dbPassword = data[i].Value;
				}

				if (!dbPassword) {
					req.session.message = "Error retrieving user information";
					console.log("Could not find user's password in database: " + username);
					res.send({organization: null, err: req.session.message});
				} else {
					bcrypt.compare(password, dbPassword, function (err, response) {
						if (response) {
							console.log("user login successful");
							req.session.user = organization;
							res.send({organization: organization, err: null});
							return;
						} else {
							console.log("incorrect password");
							req.session.message = "Password is incorrect";
							res.send({organization: null, err: req.session.message});
						}
					});
				}
			}
		});
	}
}

var postLogout = function(req, res) {
	req.session.message = null;
	req.session.user = null;
	res.send({data: "success"});
}

var routes = {
	get_main: getMain,
	post_login: postLogin,
	post_logout: postLogout
};

module.exports = routes;