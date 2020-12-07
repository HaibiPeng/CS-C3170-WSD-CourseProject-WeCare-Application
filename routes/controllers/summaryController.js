import { getTimeData, calcWeekInfo, calcMonthInfo, calcAllUsersInfo, calcGivenDayInfo } from "../../services/summaryService.js";

const showSummaryForm = async({request, render, session}) => {
    if (session && await session.get('authenticated')) {
        const timedata = await getTimeData({session: session});
        const userId = (await session.get('user')).id;
        const WeekInfo = await calcWeekInfo(timedata.weekrange, userId);
        const MonthInfo = await calcMonthInfo(timedata.monthrange, userId);
        const data = {
            email: (await session.get('user')).email,
            week: timedata.week,
            month: timedata.month,
            weekrange: timedata.weekrange,
            monthrange: timedata.monthrange,
            avgwsd: WeekInfo.avgwsd,
            avgwset: WeekInfo.avgwset,
            avgwst: WeekInfo.avgwst,
            avgwsq: WeekInfo.avgwsq,
            avgwgm: WeekInfo.avgwgm,
            noweeklydata: WeekInfo.noweeklydata,
            avgmsd: MonthInfo.avgmsd,
            avgmset: MonthInfo.avgmset,
            avgmst: MonthInfo.avgmst,
            avgmsq: MonthInfo.avgmsq,
            avgmgm: MonthInfo.avgmgm,
            nomonthlydata: MonthInfo.nomonthlydata
        }
        render('summary.ejs', data);
        return;
    } 
};

const postSummaryForm = async({request, render, session}) => {
    if (session && await session.get('authenticated')) {
        const timedata = await getTimeData({request:request, session: session});
        const userId = (await session.get('user')).id;
        const WeekInfo = await calcWeekInfo(timedata.weekrange, userId);
        const MonthInfo = await calcMonthInfo(timedata.monthrange, userId);
        const data = {
            email: (await session.get('user')).email,
            week: timedata.week,
            month: timedata.month,
            weekrange: timedata.weekrange,
            monthrange: timedata.monthrange,
            avgwsd: WeekInfo.avgwsd,
            avgwset: WeekInfo.avgwset,
            avgwst: WeekInfo.avgwst,
            avgwsq: WeekInfo.avgwsq,
            avgwgm: WeekInfo.avgwgm,
            noweeklydata: WeekInfo.noweeklydata,
            avgmsd: MonthInfo.avgmsd,
            avgmset: MonthInfo.avgmset,
            avgmst: MonthInfo.avgmst,
            avgmsq: MonthInfo.avgmsq,
            avgmgm: MonthInfo.avgmgm,
            nomonthlydata: MonthInfo.nomonthlydata
        }
        render('summary.ejs', data);
        return;
    } 
};

const getAllUsersInfo = async({response,render}) => {
    const data = await calcAllUsersInfo();
    response.body = data;
    //render('api.ejs', data);
};

const getGivenDayInfo = async({response,params,render}) => {
    const data = await calcGivenDayInfo({params:params});
    response.body = data;
    //render('api.ejs', data);
};

export { showSummaryForm, postSummaryForm, getAllUsersInfo, getGivenDayInfo };