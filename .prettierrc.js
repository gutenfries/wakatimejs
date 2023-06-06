module.exports = {
	$schema: 'http://json.schemastore.org/prettierrc',
	arrowParens: 'always',
	bracketSameLine: false,
	bracketSpacing: true,
	embeddedLanguageFormatting: 'auto',
	endOfLine: 'lf',
	htmlWhitespaceSensitivity: 'css',
	insertPragma: false,
	jsxSingleQuote: true,
	printWidth: 125,
	quoteProps: 'as-needed',
	semi: true,
	singleQuote: true,
	tabWidth: 4,
	trailingComma: 'es5',
	useTabs: true,
	vueIndentScriptAndStyle: false,
	overrides: [
		{
			files: [
				'nuget.config',
				'*.props',
				'*.filters',
				'*.vcxproj',
				'*.targets',
				'*.xaml',
				'packages.config',
				'*.appxmanifest',
			],
			options: {
				parser: 'xml',
			},
		},
		{
			files: ['*.yml', '*.yaml'],
			options: {
				singleQuote: false,
				useTabs: false,
				tabWidth: 2,
			},
		},
		{
			files: ['*.md', '*.html'],
			options: {
				singleQuote: false,
				printWidth: 100,
			},
		},
		{
			files: ['*.svg'],
			options: {
				parser: 'xml',
			},
		},
		{
			files: ['*.ejs'],
			options: {
				parser: 'glimmer',
			},
		},
	],
};

//
