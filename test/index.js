var pt = require('../');

/**/
var options = {
	sl: 'ru',
	tl: 'en',
	//uri: 'http://myip.ru/index_small.php',
	uri: 'http://t.zanner.org.ua/task-to-translate/57cb4ccafa9a00682b684fda',
	fix: {link: 1, script: 1, iframe: 1, meta: 1, style: 1}
};
pt.translate(options) // proxy:'http://104.236.222.191:3128'
	.then(function(result){
		var body = result.body;
		var code = result.code;
		var headers = result.headers;
		var $ = result.$;
		//console.log(body);
		//console.log(code);
		//console.log(headers);
		console.log($(':root').html());
		//console.log($('table.network-info > tr > td').eq(0).html().trim());
	}, function(error){
		console.log(error);
	});
/** /
 pt.translate({sl:'ru', tl:'en', uri:'http://myip.ru', fix:true})
 .then(function(result){
		console.log('!');
		var code = result.code;
		var headers = result.headers;
		var html = result.html;
		var $ = result.$;
		console.log(code);
		console.log(headers);
		console.log(html);
		//console.log($('table.network-info > tr > td').eq(0).html());
	}, function(error){
		console.log(error);
	});
 /**/
