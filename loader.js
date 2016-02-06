//Loads test data into the DB

//Initializes the database API
var AWS = require('aws-sdk');
var async = require('async');
var bcrypt = require('bcrypt-nodejs');
AWS.config.loadFromPath('./config.json');
var simpledb = new AWS.SimpleDB();
var loginTable = "login_aid_buddy";

var loginData = [
	{	//First location
		Key: 'hiro',
		Value: {
			Organization: 'Robotics University',
			Pass: 'Welcome123!'
		}
	}
];

var getHash = function (pass, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		if (err) {
			console.log("There was an error generating a salt: " + err);
			callback("error", null);
		} else {
			bcrypt.hash(pass, salt, null, function (err, hash) {
				if (err) {
					console.log("There was an error generating a hash: " + err);
					callback("error", null);
				} else {
					console.log("hash: " + hash);
					callback(null, hash);
				}
			});
		}
	});
}

var addLoginContent = function(callback) {
	console.log("Add Login Content");
	simpledb.deleteDomain({DomainName: loginTable}, function(err, data) {
		if (err) {
			console.log("Cannot delete table " + loginTable + ": " + err);
		} else {
			simpledb.createDomain({DomainName: loginTable}, function(err, data) {
				if (err) {
					console.log("Cannot create table " + loginTable + ": " + err);
				} else {
					async.forEach(loginData, function(login, callback) {
						console.log("Putting " + login.Key);
						getHash(login.Value.Pass, function (err1, data1) {
							if (data1) {
								simpledb.putAttributes({
								DomainName:loginTable, 
								ItemName:login.Key, 
								Attributes: [
									{Name:'organization', Value:login.Value.Organization},
									{Name:'password', Value:data1}
								]},
								function(err, data) {
									if (err) { 
										console.log("Cannot put login " + login.Key + ": " + err);
									}	
									callback();
								})
							}
						});
					});

					callback();
				}
			});
		}
	});
};

addLoginContent(function () {
		console.log("Finished adding test login data");
	})