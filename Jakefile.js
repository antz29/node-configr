var exec = require('child_process').exec;

desc('Run the tests');
task('test', [], function (params) {
	exec('./node_modules/expresso/bin/expresso', function (error, stdout, stderr) { 
		console.log(stdout); 
		console.log(stderr); 			
	});	
});
