(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const initPageBindings = require('./lib/handlers');

document.addEventListener('DOMContentLoaded', initPageBindings);

},{"./lib/handlers":6}],2:[function(require,module,exports){
const jwt_decode = require("jwt-decode");

async function requestLogin(data) {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(`http://localhost:3000/auth/login`, options);
    const responseJson = await response.json();
    if (!responseJson.success) {
      throw new Error("Login not authorised");
    }
    login(responseJson.token);
  } catch (err) {
    console.warn(err);
  }
}

async function requestRegistration(data) {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    };
    const response = await fetch(`http://localhost:3000/auth/register`, options);
    const responseJson = await response.json();
    if (responseJson.err) {
      throw Error(responseJson.err);
    }
    requestLogin(data);
  } catch (err) {
    console.warn(err);
  }
}

function login(token) {
  const user = jwt_decode(token);
  localStorage.setItem("token", token);
  localStorage.setItem("name", user.name);
  localStorage.setItem("email", user.email);
  window.location.pathname = "/dashboard.html";
}

function logout() {
  localStorage.clear();
  window.location.pathname = "/index.html";
}

module.exports = { requestLogin, requestRegistration, login, logout };

},{"jwt-decode":8}],3:[function(require,module,exports){
function createLoginForm() {
	const form = document.createElement('form');

	const emailLabel = document.createElement('label');
	emailLabel.setAttribute('for', 'email');

	const emailInput = document.createElement('input');
	emailInput.setAttribute('name', 'email');
	emailInput.setAttribute('id', 'email');
	emailInput.setAttribute('type', 'email');
	emailInput.setAttribute('required', true);

	form.append(emailLabel);
	form.append(emailInput);

	const passwordLabel = document.createElement('label');
	passwordLabel.setAttribute('for', 'password');

	const passwordInput = document.createElement('input');
	passwordInput.setAttribute('name', 'password');
	passwordInput.setAttribute('id', 'password');
	passwordInput.setAttribute('type', 'password');
	passwordInput.setAttribute('required', true);

	form.append(passwordLabel);
	form.append(passwordInput);

	const loginButton = document.createElement('input');
	loginButton.setAttribute('type', 'submit');
	loginButton.setAttribute('value', 'Login');

	form.append(loginButton);

	return form;
}

function createRegistrationForm() {
	const form = document.createElement('form');

	const nameLabel = document.createElement('label');
	nameLabel.setAttribute('for', 'name');

	const nameInput = document.createElement('input');
	nameInput.setAttribute('name', 'name');
	nameInput.setAttribute('id', 'name');
	nameInput.setAttribute('type', 'text');
	nameInput.setAttribute('required', true);

	form.append(nameLabel);
	form.append(nameInput);

	const emailLabel = document.createElement('label');
	emailLabel.setAttribute('for', 'email');

	const emailInput = document.createElement('input');
	emailInput.setAttribute('name', 'email');
	emailInput.setAttribute('id', 'email');
	emailInput.setAttribute('type', 'email');
	emailInput.setAttribute('required', true);

	form.append(emailLabel);
	form.append(emailInput);

	const passwordLabel = document.createElement('label');
	passwordLabel.setAttribute('for', 'password');

	const passwordInput = document.createElement('input');
	passwordInput.setAttribute('name', 'password');
	passwordInput.setAttribute('id', 'password');
	passwordInput.setAttribute('type', 'password');
	passwordInput.setAttribute('required', true);

	form.append(passwordLabel);
	form.append(passwordInput);

	const registerButton = document.createElement('input');
	registerButton.setAttribute('type', 'submit');
	registerButton.setAttribute('value', 'Login');

	form.append(registerButton);

	return form;
}

module.exports = { createLoginForm, createRegistrationForm };

},{}],4:[function(require,module,exports){
const { createLoginForm, createRegistrationForm } = require('../dom_elements');

function onLoginButtonClick(e) {
	const body = document.querySelector('body');
	const slogan = document.querySelector('p');
	const loginButton = document.querySelector('.login');
	const form = createLoginForm();
	form.addEventListener('submit', onLoginSumbit);
	body.removeChild(slogan);
	body.insertBefore(form, loginButton);
	body.removeChild(loginButton);
}

function onRegistrationButtonClick(e) {}

function onRegistrationSumbit(e) {}

function onLoginSumbit(e) {
	e.preventDefault();
	// call auth function
}

module.exports = {
	onLoginButtonClick,
	onRegistrationButtonClick,
	onRegistrationSumbit,
	onLoginSumbit,
};

},{"../dom_elements":3}],5:[function(require,module,exports){
const { putUserInfo } = require("../requests");

async function onChangePasswordSumbit(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  let response;
  if (formData["new-password"] === formData["confirm-password"]) {
    try {
      response = await putUserInfo(formData);
    } catch (error) {
      console.warn(error);
    }
  } else {
    window.alert("Your passwords do not match, please try again.");
  }
}

async function onUpdateUserInfoSumbit(e) {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target));
  let response;

  try {
    response = await putUserInfo(formData);
  } catch (error) {
    console.warn(error);
  }
  console.log(response);
}

