
const fs =require('fs');
const sourceDir = "/Users/amitm/Desktop/פלאפון אמא/Camera5";
const targetDir = "/Volumes/Elements/Amit/Pics/שרה - תמונות פלאפון /פלאפון אמא/Camera";

fs.readdir(sourceDir, (error,sourceFiles)=>{
	fs.readdir(targetDir, (error, targetFiles)=>{
		const diff = sourceFiles.filter(file=> !targetFiles.includes(file));
		fs.writeFile('diff.txt', diff, (error, data)=> console.log({data, error, source: sourceFiles.length, target: targetFiles.length}));
	})

})
