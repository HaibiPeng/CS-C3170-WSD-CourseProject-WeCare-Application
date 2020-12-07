import { calcTrendInfo } from "../../services/landingService.js";
import { showLoginForm } from "./userController.js";

const showLandingForm = async({render}) => {
        const trendinfo = await calcTrendInfo();
        const data = {
            todaymood: trendinfo.todaymood,
            yesterdaymood: trendinfo.yesterdaymood,
            notodaydata: trendinfo.notodaydata,
            noyesterdaydata: trendinfo.noyesterdaydata,
            trend: trendinfo.trend
        }
        render('landing.ejs', data);
        return;
     /*else {
        response.redirect('/auth/login');
        await showLoginForm({render:render});
    }*/
};

export { showLandingForm };
