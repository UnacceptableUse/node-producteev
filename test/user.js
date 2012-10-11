var util = require('util');
var assert = require("assert");

var api_key = process.env.API_KEY;
var api_secret = process.env.API_SECRET;
var email = process.env.EMAIL;
var password = process.env.PASSWORD;

if (!api_key) {
	util.puts('To run the mocha test, you must have a API_KEY environment variable with a producteev api key');
	process.exit(2);
}

if (!api_secret) {
	util.puts('To run the mocha test, you must have a API_SECRET environment variable with a producteev api secret');
	process.exit(2);
}

if (!email) {
	util.puts('To run the mocha test, you must have a EMAIL environment variable with a producteev api secret');
	process.exit(2);
}

if (!password) {
	util.puts('To run the mocha test, you must have a PASSWORD environment variable with a producteev api secret');
	process.exit(2);
}

var producteev = require('./../lib/main.js')(api_key, api_secret);

describe('user', function(){
	describe('#login()', function(){
		it('should return token and email upon succesful login', function(done){
			producteev.user.login({ email: email, password: password }, function(err, response) {
				assert.equal(null, err);
				assert.equal(email, response.login.email);

				console.log('Login completed successfully, use the following token in other tests', response.login.token);
				done();
			});
		});

		it('should return token and email upon succesful login', function(done){
			producteev.api.get('/users/login', { email: email, password: password }, function(err, response) {
				assert.equal(null, err);
				assert.equal(email, response.login.email);

				console.log('Login completed successfully, use the following token in other tests', response.login.token);
				done();
			});
		});

	});
});