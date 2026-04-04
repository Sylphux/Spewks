/////////////////////////////////////////
// COOKIES (unused for now)
/////////////////////////////////////////

function setCookie(cname, val, exdays = 400) {
  cvalue = JSON.stringify(val);
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  let expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  let name = cname + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return JSON.parse(c.substring(name.length, c.length));
    }
  }
  return "";
}

function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  checkForCookies();
  checkUnsaved();
}

/////////////////////////////////////////
// LOCAL STORAGE
/////////////////////////////////////////

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function load(key) {
  return JSON.parse(localStorage.getItem(key));
}

/////////////////////////////////////////
// MATH
/////////////////////////////////////////

function randTo(n) {
  return Math.floor(Math.random() * (n + 1));
}

function milliToDays(ms) {
  let day = 1000 * 60 * 60 * 24;
  return Math.round(ms / 1000 / 60 / 60 / 24);
}

/////////////////////////////////////////
// TECHNICAL
/////////////////////////////////////////

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms)); // pause an async func with wait delay(n)

/////////////////////////////////////////
// STRINGS
/////////////////////////////////////////

function scan(string, sub, scanChars = false) {
  // if scanChars is true, it will scan for each char of sub instead of "sub"
  if (!scanChars) {
    return string.indexOf(sub) != -1;
  } else {
    for (let c of sub) {
      if (scan(string, c)) {
        return true
      }
    }
  }
  return false
}

function capitalize(s) {
  return s[0].toUpperCase() + s.substr(1);
}

/////////////////////////////////////////
// ARRAYS AND 2D ARRAYS
/////////////////////////////////////////

// turns arr of strings into arr of arr
function real2d(arr) {
  return arr.map((string) => string.split(""));
}

// turns arr of arr into arr of strings
function fake2d(arr) {
  return arr.map((string) => string.join(""));
}

/////////////////////////////////////////
// ALGOS
/////////////////////////////////////////

const crypt = (salt, text) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);

  return text
    .split("")
    .map(textToChars)
    .map(applySaltToChar)
    .map(byteHex)
    .join("");
};

const decrypt = (salt, encoded) => {
  const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
  const applySaltToChar = (code) =>
    textToChars(salt).reduce((a, b) => a ^ b, code);
  return encoded
    .match(/.{1,2}/g)
    .map((hex) => parseInt(hex, 16))
    .map(applySaltToChar)
    .map((charCode) => String.fromCharCode(charCode))
    .join("");
};
