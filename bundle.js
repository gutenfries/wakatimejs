const estrella = require('estrella');

const base = {
	entry: 'src/index.ts',
	bundle: true,
	sourcemap: true,
};

estrella.build({
	...base,
	outfile: 'dist/browser/bundle.js',
	format: 'iife',
	tsconfig: 'tsconfig.browser.json',
	onEnd(config) {
		const dtsFilesOutdir = estrella.dirname(config.outfile);
		generateTypeDefs(estrella.tsconfig(config), config.entry, dtsFilesOutdir);
	},
});

estrella.build({
	...base,
	outfile: 'dist/node/index.js',
	format: 'cjs',
	tsconfig: 'tsconfig.node.json',
	onEnd(config) {
		const dtsFilesOutdir = estrella.dirname(config.outfile);
		generateTypeDefs(estrella.tsconfig(config), config.entry, dtsFilesOutdir);
	},
});

function generateTypeDefs(tsconfig, entryfiles, outdir) {
	const filenames = Array.from(
		new Set((Array.isArray(entryfiles) ? entryfiles : [entryfiles]).concat(estrella.tsconfig.include || []))
	).filter((v) => v);
	estrella.log.info('Generating type declaration files for', filenames.join(', '));
	const compilerOptions = {
		...estrella.tsconfig.compilerOptions,
		moduleResolution: undefined,
		declaration: true,
		outDir: outdir,
	};
	const program = estrella.ts.ts.createProgram(filenames, compilerOptions);
	const targetSourceFile = undefined;
	const writeFile = undefined;
	const cancellationToken = undefined;
	const emitOnlyDtsFiles = true;
	program.emit(targetSourceFile, writeFile, cancellationToken, emitOnlyDtsFiles);
	estrella.log.info('Wrote', estrella.glob(outdir + '/*.d.ts').join(', '));
}
