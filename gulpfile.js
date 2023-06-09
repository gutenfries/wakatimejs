const gulp = require('gulp');
const tsc = require('gulp-typescript');
const esbuild = require('gulp-esbuild');

function bundleBrowser() {
	return gulp
		.src('index.ts')
		.pipe(
			esbuild({
				tsconfig: 'tsconfig.browser.json',
				outfile: 'bundle.js',
				sourcemap: 'external',
				format: 'iife',
				minify: true,
				bundle: true,
				globalName: 'lib',
				loader: {
					'.ts': 'ts',
					'.json': 'json',
				},
			})
		)
		.pipe(gulp.dest('dist/browser'));
}

function bundleNode() {
	return gulp.src('**/*.ts').pipe(tsc('tsconfig.node.json')).pipe(gulp.dest('dist/node'));
}

function watch() {
	return gulp.watch('**/*.ts', bundle);
}

const bundle = gulp.parallel(bundleBrowser, bundleNode);

exports.bundle = bundle;
exports.watch = gulp.series(bundle, watch);
