const fetch = require("node-fetch");
const difflib = require('difflib');
const cluster = require('set-clustering');

async function getHuristicLocation(location){
    const result = await fetch(`https://www.google.com/search?q=${encodeURI(location)}&oq=${encodeURI(location)}`);

    function pickOneFromLargest(arr){
        const pickedArray = arr.reduce((selected, item)=> selected.length > item.length ? selected : item, [])
        return pickedArray[0]
    }

    const text = await result.text()
    const locationRegex = /(-?\d+(\.\d+)?)\.\s*(-?\d+(\.\d+)?),(-?\d+(\.\d+)?)\.\s*(-?\d+(\.\d+)?)/g
    const matches = text.match(locationRegex)
    const latitudes = matches.map(s=> s.split(',')[0])
    const longitudes = matches.map(s=> s.split(',')[1])
    const similarity = (x,y) => new difflib.SequenceMatcher(null, x, y).ratio()
    const latitudeCluster = cluster(latitudes, similarity)
    const longitudeCluster = cluster(longitudes, similarity)
    return {
        latitude: pickOneFromLargest(latitudeCluster.similarGroups(0.7)),
        longitude: pickOneFromLargest(longitudeCluster.similarGroups(0.7))
    }


}

async function getLocation(location){
    const response = await fetch("https://nominatim.openstreetmap.org/search/"+encodeURI(location)+"?" + new URLSearchParams({format: "json", limit: 1}))
    const responseJson = await response.json()
    return {
        latitude: responseJson[0].lat,
        longitude: responseJson[0].lon
    }
}
(async function(){
    const location = "Camp Nou Stadium"
    console.log(await getLocation(location))
    console.log(await getHuristicLocation(location))
})()
