import path from 'node:path';
import { $, Glob } from 'bun';
import { expect, test } from 'bun:test';
import dts from '../index.ts';

test('build', async () => {
	const input = path.resolve(__dirname, 'fixtures/main.ts');
	const dist = path.resolve(__dirname, 'out');

	await $`rm -rf ${dist}`;

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await $`cat ${path.resolve(dist, 'main.d.ts')}`.text();
	expect(outputDts).toMatchSnapshot();
});

test('build with glob path', async () => {
	// const input = path.resolve(__dirname, 'fixtures/*.ts');
	const dist = path.resolve(__dirname, 'out');

	const entrypoints = [];
	const glob = new Glob(path.resolve(__dirname, 'fixtures/*.ts'));
	for await (const file of glob.scan('.')) {
		entrypoints.push(file);
	}

	await $`rm -rf ${dist}`;

	await Bun.build({
		entrypoints,
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await $`cat ${path.resolve(dist, 'main.d.ts')}`.text();
	expect(outputDts).toMatchSnapshot();
});
