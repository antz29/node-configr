// converted from CoffeeScript (so looks a bit weird at the moment...)

var Configr, EventEmitter, fs, isPlainObject, loadConfig, loadConfigFromDir, mergeConfig, path, _,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

fs = require('fs');
path = require('path');

_ = require('underscore');

EventEmitter = require('events').EventEmitter;

loadConfigFromDir = function(ext, dir, callback) {
  var out;
  out = {};
  return fs.readdir(dir, function(err, files) {
    var file, _fn, _i, _len;
    _fn = function(file) {
      var error, file_path, name;
      if (path.extname(file) !== ("." + ext)) {
        return null;
      }
      file_path = dir + '/' + file;
      name = file.replace("." + ext, '');
      try {
        return out[name] = require(file_path).config;
      } catch (_error) {
        error = _error;
        throw error;
      }
    };
    for (_i = 0, _len = files.length; _i < _len; _i++) {
      file = files[_i];
      _fn(file);
    }
    return callback(out);
  });
};

loadConfig = function(ext, root, env, callback) {
  return loadConfigFromDir(ext, root, function(data) {
    var dir;
    if (!env) {
      return callback(data);
    }
    dir = root + '/' + env;
    return fs.exists(dir, function(exists) {
      if (!exists) {
        return callback(data);
      }
      return loadConfigFromDir(ext, dir, function(env_data) {
        return callback(mergeConfig(data, env_data));
      });
    });
  });
};

isPlainObject = function(obj) {
  if (!obj) {
    return false;
  }
  if (_.isArray(obj)) {
    return false;
  }
  if (_.isFunction(obj)) {
    return false;
  }
  if (_.isString(obj)) {
    return false;
  }
  if (_.isBoolean(obj)) {
    return false;
  }
  if (_.isNumber(obj)) {
    return false;
  }
  if (_.isDate(obj)) {
    return false;
  }
  if (_.isRegExp(obj)) {
    return false;
  }
  if (_.isNaN(obj)) {
    return false;
  }
  return true;
};

mergeConfig = function(conf1, conf2) {
  _.map(conf2, function(val, key) {
    if (conf1[key] && isPlainObject(val)) {
      return conf1[key] = mergeConfig(conf1[key], conf2[key]);
    } else {
      return conf1[key] = val;
    }
  });
  return conf1;
};

Configr = (function(_super) {
  __extends(Configr, _super);

  function Configr(opt) {
    if (opt == null) {
      opt = {};
    }
    this.options = _.defaults(opt, {
      root: root,
      env: null,
      language: 'js'
    });
    this.config = {};
    this.loading = false;
    this._load();
  }

  Configr.prototype.getRoot = function() {
    return this.options.root;
  };

  Configr.prototype.getEnv = function() {
    return this.options.env;
  };

  Configr.prototype._load = function() {
    if (this.loading) {
      return null;
    }
    this.loading = true;
    return loadConfig(this.options.language, this.options.root, this.options.env, (function(_this) {
      return function(data) {
        _this.config = mergeConfig(_this.config, data);
        _this.loading = false;
        return _this.emit('ready');
      };
    })(this));
  };

  Configr.prototype.get = function() {
    return this.config;
  };

  return Configr;

})(EventEmitter);

module.exports = Configr;