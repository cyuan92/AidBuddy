/* Load all dependencies */
var AWS = require('aws-sdk');
var bcrypt = require('bcrypt-nodejs');

/* AWS table names and AWS instances */
var loginTable = "login_aid_buddy";
var AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_KEY;
AWS.config.update({region: 'us-west-2'});

var simpledb = new AWS.SimpleDB();

/* Authenticate user by finding the username in the user table */
var myDB_lookup_user = function (username, callback) {
	simpledb.getAttributes({
		DomainName: loginTable,
		ItemName: username
	}, function (err, data) {
		if (err) {
			callback("There was an error retrieving user: " + err, null);
		} else if (data.Attributes === undefined) {
			callback("User does not exist", null);
		} else {
			callback(null, data.Attributes);
		}
	});
};

var database = {
	lookup: myDB_lookup_user
};
                                        
module.exports = database;
