import { checkexistingUsers, addUserInfo, getRegistrationData, getLoginData, setSession, cleanSession } from "../../services/userService.js";
import { validate, required, isEmail, minLength } from "../../deps.js";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.2.4/mod.ts";


const RegistrationValidationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
    verification: [required, minLength(4)],
};

const LoginValidationRules = {
    email: [required, isEmail],
    password: [required, minLength(4)],
};

const showRegistrationForm = async({session,render}) => {
    cleanSession({session:session});
    const data = await getRegistrationData();
    render('register.ejs', data);
};

const postRegistrationForm = async({request, render}) => {
    const data = await getRegistrationData(request);
    const [passes, errors] = await validate(data, RegistrationValidationRules);

    if (!passes) {
        data.errors = errors;
        render("register.ejs", data);
        return;
    } 

    //check if password is verified
    if (data.password !== data.verification) {
        data.errors = { verification : { notverified : 'The entered passwords did not match' } };
        render("register.ejs", data);
        return;
    }

    //check if there is already a existing user
    const existingUsers = await checkexistingUsers(data.email);
    if (existingUsers.rowCount > 0) {
        data.errors = { existing : { reserved : 'The email is already reserved.' } };
        render("register.ejs", data);
        return;
    }

    //add user info into database
    const hash = await bcrypt.hash(data.password);
    addUserInfo(data.email, hash);
    data.success = 'Registration successful!';
    render("register.ejs", data);
};

const redirectLoginForm = async({session, response, render}) => {
    response.redirect('/auth/login');
    await showLoginForm({session:session, render:render});
    return;
};

const showLoginForm = async({session, render}) => {
    if (session) {
        cleanSession({session:session});
    }
    const data = await getLoginData();
    render('login.ejs', data);
};

const postLoginForm = async({request, session, render}) => {
    const data = await getLoginData(request);
    const [passes, errors] = await validate(data, LoginValidationRules);

    if (!passes) {
        data.errors = errors;
        render("login.ejs", data);
        return;
    }
  
    // check if the email exists in the database
    const existingUsers = await checkexistingUsers(data.email);
    if (existingUsers.rowCount === 0) {
        data.errors = { existing : { nouser : 'The email is not registered! Please register.' } };
        render("login.ejs", data);
        return;
    }
  
    // take the first row from the results
    const userObj = existingUsers.rowsOfObjects()[0];
    const hash = userObj.password;
    const existingUser = await checkexistingUsers(data.email);
    
    const passwordCorrect = await bcrypt.compare(data.password, hash);
    if (!passwordCorrect || existingUser.rowCount === 0) {
        data.errors = { password : { pwerror : 'Invalid email or password! Please try again.' } };
        render("login.ejs", data);
        return;
    }
  
    setSession({session:session},userObj);
    data.success = 'Authentication successful!';
    render("login.ejs", data);
};

const getLogoutForm = async({request, response, render, session}) => {
    if (request) {
        cleanSession({session:session});
        response.redirect('/auth/login');
        await showLoginForm({render:render});
    }
};


export { showRegistrationForm, postRegistrationForm, showLoginForm, postLoginForm, getLogoutForm, redirectLoginForm };