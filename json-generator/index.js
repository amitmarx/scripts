const commandLineArgs = require('command-line-args')
const sizeof = require('object-sizeof')
const chance = new require('chance')();
const fs = require('fs');

const optionDefinitions=[
    { name: 'size', alias: 's', type: Number },
    { name: 'output', alias:'o', type: String}
]

const {size= 10, output= 'output.json' } = commandLineArgs(optionDefinitions)
const sizeInBytes = size*1000000
let result = [];

//console.log(output, sizeof(result), {size})

function randomUser(){
    return {
        name: chance.name(),
        age: chance.age(),
    }
}

while(sizeof(result) < sizeInBytes){
    result.push(randomUser())
    const temp = []
    temp[0] = result
    temp[1] = result
    result = temp
}

//console.log(sizeof(result))
fs.writeFileSync(output, JSON.stringify(result))


