module.exports = {
	// es6: true,
	root: true,
	extends: ['eslint:recommended', 'prettier'],
	parserOptions: {
		ecmaVersion: 2020,
		parser: 'babel-eslint',
	},
	env: {
		browser: true,
		node: true,
	},
	plugins: ['prettier'],
	globals: {},
	rules: {
		'prettier/prettier': 'warn',
		'class-methods-use-this': 'off',
		'no-param-reassign': 'off',
		camelcase: 'off',
		'no-unused-vars': 'off',
	},
};
