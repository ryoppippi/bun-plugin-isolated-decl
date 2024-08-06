import path from 'node:path';
import { oxcTransform } from 'unplugin-isolated-decl/api';
import { type BunPlugin, Glob } from 'bun';

// @ts-expect-error no type
import _isGlob from 'is-glob';

// eslint-disable-next-line ts/no-unsafe-assignment
const isGlob: (str: string) => boolean = _isGlob;

export type TransformResult = {
	sourceText: string;
	errors: string[];
};

type Entry = {
	id: string;
	source: string;
};

/**
 * Options for the plugin
 */
type Options = {
	/** generate declaration files even though there are errors */
	forceGenerate?: boolean;
};

function isolatedDecl(options: Options = {}): BunPlugin {
	return ({
		name: 'bun-plugin-isolated-decl',
		async setup(build): Promise<void> {
			const entrypoints = [...build.config.entrypoints].sort();
			const entriies: Entry[] = [];
			const outdir = (build.config?.outdir ?? './out');
			const resolvedOptions = { forceGenerate: false, ...options } satisfies Options;

			for (const entry of entrypoints) {
				if (isGlob(entry)) {
					const globs = new Glob(entry);
					for await (const entry of globs.scan()) {
						const source = await Bun.file(entry).text();
						entriies.push({ id: entry, source });
					}
				}
				else {
					const source = await Bun.file(entry).text();
					entriies.push({ id: entry, source });
				}
			}

			await Promise.all(
				entriies.map(async ({ id, source }) => {
					const { sourceText, errors } = oxcTransform(id, source);
					if (errors.length > 0) {
						console.error(`Error in ${id}`);
						for (const error of errors) {
							console.error(error);
						}
						/* If there are errors, we don't want to generate declaration files */
						if (!resolvedOptions.forceGenerate) {
							return;
						}
					}

					const dtsID = id
						.replace(/^.*\//, '')
						.replace(/\.[jtm]s$/, '.d.ts');
					return Bun.write(path.resolve(outdir, dtsID), sourceText);
				}),
			);
		},
	});
}

export default isolatedDecl;
