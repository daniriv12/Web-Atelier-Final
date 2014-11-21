

window.onload = function(){
  // implement the logic to render the views here. Ofcourse, you can call other functions
  // to avoid having a huge function

    if (!localStorage.getItem("playlistIdCounter")){
        localStorage.setItem("playlistIdCounter", 10)}

    if(document.getElementById("music")){
        populateLibrary();
        setupPlayer();

    }
    if(document.getElementById("artists")){
        populateArtists();}
    if(document.getElementById("albums")){
        populateAlbums();}

    populateCreatedPlaylists();

  //setup audio player

}


function getSongById(id){
    for(var x=0; x < window.data.tracks.length;x++){
        if (window.data.tracks[x]._id == id){
            return window.data.tracks[x];
        }
    }
    return "Unknown";
}

function getArtistById(id){

    for(var x=0; x < window.data.artists.length;x++){
        if (window.data.artists[x]._id == id){
            return window.data.artists[x].name;
        }
    }
    return "Unknown";
}

function getAlbumById(id){

    for(var x=0; x < window.data.albums.length;x++){

        if (window.data.albums[x]._id == id){
            return window.data.albums[x].name;
        }
    }

    return "Unknown";
}

function getAlbumObjectById(id){

    for(var x=0; x < window.data.albums.length;x++){

        if (window.data.albums[x]._id == id){
            return window.data.albums[x];
        }
    }

    return "Unknown";
}

function timeToMinutes(secs){

    var minutes = Math.floor(secs / 60);
    var seconds = secs - minutes * 60;

    if (seconds.toString().length < 2){
        seconds = "0" + seconds.toString();
    }
    return (minutes.toString() + ":" + seconds.toString());
}

function populateLibrary() {
    var first1 = "<li id=\"first\"><p class=\"title\">Title</p><p class=\"artist\">Artist</p><p class=\"album\">Album</p><p class=\"time\">Time</p></li>";
    var songs = first1;

    songIndexGlobal = 0;
    for (var i = 0; i < window.data.tracks.length; i++) {
        var track = window.data.tracks[i];

        var songIndex = songIndexGlobal.toString();

        var song = '<li id="' + track._id + '" ' + ' class="' + songIndex +'" ondblclick="setupPlayer(this)"><p class="title">' + track.name + '</p>' + '<p class="artist"><a href="Artists.html">' + getArtistById(track.artist) + '</a></p>' + '<p class="album"><a href="Albums.html">' + getAlbumById(track.album) + '</a></p>' + '<p class="time">' + timeToMinutes(track.duration) + '</p></li>';
        songIndexGlobal++;
        songs = songs + song;

    }

    document.getElementById("music").innerHTML = songs;
}



function populateArtists(){
    var artists = "";

    for (var i = 0; i<window.data.artists.length;i++) {
        var current = window.data.artists[i];
        var artist = '<div class="artist"><figure><img src=' + current.artwork + ' +  alt="title"></figure><h3><a href="#">' + current.name + '</a></h3><h4>' + current.genre + '</h4></div>';
        artists = artists + artist;
    }

    document.getElementById("artists").innerHTML = artists;
}


function populateAlbums(){
    var albums = "";

    for (var i = 0; i<window.data.albums.length;i++) {
        var current = window.data.albums[i];
        var album = '<div class="album"><figure><img src=' + current.artwork + ' +  alt="album"></figure><h3><a href="#">' + current.name + '</a></h3><h4>' + getArtistById(current.artist) + '</h4></div>';
        albums = albums + album;
    }

    document.getElementById("albums").innerHTML = albums;
}

