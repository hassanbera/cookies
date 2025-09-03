setCookie("email", "Sponge@gmail.com", 365);
console.log(document.cookie);

function setCookie(name, value, daysToLive){
    const date = new Date();
    date.setTime(date.getTime() + daysToLive * 24 * 60 * 60 * 60 * 1000);
    let expires = "expires" + date.toUTCString();
    document.cookie = `${name} = ${value}; ${expires}; path='/'`;

}