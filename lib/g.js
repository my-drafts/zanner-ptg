'use strict';


var rqp = require('./rqp');
var url = require('url');


var optionsDefault = {
	c: {},
	h: {
		'accept': 'text/html, */*;q=0.8',
		'accept-encoding': 'deflate',
		'accept-language': 'en, *;q=0.8',
		'user-agent': 'Opera 12.0'
	},
	//followRedirect: true,
	//followAllRedirects: true,
	forever: true,
	//removeRefererHeader: false,
	resolveWithFullResponse: true
};
var fix_a_href = module.exports.fix_a_href = function($, replace){
	$('a').each(function(index, a){
		let href = $(a).attr('href') || '';
		if(!href.match(/^(?:https?[\:])?[\/]{2}(?:translate[\.]googleusercontent[\.]com|[^\/]*google[^\/]*)[\/]/ig)) return;
		let q = url.parse(href, true).query;
		if(q && q.u){
			$(a).attr('href', q.u);
		}
		else if(replace!==false){
			$(a).replaceWith($(a).html());
		}
	});
	return $;
};
var fix_link_href = module.exports.fix_link_href = function($, replace){
	$('link').each(function(index, link){
		let href = $(link).attr('href') || '';
		if(!href.match(/^(?:https?[\:])?[\/]{2}(?:translate[\.]googleusercontent[\.]com|[^\/]*google[^\/]*)[\/]/ig)) return;
		let q = url.parse(href, true).query;
		if(q && q.u){
			$(link).attr('href', q.u);
		}
		else if(replace!==false){
			$(link).replaceWith($(link).html());
		}
	});
	return $;
};
var fix_script_src = module.exports.fix_script_src = function($, replace){
	$('script').each(function(index, script){
		let src = $(script).attr('src') || '';
		if(!src.match(/^(?:https?[\:])?[\/]{2}(?:translate[\.]googleusercontent[\.]com|[^\/]*google[^\/]*)[\/]/ig)) return;
		let q = url.parse(src, true).query;
		if(q && q.u){
			$(script).attr('src', q.u);
		}
		else if(replace!==false){
			$(script).replaceWith($(script).html());
		}
	});
	return $;
};
var fix_span_no_translate = module.exports.fix_span_no_translate = function($){
	// span with original text & translated
	$('span.notranslate').each(function(index, span){
		//$(span).removeAttr('onmouseover');
		//$(span).removeAttr('onmouseout');
		$(span).find('span.google-src-text').remove();
		$(span).replaceWith($(span).html());
	});
	return $;
};
var fix_script_last = module.exports.fix_script_last = function($){
	// google script last{1}
	$('script').filter(function(index, script){
		let html = $(script).html() || '';
		return html.match(/^_addload[\(]/ig);
	}).replaceWith('');
	return $;
};
var fix_iframe = module.exports.fix_iframe = function($){
	// google script last{1}
	$('iframe[src*="//translate.google.com"]').replaceWith('');
	return $;
};
var fix_style = module.exports.fix_style = function($){
	$('style').filter(function(index, style){
		let html = $(style).html() || '';
		return html.match(/[\.]google[\-]src[\-]text/ig);
	}).replaceWith('');
	return $;
};
var fix_base = module.exports.fix_base = function($){
	// google base
	//$('html > head > base').replaceWith('');
	return $;
};
var fix_link = module.exports.fix_link = function($){
	// google link rel~=machine-translated-from
	$('link[rel*="machine-translated-from"]').replaceWith('');
	return $;
};
var fix_meta = module.exports.fix_meta = function($){
	// google meta http-equiv=X-Translated-By
	$('meta[http-equiv*="X-Translated-By"]').replaceWith('');
	return $;
};
var fix_script_first = module.exports.fix_script_first = function($){
	// google script first{2}
	$('script').filter(function(index, script){
		let html = $(script).html() || '';
		return html.match(/^[\(]function[\(][\)][\{]/ig) || html.match(/https?[\:][\/]{2}translate[\.]google[\.]/ig);
	}).replaceWith('');
	return $;
};


/*
var cheerio = require('cheerio');
var of = require('zanner-typeof').of;

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
*/


var translating = module.exports.translating = function(sl, tl, uri, proxy, cs, hs){
	let options = {
		cs: cs,
		hs: hs,
		qs: {hl: 'en', prev: 'hp', sl: sl, tl: tl, u: uri},
		uri: 'https://translate.google.com.ua/translate'
	};
	options = Object.assign({}, optionsDefault, options, proxy ? {proxy: proxy} : {});
	return rqp(options, true)
		.then(function(result){
			//console.log(result.code);
			//console.log(result.headers);
			var iframe_src = result.$('html body div#contentframe iframe').attr('src');
			var iframe_url = url.parse(iframe_src, true);
			//console.log(iframe_src);
			//console.log(iframe_url);
			let options = {
				cs: cs,
				hs: hs,
				qs: iframe_url.query,
				uri: 'https://translate.googleusercontent.com/translate_p'
			};
			options = Object.assign({}, optionsDefault, options, proxy ? {proxy: proxy} : {});
			return rqp(options, true);
		})
		.then(function(result){
			//console.log(result.code);
			//console.log(result.headers);
			var locations_src = result.headers.location;
			var locations_url = url.parse(locations_src, true);
			//console.log(locations_src);
			//console.log(locations_url);
			let options = {
				cs: cs,
				hs: hs,
				qs: locations_url.query,
				uri: 'https://translate.googleusercontent.com/translate_c'
			};
			options = Object.assign({}, optionsDefault, options, proxy ? {proxy: proxy} : {});
			return rqp(options, true);
		})
		.then(function(result){
			//console.log(result.code);
			//console.log(result.headers);
			return result;
		});
};
var translate = module.exports.translate = function(options){
	let check = options && options.sl && options.tl && options.uri;
	return translating(options.sl, options.tl, options.uri, options.proxy, options.cs, options.hs)
		.then(function(result){
			if(options.fix===true || options.fix.a){
				result.$ = fix_a_href(result.$, true);
			}
			if(options.fix===true || options.fix.link){
				result.$ = fix_link_href(result.$, true);
			}
			if(options.fix===true || options.fix.script){
				result.$ = fix_script_src(result.$, true);
			}
			if(options.fix===true || options.fix.span){
				result.$ = fix_span_no_translate(result.$);
			}
			if(options.fix===true || options.fix.script){
				result.$ = fix_script_last(result.$);
			}
			if(options.fix===true || options.fix.iframe){
				result.$ = fix_iframe(result.$);
			}
			if(options.fix===true || options.fix.style){
				result.$ = fix_style(result.$);
			}
			if(options.fix===true || options.fix.base){
				result.$ = fix_base(result.$);
			}
			if(options.fix===true || options.fix.link){
				result.$ = fix_link(result.$);
			}
			if(options.fix===true || options.fix.meta){
				result.$ = fix_meta(result.$);
			}
			if(options.fix===true || options.fix.script){
				result.$ = fix_script_first(result.$);
			}
			return result;
		});
};
