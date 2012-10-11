var util = require('util');
var assert = require("assert");

var api_key = process.env.API_KEY;
var api_secret = process.env.API_SECRET;
var token = process.env.TOKEN;

if (!api_key) {
	util.puts('To run the mocha test, you must have a API_KEY environment variable with a producteev api key');
	process.exit(2);
}

if (!api_secret) {
	util.puts('To run the mocha test, you must have a API_SECRET environment variable with a producteev api secret');
	process.exit(2);
}

if (!token) {
	util.puts('To run the mocha test, you must have a EMAIL environment variable with a producteev api secret');
	process.exit(2);
}

var producteev = require('./../lib/main.js')(api_key, api_secret);

describe('tasks', function() {
	describe('#show_list()', function() {
		it('should return list of tasks', function(done) {
			producteev.tasks.show_list({ token: token }, function(err, response) {
				assert.equal(null, err);
				assert.notEqual(null, response.tasks);
				done();
			});
		});
	});
});