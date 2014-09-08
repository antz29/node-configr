var fs = require('fs');
var path = require('path');
var _ = require('underscore');

function Configr(root,env) {
  var self = this;
  
  self.options = {
    root: root,
    env: env
  };

  self.config = {};

  self._load();
}

Configr.prototype.getRoot = function() {
  var self = this;

  return self.options.root;
};

Configr.prototype.getEnv = function() {
  var self = this;

  return self.options.env;
};

Configr.prototype._load = function() {
  var self = this;  

  var data = loadConfig(self.options.root, self.options.env);
  self.config = mergeConfig(self.config, data);
};

Configr.prototype.get = function() {
  var self = this;

  return self.config;
};

var loadConfigFromDir = function(dir) {
  var out = {};

  var files = fs.readdirSync(dir);

  files.forEach(function(file) {
      var error, file_path, name;

      if (path.extname(file) !== (".js")) {
        return null;
      }

      file_path = dir + '/' + file;
      name = file.replace(".js", '');

      try {
        out[name] = require(file_path);
      } catch (_error) {
        error = _error;
        throw error;
      }
  });

  return out;
};

var loadConfig = function(root, env) {
  var data = loadConfigFromDir(root);

  var dir = root + '/' + env;  
  if (env && fs.existsSync(dir)) {
    var env_data = loadConfigFromDir(dir);
    return mergeConfig(data, env_data);
  }

  return data;
};

var isPlainObject = function(obj) {
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

var mergeConfig = function(conf1, conf2) {
  _.map(conf2, function(val, key) {
    if (conf1[key] && isPlainObject(val)) {
      return conf1[key] = mergeConfig(conf1[key], conf2[key]);
    } else {
      return conf1[key] = val;
    }
  });
  return conf1;
};

module.exports = Configr;