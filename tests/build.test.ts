import fs from 'node:fs/promises';
import path from 'node:path';
import { Glob } from 'bun';
import { expect, test } from 'bun:test';
import dts from '../index.ts';

const dist = path.resolve(__dirname, 'out');

test('build single entrypoint', async () => {
	const input = path.resolve(__dirname, 'fixtures/main.ts');

	await fs.rm(dist, { recursive: true, force: true });

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await fs.readFile(path.resolve(dist, 'main.d.ts'), 'utf-8');
	expect(outputDts).toMatchSnapshot();
});

test('build with glob entrypoints', async () => {
	const glob = new Glob(path.resolve(__dirname, 'fixtures/*.ts'));
	const entrypoints = [];
	for await (const file of glob.scan('.')) {
		entrypoints.push(file);
	}

	await fs.rm(dist, { recursive: true, force: true });

	await Bun.build({
		entrypoints,
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await fs.readFile(path.resolve(dist, 'main.d.ts'), 'utf-8');
	expect(outputDts).toMatchSnapshot();
});

test('build nested entrypoint', async () => {
	const input = path.resolve(__dirname, 'fixtures/folder/child.ts');

	await fs.rm(dist, { recursive: true, force: true });

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await fs.readFile(path.resolve(dist, 'child.d.ts'), 'utf-8');
	expect(outputDts).toMatchSnapshot();
});

test('build with custom outdir', async () => {
	const input = path.resolve(__dirname, 'fixtures/folder/child.ts');

	await fs.rm(dist, { recursive: true, force: true });

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts({ outdir: 'dts' })],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await fs.readFile(path.resolve(dist, 'dts', 'child.d.ts'), 'utf-8');
	expect(outputDts).toMatchSnapshot();
});

test('build with custom outdir and root', async () => {
	const input = path.resolve(__dirname, 'fixtures/folder/child.ts');

	await fs.rm(dist, { recursive: true, force: true });

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts({ outdir: 'dts' })],
		target: 'bun',
		root: 'tests/fixtures',
		external: ['*'],
	});

	const outputDts = await fs.readFile(path.resolve(dist, 'dts', 'folder', 'child.d.ts'), 'utf-8');
	expect(outputDts).toMatchSnapshot();
});
