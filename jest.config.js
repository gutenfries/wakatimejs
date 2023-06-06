/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

module.exports = {
	// All imported modules in your tests should be mocked automatically
	// automock: false,

	// Automatically clear mock calls, instances, contexts and results before every test
	clearMocks: true,

	// Indicates whether the coverage information should be collected while executing the test
	collectCoverage: true,

	// An array of glob patterns indicating a set of files for which coverage information should be collected
	// collectCoverageFrom: undefined,

	// The directory where Jest should output its coverage files
	coverageDirectory: 'coverage',

	// Indicates which provider should be used to instrument code for coverage
	coverageProvider: 'v8',

	// A set of global variables that need to be available in all test environments
	// globals: {},

	// An array of file extensions your modules use
	moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'ts', 'tsx'],

	// Activates notifications for test results
	notify: false,

	// The glob patterns Jest uses to detect test files
	testMatch: ['**/tests/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)', '**/?test.[tj]s?(x)'],
};
