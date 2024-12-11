const fetch = require('node-fetch');
const {cookie} = require('./cred.js')
const fs = require("fs");
const outputFile = "./result.json";

const IS_DEBUG = true

const log = (msg) => IS_DEBUG ? console.log(msg): ""

const getSingleNote = async (id) =>{

    const note = await fetch("https://us.i.mi.com/note/note/"+id+"/?ts=1", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": cookie,
    "Referer": "https://us.i.mi.com/note/h5",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
}).then(x=>x.json())
const content = note?.data?.entry?.content;
const imageIds = note?.data?.entry?.setting?.data?.map(x=> x.fileId) || []
const images = (await Promise.all(imageIds.map(x=>getPhoto(x).catch(x=>"")))).filter(Boolean)

return { content, images}
}


const getAllNotes = async (syncTag) => {
    const url = `https://us.i.mi.com/note/full/page/?ts=1&${syncTag ? 'syncTag='+syncTag +'&': ''}limit=200`;
    log(url)
    const result = await fetch(url, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": cookie,
      "Referer": "https://us.i.mi.com/note/h5",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
}).then(x=>x.json());
log(result)
const items = result?.data?.entries?.map(x=>x.id) || []
const nextSyncTag = result?.data?.syncTag;
log(nextSyncTag)
return [...items, ...(items.length ? await getAllNotes(nextSyncTag) : [])]
}


const xAtAtime = async (x, arr, f) => {
    const current = arr.slice(0, x)
    const currentResult = await Promise.all(current.map(f))
    return [...currentResult, ...(current.length === x ? await xAtAtime(x, arr.slice(x), f) : [])];
}

const stringifyArr = (arr) => "["+arr.map(x=> JSON.stringify(x)).join(",")+"]"

async function getPhoto(id) {
    const url = "https://us.i.mi.com/file/full?type=note_img&fileid="+id
    const response = await fetch(url, {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": "\"Google Chrome\";v=\"107\", \"Chromium\";v=\"107\", \"Not=A?Brand\";v=\"24\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "cookie": cookie,
      "Referer": "https://us.i.mi.com/note/h5",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  },
  "body": null,
  "method": "GET"
})
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    return buffer.toString('base64')
}

(async function (){
    const allNotes = await getAllNotes()
    const allContent = await xAtAtime(10, allNotes, async noteId => {
        const note = await getSingleNote(noteId)
        const result = {noteId, ...note}
        
        fs.appendFileSync(outputFile, JSON.stringify(result))
        fs.appendFileSync(outputFile, "\n")
        log("Finished with " + noteId)
    })
    
    console.log(stringifyArr(allContent))
})()

/*
 *
    console.log(await (await getSingleNote(34281050323689824)).images[0])
    return;

    const imageBase64 = await getPhoto("1831886479.vKOZVkH_AJ8n_XG70I2Acg");
    console.log(imageBase64)

    return;
    
 *
 */
