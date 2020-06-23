const fetch = require('node-fetch');
const fs = require('fs');
const {JSDOM} = require("jsdom");
const pdf = require('html-pdf');
const htmlDocx = require('html-docx-js');
const {saveAs} = require('file-saver');
const size = "120"; 
const style = `<style id='wpdiscuz-frontend-rtl-css-inline-css' type='text/css'>
html {
font-size: ${size}%
}
</style>`;

const errors = [];
async function fetchAndSave(url,postId){
	const text = await fetch(url).then(res => res.text());
	const dom = new JSDOM(text);
	const title = dom.window.document.querySelector('.entry-header').innerHTML;
	const titleText = dom.window.document.querySelector('.entry-header h1').textContent.replace('/','\\');
	const body = dom.window.document.querySelector('.entry-content').innerHTML;
	const callback = (error,result) => {
		if(error){
			errors.push(postId);
		}
		else{
			console.log("Successfully download "+postId);
		}
	};
	return pdf.create(`<html dir="rtl">${style} ${title} ${body}</html>`,{"format": "Letter"}).
		toFile(`./posts_${size}/${postId}. ${titleText}.pdf`, callback);
}

async function getPagePosts(pageId){
	const page = await fetch("https://www.hasolidit.com/page/"+pageId).then(x=> x.text());
	const dom = new JSDOM(page);
	const htmlLinks = Array.from(dom.window.document.querySelectorAll(".entry-title a"));
	return htmlLinks.map(link => link.href);
}

const range = (min, max) => {
	const result = [];
	for (let i=min; i<=max; i++)
		result.push(i);
	return result;
}

const fmap = (arr, f) => arr.reduce( (acc, item) => {
	acc.push(...f(item))
	return acc;
},[]);

const identity = (x) => x;

async function getAllPostsLinks(){
	let result = [];
	const pages = range(1,40);
	return fmap(await Promise.all(pages.map(getPagePosts)), identity).reverse();
}

async function runInGroups(items, f, groups){
	if(items.length ===0) return;
	const itemsToRun = items.slice(0,groups);
	const tasks = itemsToRun.map(f);
	await Promise.all(tasks);
	const itemsLeft = items.slice(groups);
	return runInGroups(itemsLeft,f,groups);
}

getAllPostsLinks()
	.then(links => {
		const linksWithIds = links.map((link, id) => [link,id]);
		const linkHandler = ([link,id]) => fetchAndSave(link,id+1);
		return runInGroups(linksWithIds, linkHandler, 10);
	})
	.then(_=> {
	console.log("Errors");
	errors.forEach(x=>console.log(x))
});
