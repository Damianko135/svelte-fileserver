// naming.ts <== naming the data that is being returned from the server

// The naming convention of this project is as follows:
// - Pattern: `{modpackGroup}_{modpack}_{version}_{edition}_{world_name}.tar.xz`
// - Examples: `atm_atm10_v2.42_season2_main.tar.xz`, `tandem_create_season1_default.tar.xz`

function ensureValidName(name: string): string {
	// Ensure the name is a valid file name
	const invalidChars = /[<>:"/\\|?*]/g;
	const sanitized = name.replace(invalidChars, '_');
	return sanitized.trim();
}

function extractName(filename: string): {
	modpackGroup: string;
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

	const modpackGroup = ensureValidName(parts[0]);
	const modpack = ensureValidName(parts[1]);
	const version = ensureValidName(parts[2]);
	const season = ensureValidName(parts[3]);
	const worldName = ensureValidName(
		parts
			.slice(3)
			.join('_')
			.replace(/\.tar\.xz$/, '')
	);

	return { modpackGroup, modpack, version, season, worldName };
}

export { ensureValidName, extractName };
