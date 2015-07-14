var assert = require('assert');
var configPath = require('../index');
var path = require('path');

describe('config-path', function() {
	it('loads config with the default environment', function() {
		var config = configPath(__dirname);
		assert.deepEqual(config, {
			app: {
				title: "Super website",
			},
			listen: 3000,
			redis: {
				host: "localhost",
				port: 6379,
			},
		});
	});
	
	it('loads config with a specified environment with NODE_ENV', function() {
		process.env.NODE_ENV = 'production';
		var config = configPath(__dirname);
		assert.deepEqual(config, {
			app: {
				title: "Super website",
			},
			listen: 80,
			redis: {
				host: "databases.lan",
				port: 6379,
			},
		});
	});
	
	it('cannot load config with an unknown environment', function() {
		process.env.NODE_ENV = 'test';
		assert.throws(function() {
			var config = configPath(__dirname);
		}, Error);
	});
	
	it('loads another config file with CONFIG', function() {
		process.env.CONFIG = path.resolve(__dirname, 'other-config.yml');
		delete process.env.NODE_ENV;
		var config = configPath(__dirname);
		assert.deepEqual(config, {
			answer: 42,
		});
	});
});
