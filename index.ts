import type { BunPlugin } from 'bun';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { Glob } from 'bun';
// @ts-expect-error no type
import _isGlob from 'is-glob';
import { oxcTransform } from 'unplugin-isolated-decl/api';

// eslint-disable-next-line ts/no-unsafe-assignment
const isGlob: (str: string) => boolean = _isGlob;

export type TransformResult = {
	code: string;
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
	outdir?: string;
};

function isolatedDecl(options: Options = {}): BunPlugin {
	return {
		name: 'bun-plugin-isolated-decl',
		async setup(build): Promise<void> {
			const entrypoints = [...build.config.entrypoints].sort();
			const entriies: Entry[] = [];
			const _basedir = build.config?.outdir ?? './out';
			const outdir = (options.outdir != null) ? path.join(_basedir, options.outdir) : _basedir;
			const resolvedOptions = {
				forceGenerate: false,
				...options,
			} satisfies Options;

			for (const entry of entrypoints) {
				if (isGlob(entry)) {
					const globs = new Glob(entry);
					for await (const entry of globs.scan()) {
						const file = Bun.file(entry);
						if (!(await file.exists())) {
							console.error(`File ${entry} does not exist`);
							continue;
						}
						const source = await file.text();
						entriies.push({ id: entry, source });
					}
				}
				else {
					const file = Bun.file(entry);
					if (!(await file.exists())) {
						console.error(`File ${entry} does not exist`);
						continue;
					}
					const source = await file.text();
					entriies.push({ id: entry, source });
				}
			}

			for (const { id, source } of entriies) {
				const { code, errors } = await oxcTransform(id, source);
				if (errors.length > 0) {
					console.error(`Error in ${id}`);
					for (const error of errors) {
						console.error(error);
					}
					/* If there are errors, we don't want to generate declaration files */
					if (!resolvedOptions.forceGenerate) {
						continue;
					}
				}
				const root = build.config?.root ?? '';
				const dtsID = (root.length > 0)
					? path.relative(root, id).replace(/\.[jtm]s$/, '.d.ts')
					: path.basename(id).replace(/\.[jtm]s$/, '.d.ts');
				const _savepath = path.resolve(outdir, dtsID);
				const _dirpath = path.dirname(_savepath);
				await mkdir(_dirpath, { recursive: true });
				await writeFile(_savepath, code);
			}
		},
	};
}

export default isolatedDecl;
