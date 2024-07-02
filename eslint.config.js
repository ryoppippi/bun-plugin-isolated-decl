import { join } from 'node:path';
import { ryoppippi } from '@ryoppippi/eslint-config';

export default ryoppippi({
	svelte: false,
	typescript: {
		tsconfigPath: join(import.meta.dirname, 'tsconfig.json'),
	},
});
