
var cheerio = require('cheerio');
var of = require('zanner-typeof').of;
var rp = require('request-promise');
var url = require('url');

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
	//console.log(options);
	return new Promise(function(resolve, reject){
		rp(options).then(function(response){
			//console.log(response.statusCode, response.headers, response.body);
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
			//console.log(result.code);
			//console.log(result.headers);
			//console.log(result.html);
			resolve(result);
		}, reject);
	});
};

var fixURI = module.exports.fixURI = function(result){
	result.$('a, link, script').each(function(index, element){
		var attrName, attrValue;
		switch(result.$(element)[0].name.toLowerCase()){
			case 'a': attrName = 'href'; break;
			case 'link': attrName = 'href'; break;
			case 'script': attrName = 'src'; break;
		}
		attrValue = result.$(element).attr(attrName);
		if(!attrName) return;
		if(!attrValue) return;
		if(!attrValue.match(/^(?:https?[\:])?[\/]{2}(?:translate[\.]googleusercontent[\.]com|[^\/]*google[^\/]*)[\/]/ig)) return;
		var query = url.parse(attrValue, true).query;
		if(query && query.u) result.$(element).attr(attrName, query.u);
		else result.$(element).replaceWith(result.$(element).html());
	});
};

var fixPopup = module.exports.fixPopup = function(result){
	// span with original text & translated
	result.$('span.notranslate').each(function(index, element){
		result.$(element).find('span.google-src-text').remove();
		//result.$(element).removeAttr('onmouseover');
		//result.$(element).removeAttr('onmouseout');
		result.$(element).replaceWith(result.$(element).html());
	});
};

var fixMeta = module.exports.fixMeta = function(result){
	// google script last{1}
	result.$('script').filter(function(index, element){
		var html = result.$(element).html();
		return html && html.match(/^_addload[\(]/ig);
	}).replaceWith('');
	// google iframe
	result.$('iframe[src*="//translate.google.com"]').replaceWith('');
	// google style
	result.$('style').filter(function(index, element){
		var html = result.$(element).html();
		return html && html.match(/[\.]google[\-]src[\-]text/ig);
	}).replaceWith('');
	// google base
	//result.$('html > head > base').replaceWith('');
	// google link rel~=machine-translated-from
	result.$('link[rel*="machine-translated-from"]').replaceWith('');
	// google meta http-equiv=X-Translated-By
	result.$('meta[http-equiv*="X-Translated-By"]').replaceWith('');
	// google script first{2}
	result.$('script').filter(function(index, element){
		var html = result.$(element).html();
		if(!html) return false;
		else if(html.match(/^[\(]function[\(][\)][\{]/ig)) return true;
		else if(html.match(/https?[\:][\/]{2}translate[\.]google[\.]/ig)) return true;
		else return false;
	}).replaceWith('');
};

var fix = module.exports.fix = function(result, doFix){
	if(doFix===false) doFix = {};
	else if(doFix===true) doFix = {meta: true, popup: true, uri: true};
	else if(of(doFix, 'function')) doFix = {filter: doFix};
	else doFix = Object.assign({meta: true, popup: true, uri: true}, doFix);
	//
	for(var f in doFix){
		if(of(doFix[f], 'function')){
			doFix[f](result);
		}
		else if(f.match(/^uri$/ig) && doFix[f]===true){
			fixURI(result);
		}
		else if(f.match(/^popup$/ig) && doFix[f]===true){
			fixPopup(result);
		}
		else if(f.match(/^meta$/ig) && doFix[f]===true){
			fixMeta(result);
		}
		else if(f.match(/^filter/ig) && of(doFix[f], 'object')){
			for(var ff in doFix[f]){
				if(!of(doFix[f][ff], 'function')) continue;
				doFix[f][ff](result);
			}
		}
		else if(f.match(/^filter/ig) && of(doFix[f], 'array')){
			for(var i=0; i<doFix[f].length; i++){
				if(!of(doFix[f][i], 'function')) continue;
				doFix[f][i](result);
			}
		}
	};
};

var translating = module.exports.translating = function(sl, tl, uri, proxy, cs, hs){
	var URL = [
		'https://translate.google.com.ua/translate',
		'https://translate.googleusercontent.com/translate_p',
		'https://translate.googleusercontent.com/translate_c'
	];
	return new Promise(function(resolve, reject){
		cs = of(cs, 'object') ? {cs:cs} : {};
		hs = of(hs, 'object') ? {hs:hs} : {};
		proxy = of(proxy, 'string') ? {proxy:proxy} : {};
		loading(URL[0], [cs, hs, proxy, {qs:{hl: 'en', prev: 'hp', sl: sl, tl: tl, u: uri}}])
			.then(function(result){
				var src = result.$('html body div#contentframe iframe').attr('src');
				var srcp = url.parse(src, true);
				//console.log(result.code);
				//console.log(result.headers);
				//console.log(src);
				//console.log(srcp);
				loading(URL[1], [cs, hs, proxy, {qs:srcp.query}])
					.then(function(result){
						var src = result.headers.location;
						var srcp = url.parse(src, true);
						//console.log(result.code);
						//console.log(result.headers);
						//console.log(src);
						//console.log(srcp);
						loading(URL[2], [cs, hs, proxy, {qs:srcp.query}])
							.then(function(result){
								//console.log(result.code);
								//console.log(result.headers);
								resolve(result);
							},
							reject);
					},
					reject);
			},
			reject);
	});
};

var translate = module.exports.translate = function(options){
	return new Promise(function(resolve, reject){
		if(!of(options, 'object')) reject('translate options is not object');
		else if(!of(options.sl, 'string')) reject('translate options has no source language');
		else if(!of(options.tl, 'string')) reject('translate options has no target language');
		else if(!of(options.uri, 'string')) reject('translate options has no uri');
		else{
			if(!of(options.proxy, 'string')) options.proxy = undefined;
			if(!of(options.cs, 'object')) options.cs = {};
			if(!of(options.hs, 'object')) options.hs = {};
			//console.log(options);
			translating(options.sl, options.tl, options.uri, options.proxy, options.cs, options.hs)
				.then(function(result){
					if(options.fix) fix(result, options.fix);
					resolve(result);
				},
				reject);
		}
	});
};