function populateCreatedPlaylists(){

//    var playlistsToPrint = JSON.stringify(JSON.parse(localStorage.playlists));

  // console.log(JSON.stringify(JSON.parse(localStorage.playlists),null,2));

  //  console.log(playlistsToPrint.length);

    var objects = (JSON.parse(localStorage.playlists));

//    for (var x in objects) {
//        console.log(x); // id number
//        console.log(objects[x]); //actual object
//        console.log(objects[x].name)} //name of each playlist
//    }
//    TESTING

    var allPlaylists =  "";
    for (var i in objects){

        var playlist = '<li id="' + objects[i]._id + '" ondblclick="editName(this)" onkeydown="if (event.keyCode == 13){doneEditing(this)} if(event.keyCode == 27){cancelEditing(this)}"><img src="CSS/Resources/playlist.png" alt=""><a href="#" >' + objects[i].name + '</a></li>';
        allPlaylists = allPlaylists + playlist;

    }
    document.getElementById("play-lists").innerHTML = allPlaylists;

}
// Search
function execute(dom){

    var matches = fuzzyFind(window.data.tracks, "name", dom);



    var first1 = "<li id=\"first\"><p class=\"title\">Title</p><p class=\"artist\">Artist</p><p class=\"album\">Album</p><p class=\"time\">Time</p></li>";
    var songsFounded = first1;
    songIndexGlobal = 0;
    for (var i = 0; i < matches.length; i++) {
        var track = matches[i];

        var songIndex = songIndexGlobal.toString();

        var song = '<li id="' + track._id + '" ' + ' class="' + songIndex +'" ondblclick="setupPlayer(this)"><p class="title">' + track.name + '</p>' + '<p class="artist"><a href="Artists.html">' + getArtistById(track.artist) + '</a></p>' + '<p class="album"><a href="Albums.html">' + getAlbumById(track.album) + '</a></p>' + '<p class="time">' + timeToMinutes(track.duration) + '</p></li>';
        songIndexGlobal++;
        songsFounded = songsFounded + song;

    }

    document.getElementById("music").innerHTML = songsFounded;
}






/**
* This function setups the player. More specifically:
* - It should create an audio element and append it in the body
*
* - The audio element should load by default the first track of your library
*
* - When the track is paused and you click on the play button of exercise one,
*   it should play the current track and switch the icon of the button to 'pause'.
*   You don't need to use the checkbox hack for toggling the icons. You might as well
*   use Javascript.
*
* - When the track is playing and you click on the pause button of exercise one,
*   it should pause the current track and switch the icon of the button to 'pause'.
*
*
* Optionally:
* - When the track is playing the progress bar should be updated to reflect the progress
*
* - When the progress bar is clicked the current time of the player should skip to
*  the corresponding time (that is, if the click was on the 2/3 of the total width
*  of the bar, the track current time should be the 2/3 of the total duration). Also
*  the progress bar should be updated.
*
* - As the track is playing the elapsed time should be updated
*
* - Implement a volume bar that does what the progress bar does for sound but for volume.
*
* - When a track is clicked from the library, your player should start playing it
*
* - When a track finishes your player should play the next one
*/
function setupPlayer(songSent) {

    var playingArtist;
    var playingAlbum;
    var playingArtwork;
    var playingArtworkSource;
    var playingSong;


    if (songSent) {
        var songId = songSent.getAttribute("id");

        playingSong = getSongById(songId);


        playingArtist = getArtistById(playingSong.artist);

        playingAlbum = getAlbumById(playingSong.album);
        playingArtwork = getAlbumObjectById(playingSong.album);
        playingArtworkSource = playingArtwork.artwork;

        currentSongIndexNumber = songSent.getAttribute("class");

    }
    else {

    playingSong = window.data.tracks[0];
    playingArtist = getArtistById(playingSong.artist);
    playingAlbum = getAlbumById(playingSong.album);
    playingArtwork = getAlbumObjectById(playingSong.album);
    playingArtworkSource = playingArtwork.artwork;
    currentSongIndexNumber = "0";
    }


    document.getElementById("currentTrackArtist").innerHTML = playingArtist;
    document.getElementById("currentTrackName").innerHTML = playingSong.name;
    document.getElementById("currentTrackAlbum").innerHTML = playingAlbum;
    document.getElementById("albumcover").setAttribute("src", playingArtworkSource);


    var track1 = document.createElement("audio");

    var source = document.createAttribute("src");
    var identification = document.createAttribute("id");

    source.value = playingSong.file;
    identification.value = "songPlaying";

    track1.setAttributeNode(source);
    track1.setAttributeNode(identification);

    track1.addEventListener('timeupdate', UpdateTheTime, false);
    track1.addEventListener('durationchange', SetTotal, false);
    track1.addEventListener('ended', function(){

        //Code here what happens when ended, mimic the setup player.


        var nextSongIndexNumber = (parseInt(currentSongIndexNumber,10) + 1);
        var nextSongClass = nextSongIndexNumber.toString();
        var nextSong = document.getElementsByClassName(nextSongClass)[0];
        setupPlayer(nextSong);
//        songId = nextSong[0].getAttribute("id");
//
//        playingSong = getSongById(songId);
//        playingArtist = getArtistById(playingSong.artist);
//        playingAlbum = getAlbumById(playingSong.album);
//        playingArtwork = getAlbumObjectById(playingSong.album);
//        playingArtworkSource = playingArtwork.artwork;
//        currentSongIndexNumber = nextSong.getAttribute("class");
//
//        console.log(playingSong);
    });

    console.log(playingSong);
    if(songSent){
        var lala = document.getElementById("track");
        lala.removeChild(lala.childNodes[ lala.childNodes.length - 1 ] );
        //This removes the previous generated audio file, to update with the new one.
    }


    document.getElementById("track").appendChild(track1);

    if(songSent){

        if (document.getElementById("toggle-1").checked){
            document.getElementById("clickable").click();
        }
        else {
            document.getElementById("songPlaying").play();
        }
    }
    UpdateTheTime();


//Parts of this taken almost directly from a stackoverflow post, could have rewritten it myself but I would've done the same thing
    function UpdateTheTime() {
        var sec = track1.currentTime;
        track1.volume = 1;
        var min = Math.floor(sec / 60);
        sec = Math.floor(sec % 60);
        if (sec.toString().length < 2) sec = "0" + sec;
        if (min.toString().length < 2) min = "0" + min;
        document.getElementById('timer').innerHTML = min + ":" + sec + "/";
        var bar = document.getElementById("progressBar");
        bar.setAttribute("max", track1.duration.toString());
        bar.setAttribute("value", track1.currentTime.toString());
    }
    function SetTotal() {
        var sec = track1.duration;
        var min = Math.floor(sec / 60);
        sec = Math.floor(sec % 60);
        if (sec.toString().length < 2) sec = "0" + sec;
        if (min.toString().length < 2) min = "0" + min;
        document.getElementById('timer2').innerHTML = "/" + min + ":" + sec;
    }

}

