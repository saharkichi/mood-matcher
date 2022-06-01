let moodMenu = document.getElementById("moodMenu")
let submit = document.getElementById("submit")


Search = function(){
moodMenu.setAttribute("style", "margin-left: 40px;");
getPlayer();

}

// Will create souncloud player
function getPlayer() {
    let player = $(".Playlist");
    let frame = $("<iframe>");

    let mood = $("#moods");
    console.log(mood[0].value); 

    let angry = "https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/playlists/127755258&color=%23948464&auto_play=true&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true&visual=true"
    frame.attr("src", angry);
    frame.attr("width", "100%");
    frame.attr("height", "300");
    player.append(frame);

    //REMOVE
    console.log(frame);
}


submit.addEventListener("click", Search)
