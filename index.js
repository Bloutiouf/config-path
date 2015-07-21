var fs = require('fs');
var path = require('path');
var yaml = require('js-yaml');

module.exports = function(defaultFilename) {
	var filename = process.env.CONFIG || defaultFilename || process.cwd();

	var stats = fs.statSync(filename);
	if (stats.isDirectory())
		filename = path.join(filename, 'config.yml');
	
	var content = fs.readFileSync(filename);
	var configs = yaml.load(content);

	var env = process.env.NODE_ENV || 'development';
	if (!configs.hasOwnProperty(env))
		throw new Error("The config file doesn't have the environment " + env);

	return configs[env];
};
