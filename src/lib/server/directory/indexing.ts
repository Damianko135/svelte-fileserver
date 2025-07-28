import fs from 'fs';
import path from 'path';
import { env } from '$env/dynamic/private';
const WORLDS_DIRECTORY = env.WORLDS_DIRECTORY || process.cwd();

function locateDirectory(directory: string): string | null {
	const dirPath = path.resolve(directory);
	if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
		return dirPath;
	}
	return null;
}

function readDirectory(directory: string): fs.Dirent[] {
	const dirPath = locateDirectory(directory);
	if (!dirPath) {
		throw new Error(`Directory not found: ${directory}`);
	}
	return fs.readdirSync(dirPath, { withFileTypes: true });
}

function getMetadata(filePath: string): fs.Stats {
	if (!fs.existsSync(filePath)) {
		throw new Error(`File not found: ${filePath}`);
	}
	return fs.statSync(filePath);
}

function indexDirectory(directory: string): {
	files: string[];
	metadata: Record<string, fs.Stats>;
} {
	const dirPath = locateDirectory(directory);
	if (!dirPath) {
		throw new Error(`Directory not found: ${directory}`);
	}

	const dirents = readDirectory(dirPath);
	const files: string[] = [];
	const metadata: Record<string, fs.Stats> = {};

	for (const dirent of dirents) {
		if (dirent.isFile()) {
			const fullPath = path.join(dirPath, dirent.name);
			files.push(fullPath);
			metadata[fullPath] = getMetadata(fullPath);
		} else if (dirent.isDirectory()) {
			const subDirPath = path.join(dirPath, dirent.name);
			const subDirIndex = indexDirectory(subDirPath);
			files.push(...subDirIndex.files);
			Object.assign(metadata, subDirIndex.metadata);
		}
	}

	return { files, metadata };
}

export { locateDirectory, readDirectory, getMetadata, indexDirectory, WORLDS_DIRECTORY };