function playpause(){

    var status = false;
    return function(){
        if (status){
            //what happens if you call it while it is playing
            status = false;
            document.getElementById("songPlaying").pause();


        }
        else{
            //what happens if you call it while it is paused
            status = true;
            document.getElementById("songPlaying").play();

        }


    }
}

var playorpause = playpause();



function newPlaylist(){
    var list = document.getElementById("play-lists");

    var appendable = document.createElement("li");
    appendable.setAttribute("ondblclick", "editName(this)");

    appendable.setAttribute("onkeydown", 'if (event.keyCode == 13){doneEditing(this)} if(event.keyCode == 27){cancelEditing(this)}');
    appendable.setAttribute("focusout","doneEditing(this)");

    var image = document.createElement("img");
    image.setAttribute("src", "CSS/Resources/playlist.png");

    image.setAttribute("alt", "");

    var anchor = document.createElement("a");
    anchor.setAttribute("href", "#");
    anchor.textContent = "New Playlist";
    appendable.appendChild(image);

    appendable.appendChild(anchor);

    list.appendChild(appendable);


    var playlistId = localStorage.getItem("playlistIdCounter");
    console.log(playlistId);
    var playlistIdInt = parseInt(playlistId,10);


    localStorage.setItem("playlistIdCounter", playlistIdInt+1);

    var playlistToBeAdded = new playlist(playlistId, "New Playlist", "01", []);

    console.log(playlistToBeAdded);
    savePlaylist(playlistToBeAdded);


}

function editName(dom){
    dom.children[1].setAttribute("contentEditable","true");

}

function doneEditing(dom){
    dom.children[1].setAttribute("contentEditable","false");

    if (dom.children[1].textContent == ""){
        cancelEditing(dom);
        return;
    }


    var playlistId = dom.getAttribute("id");
    console.log(playlistId);
    var playlistsNow = (JSON.parse(localStorage.playlists));
    console.log(playlistsNow);
    for (var i in playlistsNow){

        if (playlistsNow[i]._id == playlistId ){
            console.log(dom.children[1].textContent);


            playlistsNow[i].name = dom.children[1].textContent;

        }
    }

    localStorage.playlists = JSON.stringify(playlistsNow);

}


function cancelEditing(dom){
    dom.children[1].setAttribute("contentEditable","false");

    var playlistId = dom.getAttribute("id");

    var playlistsNow = (JSON.parse(localStorage.playlists));

    for (var i in playlistsNow){

        if (playlistsNow[i]._id == playlistId ){
            console.log(dom.children[1].textContent);


            dom.children[1].innerHTML = playlistsNow[i].name;

        }
    }
}