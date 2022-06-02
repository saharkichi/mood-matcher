let moodMenu = document.getElementById("moodMenu")
let submit = document.getElementById("submit")

let lat = ""
let lon = ""

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

function getMapsApi() {
    moodLocationTypes = ["gym","restaurant","park","lodging","night_club","spa","casino","bar","church"];
    moodType =  moodLocationTypes[$("#moods").val()];
    console.log(moodType);
    
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    var requestUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat}%2C${lon}&radius=50000&type=${moodType}&key=AIzaSyDtsmRas9J20TKmYQiVSW8XvWCNY7IIsYE`;
  
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

function populateLocations(data) {

}

// Will create map of your location
function getMap() {
    let mapBox = $("#mapsPlaceHolder");
    
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


submit.addEventListener("click", Search)