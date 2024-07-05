import dts from './index.ts';

await Bun.build({
	entrypoints: ['./index.ts'],
	outdir: './dist',
	minify: false,
	plugins: [dts()],
	target: 'bun',
	external: ['*'],
});
