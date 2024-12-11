const fs = require('fs-extra');
const path = require('path');

// Function to get all files recursively
const getAllFiles = async (dirPath, arrayOfFiles = []) => {
    const files = await fs.readdir(dirPath);

    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        if ((await fs.stat(fullPath)).isDirectory()) {
            arrayOfFiles = await getAllFiles(fullPath, arrayOfFiles);
        } else {
            arrayOfFiles.push(fullPath);
        }
    }

    return arrayOfFiles;
};

// Function to get relative paths for easier comparison
const getRelativePaths = (baseDir, files) => {
    return files.map(file => path.relative(baseDir, file));
};

// Main function to compare two folders
const compareFolders = async (folder1, folder2) => {
    const filesInFolder1 = await getAllFiles(folder1);
    const filesInFolder2 = await getAllFiles(folder2);

    const relativeFilesInFolder1 = getRelativePaths(folder1, filesInFolder1);
    const relativeFilesInFolder2 = getRelativePaths(folder2, filesInFolder2);

    const onlyInFolder1 = relativeFilesInFolder1.filter(file => !relativeFilesInFolder2.includes(file));
    const onlyInFolder2 = relativeFilesInFolder2.filter(file => !relativeFilesInFolder1.includes(file));

    console.log('Files only in Folder 1:');
    onlyInFolder1.forEach(file => console.log(file));

    console.log('\nFiles only in Folder 2:');
    onlyInFolder2.forEach(file => console.log(file));
};

const args = process.argv.slice(2);

if (args.length < 2) {
    console.error('Usage: node index.js <folder1> <folder2>');
    process.exit(1);
}

const [folder1, folder2] = args;

compareFolders(folder1, folder2).catch(console.error);
