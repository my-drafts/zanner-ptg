'use strict';


var cheerio = require('cheerio');
var rp = require('request-promise');
var type = require('zanner-typeof'), is = type.is, of = type.of;


/*
* https://www.npmjs.com/package/request-promise
*
* @oprions: {
*   <key>: <value>,
*   ...
*
*   method: 'POST' | 'GET',
*   uri: 'string',
*   json: true | false,
*   resolveWithFullResponse: true | false,
*   simple: false | true,
*   transform: function (body, response, resolveWithFullResponse) {
*     return body.split('').reverse().join('');
*   }
*
*   ?form: {
*     some: 'payload' // Will be urlencoded
*   },
*
*   ?body: {
*     some: 'payload'
*   },
*
*   ?cookies: {
*     <key>: <value>,
*     ...
*   },
*   ?cookie: @cookies,
*   ?cs: @cookies,
*   ?c: @cookies,
*
*   ?headers: {
*     <header>: <value>,
*     ...
*   },
*   ?header: ?headers,
*   ?hs: ?headers,
*   ?h: ?headers,
*
*   ?queries: {
*     key: value,
*     ...
*   },
*   ?query: ?queries,
*   ?qs: ?queries,
*   ?q: ?queries,
*
*   ...
* }
* =>
* */
const cheerioOptions = {
	decodeEntities: true,
	lowerCaseAttributeNames: true,
	lowerCaseTags: true,
	normalizeWhitespace: true,
	recognizeCDATA: true,
	xmlMode: false
};


var rqp = module.exports = function(options, $){
	let o = Object.assign({}, options);
/** /
	let cs = Object.assign.apply(null, [{}].concat(o.c, o.cookie, o.cs, o.cookies));
  o.cookies = o.cookie = o.cs = o.c = null;
	delete o.cookies;
	delete o.cookie;
	delete o.cs;
	delete o.c;
	o.cookie = cs;
/**/
	let hs = Object.assign.apply(null, [{}].concat(o.h, o.header, o.hs, o.headers));
	o.headers = o.header = o.hs = o.h = null;
	delete o.headers;
	delete o.header;
	delete o.hs;
	delete o.h;
	o.headers = hs;

	let qs = Object.assign.apply(null, [{}].concat(o.q, o.query, o.qs, o.queries));
	o.queries = o.query = o.qs = o.q = null;
	delete o.queries;
	delete o.query;
	delete o.qs;
	delete o.q;
	o.qs = qs;

	return rp(o).then(function(response){
		var result = {
			body: response.body,
			code: response.statusCode,
			headers: response.headers,
			options: o,
			response: response
		};
		//console.log(result.body);
		//console.log(result.code);
		//console.log(result.headers);
		//console.log(result.options);
		if($){
			result.$ = cheerio.load(result.body, cheerioOptions);
		}
		return Promise.resolve(result);
	});
};

