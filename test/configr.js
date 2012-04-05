var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require('coffee-script');
require('underscore');

var test_dir = path.resolve(path.dirname(new String(process.argv[2]))) + '/test/config_test/';

var tests = {
	'You can get a configr instance' : function(beforeExit, assert) {
		console.log('* You can get a configr instance');
		var Configr = require('../');
		var c = new Configr(test_dir);
		assert.ok(c);
		delete c
	},
	'You can set and get the config directory' : function(beforeExit, assert) {
		console.log('* You can set and get the config directory');
		var Configr = require('../');
		var c = new Configr(test_dir);
		assert.ok(c.getRoot() === test_dir);
		delete c
	},
	'You can load the shared config' : function(beforeExit, assert) {
		console.log('* You can load the shared config')
		var Configr = require('../');
		var c = new Configr(test_dir);
		c.on('ready',function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'myuser');
			assert.equal(c.get().db.pass,'mypass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bar');
			delete c
		});

	},
	'You can load the config for an environment' : function(beforeExit, assert) {
		console.log('* You can load the config for an environment')
		var Configr = require('../');

		var dev = new Configr(test_dir,'dev');
		dev.on('ready',function() {
			assert.equal(dev.get().db.db,'fred');
			assert.equal(dev.get().db.user,'devuser');
			assert.equal(dev.get().db.pass,'devpass');
			assert.deepEqual(dev.get().db.list,['one','two','three']);
			assert.equal(dev.get().db.obj.foo,'bop');
			delete dev
		});

		var prod = new Configr(test_dir,'prod');
		prod.on('ready',function() {
			assert.equal(prod.get().db.db,'fred');
			assert.equal(prod.get().db.user,'myuser');
			assert.equal(prod.get().db.pass,'mypass');
			assert.deepEqual(prod.get().db.list,['one','two','three']);
			assert.equal(prod.get().db.obj.foo,'bar');
			delete prod
		});
	}/*,
	'The config is reloaded when the config is changed' : function(beforeExit, assert) {
		console.log('* The config is reloaded when the config is changed')
		var Configr = require('../');
		var c = new Configr(test_dir);

		c.on('ready',function() {
			console.log('READY')
			console.log(c.get().test)
		});

		fs.writeFileSync(test_dir + 'test.js', 'module.exports.config = { foo : "bar" }', 'utf-8');

		c.on('updated',function() {
			console.log('updated')
			console.log(c.get().general)
		});
	}*/
};

module.exports = tests;
