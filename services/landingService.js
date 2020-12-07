import { executeQuery, executeCachedQuery } from "../database/database.js";

const getToday = async () => {
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();
      let Today = yyyy + '-' + mm + '-' + dd;
      return Today;
  };

const getTesterday = async () => {
    var yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    var dd = String(yesterday.getDate()).padStart(2, '0');
    var mm = String(yesterday.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = yesterday.getFullYear();
    let Yesterday = yyyy + '-' + mm + '-' + dd;
    return Yesterday;
};
  

const calcTrendInfo = async () => {
    const Today = await getToday();
    const Yesterday = await getTesterday();
    const Todaymood = await executeCachedQuery("SELECT (mgenericmood+mgenericmood)/2 AS avgmood FROM reports WHERE date = $1;", Today);
    const Yesterdaymood = await executeCachedQuery("SELECT (mgenericmood+mgenericmood)/2 AS avgmood FROM reports WHERE date = $1;", Yesterday);
    const data = {
        todaymood: null,
        yesterdaymood: null,
        trend: null,
        notodaydata: null,
        noyesterdaydata: null
    }
    console.log(Todaymood.rowsOfObjects()[0]);
    if (Todaymood.rowsOfObjects()[0] === undefined) {
        data.notodaydata = 'No data for today!';
    }
    if (Yesterdaymood.rowsOfObjects()[0] === undefined) {
        data.noyesterdaydata = 'No data for yesterday!';
    }
    if (Todaymood.rowsOfObjects()[0] !== undefined && Yesterdaymood.rowsOfObjects()[0] !== undefined) {
        data.todaymood = Number(Todaymood.rowsOfObjects()[0].avgmood).toFixed(1);
        data.yesterdaymood = Number(Yesterdaymood.rowsOfObjects()[0].avgmood).toFixed(1);
        if (data.yesterdaymood > data.todaymood) {
            data.trend = 'Things are looking gloomy today...';
        } else if (data.yesterdaymood < data.todaymood) {
            data.trend = 'Things are looking bright today!';
        } else {
            data.trend = 'Things are looking the same today.'
        }
    }
    return data;
};

export { calcTrendInfo };
