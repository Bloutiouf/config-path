# config-path

Loads a config based on a file (overridable by the environment variable `CONFIG`) and the Node.js environment (environment variable `NODE_ENV`).

	npm install config-path --save

## Config file

This module exports a `function(filename)` which loads a config file.

`filename` is the path to the YAML file. If it points to a directory, it loads the config file _config.yml_ inside this directory. If it's undefined, it defaults to the process's current working directory

In any case, the value of `filename` can be overriden by the environment variable `CONFIG`.

If the config file does not exist, `ENOENT` is thrown.

### Example

Given the file _./super-website/app.js_:

	var config = require('config-path')();
	var express = require('express');
	
	var app = express();
	...
	app.listen(config.listen);

the following command loads _./config.yml_:

	node ./super-website/app.js

the following command loads _./super-website/config.yml_:

	cd super-website && node ./app.js

the following command loads _/var/www/configs/super-website.yml_:

	CONFIG=/var/www/configs/super-website.yml node ./super-website/app.js

## Config format

This package loads **YAML** files. Since **JSON** is a subset of YAML, JSON files are also accepted. And because it's still YAML, JSON files can contain comments too!

The file must describe an associative array where the keys are the available environments. `NODE_ENV` defines which environment is chosen. If `NODE_ENV` is undefined, defaults to `development`. An `Error` is thrown if the environment is not available.

As part of the YAML specs, you can use anchors and references to specify variables across environments.

### Example

	development: &development
	  app:
	    title: Super website
	  listen: 3000
	  redis: &redis
	    host: localhost
	    port: 6379
	
	production:
	  <<: *development
	  listen: 80
	  redis:
	    <<: *redis
	    host: databases.lan


will deliver when `NODE_ENV` is undefined or is `development`:

	{
		app: {
			title: "Super website",
		},
		listen: 3000,
		redis: {
			host: "localhost",
			port: 6379,
		},
	}

and when `NODE_ENV` is `production`:

	{
		app: {
			title: "Super website",
		},
		listen: 80,
		redis: {
			host: "databases.lan",
			port: 6379,
		},
	}

## Test environment

In order to use a `test` environment when running the tests, you could write (for instance with [mocha](http://mochajs.org/)):

	"scripts": {
	  "test": "NODE_ENV=test mocha"
	}

Sadly this won't work on Windows. However, you can use [grunt-mocha-cli](https://www.npmjs.com/package/grunt-mocha-cli) that can run mocha with custom environment variables.

Moreover, you can use the following pattern in order to automatically append `-test` to the running `NODE_ENV`. This is especially useful if you have several staging environments (e.g. `user-acceptance`, `load-testing`, `demo`...).

	grunt.initConfig({
		mochacli: {
			options: {
				env: {
					NODE_ENV: (process.env.NODE_ENV || 'development') + '-test'
				}
			}
		}
	});

## Config required from multiple files

You shouldn't require this module several times for the same config, because it will read and parse the config file every time. Instead, create the following file _./config.js_:

	module.exports = require('config-path')(PATH_TO_CONFIG_YML);

and in your files, write:

	var config = require('./config');

## License

Copyright (c) 2014 Bloutiouf aka Jonathan Giroux

[MIT licence](http://opensource.org/licenses/MIT)
