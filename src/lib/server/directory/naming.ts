// naming.ts <== naming the data that is being returned from the server

// The naming convention of this project is as follows:
// - Pattern: `{modpack}_{version}_{edition}_{world_name}.tar.xz`
// - Examples: `atm_atm10_v2.42_season2_main.tar.xz`, `tandem_create_season1_default.tar.xz`

function ensureValidName(name: string): string {
	// Ensure the name is a valid file name
	const invalidChars = /[<>:"/\\|?*]/g;
	const sanitized = name.replace(invalidChars, '_');
	return sanitized.trim();
}

// For the future, we can use this function to format filenames
// function formatFilename(modpack: string, version: string, edition: string, worldName: string): string {
//     // Format the filename according to the naming convention
//     const sanitizedModpack = ensureValidName(modpack);
//     const sanitizedVersion = ensureValidName(version);
//     const sanitizedEdition = ensureValidName(edition);
//     const sanitizedWorldName = ensureValidName(worldName);

//     return `${sanitizedModpack}_${sanitizedVersion}_${sanitizedEdition}_${sanitizedWorldName}.tar.xz`;
// }
function extractName(filename: string): {
	modpack: string;
	version: string;
	season: string;
	worldName: string;
} {
	// Extract the modpack, version, and world name from the filename
	const parts = filename.split('_');
	if (parts.length < 4) {
		throw new Error('Invalid filename format. Expected at least 4 parts.');
	}

	const modpack = ensureValidName(parts[0]);
	const version = ensureValidName(parts[1]);
	const season = ensureValidName(parts[2]);
	const worldName = ensureValidName(
		parts
			.slice(3)
			.join('_')
			.replace(/\.tar\.xz$/, '')
	);

	return { modpack, version, season, worldName };
}

export { ensureValidName, extractName };
