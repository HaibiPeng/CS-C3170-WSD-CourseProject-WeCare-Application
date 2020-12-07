import { executeQuery, executeCachedQuery } from "../database/database.js";

Date.prototype.getWeek = function() {
    var date = new Date(this.getTime());
    date.setHours(0, 0, 0, 0);
    // Thursday in current week decides the year.
    date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
    // January 4 is always in week 1.
    var week1 = new Date(date.getFullYear(), 0, 4);
    // Adjust to Thursday in week 1 and count number of weeks from date to week1.
    return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  }

//get date range from week number
function getDateRangeOfWeek(weekNo, y) {
    var d1, numOfdaysPastSinceLastMonday, rangeIsFrom, rangeIsTo;
    d1 = new Date(''+y+'');
    numOfdaysPastSinceLastMonday = d1.getDay() - 1;
    d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
    d1.setDate(d1.getDate() + (7 * (weekNo - d1.getWeek())));
    rangeIsFrom = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
    d1.setDate(d1.getDate() + 7);
    rangeIsTo = d1.getFullYear() + "-" + (d1.getMonth() + 1) + "-" + d1.getDate();
    return [rangeIsFrom, rangeIsTo];
};

function getDateRangeOfMonth(monthNo, y) {
    var formatted_date = function(date){
        var m = ("0"+ (date.getMonth()+1)).slice(-2); // in javascript month start from 0.
        var d = ("0"+ date.getDate()).slice(-2); // add leading zero 
        var y = date.getFullYear();
        return  y +'-'+m+'-'+d; 
    }    
        var first_day = new Date(y, monthNo, 1); 
        var last_day = new Date(y, monthNo + 1 , 0);    
        var month_start_date =formatted_date(first_day);   
        var month_end_date =formatted_date(last_day);
        return [month_start_date, month_end_date];
    };    

const getWeek = async (dt) => {
     var tdt = new Date(dt.valueOf());
     var dayn = (dt.getDay() + 6) % 7;
     tdt.setDate(tdt.getDate() - dayn + 3);
     var firstThursday = tdt.valueOf();
     tdt.setMonth(0, 1);
     if (tdt.getDay() !== 4) {
      tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
    }
    //return String(dt.getFullYear()) + '-W' + String( Math.ceil((firstThursday - tdt) / 604800000));
    return [dt.getFullYear(), 1 + Math.ceil((firstThursday - tdt) / 604800000)];
};

const getMonth = async () => {
    var today = new Date();
    var mm = String(today.getMonth()).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    if (mm === '01') {
        mm = '12';
        yyyy = (Number(yyyy) - 1).toString();
    }
    let Month = yyyy + '-' + mm;
    return Month;
};

const getTimeData = async ({request, session}) => {
    var myDate=new Date();
    let Week = await getWeek(myDate);
    let lastmonth = await getMonth();
    let lastweek = '';
    if (Week[1] ===  53 ) {
        Week[0] = Week[0] - 1;
    }
    if (Week[1] === 1) {
        myDate.setDate(myDate.getDate()-7)
        let Week = await getWeek(myDate);
        lastweek = String(Week[0]-1)+'-W'+String(Week[1]);
    } else {
        lastweek = String(Week[0])+'-W'+String(Week[1]-1).padStart(2, '0');
    }
    const data = {
        week: lastweek,
        month: lastmonth,
        weekrange: getDateRangeOfWeek(Number(lastweek.substring(6,8)), Number(lastweek.substring(0,4))),
        monthrange: getDateRangeOfMonth(Number(lastmonth.substring(5,7)-1), Number(lastweek.substring(0,4)))
    }
   
    if (request) {
      const body = request.body();
      const params = await body.value;
      data.week = params.get("week");
      data.month = params.get("month");
      data.weekrange = getDateRangeOfWeek(Number(data.week.substring(6,8)), Number(data.week.substring(0,4)));
      data.monthrange = getDateRangeOfMonth(Number(data.month.substring(5,7)-1), Number(data.month.substring(0,4)));
      }
    return data;
  };

  const calcWeekInfo = async (weekrange, userID) => {
    /*
    const Avgwsd = await executeCachedQuery("SELECT AVG(sleepduration) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
    const Avgwset = await executeCachedQuery("SELECT AVG(sporttime) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
    const Avgwst = await executeCachedQuery("SELECT AVG(studytime) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
    const Avgwsq = await executeCachedQuery("SELECT AVG(sleepquality) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
    const Avgwgm = await executeCachedQuery("SELECT AVG((mgenericmood+mgenericmood)/2) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
    const data = {
        avgwsd: Number(Avgwsd.rowsOfObjects()[0].avg).toFixed(1),
        avgwset: Number(Avgwset.rowsOfObjects()[0].avg).toFixed(1),
        avgwst: Number(Avgwst.rowsOfObjects()[0].avg).toFixed(1),
        avgwsq: Number(Avgwsq.rowsOfObjects()[0].avg).toFixed(1),
        avgwgm: Number(Avgwgm.rowsOfObjects()[0].avg).toFixed(1),
        noweeklydata: null
    }
    if (Avgwsd.rowsOfObjects()[0].avg === null) {
        console.log(1);
        data.noweeklydata = 'No data for that week!';
    }
    */
   const Avg = await executeCachedQuery("SELECT round(AVG(sleepduration)::numeric,1) as avgwsd, round(AVG(sporttime)::numeric,1) as avgwset, round(AVG(studytime)::numeric,1) as avgwst, round(AVG(sleepquality)::numeric,1) as avgwsq, round(AVG((mgenericmood+mgenericmood)/2)::numeric,1) as avgwgm FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", weekrange[0], weekrange[1], userID);
   const data = {
    avgwsd: Avg.rowsOfObjects()[0].avgwsd,
    avgwset: Avg.rowsOfObjects()[0].avgwset,
    avgwst: Avg.rowsOfObjects()[0].avgwst,
    avgwsq: Avg.rowsOfObjects()[0].avgwsq,
    avgwgm: Avg.rowsOfObjects()[0].avgwgm,
    noweeklydata: null
   }
   if (Avg.rowsOfObjects()[0].avgwsd === null) {
    data.avgwsd = 0;
    data.avgwset = 0;
    data.avgwst = 0;
    data.avgwsq = 0;
    data.avgwgm = 0;
    data.noweeklydata = 'No data for that week!';
}
    return data;
};

