# config-path

Loads a config based on a file (environment variable `CONFIG`) and the Node.js environment (environment variable `NODE_ENV`).

	npm install config-path --save

## Config file

This package exports a function which loads the file whose path is the environment variable `CONFIG`, or if undefined, is the argument to the function.

### Example

Given the file _./super-website/app.js_:

	var config = require('config-path')(__dirname + "/config.yml");
	var express = require('express');
	
	var app = express();
	app.set('port', config.express.port);
	...

the following command loads _/var/www/configs/super-website.yml_.:

	CONFIG=/var/www/configs/super-website.yml node ./super-website/app.js

and the following command loads _./super-website/config.yml_.:

	node ./super-website/app.js

## Config format

This package loads **YAML** files. Since **JSON** is a subset of YAML, JSON files are also accepted, moreover they can contain comments, which is not part of the JSON specs.

The file must describe an associative array where the keys are the available environments. `NODE_ENV` defines which environment is chosen, and an error is thrown if the environment is not available. Moreover, if the key `default` exists, it contains default values that are common to all environments.

If `NODE_ENV` is undefined, defaults to `development`.

### Example

	default:
	  express:
	    title: Super website
	  redis:
	    port: 6379
	
	development:
	  express:
	    port: 3000
	  redis:
	    host: localhost
	
	production:
	  express:
	    port: 80
	  redis:
	    host: databases.lan
	    port: 6382

will deliver when `NODE_ENV` is undefined:

	{
		express: {
			title: 'Super website',
			port: 3000
		},
		redis: {
			port: 6379,
			host: 'localhost'
		}
	}

and when `NODE_ENV` is `production`:

	{
		express: {
			title: 'Super website',
			port: 80
		},
		redis: {
			port: 6382,
			host: 'databases.lan'
		}
	}

## Test environment

In order to use a `test` environment when running the tests, you could write (for instance with [mocha](http://mochajs.org/)):

	"scripts": {
	  "test": "NODE_ENV=test mocha"
	}

Sadly this won't work on Windows. However, you can use [grunt-mocha-cli](https://www.npmjs.com/package/grunt-mocha-cli) that can run mocha with custom environment variables.

Moreover, you can use the following pattern in order to automatically append `-test` to the running `NODE_ENV`. This is especially useful if you have several "production" environments (e.g. `demo`, `user-acceptance`, `load-testing`...).

	grunt.initConfig({
		mochacli: {
			options: {
				env: {
					NODE_ENV: (process.env.NODE_ENV || 'development') + '-test'
				}
			}
		}
	});

## Several files in one project

You shouldn't require this module several times for the same config, because it will read and parse the config file every time. Instead, create the following file `./config.js`:

	module.exports = require('config-path')(__dirname + "/config.yml");

and in your files, write:

	var config = require("./config");

## License

Copyright (c) 2014 Bloutiouf aka Jonathan Giroux

[MIT licence](http://opensource.org/licenses/MIT)
