// npm i --save cheerio zanner-typeof request-promise url
// npm rm --save cheerio zanner-typeof request-promise url

var cheerio = require('cheerio');
var of = require('zanner-typeof').of;
var rp = require('request-promise');

function _loadingConfigMerge(){
	var result = {};
	for(var i=0; i<arguments.length; i++){
		var a = arguments[i];
		if(of(a, 'object')){
			result = Object.assign(result, a);
		}
		else if(of(a, 'array')){
			result = Object.assign(result, _loadingConfigMerge.apply(this, a));
		}
	}
	return result;
};

function loadingConfigMerge(){
	var result = { cookie: {}, headers: {}, qs: {} };
	for(var i=0; i<arguments.length; i++){
		var a = arguments[i];
		if(of(a, 'object')){
			result.cookie = _loadingConfigMerge(result.cookie, a.cookie, a.cs);
			delete a.cookie;
			delete a.cs;
			result.headers = _loadingConfigMerge(result.headers, a.headers, a.hs);
			delete a.headers;
			delete a.hs;
			result.qs = _loadingConfigMerge(result.qs, a.query, a.qs);
			delete a.query;
			delete a.qs;
			result = Object.assign(result, a);
		}
		else if(of(a, 'array')){
			result = Object.assign(result, loadingConfigMerge.apply(this, a));
		}
	}
	return result;
};

function loading(uri, options){
	var HS = {
		'accept': 'text/html, */*;q=0.8',
		'accept-encoding': 'deflate',
		'accept-language': 'en, *;q=0.8',
		'user-agent': 'Opera 12.0'
	};
	options = loadingConfigMerge(options, {uri: uri, hs: HS});
	//options = loadingConfigMerge(options, {followRedirect: true});
	//options = loadingConfigMerge(options, {followAllRedirects: true});
	options = loadingConfigMerge(options, {forever: true});
	//options = loadingConfigMerge(options, {removeRefererHeader: false});
	options = loadingConfigMerge(options, {resolveWithFullResponse: true});
	return new Promise(function(resolve, reject){
		rp(options).then(function(response){
			var result = {
				code: response.statusCode,
				headers: response.headers,
				html: response.body,
				$: cheerio.load(response.body, {
					decodeEntities: true,
					lowerCaseAttributeNames: true,
					lowerCaseTags: true,
					normalizeWhitespace: true,
					recognizeCDATA: true,
					xmlMode: false
				})
			};
			resolve(result);
		}, reject);
	});
};

loading('http://myip.ru/index_small.php', {proxy: 'http://104.236.222.191:3128'})
	.then(function(result){
		var code = result.code;
		var headers = result.headers;
		var html = result.html;
		var $ = result.$;
		console.log($('table.network-info > tr > td').eq(0).html());
	}, function(error){
		console.log(error);
	});