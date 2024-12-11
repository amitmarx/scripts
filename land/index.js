const fetch = require('node-fetch');

const getAllMichrazim = async () => {
    const response = await fetch(
      "https://apps.land.gov.il/MichrazimSite/api/SearchApi/Search",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,he;q=0.8",
          "content-type": "application/json",
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://apps.land.gov.il/MichrazimSite/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: '{"ActiveQuickSearch":false,"FromVaadaDate":"2020-12-31T22:00:00.000Z","ActiveMichraz":false}',
        method: "POST",
        mode: "cors",
        credentials: "include",
      }
    );

    return response.json();
}

const getMichraz = async (id) => {
  try {
    const response = await fetch(
      "https://apps.land.gov.il/MichrazimSite/api/MichrazDetailsApi/Get?michrazID=" +
        id,
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,he;q=0.8",
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": '"macOS"',
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
        },
        referrer: "https://apps.land.gov.il/MichrazimSite/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    ).then((x) => x.json());

    return {
      michrazID: response.MichrazID,
      name: response.MichrazName,
      type: null,
      yechidotDiur: response.YechidotDiur,
      pirsumDate: response.PirsumDate,
      statusMichraz: response.StatusMichraz, //2 is נדון בוועדת מכרזים
      ptichaDate: response.PtichaDate,
      sgiraDate: response.SgiraDate,
    };
  } catch {
    return {};
  }
};

const xAtAtime = async (x, arr, f, i=0) => {
    console.log("batch:"+i)
    const current = arr.slice(0, x)
    const currentResult = await Promise.all(current.map(f))
    return [...currentResult, ...(current.length === x ? await xAtAtime(x, arr.slice(x), f, i+1) : [])];
}

const getYeshuvs = async () => {
    const response = await fetch(
      "https://apps.land.gov.il/MichrazimSite/api/YeshuvimApi/Get",
      {
        headers: {
          accept: "application/json, text/plain, */*",
          "accept-language": "en-US,en;q=0.9,he;q=0.8",
          "sec-ch-ua":
            '"Not?A_Brand";v="8", "Chromium";v="108", "Google Chrome";v="108"'
        },
        referrer: "https://apps.land.gov.il/MichrazimSite/",
        referrerPolicy: "strict-origin-when-cross-origin",
        body: null,
        method: "GET",
        mode: "cors",
        credentials: "include",
      }
    ).then((x) => x.json());


}


const main = async () => {
    const michrazim = await getAllMichrazim();
    const michrazimIds = michrazim.map((x) => x.MichrazID);
    console.log(michrazimIds); 
    
    const michrazimDetails = await xAtAtime(20, michrazimIds, getMichraz);
    console.log(michrazimDetails);
}

main()