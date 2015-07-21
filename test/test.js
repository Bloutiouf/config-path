var assert = require('assert');
var configPath = require('../index');
var path = require('path');

describe('config-path', function() {
	it('loads config with the default environment', function() {
		var config = configPath();
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
		var config = configPath();
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
		delete process.env.NODE_ENV;
	});
	
	it('cannot load config with an unknown environment', function() {
		process.env.NODE_ENV = 'test';
		assert.throws(function() {
			var config = configPath();
		}, Error);
		delete process.env.NODE_ENV;
	});
	
	it('loads another config file specified with a file path', function() {
		var config = configPath(path.resolve(__dirname, 'other-config.yml'));
		assert.deepEqual(config, {
			answer: 42,
		});
	});
	
	it('loads another config file specified with a dir path', function() {
		var config = configPath(path.resolve(__dirname, 'dir'));
		assert.deepEqual(config, {
			foo: 'bar',
		});
	});
	
	it('loads another config file specified with CONFIG env var', function() {
		process.env.CONFIG = path.resolve(__dirname, 'other-config.yml');
		var config = configPath();
		assert.deepEqual(config, {
			answer: 42,
		});
	});
});
