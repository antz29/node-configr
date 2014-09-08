# node-configr - Configure your apps

* master [![Build Status](https://secure.travis-ci.org/antz29/node-configr.png?branch=master)](http://travis-ci.org/antz29/node-configr)
* develop [![Build Status](https://secure.travis-ci.org/antz29/node-configr.png?branch=develop)](http://travis-ci.org/antz29/node-configr)

## Installation

    npm install configr

## What's it do?

It allows you to parse and merge multiple JSON configuration files (allowing 
you to create environment specific configuration) and then access your configuration
through a simple interface.

## Config files

Your applications configuration takes the form of simple JSON files. You create a directory
to store your config files, the config files stored in the root are merged and form the 'base'
configuration that is shares between all environments.

To create environment specific overrides you create sub directories, for each environment, and
place the configuration files in the there for each environment. For example, you start off with a
config dir, and in there you have 'general.js' and 'db.js' files. See below

    // general.js
    module.exports = {
        "app_name" : "test_app",
        "hawtness" : "extreme"
    }

    // db.js
    module.exports = {
        "host" : "127.0.0.1",
        "user" : "myuser",
        "pass" : "mypass",
        "db"   : "mydb"
    }

These files are merged into an internal structure:

    {
        "general" : {
            "app_name" : "test_app",
            "hawtness" : "extreme"
        },

        "db" : {
            "host" : "127.0.0.1",
            "user" : "myuser",
            "pass" : "mypass",
            "db"   : "mydb"
        }
    }

You can then create environment specific config overrides; let's create a dev environment; create 
a folder called 'dev' in the config dir, and we add a db.js file with specific overrides for 
the dev environment. 

     module.exports = {
        "host" : "dev.db.com",
        "user" : "devuser",
        "pass" : "devpass"
    }

When you create a configr instance (as shown below) the internal structure will be as follows:

    {
        "general" : {
            "app_name" : "test_app",
            "hawtness" : "extreme"
        },

        "db" : {
            "host" : "dev.db.com", // Overriden
            "user" : "devuser", // Overriden
            "pass" : "devpass", // Overriden
            "db"   : "mydb"
        }
    }

## Usage

    // Create a new configr instance for the provided environment. This is any arbitary name; 
    // dev, staging, prod, etc. (you can have multiple configr instances that are independant 
    // of one another).

    var Configr = require("configr");

    var c = new Configr('/path/to/config/files');
	
    // Load the configuration

    // Access the configuration values
    c.get().db // will return { "host" : "127.0.0.1", "user" : "myuser", "pass" : "mypass", "db" : "mydb"}
    c.get().general.app_name // will return "test_app"

    // Load the configuration for the dev environment
    var c = new Configr('/path/to/config/files','dev');

    // Access the configuration values
    c.get().db // will return { "host" : "dev.db.com", "user" : "devuser", "pass" : "devpass", "db" : "mydb"}
    c.get().general.app_name // will return "test_app"


## Bugs

See <https://github.com/antz29/node-configr/issues>.
