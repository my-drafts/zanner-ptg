var pt = require('../');

/**/
var options = {
	//proxy: 'http://200.9.220.120:3128',
	//proxy: 'http://52.88.220.145:80',
	//proxy: 'http://158.85.234.42:3128',
	sl: 'ru',
	tl: 'en',
	uri: 'http://zanner.org.ua/t/test.html',
	//uri: 'http://bash.im/',
	//uri: 'http://myip.ru/index_small.php',
	//uri: 'http://t.zanner.org.ua/task-to-translate/57cb4ccafa9a00682b684fda',
	fix: true //{link: 1, script: 1, iframe: 1, meta: 1, style: 1}
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
		console.log($('body').html());
		//console.log($(':root').html());
		//console.log($('table.network-info > tr > td').eq(0).html().trim());
	})
	.catch(function(error){
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
