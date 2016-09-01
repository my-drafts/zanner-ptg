var pt = require('../');

var postData = {
	a: 'qwe',
	b: 123,
	f: true
};

pt.send('http://zanner.org.ua/t/', postData)
	.then(function(result){
		console.log('result: ', result);
	})
	.catch(function(error){
		console.log('error: ', error);
	});