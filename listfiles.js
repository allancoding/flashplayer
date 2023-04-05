getData(document);
async function getData(document){
  const api_url = "https://api.github.com/repos/Miststorm/swfFiles/contents/games";
  const response = await fetch(api_url);
  const obj = (await response.json());
  console.log(obj);
  for (let i = 0 ; i < obj.length ; i++) {
  	console.log(obj[i].name);
	document.getElementById("p1").innerHTML += "<a href=renderpage.html?https://github.com/Miststorm/swfFiles/blob/main/games/" + obj[i].name + ">"+ obj[i].name.replace('.swf', '') + "</a>" + "<br>";
  }
  //console.log(parseResponse.name);
}
