import { getMorningData, addMorningInfo, getNightData, addNightInfo, checkInfo, getDate, getCheckData, alertMessage } from "../../services/reportingService.js";
import { validate, required, isNumeric, minNumber, maxNumber, isDate, numberBetween } from "../../deps.js";

const morningValidationRules = {
    date: [required, isDate],
    //sleepduration: [required, isNumeric],
    //sleepquality: [required, numberBetween(1,5)],
    //mgenericmood: [required, numberBetween(1,5)],
};

const nightValidationRules = {
    date: [required, isDate],
    sporttime: [required, isNumeric],
    studytime: [required, isNumeric],
    //eatregnqua: [required, numberBetween(1,5)],
    //ngenericmood: [required, numberBetween(1,5)],
};

const showReportingForm = async({request, render, session}) => {
    if (session && await session.get('authenticated')) {
        const data = await getCheckData({session: session});
        render('reporting.ejs', data);
        return;
    } 
};

const postReportingForm = async({request, render, session}) => {
    if (session && await session.get('authenticated')) {
        const data = await getCheckData({request:request, session: session});
        render('reporting.ejs', data);
        return;
    } 
};

const showMorningForm = async({render, session}) => {
    if (session && await session.get('authenticated')) {
        const data = await getMorningData({session: session});
        render('morning.ejs', data);
    }
};

const postMorningForm = async({request, render, session}) => {
    const data = await getMorningData({request:request, session: session});
    const [passes, errors] = await validate(data, morningValidationRules);

    if (!passes) {
        data.errors = errors;
        render("morning.ejs", data);
        return;
    } else {
        //add report info into database
        const userId = (await session.get('user')).id;
        addMorningInfo(data, userId);
        data.success = 'Reporting successful!';
        await alertMessage(data.success);
        render("morning.ejs", data);
    }
};

const showNightForm = async({render, session}) => {
    if (session && await session.get('authenticated')) {
        const data = await getNightData({session: session});
        render('night.ejs', data);
    }
};

const postNightForm = async({request, render, session}) => {
    const data = await getNightData({request:request, session: session});
    const [passes, errors] = await validate(data, nightValidationRules);

    if (!passes) {
        data.errors = errors;
        render("night.ejs", data);
        return;
    } else {
        //add report info into database
        const userId = (await session.get('user')).id;
        addNightInfo(data, userId);
        data.success = 'Reporting successful!';
        await alertMessage(data.success);
        render("night.ejs", data);
    }
};



export { showReportingForm, postReportingForm, showMorningForm, postMorningForm, showNightForm, postNightForm };