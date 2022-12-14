const login = document.getElementById('login');
const signin = document.getElementById('signin');
const logout = document.getElementById('logout');

const login_modal = document.getElementById('login_modal');
const signin_modal = document.getElementById('signin_modal');

const login_btn = document.getElementById('login_btn');
const signin_btn = document.getElementById('signin_btn');

//	Variables or login implementing (with username/email + password OR every detail)
// const modal_login_floating_input_username = document.getElementById('login_floating_input_username');
// const modal_login_floating_input_password = document.getElementById('login_floating_input_password');
// const modal_login_floating_input_email = document.getElementById('login_floating_input_email');

// Variables or signin implementing (with username/email + password OR every detail)
// const modal_signin_floating_input_username = document.getElementById('signin_floating_input_username');
// const modal_signin_floating_input_password = document.getElementById('signin_floating_input_password');
// const modal_signin_floateing_input_email = document.getElementById('signin_floating_input_email');

const top_meme_1 = document.getElementById('top_meme_1');
const top_meme_2 = document.getElementById('top_meme_2');
const top_meme_3 = document.getElementById('top_meme_3');

const stored_user_status = localStorage;

if (stored_user_status.getItem('status') == "logged") {
	login.hidden = true;
	signin.hidden = true;
	logout.hidden = false;
} else if (stored_user_status.getItem('status') == "not_logged") {
	login.hidden = false;
	signin.hidden = false;
	logout.hidden = true;
} else {
	login.hidden = false;
	signin.hidden = false;
	logout.hidden = true;
}

const saveToLocalStorageLogged = () => {
	stored_user_status.setItem('status', 'logged');
}

const saveToLocalStorageNotLogged = () => {
	stored_user_status.setItem('status', 'not_logged');
}

login_btn.addEventListener('click', click => {
	login.hidden = true;
	signin.hidden = true;
	logout.hidden = false;
	saveToLocalStorageLogged();
})

signin_btn.addEventListener('click', click => {
	login.hidden = true;
	signin.hidden = true;
	logout.hidden = false;
	saveToLocalStorageLogged();
})

logout.addEventListener('click', click => {
	login.hidden = false;
	signin.hidden = false;
	logout.hidden = true;
	saveToLocalStorageNotLogged();
})
