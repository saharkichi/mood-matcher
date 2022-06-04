let moodMenu = document.getElementById("moodMenu")
let submit = document.getElementById("submit")
let playlistheader = document.getElementById("playlistPlaceholder")
let lat = ""
let lon = ""
let previousMoods = []
let urlocation = document.getElementById("urlocation")

Search = function(){
    urlocation.setAttribute("style", "display: block;");
    playlistheader.textContent="Playlist"; 
    getLocation();
    MusicFetcher();
    saveMood();
    
}

// Gets location from browser
function getLocation() {
    navigator.geolocation.getCurrentPosition(getPosition);
    function getPosition(position) {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
        getMapsApi();
        getMap();
    }
}

// Gets data from google maps
function getMapsApi() {
    moodLocationTypes = ["gym","restaurant","park","lodging","night_club","spa","bicycle_store","bar","church"];
    moodType =  moodLocationTypes[$("#moods").val()];
    
    const proxyurl = "https://cors-ps.herokuapp.com/";
    let requestUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lon}&radius=50000&type=${moodType}&key=AIzaSyDtsmRas9J20TKmYQiVSW8XvWCNY7IIsYE`;
  
    fetch(proxyurl + requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        populateLocations(data);
        saveMood();
    })
      .catch( function (error) {
          console.log(error);
      })
}

// Displays locations based on mood
function populateLocations(data) {
    let address = $("#addressList");
    if(!address.children().length) {
        for(let i = 0; i < data.results.length; i++) {
            let listItem = $("<li>");
            address.append(listItem);
            let name = $("<p>");
            name.text(data.results[i].name);
            listItem.append(name);
            let location = $("<p>");
            location.text(`Located at: ${data.results[i].vicinity}`);
            listItem.append(location);
            let rating = $("<p>");
            rating.text(`Rating: ${data.results[i].rating}`);
            listItem.append(rating);
        }
    } else {
        address.children().remove();
        populateLocations(data);
    }
}

// Will create map of your location
function getMap() {
    let mapBox = $("#mapsPlaceholder");
    if(!mapBox.children().length) {
        let frame = $("<iframe>");
        let map = `https://www.google.com/maps/embed/v1/view?key=AIzaSyDtsmRas9J20TKmYQiVSW8XvWCNY7IIsYE&center=${lat},${lon}&zoom=12`
        frame.attr("src", map);
        frame.attr("width", "500");
        frame.attr("height", "500");
        mapBox.append(frame);
    } else {
        mapBox.children().eq(0).remove();
        getMap();
    }
}


//Fetches Music playlist data
function MusicFetcher() {

PlaylistTypes = ["angry","hungry","calm","tired","happy","sad","adventurous","party","stressed"];
Playlist = PlaylistTypes[$("#moods").val()];
    const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Host': 'spotify23.p.rapidapi.com',
		'X-RapidAPI-Key': 'ba57859892msh1281e4ea9521f97p11b86fjsn22579b138546'
	}
};
fetch(`https://spotify23.p.rapidapi.com/search/?q=${Playlist}&type=playlists&offset=0&limit=1&numberOfTopResults=1`, options)
	.then(function (response) {
        return response.json();
    })
.then(function (data) {
    console.log(data)
    let playlistoutput = data.playlists.items[0].data.uri;
    playlistoutput = playlistoutput.split(":");
    playlistoutput = playlistoutput[2];
    console.log(playlistoutput);
    getPlayer(playlistoutput);
})
	.catch(err => console.error(err));
};


//Creates music player 
function getPlayer(playlist) {
    let Player = $("#player");
    
    if(!Player.children().length) {
        let frame = $("<iframe>");
        let player = `https://open.spotify.com/embed/playlist/${playlist}?utm_source=generator`
        frame.attr("src", player);
        frame.attr("width", "50%");
        frame.attr("height", "380");
        Player.append(frame);
    } else {
        Player.children().eq(0).remove();
        getPlayer(playlist);
    }
}

// Checks if local storage has any items and puts them in an array
function initiateStorage() {
    if(localStorage.getItem("previousMoods") !== null) {
        previousMoods = JSON.parse(localStorage.getItem("previousMoods"));
    } else {
        localStorage.setItem("previousMoods", JSON.stringify(previousMoods));
    }
    initiatePrev();
}
 
// Populates mood history
function initiatePrev() {
    let i = 0;
    let moodHistory = $("#history");
    while(i < previousMoods.length && i < 6) {
        let prev = $("<p>");
        prev.text(`${previousMoods[i]}`);
        moodHistory.append(prev);
        i++;
    }
}
 
// Saves mood to local storage and updates list
function saveMood() {
    if(localStorage.getItem("previousMoods") !== null) {
        previousMoods = JSON.parse(localStorage.getItem("previousMoods"));
    }
    let moods = ["Angry","Hungry","Calm","Tired","Happy","Sad","Adventurous","Social","Stressed"]
    let mood = `Your mood was ${moods[$("#moods").val()]} on ${moment()}`;
    previousMoods.reverse();
    previousMoods.push(mood);
    previousMoods.reverse();
    localStorage.setItem("previousMoods", JSON.stringify(previousMoods));
    updatePrev();
}
 
// Creates a new entry if less than 5
// Otherwise it renames the entries
function updatePrev() {
    let moodHistory = $("#history");
    if(previousMoods.length < 6) {
        let prev = $("<p>");
        prev.text(`${previousMoods[0]}`);
        moodHistory.append(prev);
    } else {
        for(let i = 0; i < 6; i++) {
            moodHistory.children().eq(i).text(previousMoods[i]);
        }
    }    
}

submit.addEventListener("click", Search)
initiateStorage();