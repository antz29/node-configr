# Deps
fs    = require('fs')
path  = require('path')
_     = require('underscore')
EventEmitter = require('events').EventEmitter

# Helper Functions
loadConfigFromDir = (dir, callback) ->
  out = {}

  fs.readdir dir,(err,files) -> 
    for file in files 
      do (file) ->
        if path.extname(file) != '.js' then return null
        file_path = dir + '/' + file
        name = file.replace('.js','')
        try
          out[name] = require(file_path).config
        catch error
          return throw error
    callback(out)

loadConfig = (root,env,callback) ->
    loadConfigFromDir root, (data) ->
      if !env then return callback(data)
      dir = root + '/' + env
      path.exists dir, (exists) ->
        if !exists then return callback(data);
        loadConfigFromDir dir, (env_data) ->
          callback mergeConfig(data,env_data);

isPlainObject = (obj) -> 
  if !obj then return false
  if _.isArray(obj) then return false
  if _.isFunction(obj) then return false
  if _.isString(obj) then return false
  if _.isBoolean(obj) then return false
  if _.isNumber(obj) then return false
  if _.isDate(obj) then return false
  if _.isRegExp(obj) then return false
  if _.isNaN(obj) then return false

  return true

mergeConfig = (conf1, conf2) ->
  _.map conf2, (val,key) -> 
    if conf1[key] && isPlainObject(val)
      conf1[key] = mergeConfig(conf1[key],conf2[key])
    else
      conf1[key] = val

  return conf1

# The main Configr class
class Configr extends EventEmitter
  constructor: (root, env) ->
    @root = root
    @env = env
    @config = {}
    @watcher = null
    @loading = false

    this._load(@env,true)
    
    #this._watch() see below

  getRoot: ->
    return @root;

  getEnv: ->
    return @env;
  
  _load: (env, first = false) ->
    if (@loading) then return null

    @loading = true

    loadConfig @root, env, (data) =>
      @config = mergeConfig(@config,data)
      @loading = false
      if first
        this.emit('ready')
      else
        this.emit('updated')

  get: ->
    return @config
  

module.exports = Configr
