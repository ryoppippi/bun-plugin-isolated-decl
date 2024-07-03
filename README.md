# bun-plugin-isolated-decl

![NPM Version](https://img.shields.io/npm/v/bun-plugin-isolated-decl)

A Bun plugin for generating isolated declaration files (.d.ts) from TypeScript sources using the oxc-transformer. This is the Bun-specific version of [unplugin-isolated-decl](https://github.com/unplugin/unplugin-isolated-decl).

## Features

- ⚡ **Ultra-Fast**: Generates `.d.ts` files significantly faster than `tsc`
- 🔧 **Powered by oxc**: Utilizes the efficient [`oxc-transformer`](https://www.npmjs.com/package/oxc-transform) for blazing-fast performance
- 🔌 **Bun Integration**: Seamlessly integrates with Bun's build process
- 🚀 **Zero Config**: Works out of the box with no configuration required
- 🎯 **Focused Functionality**: Optimized for TypeScript 5.5's isolatedDeclarations option
- 🔄 **Ecosystem Compatibility**: Bun version of [`unplugin-isolated-decl`](https://github.com/unplugin/unplugin-isolated-decl/tree/main)

## Installation

```bash
bun add -d bun-plugin-isolated-decl
```

## Usage

Add the plugin to your Bun build configuration:

```typescript
import isolatedDecl from 'bun-plugin-isolated-decl';

await Bun.build({
	entrypoints: ['./index.ts'],
	outdir: './dist',
	plugins: [isolatedDecl()],
	// ... other configuration options
});
```

You can also check the example script: [build.ts](./build.ts).

### Options

You can pass options to the plugin:

```typescript
isolatedDecl({
	forceGenerate: true // Generate declaration files even if there are errors
});
```

| Option          | Type    | Default | Description                                                                   |
| --------------- | ------- | ------- | ----------------------------------------------------------------------------- |
| `forceGenerate` | boolean | `false` | If true, generates declaration files even when there are errors in the source |

## How it works

1. The plugin processes all entrypoints specified in your Bun build configuration.
2. For each entrypoint, it uses the oxc-transformer to generate isolated declaration files.
3. If errors are encountered and `forceGenerate` is false, it will log the errors and skip generation for that file.
4. Generated declaration files are written to the specified `outdir` with a `.d.ts` extension.

## Comparison with bun-plugin-dts

While both plugins aim to generate declaration files, they have some key differences:

1. **Speed**: `bun-plugin-isolated-decl` is significantly faster than `bun-plugin-dts` due to its use of oxc-transformer instead of tsc.

2. **Compatibility**:

   - `bun-plugin-dts` uses tsc and can generate types for all TypeScript code.
   - `bun-plugin-isolated-decl` is optimized for and limited to source code that is compatible with TypeScript 5.5's isolatedDeclarations option.

3. **Use Case**:
   - Choose `bun-plugin-dts` if you need comprehensive type generation for all TypeScript features.
   - Choose `bun-plugin-isolated-decl` if you prioritize speed and your codebase is compatible with isolated declarations.

## Limitations and Advantages

- **Limitation**: This plugin can only handle source code that is compatible with TypeScript 5.5's isolatedDeclarations option. It may not work for all TypeScript projects, especially those using advanced type features.

- **Advantage**: For compatible codebases, this plugin offers extremely fast declaration file generation, significantly outperforming traditional tsc-based solutions.

## Relationship to [`unplugin-isolated-decl`](https://github.com/unplugin/unplugin-isolated-decl/tree/main)

`bun-plugin-isolated-decl` is the Bun-specific implementation of [ `unplugin-isolated-decl` ](https://github.com/unplugin/unplugin-isolated-decl).

## License

MIT License

## Author

ryoppippi

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Issues

If you find a bug or have a suggestion, please file an issue on the GitHub repository.
