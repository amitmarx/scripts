const fs = require('fs')
const readline = require('readline')
var pdf = require("pdf-creator-node");


async function readLines(file) {
  const fileStream = fs.createReadStream(file);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  const result = [];
  for await (const line of rl) {
    result.push(line);
  }
  return result;
}

async function main1() {
  const options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "45mm",
      contents: '<div style="text-align: center;">Author: Shyam Hajare</div>',
    },
    footer: {
      height: "28mm",
      contents: {
        first: "Cover page",
        2: "Second page", // Any page number is working. 1-based index
        default:
          '<span style="color: #444;">{{page}}</span>/<span>{{pages}}</span>', // fallback value
        last: "Last Page",
      },
    },
  };

  const notesFile = (await readLines("./result-gili.json")).map(x=>JSON.parse(x));
  console.log(notesFile[0])
  const notes = notesFile.map((x) => {
    const prefix = x.content.slice(0, 20);
    return {
      ...x,
      title: prefix + (prefix === x.content ? "" : "..."),
    };
  });

  const template = fs.readFileSync('./template.html', 'utf-8')
  const document = {
    html: template,
    data: {
      notes
    },
    path: "./output.pdf",
    type: "",
  };

  pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.error(error);
  });
}

const escapeHtml = (unsafe) => {
  return unsafe;
    return unsafe.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
async function main() {
    const notesFile = (await readLines("./result-gili.json")).map(x=>JSON.parse(x));
    console.log(notesFile.length)
    const notes = notesFile.map((x) => {
        const content =  escapeHtml(x.content)
        const prefix = content.slice(0, 20) || "ללא שם";
      return {
        ...x,
        content: escapeHtml(content),
        title: (prefix === content ? "" : "...") + prefix ,
      };
    });
  
    const template = fs.readFileSync('./template.html', 'utf-8')

    const newline = '\n';
    const content = notes
      .map((note) => {
        return `
        <button class="collapsible" style="text-align: right;">${note.title}</button>
    <div class="content" dir="rtl">
      <p>${note.content}</p>
        ${note.images
          .map((base64) => `<img src="data:image/png;base64,${base64}"/>`)
          .join(newline)}
          </div>`
        ;
      })
      .join(newline);
    const output = template.replace("###content###", content);

    fs.writeFileSync('./output.html', output)

  }

main();