module.exports = { onChangePasswordSumbit, onUpdateUserInfoSumbit };

},{"../requests":7}],6:[function(require,module,exports){
const { onLoginButtonClick, onRegistrationButtonClick } = require("./event_handlers/index");
const { onChangePasswordSumbit, onUpdateUserInfoSumbit } = require("./event_handlers/profile");

function bindIndexListeners() {
  const loginButton = document.querySelector(".login");
  loginButton.addEventListener("click", onLoginButtonClick);

  const registrationButton = document.querySelector(".register");
  registrationButton.addEventListener("click", onRegistrationButtonClick);
}

function bindDashboardListeners() {}

function bindProfileListeners() {
  const changeUserInfoSubmitButton = document.getElementById("user-info-form");
  changeUserInfoSubmitButton.addEventListener("submit", onUpdateUserInfoSumbit);

  const changePasswordSubmitButton = document.getElementById("change-password-form");
  changePasswordSubmitButton.addEventListener("submit", onChangePasswordSumbit);
}

function renderHabits() {}

function initPageBindings() {
  const path = window.location.pathname;
  if (path === "/") {
    bindIndexListeners();
  } else if (path === "/dashboard") {
    bindDashboardListeners();
  } else if (path === "/profile.html") {
    bindProfileListeners();
  }
}

module.exports = initPageBindings;

},{"./event_handlers/index":4,"./event_handlers/profile":5}],7:[function(require,module,exports){
const { logout } = require("./auth");

const devURL = "http://localhost:3000";

async function getAllUserHabits(email) {
  try {
    const options = { headers: new Headers({ Authorization: localStorage.getItem("token") }) };
    const response = await fetch(`${devURL}/habits/${email}`, options);
    const data = await response.json();
    if (data.err) {
      console.warn(data.err);
      logout();
    }
    return data;
  } catch (err) {
    console.warn(err);
  }
}

async function postHabit(data) {
  try {
    const options = {
      method: "POST",
      headers: new Headers({
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(data),
    };

    const response = await fetch(`${devURL}/habits`, options);
    const responseJson = await response.json();
    if (responseJson.err) {
      throw new Error(err);
    } else {
      // add a new habit (require from dom_elements.js)
    }
  } catch (err) {
    console.warn(err);
  }
}

async function deleteHabit(id) {
  try {
    const options = {
      method: "DELETE",
      headers: new Headers({ Authorization: localStorage.getItem("token") }),
    };
    const response = await fetch(`${devURL}/habits/${id}`, options);
    const responseJson = await response.json();
    if (responseJson.err) {
      throw Error(err);
    }
  } catch (err) {
    console.warn(err);
  }
}

async function putHabit(data) {
  try {
    const options = {
      method: "PUT",
      headers: new Headers({ Authorization: localStorage.getItem("token") }),
      body: JSON.stringify(data),
    };
    const response = await fetch(`${devURL}/habits/${data.id}`, options);
    const responseJson = await response.json();
    if (responseJson.err) {
      throw Error(err);
    } else {
      // redirect to the dashboard
      console.log(responseJson);
    }
  } catch (err) {
    console.warn(err);
  }
}

async function putUserInfo(data) {
  try {
    const options = {
      method: "PUT",
      headers: new Headers({ Authorization: localStorage.getItem("token") }),
      body: JSON.stringify(data),
    };
    const response = await fetch(`${devURL}/user/${data.email}`, options);
    const responseJson = await response.json();
    if (responseJson.err) {
      throw Error(err);
    } else {
      // redirect to the dashboard
      console.log(responseJson);
    }
  } catch (err) {
    console.warn(err);
  }
  return responseJson;
}

module.exports = { getAllUserHabits, postHabit, deleteHabit, putHabit, putUserInfo };

},{"./auth":2}],8:[function(require,module,exports){
"use strict";function e(e){this.message=e}e.prototype=new Error,e.prototype.name="InvalidCharacterError";var r="undefined"!=typeof window&&window.atob&&window.atob.bind(window)||function(r){var t=String(r).replace(/=+$/,"");if(t.length%4==1)throw new e("'atob' failed: The string to be decoded is not correctly encoded.");for(var n,o,a=0,i=0,c="";o=t.charAt(i++);~o&&(n=a%4?64*n+o:o,a++%4)?c+=String.fromCharCode(255&n>>(-2*a&6)):0)o="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=".indexOf(o);return c};function t(e){var t=e.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw"Illegal base64url string!"}try{return function(e){return decodeURIComponent(r(e).replace(/(.)/g,(function(e,r){var t=r.charCodeAt(0).toString(16).toUpperCase();return t.length<2&&(t="0"+t),"%"+t})))}(t)}catch(e){return r(t)}}function n(e){this.message=e}function o(e,r){if("string"!=typeof e)throw new n("Invalid token specified");var o=!0===(r=r||{}).header?0:1;try{return JSON.parse(t(e.split(".")[o]))}catch(e){throw new n("Invalid token specified: "+e.message)}}n.prototype=new Error,n.prototype.name="InvalidTokenError";const a=o;a.default=o,a.InvalidTokenError=n,module.exports=a;


},{}]},{},[1]);
