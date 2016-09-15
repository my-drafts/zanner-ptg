'use strict';


var rp = require('request-promise');


var optionsDefault = {
	//json: true,
	method: 'POST',
	uri: 'http://zanner.org.ua/t/'
};


var send = module.exports = function(uri, body){
	let options = Object.assign({}, optionsDefault);
	options.uri = uri;
	options.form = body;
	return rp(options)
		.then(function(parsedBody){
			let result = {
				body: body,
				repled: parsedBody,
				uri: uri
			};
			return Promise.resolve(result);
		});
};