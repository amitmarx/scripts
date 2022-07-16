import fetch from 'node-fetch';


Date.prototype.addDays = function (days) {
    const date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};

const isAvaliable = async (restaurant, persons, date, time, area) => {
    const toDisplay = num => num<10 ? '0'+num : `${num}`;
    const body = {
        page_id: restaurant,
        locale:"en",
        criteria:{
            size: persons,
            date: `${date.getFullYear()}${toDisplay(date.getMonth()+1)}${toDisplay(date.getDate())}`,
            time
        }
    };
   console.log(body)
    const response = await fetch("https://ontopo.co.il/api/availability/searchAvailability", {
  "headers": {
    "content-type": "application/json"
  },
        body: JSON.stringify(body),
        method: "POST"
    }).then(x=> x.json());

  
    
    const options = area ? response?.areas?.find(a=> a.name ===area)?.options: response?.areas?.flatMap(a => a.options.map(x => ({area: a, ...x})));
    const option = options?.find(o => o.time === time);
    //console.log(options)
    return {
        isAvaliable: option?.method === "seat",
        ...option
    }
}

const findDayByHour = async (restaurant, persons, time, area, fromDate = new Date(), interval = 1) =>{
   const isFree = await isAvaliable(restaurant,persons, fromDate, time, area)

   return isFree.isAvaliable ? {
       date: fromDate,
       option: isFree }
        : findDayByHour(restaurant, persons, time, area, fromDate.addDays(interval), interval);

}

const getAllOptions = async (restaurant)=>{
    const toDisplay = num => num<10 ? '0'+num : `${num}`;
    const date = new Date();
    const body = {
        page_id:"cucinahess4",
        locale:"en",
        criteria:{
            size: '2',
            date: `${date.getFullYear()}${toDisplay(date.getMonth()+1)}${toDisplay(date.getDate())}`,
            time: '1900'
        }
    };
   console.log("#####",body)
    const response = await fetch("https://ontopo.co.il/api/availability/searchAvailability", {
  "headers": {
    "content-type": "application/json"
  },
        body: JSON.stringify(body),
        method: "POST"
    }).then(x=> x.json());
    console.log(response)
    return response?.area?.map(a=> a.id);
};


(async function(){
    //const date = await findDayByHour("cucinahess4","2","2100", "Inside")
    //console.log(await getAllOptions("cucinahess4"))
    const date = await findDayByHour("clarotlv","4","1100", null,new Date('06-17-2022'), 7)
    
    //const date = await findDayByHour("hasalon","2","2130", null, new Date('05-19-2022'), 7)
    console.log(JSON.stringify(date))
    //const findDayByHour("cucinahess4", "2", 20:30);

})();
