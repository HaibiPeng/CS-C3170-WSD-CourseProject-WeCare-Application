import { executeQuery, executeCachedQuery } from "../database/database.js";
import AutoPilot from 'https://deno.land/x/autopilot@0.2.1/mod.ts';

var pilot = new AutoPilot();

const alertMessage = async(message) => {
    await pilot.alert(message);
}

const getDate = async () => {
  var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    let Today = yyyy + '-' + mm + '-' + dd;
    return Today;
};

const getCheckData = async ({request, session}) => {
  const userId = (await session.get('user')).id;
  let Info = await checkInfo(await getDate(), userId);
  const data = {
    date: await getDate(),
    email: (await session.get('user')).email,
    morningInfo: Info.morningInfo,
    nightInfo: Info.nightInfo,
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get("date");
    let Info = await checkInfo(data.date, userId);
    data.morningInfo = Info.morningInfo,
    data.nightInfo = Info.nightInfo
    }
  return data;
};

const getMorningData = async ({request, session}) => {
    const data = {
      date: await getDate(),
      email: (await session.get('user')).email,
      sleepduration: '',
      sleepquality: '3',
      mgenericmood: '3',
      errors: null, // or errors: {}
      success: null
    };
  
    if (request) {
      const body = request.body();
      const params = await body.value;
      data.date = params.get("date");
      data.sleepduration = params.get("sleepduration");
      data.sleepquality = params.get("sleepquality");
      data.mgenericmood = params.get("mgenericmood");
    }
    return data;
};

const getNightData = async ({request, session}) => {
  const data = {
    date: await getDate(),
    email: (await session.get('user')).email,
    sporttime: '',
    studytime: '',
    eatregnqua: '3',
    ngenericmood: '3',
    errors: null, // or errors: {}
    success: null
  };

  if (request) {
    const body = request.body();
    const params = await body.value;
    data.date = params.get("date");
    data.sporttime = params.get("sporttime");
    data.studytime = params.get("studytime");
    data.eatregnqua = params.get("eatregnqua");
    data.ngenericmood = params.get("ngenericmood");
  }
  return data;
};

const addMorningInfo = async(data, userID) => {
    const morninginfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and morning=true and user_id=$2;", data.date, userID);
    const nightinfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and night=true and user_id=$2;", data.date, userID);
    if (morninginfo.rowsOfObjects()[0].count === "1") {
      await executeCachedQuery("UPDATE reports SET sleepduration=$1, sleepquality=$2, mgenericmood=$3 WHERE date=$4 and user_id=$5;", data.sleepduration, 
      data.sleepquality, data.mgenericmood, data.date, userID);
    } else if (nightinfo.rowsOfObjects()[0].count === "1" && morninginfo.rowsOfObjects()[0].count === "0") {
      await executeCachedQuery("UPDATE reports SET morning=true, sleepduration=$1, sleepquality=$2, mgenericmood=$3 WHERE date=$4 and user_id=$5;", data.sleepduration, 
      data.sleepquality, data.mgenericmood, data.date, userID);
    } else {
      await executeCachedQuery("INSERT INTO reports (date, morning, sleepduration, sleepquality, mgenericmood, user_id) VALUES ($1, $2, $3, $4, $5, $6);", data.date, 
      true, data.sleepduration, data.sleepquality, data.mgenericmood, userID);
    }
};

const addNightInfo = async(data, userID) => {
  const morninginfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and morning=true and user_id=$2;", data.date, userID);
  const nightinfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and night=true and user_id=$2;", data.date, userID);
  if (nightinfo.rowsOfObjects()[0].count === "1") {
    await executeCachedQuery("UPDATE reports SET sporttime=$1, studytime=$2, eatregnqua=$3, ngenericmood=$4 WHERE date=$5 and user_id=$6;", data.sporttime, 
    data.studytime, data.eatregnqua, data.ngenericmood, data.date, userID);
  } else if (nightinfo.rowsOfObjects()[0].count === "0" && morninginfo.rowsOfObjects()[0].count === "1") {
    await executeCachedQuery("UPDATE reports SET night=true, sporttime=$1, studytime=$2, eatregnqua=$3, ngenericmood=$4 WHERE date=$5 and user_id=$6;", data.sporttime, 
    data.studytime, data.eatregnqua, data.ngenericmood, data.date, userID);
  } else {
    await executeCachedQuery("INSERT INTO reports (date, night, sporttime, studytime, eatregnqua, ngenericmood, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7);", 
    data.date, true, data.sporttime, data.studytime, data.eatregnqua, data.ngenericmood, userID);
  }
};

const checkInfo = async(date, userID) => {
  const Info = {
    morningInfo: '',
    nightInfo: '',
  }
  const morninginfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and morning=true and user_id=$2;", date, userID);
  const nightinfo = await executeCachedQuery("SELECT COUNT(*) FROM reports WHERE date=$1 and night=true and user_id=$2;", date, userID);
  if (morninginfo.rowsOfObjects()[0].count === "1") {
    Info.morningInfo = 'Morning reporting has alreay been done!';
  } else {
    Info.morningInfo = 'You have not done the morning reporting.';
  } 
  if (nightinfo.rowsOfObjects()[0].count === "1") {
    Info.nightInfo = 'Night reporting has alreay been done!';
  } else {
    Info.nightInfo = 'You have not done the night reporting.';
  } 
  return Info;
};


export { getMorningData, addMorningInfo, getNightData, addNightInfo, checkInfo, getDate, getCheckData, alertMessage };

