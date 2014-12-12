var fs = require('fs');
var merge = require('merge');
var yaml = require('js-yaml');

module.exports = function(defaultFilename) {
	var filename = process.env.CONFIG || defaultFilename;
	if (!filename)
		throw new Error("Cannot determine where the config file is");

	var env = process.env.NODE_ENV || 'development';

	var content = fs.readFileSync(filename);
	var configs = yaml.load(content);

	if (!configs.hasOwnProperty(env))
		throw new Error("The config file doesn't have the environment " + env);

	return configs.hasOwnProperty('default') ?
		merge.recursive(configs['default'], configs[env]) :
		configs[env];
};
