import path from 'node:path';
import { oxcTransform } from 'unplugin-isolated-decl/api';
import type { BunPlugin } from 'bun';

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
			const outdir = (build.config?.outdir ?? './dist');
			const resolvedOptions = { forceGenerate: false, ...options } satisfies Options;

			for (const entry of entrypoints) {
				const source = await Bun.file(entry).text();
				entriies.push({ id: entry, source });
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
					return Bun.write(path.join(outdir, dtsID), sourceText);
				}),
			);
		},
	});
}

export default isolatedDecl;
