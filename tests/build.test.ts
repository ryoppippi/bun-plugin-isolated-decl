import path from 'node:path';
import { expect, test } from 'bun:test';
import dts from '../index.ts';

test('build', async () => {
	const input = path.resolve(__dirname, 'fixtures/main.ts');
	const dist = path.resolve(__dirname, 'out');

	await Bun.build({
		entrypoints: [input],
		outdir: dist,
		minify: false,
		plugins: [dts()],
		target: 'bun',
		external: ['*'],
	});

	const outputDts = await Bun.file(path.resolve(dist, 'main.d.ts')).text();
	expect(outputDts).toMatchSnapshot();
});