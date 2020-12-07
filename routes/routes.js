import { Router } from "../deps.js";
import { showRegistrationForm, postRegistrationForm, showLoginForm, postLoginForm, getLogoutForm, redirectLoginForm } from "./controllers/userController.js";
import { showReportingForm, postReportingForm, showMorningForm, postMorningForm, showNightForm, postNightForm } from "./controllers/reportingController.js";
import { showSummaryForm, postSummaryForm, getAllUsersInfo, getGivenDayInfo } from "./controllers/summaryController.js";
import { showLandingForm } from "./controllers/landingController.js";

const router = new Router();

router.get('/', redirectLoginForm);
router.get('/auth/registration', showRegistrationForm);
router.post('/auth/registration', postRegistrationForm);
router.get('/auth/login', showLoginForm);
router.post('/auth/login', postLoginForm);
router.get('/auth/logout', getLogoutForm);

router.get('/behavior/reporting', showReportingForm);
router.post('/behavior/reporting', postReportingForm);
router.get('/behavior/reportingmorning', showMorningForm);
router.post('/behavior/reportingmorning', postMorningForm);
router.get('/behavior/reportingnight', showNightForm);
router.post('/behavior/reportingnight', postNightForm);

router.get('/behavior/summary', showSummaryForm);
router.post('/behavior/summary', postSummaryForm);

router.get('/landing', showLandingForm);

router.get('/api/summary', getAllUsersInfo);
router.get('/api/summary/:year/:month/:day', getGivenDayInfo);

export { router };