const calcMonthInfo = async (monthrange, userID) => {
    /*
    const Avgmsd = await executeCachedQuery("SELECT AVG(sleepduration) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
    const Avgmset = await executeCachedQuery("SELECT AVG(sporttime) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
    const Avgmst = await executeCachedQuery("SELECT AVG(studytime) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
    const Avgmsq = await executeCachedQuery("SELECT AVG(sleepquality) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
    const Avgmgm = await executeCachedQuery("SELECT AVG((mgenericmood+mgenericmood)/2) FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
    const data = {
        avgmsd: Number(Avgmsd.rowsOfObjects()[0].avg).toFixed(1),
        avgmset: Number(Avgmset.rowsOfObjects()[0].avg).toFixed(1),
        avgmst: Number(Avgmst.rowsOfObjects()[0].avg).toFixed(1),
        avgmsq: Number(Avgmsq.rowsOfObjects()[0].avg).toFixed(1),
        avgmgm: Number(Avgmgm.rowsOfObjects()[0].avg).toFixed(1),
        nomonthlydata: null
    }
    if (Avgmsd.rowsOfObjects()[0].avg === null) {
        console.log(1);
        data.nomonthlydata = 'No data for that month!';
    }
    */
   const Avg = await executeCachedQuery("SELECT round(AVG(sleepduration)::numeric,1) as avgmsd, round(AVG(sporttime)::numeric,1) as avgmset, round(AVG(studytime)::numeric,1) as avgmst, round(AVG(sleepquality)::numeric,1) as avgmsq, round(AVG((mgenericmood+mgenericmood)/2)::numeric,1) as avgmgm FROM reports WHERE date BETWEEN $1 AND $2 AND user_id=$3;", monthrange[0], monthrange[1], userID);
   const data = {
    avgmsd: Avg.rowsOfObjects()[0].avgmsd,
    avgmset: Avg.rowsOfObjects()[0].avgmset,
    avgmst: Avg.rowsOfObjects()[0].avgmst,
    avgmsq: Avg.rowsOfObjects()[0].avgmsq,
    avgmgm: Avg.rowsOfObjects()[0].avgmgm,
    nomonthlydata: null
   }
   if (Avg.rowsOfObjects()[0].avgmsd === null) {
    data.avgmsd = 0;
    data.avgmset = 0;
    data.avgmst = 0;
    data.avgmsq = 0;
    data.avgmgm = 0;
    data.nomonthlydata = 'No data for that month!';
}
   return data;
};

const calcAllUsersInfo = async () => {
    const Avg = await executeCachedQuery("SELECT user_id, round(AVG(sleepduration)::numeric,1) as AvgSleepDuration, round(AVG(sporttime)::numeric,1) as AvgTimeOnSportAndExercise, round(AVG(studytime)::numeric,1) as AvgTimeOnStudy, round(AVG(sleepquality)::numeric,1) as AvgSleepQuality, round(AVG((mgenericmood+mgenericmood)/2)::numeric,1) as AvgGenericMood FROM reports WHERE date BETWEEN ( SELECT now( ) - INTERVAL '7 day' ) AND ( SELECT now( ) ) GROUP BY user_id");
   const data = {
       allusersdata : Avg.rowsOfObjects()
   }
    return data;
};

const calcGivenDayInfo = async ({params}) => {
    const date = String(params.year) + '-' + String(params.month) + '-' + String(params.day);
    const Day = await executeCachedQuery("SELECT substring(date::varchar from 1 for 10) as date, user_id, sleepduration as AvgSleepDuration, sporttime as AvgTimeOnSportAndExercise, studytime as AvgTimeOnStudy, sleepquality as AvgSleepQuality, (mgenericmood+mgenericmood)/2 as AvgGenericMood FROM reports WHERE date=$1",date);
    const data = {
       daydata : Day.rowsOfObjects()
   }
    return data;
};

export { getTimeData, calcWeekInfo, calcMonthInfo, calcAllUsersInfo, calcGivenDayInfo };
