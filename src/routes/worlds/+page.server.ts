export const prerender = false;
import type { PageServerLoad } from './$types';

import { extractName } from '$lib/server/directory/naming';
import { indexDirectory, WORLDS_DIRECTORY } from '$lib/server/directory/indexing';

export const load: PageServerLoad = async () => {
	const worlds = [];
	try {
		const { files } = indexDirectory(WORLDS_DIRECTORY);
		for (const filePath of files) {
			if (filePath.endsWith('.tar.xz')) {
				const fileName = filePath.split(/[\\/]/).pop() || filePath;
				try {
					const meta = extractName(fileName);
					worlds.push({
						filename: fileName,
						...meta
					});
				} catch (err) {
					console.error(`Error extracting name from file ${fileName}:`, err);
					continue;
				}
			}
		}
		// console.log(JSON.stringify(worlds, null, 2));
		return { worlds };
	} catch (error) {
		console.error('Error locating directory:', error);
		return { worlds: [] };
	}
};
