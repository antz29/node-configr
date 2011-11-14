var assert = require('assert'),
    fs = require('fs'),
    path = require('path');

require('underscore');

var test_dir = process.cwd() + '/test/config_test';

var tests = {
	'You can get a configr instance' : function(beforeExit, assert) {
		var c = require('configr').create();
		assert.ok(c);
	},
	'You can set and get the config directory' : function(beforeExit, assert) {
		var c = require('configr').create();
		c.setDirectory(test_dir);
		assert.ok(c.getDirectory() === test_dir);
	},
	'You can load the shared config' : function(beforeExit, assert) {
		var c = require('configr').create();
		c.setDirectory(test_dir);
		c.load(function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'myuser');
			assert.equal(c.get().db.pass,'mypass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bar');
		});

	},
	'You can load the config for an environment' : function(beforeExit, assert) {
		var c = require('configr').create();
		c.setDirectory(test_dir);
		c.load('dev',function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'devuser');
			assert.equal(c.get().db.pass,'devpass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bop');
		});
	},
	'You can reload the config and change the environment' : function(beforeExit, assert) {
		var c = require('configr').create();
		c.setDirectory(test_dir);

		c.load(function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'myuser');
			assert.equal(c.get().db.pass,'mypass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bar');
		});

		c.load('dev',function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'devuser');
			assert.equal(c.get().db.pass,'devpass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bop');
		});

		c.load('dev',function() {
			assert.equal(c.get().db.db,'fred');
			assert.equal(c.get().db.user,'devuser');
			assert.equal(c.get().db.pass,'devpass');
			assert.deepEqual(c.get().db.list,['one','two','three']);
			assert.equal(c.get().db.obj.foo,'bop');
		});

	}
};

module.exports = tests;
