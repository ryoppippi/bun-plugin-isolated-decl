import dts from './index.ts';

/* eslint-disable ts/no-unsafe-assignment, ts/no-unsafe-member-access, ts/no-unsafe-argument */
const pkgJson = await Bun.file('./package.json').json();
const external = [
	...Object.keys(pkgJson?.dependencies ?? {}),
	...Object.keys(pkgJson?.devDependencies ?? {}),
	...Object.keys(pkgJson?.peerDependencies ?? {}),
];
/* eslint-enable ts/no-unsafe-assignment, ts/no-unsafe-member-access, ts/no-unsafe-argument */

await Bun.build({
	entrypoints: ['./index.ts'],
	outdir: './dist',
	minify: false,
	plugins: [dts()],
	target: 'bun',
	external,
});
