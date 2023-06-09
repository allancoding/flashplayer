//This script belongs to the index.html file (the main page of the application)
//Declaring various variables
let flashurl, flashfile, flashopen, flashgames, flashinput;
function declareVariables(){
    flashurl = document.getElementById('flashurl');
    flashfile = document.getElementById('flashfile');
    flashopen = document.getElementById('flashopen');
    flashgames = document.getElementById('flashlist');
    flashinput = document.getElementById('flashinput');
}
function defineEventListeners() {
    flashurl.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            urlGameInput(flashurl.value);
        }
    });
}
//window.electronAPI.setUrl("./demo/btd5.html", "file");
async function getData(document){
    const api_url = "https://api.github.com/repos/Miststorm/swfFiles/contents/games";
    const response = await fetch(api_url);
    const obj = (await response.json());
    document.getElementById("flashlinks").innerHTML = "";
    obj.map((item) => {
        if(item.name != "README.md"){
            item.name = item.name.replace(".swf", "");
            document.getElementById("flashlinks").innerHTML += `<a href="#" style="text-decoration: none; color: white;" class="swflinks"  onclick="openGame('https://cdn.jsdelivr.net/gh/Miststorm/swfFiles/${item.path}', '${item.name}', 'url')">${item.name}</a><br>`;
        }
    });
}
function flashGames(opened) {
    switch(opened){
        case true:
        case "true":
            flashgames.style.display = "block";
            flashinput.style.display = "none";
            document.title = "Flash Player - Games";
            break;
        default:
            flashgames.style.display = "none";
            flashinput.style.display = "block";
            document.title = "Flash Player";
    }
}
function openGame(url, title, type){
    switch(url){
        case "":
        case null:
        case undefined:
            console.error("No URL provided");
            break;
        default:
            window.location.href = './page.html?file=' + url + '&title=' + title + '&type=' + type;
    }
}
function fileSelectInput(){
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = e => {
        const file = e.target.files[0];
        openGame(file.path, file.name, "file");
        input.remove();
    }
    input.click();
}
function urlbutton(){
    urlGameInput(flashurl.value);
}
function urlGameInput(uri) {
    //window.electronAPI.setUrl(uri, "url");
    //openGame(uri, "Flash Player", "url");
    //get the mime type of the file
    getMimeType(uri).then((mime) => {
        switch(mime){
            case "application/x-shockwave-flash":
                openGame(uri, "Flash Player", "url");
                break;
            default:
                window.electronAPI.setUrl(uri, "url");
        }
    });
}
function demo() {
    window.electronAPI.setUrl("./demo/btd5.html", "file");
}

async function getMimeType(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return blob.type;
}

//init function (called when the page is loaded)
async function init(){
    declareVariables();
    defineEventListeners();
    await getData(document);
}
window.onload = function(){ init() }
