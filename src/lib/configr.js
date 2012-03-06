var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/**
 * @api private
 */
function NodeConfigr() {
	
	var root,
	    config = {},
	    loading = false;

	function loadJsonFromDir(dir,callback) {
		var out = {};
		
		var to_process = [];
		var processing = 0;

		fs.readdir(dir,function(err,files) {

			function readFile() {
				if (!files.length) return;

				processing++;		
				var file = files.shift();

				if (path.extname(file) !== '.json') return processing--;

				to_process.push(file);
			}

			function processFile() {
				if (!to_process.length) return;
				
				var file = to_process.pop();
			
				var file_path = dir + '/' + file;

				fs.readFile(file_path, 'utf8', function (err, data) {
					if (err) throw err;
					data = JSON.parse(data.trim());
					var name = file.replace('.json','');
					out[name] = data;
					processing--;
				});
			}

			function checkFiles() {
				if (files.length || to_process.length || processing) return;
				clearTimeout(read_files);			
				clearTimeout(process_queue);
				clearTimeout(check_files);
				callback(out);
			};

			var read_files = setInterval(readFile,0);
			var process_queue = setInterval(processFile,0);
			var check_files = setInterval(checkFiles,0);
		});
	}

	function isPlainObject(obj) {
		if (!obj) return false;		
		if (_.isArray(obj)) return false;
		if (_.isFunction(obj)) return false;
		if (_.isString(obj)) return false;
		if (_.isBoolean(obj)) return false;
		if (_.isNumber(obj)) return false;
		if (_.isDate(obj)) return false;
		if (_.isRegExp(obj)) return false;
		if (_.isNaN(obj)) return false;
		
		return true;
	}

	function mergeConfig(conf1,conf2) {

		_.map(conf2, function(val, key) {
			if (conf1[key] && isPlainObject(val)) {
				conf1[key] = mergeConfig(conf1[key],conf2[key]);
			}
			else {
				conf1[key] = val;
			}
		});

		return conf1;
	}

	function loadConfig(env,callback) {
		if (loading) return;
		loading = true;
		loadJsonFromDir(root, function(data) {
			if (!env) return callback(data);
			var dir = root + '/' + env;
			path.exists(dir,function(exists) {
				if (!exists) return callback(data);
				loadJsonFromDir(dir, function(env_data) {
					callback(mergeConfig(data,env_data));
					loading = false;
				});
			});
		});
	}

	this.setDirectory = function(dir) {
		root = dir;
	};

	this.getDirectory = function() {
		return root;
	};

	this.load = function(env,callback) {
		if (_.isFunction(env)) {
			callback = env;
			env = null;
		}

		config = {};

		loadConfig(env,function(data) {
			config = mergeConfig(config,data);
			callback();
		});
	};

	this.get = function() {
		return config;
	};
}

/**
 * Create a new configr instance for the gived environment.
 *
 * @return {NodeConfigr} NodeConfigr instance.
 * @api public
 */
exports.create = function() { return new NodeConfigr(); };
