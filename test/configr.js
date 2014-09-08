var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require('underscore');

var test_dir = path.resolve(path.dirname(new String(process.argv[2]))) + '/test/config_test/';

var tests = {
	'You can load the shared config' : function(beforeExit, assert) {
		console.log('* You can load the shared config')
		var c = require('../')(test_dir);

		assert.equal(c.db.db,'fred');
		assert.equal(c.db.user,'myuser');
		assert.equal(c.db.pass,'mypass');
		assert.deepEqual(c.db.list,['one','two','three']);
		assert.equal(c.db.obj.foo,'bar');
		delete c;

	},
	'You can load the config for an environment' : function(beforeExit, assert) {
		console.log('* You can load the config for an environment')
		var dev = require('../')(test_dir,'dev');

		assert.equal(dev.db.db,'fred');
		assert.equal(dev.db.user,'devuser');
		assert.equal(dev.db.pass,'devpass');
		assert.deepEqual(dev.db.list,['one','two','three']);
		assert.equal(dev.db.obj.foo,'bop');
		delete dev;

		var prod = require('../')(test_dir,'prod');
		
		assert.equal(prod.db.db,'fred');
		assert.equal(prod.db.user,'myuser');
		assert.equal(prod.db.pass,'mypass');
		assert.deepEqual(prod.db.list,['one','two','three']);
		assert.equal(prod.db.obj.foo,'bar');
		delete prod;
	}
};

module.exports = tests;
