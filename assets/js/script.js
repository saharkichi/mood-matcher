let moodMenu = document.getElementById("moodMenu")
let submit = document.getElementById("submit")

let lat = ""
let lon = ""
let previousMoods = [];

Search = function(){
    moodMenu.setAttribute("style", "margin-left: 40px;");
    getLocation();
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
    moodLocationTypes = ["gym","restaurant","park","lodging","night_club","spa","casino","bar","church"];
    moodType =  moodLocationTypes[$("#moods").val()];
    console.log(moodType);
    
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    let requestUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lon}&radius=50000&type=${moodType}&key=AIzaSyDtsmRas9J20TKmYQiVSW8XvWCNY7IIsYE`;
  
    fetch(proxyurl + requestUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        console.log(data);
        populateLocations(data);
    })
      .catch( function (error) {
          console.log(error);
      })
}

// Displays locations based on mood
function populateLocations(data) {
    let address = $("#addressList");
    console.log(address);
    for(let i = 0; i < data.results.length; i++) {
        console.log(data.results[i].name);
        
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
}

// Will create map of your location
function getMap() {
    let mapBox = $("#mapsPlaceholder");
    console.log(mapBox);
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

submit.addEventListener("click", Search);