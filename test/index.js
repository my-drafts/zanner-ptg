var pt = require('../');

/**/
pt.translate({sl:'ru', tl:'en', uri:'http://myip.ru/index_small.php', fix:true}) // proxy:'http://104.236.222.191:3128'
	.then(function(result){
		var code = result.code;
		var headers = result.headers;
		var html = result.html;
		var $ = result.$;
		//console.log(code);
		//console.log(headers);
		//console.log($(':root').html());
		console.log($('table.network-info > tr > td').eq(0).html().trim());
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
