var https = require('https');
var querystring = require('querystring');
var crypto = require('crypto');

var defaults = {
	host: 'api.producteev.com',
	port: 443,
	format: 'json'
};

module.exports = function (api_key, api_secret, options) {
	for (var key in options) {
		defaults[key] = options[key];
	}

	function _request(method, path, data, callback) {
		data['api_key'] = api_key;
		data['api_sig'] = _generateSignature(data, api_secret);

		Object.keys(data).forEach(function(key) {
			if (typeof data[key] === 'object' && data[key] !== null) {
				var o = data[key];
				delete data[key];
				Object.keys(o).forEach(function(k) {
					var new_key = key + "[" + k + "]";
					data[new_key] = o[k];
				});
			}
		});

		var request_data = querystring.stringify(data);

		var request_options = {
			host: defaults.host,
			port: defaults.port,
			path: path + '.' + defaults.format + '?' + request_data,
			method: method
		};

		var req = https.request(request_options);
		setup_response_handler(req, callback);
		req.write(request_data);
		req.end();
	}

	function _generateSignature(data, api_secret) {
		// Sort keys in data by alphabetical order
		var sorted = {};
		var key = [];
		var a = [];

		for (key in data) {
			if (data.hasOwnProperty(key)) {
				a.push(key);
			}
		}

		a.sort();

		for (key = 0; key < a.length; key++) {
			sorted[a[key]] = data[a[key]];
		}

		var sig = '';

		for (var key in sorted) {
			sig = sig + key + sorted[key];
		}

		sig = sig + api_secret;

		var hash = crypto.createHash('md5').update(sig).digest("hex");

		return hash;
	}

	var api = {
		post: function (path, data, callback) {
			_request('POST', path, data, callback);
		},
		get: function (path, data, callback) {
			_request('GET', path, data, callback);
		},
		del: function (path, data, callback) {
			_request('DELETE', path, data, callback);
		}
	};

	var methods = {
		user: {
			login: function (data, callback) {
				api.get('/users/login', data, callback);
			}
		},
		tasks: {
			show_list: function(data, callback) {
				api.get('/tasks/show_list', data, callback);
			}
		},
		api: api
	};

	return methods;
};

function setup_response_handler(req, callback) {
	if (typeof callback !== "function") {
		return;
	}

	req.on('response', function(res) {
		var response = '';
		res.setEncoding('utf8');
		res.on('data', function(chunk) {
			response += chunk;
		});

		res.on('end', function() {
			var err = 200 == res.statusCode ? null : res.statusCode;
			try {
				response = JSON.parse(response);
			}
			catch(e) {
				err = 1;
				response = { error : { message : 'Invalid JSON from ' + defaults.host } };
			}
			err && (err = { statusCode: err, response: response });
			callback(err, response);
		});
	});
}