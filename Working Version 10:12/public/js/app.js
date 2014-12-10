/* Setup on Page Load */

//<!-- build:remove -->
window.onload = loadpage;

function loadpage(){

    bindMenu();

    updatePage();

    setUser();

    setupPlayer();

    setupSearch();

    inactivityTime();

    setupAddTrack();

    //must handle errors -daniel

    setupPlaylists();

    //@DIN: mastery 9 - shared playlists - working on.
    setupFollowedPlaylists();

}

function displayPlayer(){
    content.removeAttribute("style");
    if(document.getElementById('tracks-list')) document.getElementById('tracks-list').removeAttribute("style");
    else if(document.getElementById('artists-list')) document.getElementById('artists-list').removeAttribute("style");
    else if(document.getElementById('albums-list')) document.getElementById('albums-list').removeAttribute("style");
    document.getElementsByClassName('player')[0].removeAttribute("style")
}

function setUser(){
    if (window.location.search.slice(1)){
        var userId = window.location.search.slice(1);
        doJSONRequest("GET", "/users/" + userId, null, null, function(data){
            sessionStorage.setItem("userName",data.userName);
            sessionStorage.setItem("user", userId);

        });
    }

    var user = document.getElementById("currentUser");
    if(user.innerHTML == "User"){
        user.innerHTML = sessionStorage.getItem("userName");
    }
//    console.log(sessionStorage)
//    document.get
    window.location.href ="http://localhost:3000/#library";
}


var inactivityTime = function () {
//    var currentUser = document.getElementById("currentUser");
//    console.log(currentUser);
//    var currentUserName = document.location.hash.substr(1);
//    currentUser.innerHTML = currentUserName;


    var time;
    window.onload = resetTimer;

    document.onmousemove = resetTimer;
    document.onkeypress = resetTimer;



    function logout() {

        window.location.href = "/logout";
        sessionStorage.clear()
        alert("Bye bye, 10 minutes have passed")
        //location.href = 'logout.php'

    }

    function resetTimer() {
        clearTimeout(time);
        time = setTimeout(logout, 600000)
    }
};



function bindMenu(){
  var menu = document.querySelectorAll("#main-menu > li > a");

  for (var elem = 0; elem < menu.length; ++elem) {
    //console.log(menu[elem])
    if(menu[elem].getAttribute("href").indexOf("library.html") > -1){
      menu[elem].onclick = function(e){
        drawLibrary(e);
        setupPlayer();
      }
    }
    else if(menu[elem].getAttribute("href").indexOf("artists.html") > -1)
      menu[elem].onclick = drawArtists;
    else if(menu[elem].getAttribute("href").indexOf("albums.html") > -1)
      menu[elem].onclick = drawAlbums;
    else if(menu[elem].getAttribute("href").indexOf("videos.html") > -1)
      menu[elem].onclick = drawVideos;
    else if(menu[elem].getAttribute("href").indexOf("friends.html") > -1)
        menu[elem].onclick = drawFriends;


  }
}

//<!-- /build -->

/* UI */

/* Library */

function drawLibrary(e, addHistory){

  if(e && e.target){
    e.preventDefault();
  }

  addLibraryToHistory(addHistory);


  //execute the AJAX call to the get tracks
  doJSONRequest("GET", "/tracks", null, null, renderTracks);

  function renderTracks(tracks){

    var tracksData = buildTracksData(tracks);

    var data = {
      "tracks" : tracksData
    };

      dust.render("tracks", data, function(err, out) {

      var content = document.getElementById("content");

      content.innerHTML = out;

      displayPlayer()

      bindAlbumLink();

      bindArtistLink();

      bindTracksDelete();

      bindEditTrackName();

    });

  }
}

function buildTracksData(tracks){
    console.log("ciao")

  var tracksData = [];

  for(track in tracks){

    var newTracksData = {};
    newTracksData.artist = {};
    newTracksData.album = {};

    newTracksData.name = tracks[track].name;
    newTracksData._id = tracks[track]._id;
    newTracksData.duration = formatTime(tracks[track].duration);

    newTracksData.artist._id = tracks[track].artist._id;
    newTracksData.artist.name = tracks[track].artist.name;

    newTracksData.album._id = tracks[track].album._id;
    newTracksData.album.name = tracks[track].album.name;
    
    newTracksData.vid = tracks[track].video;

    tracksData.push(newTracksData);

  }

  return tracksData;

}

function addLibraryToHistory(addHistory){
  if((("undefined" == typeof addHistory)
    || (addHistory === null))
    || addHistory==true){

    var state = {
      'function' : 'drawLibrary'
    };

    addToHistory(JSON.stringify(state), "/#library");
  }
}

function bindTracksDelete(){
  var tracks = document.querySelectorAll(".fl-tl-delete a");

  for (var elem = 0; elem < tracks.length; ++elem) {
    tracks[elem].onclick = deleteTrack;
  }
}

//@DIN: DELETE FUNCTIONALITY DATABASE CONSISTENCY
function deleteTrack(e){

    var href;
    var target = e.target;

    if(e && e.target){
        e.preventDefault();
        href = target.getAttribute("href");
    }

    var trackID = href.split("/")[1]

    //get to-delete track details
    var getTrack = "tracks/" + trackID
    doJSONRequest("GET", getTrack, null, null, getTrackDetails)
    function getTrackDetails(track) {
        //console.log(track)
        //console.log(track.artist._id)
        //console.log(track.album._id)
        var trackArtistID = track.artist._id;
        var trackAlbumID = track.album._id;


        //execute the AJAX call to the delete a single album
        doJSONRequest("DELETE", href, null, null, removeTrackCheckArtistCheckAlbums);

        function removeTrackCheckArtistCheckAlbums() {

            var toDelete = target.parentNode.parentNode;
            var parent = document.getElementById("tracks-list");

            parent.removeChild(toDelete);
        }

        //check if any remaining track has just-deleted-tracks-Album/Artist
        doJSONRequest("GET", "/tracks", null, null, checkOtherAlbumsOtherArtists);
        function checkOtherAlbumsOtherArtists(tracks) {
            var otherAlbum = false;
            var otherArtist = false;

            tracks.forEach(function(track) {
                if (track.album._id == trackAlbumID) {
                    otherAlbum = true;
                }

                if (track.artist._id == trackArtistID) {
                    otherArtist = true;
                }
            })

            if (!otherAlbum) {
                //console.log("no remaining tracks in album!")
                var toRemoveAlbum = "albums/" + trackAlbumID
                doJSONRequest("DELETE", toRemoveAlbum, null, null, albumRemoved);
                function albumRemoved() {
                    //album removed from database - will not be rendered in albums view

                    if (!otherArtist) {
                        //console.log("no remaining tracks in artist!")
                        var toRemoveArtist = "artists/" + trackArtistID
                        doJSONRequest("DELETE", toRemoveArtist, null, null, artistRemoved);
                        function artistRemoved() {
                            //artist removed from database - will not be rendered in artists view
                        }
                    }
                }
            }
        }
    }
    var index = findTrackIndexById(target.parentNode.parentNode.id);
    var currentID = tracks[CurrentSong]._id;

    if (oldCurrentSong > 0 ) var oldID = tracks[oldCurrentSong]._id;

    if (currentID == tracks[index]._id){
        document.getElementById("next").click();
        currentID = tracks[CurrentSong]._id;
    }
    tracks.splice(index, 1);

    CurrentSong = findTrackIndexById(currentID);
    oldCurrentSong = findTrackIndexById(oldID);
}

  function bindEditTrackName(){

    var tracksName = document.querySelectorAll("#tracks-list > div > div.fl-tl-name > span + .edit-btn");

    for (var elem = 0; elem < tracksName.length; ++elem) {
      tracksName[elem].onclick = editTrackName;
    }

  }

  function editTrackName(e){

    if(e && e.target){
      e.preventDefault();
    }

    var target = e.target;

    //console.log(target);

    var editable = target.previousSibling;

    //console.log(editable.contentEditable);
    //console.log(editable.contentEditable ==  "false");

    if(editable.contentEditable == "false" || editable.contentEditable == "inherit"){ //we have to enable the editing

      editable.contentEditable = "true";

      removeClass(target.firstChild, "fa-pencil");

      removeClass(target.firstChild, "fl-tl-pencil");

      addClass(target.firstChild, "fa-check");

      addClass(target.firstChild, "fl-tl-check");

      //set the cursor on the editable element
      var s = window.getSelection(),
      r = document.createRange();
      r.setStart(editable, 0);
      r.setEnd(editable, 0);
      s.removeAllRanges();
      s.addRange(r);

    } else { //we have to save the modified name

      var href = editable.getAttribute("href");

      //send the data to the server
      var newName = editable.innerText;

      var updatedTrack = {
        'name' : newName
      }

      doJSONRequest("PUT", href, null, updatedTrack, disableEditing);

      function disableEditing(){

        editable.contentEditable = "false";

        removeClass(target.firstChild, "fa-check");

        removeClass(target.firstChild, "fl-tl-check");

        addClass(target.firstChild, "fa-pencil");

        addClass(target.firstChild, "fl-tl-pencil");

      }

    }

  }

  /* Library */

 //@DIN: /* VIDEO */
function drawVideos(e, addHistory){

    if(e && e.target){
        e.preventDefault();
    }

    addLibraryToHistory(addHistory);

    //remove player (works but need to re-render it in other pages)
    //var player = document.getElementsByClassName("player")[0]
    //player.innerHTML = ""

    //execute the AJAX call to the get tracks
    doJSONRequest("GET", "/tracks", null, null, renderTracks);

    function renderTracks(tracks){

        var tracksData = buildTracksData(tracks);

        var data = {
            "tracks" : tracksData
        };

        dust.render("video", data, function(err, out) {

            var content = document.getElementById("content");

            content.innerHTML = out;

            content.setAttribute("style","height:715px")
            document.getElementById('tracks-list').setAttribute("style","height:715px")
            document.getElementsByClassName('player')[0].setAttribute("style","display:none")

            setupPlayer();

            bindTracksLink();

            bindAlbumLink(); //could be removed, no albums in Video view

            bindArtistLink();

            bindTracksDelete();

            bindEditTrackName();

        });

    }
}

function bindTracksLink() {

        var tracks = document.querySelectorAll(".track-link");

        for (var elem = 0; elem < tracks.length; ++elem) {
            //console.log(albums[elem])
            tracks[elem].onclick = playTrackVideo;
        }

}

function playTrackVideo(e, addHistory) {

    var href;

    if(e && e.target){
        e.preventDefault();
        href = e.target.getAttribute("href");
    } else {
        href = e;
    }

    console.log(href)

    var trackID = href.split("/")[1]
    var getTrack = "tracks/" + trackID
    //get track to get youtube video link
    doJSONRequest("GET",getTrack, null, null, playVideo)

    function playVideo(track) {
        console.log(track)
        console.log(track.video)

        var videoPlayer = document.getElementsByClassName("videoPlayer")[0]
        var fillVideoPlayer = "<iframe width='1000' height='500' src='//www.youtube.com/embed/" + track.video + "'frameborder='2' allowfullscreen></iframe" + ">"

        videoPlayer.innerHTML = fillVideoPlayer;


        }



}

  /* Artists */

  function drawArtists(e, addHistory){
    if(e && e.target){
      e.preventDefault();
    }

    addArtistsToHistory(addHistory);

  //execute the AJAX call to get the artists
  doJSONRequest("GET", "/artists", null, null, renderArtists);

  function renderArtists(artists){
    //create the data object with the structure expected by the compiled view
    var data = {
      "artists" : artists
    }

    dust.render("artists", data, function(err, out) {

      var content = document.getElementById("content");

      content.innerHTML = out;

      displayPlayer();

      bindArtistLink();

      bindArtistDelete();

    });

    //console.log(artists);
  }

}

function addArtistsToHistory(addHistory){
 if((("undefined" == typeof addHistory)
  || (addHistory === null))
  || addHistory==true){
  var state = {
    'function' : 'drawArtists'
  };

  addToHistory(JSON.stringify(state), "/#artists");
}
}

function drawArtist(e, addHistory){

  var href;

  if(e && e.target){
    e.preventDefault();
    href = e.target.getAttribute("href");
  } else {
    href = e;
  }

  addArtistToHistory(href, addHistory)

    //execute the AJAX call to the get a single artist
    doJSONRequest("GET", href, null, null, renderArtist);

    function renderArtist(artist){

        //we need the artist's tracks
        doJSONRequest("GET", "/tracks?filter=" + encodeURIComponent(JSON.stringify({'artist' : artist._id})), null, null, renderShowArtist);

        function renderShowArtist(tracks){

          var artistData = [];
          var artistTracks = buildTracksData(tracks);

          artistData.artwork = artist.artwork;
          artistData._id = artist._id;
          artistData.name = artist.name;
          artistData.genre = artist.genre;

          var data = {
            "artist" : artistData,
            "tracks" : artistTracks
          };

          dust.render("artist", data, function(err, out) {

            var content = document.getElementById("content");

            content.innerHTML = out;

              displayPlayer();

              setupPlayer();

            bindArtistLink();

            bindAlbumLink();

            bindTracksDelete();

            bindEditTrackName();

          });
        }

      }
    }

    function addArtistToHistory(href, addHistory){
      if((("undefined" == typeof addHistory)
        || (addHistory === null))
        || addHistory==true){
        var state = {
          'function' : 'drawArtist',
          'href'   : href
        };

        addToHistory(JSON.stringify(state), "/#" + href);
      }
    }

    function bindArtistLink(){
      var artists = document.querySelectorAll(".artist-link");

      for (var elem = 0; elem < artists.length; ++elem) {
        //console.log(artists[elem])
        artists[elem].onclick = drawArtist;
      }
    }

    function bindArtistDelete(){
      var artists = document.querySelectorAll(".delete-btn");

      for (var elem = 0; elem < artists.length; ++elem) {
      //console.log(albums[elem])
      artists[elem].onclick = deleteArtist;
    }
  }

//@DIN DELETE FUNCTIONALITY DATABASE CONSISTENCY
function deleteArtist(e){

    var href;
    var target = e.target;

    if(e && e.target){
        e.preventDefault();
        href = target.getAttribute("href");
    }

    var artistID = href.split("/")[1]

    //deleting an Artist --> FIRST need to delete all their tracks + albums !

    //AJAX request to get all tracks - remove each track with artistID
    doJSONRequest("GET", "/tracks", null, null, removeArtistTracks);

    function removeArtistTracks(tracks) {

        tracks.forEach(function (track) {
            if (track.artist._id == artistID) {

                var trackToDelete = "tracks/" + track._id

                //execute the AJAX call to delete a single track
                doJSONRequest("DELETE", trackToDelete, null, null, removeTrack);

                function removeTrack() {

                    //track removed from database - will then not be rendered in tracks view

                }

            }
        })

        //AJAX request to get all albums - remove each album with artistID
        doJSONRequest("GET", "/albums", null, null, removeArtistAlbums);

        function removeArtistAlbums(albums) {

            albums.forEach(function (album) {

                if (album.artist._id == artistID) {

                    var albumToDelete = "albums/" + album._id

                    //execute the AJAX call to delete a single album
                    doJSONRequest("DELETE", albumToDelete, null, null, removeAlbum);

                    function removeAlbum() {

                        //album removed from database - will then not be rendered in album view

                    }

                }
            })

            //ONLY NOW that tracks and albums have been deleted - can safely delete artist
            doJSONRequest("DELETE", href, null, null, removeArtist);

            function removeArtist() {

                //console.log(responseText);

                //console.log(target);

                var toDelete = target.parentNode.parentNode;
                var parent = document.getElementById("artists-list");

                parent.removeChild(toDelete);

            }
        }
    }
}

  /* Artists */

  /* Albums */

  function drawAlbums(e, addHistory){
    if(e && e.target)
      e.preventDefault();

    addAlbumsToHistory(addHistory);

  //execute the AJAX call to the get albums
  doJSONRequest("GET", "/albums", null, null, renderAlbums);

  function renderAlbums(albums){

    var albumData = [];

    for(album in albums){

      var newAlbumData = {};
      newAlbumData.artist = {};

      newAlbumData.artwork = albums[album].artwork;
      newAlbumData._id = albums[album]._id;
      newAlbumData.name = albums[album].name;
      newAlbumData.artist._id = albums[album].artist._id;
      newAlbumData.artist.name = albums[album].artist.name;

      albumData.push(newAlbumData);

    }

    var data = {
      "albums" : albumData
    };

    dust.render("albums", data, function(err, out) {

      var content = document.getElementById("content");

      content.innerHTML = out;

      displayPlayer();

      bindAlbumLink();

      bindAlbumDelete();

      bindArtistLink();

    });

  }

}

function addAlbumsToHistory(addHistory){
  if((("undefined" == typeof addHistory)
    || (addHistory === null))
    || addHistory==true){
    var state = {
      'function' : 'drawAlbums'
    };

    addToHistory(JSON.stringify(state), "/#albums");
  }
}

function drawAlbum(e, addHistory){
  var href;

  if(e && e.target){
    e.preventDefault();
    href = e.target.getAttribute("href");
  } else {
    href = e;
  }

  addAlbumToHistory(href, addHistory);

    //console.log(target.getAttribute("href"));

    //execute the AJAX call to the get a single album
    doJSONRequest("GET", href, null, null, renderAlbum);

    function renderAlbum(album){

        //we need the album's tracks
        doJSONRequest("GET", "/tracks?filter=" + encodeURIComponent(JSON.stringify({'album' : album._id})), null, null, renderShowAlbum);

        function renderShowAlbum(tracks){

          var albumData = [];
          var albumTracks = buildTracksData(tracks);

          albumData.artist = {};

          albumData.artwork = album.artwork;
          albumData._id = album._id;
          albumData.name = album.name;
          albumData.label = album.label;
          albumData.dateReleased = album.dateReleased.split("T")[0];
          albumData.artist._id = album.artist._id;
          albumData.artist.name = album.artist.name;

          var data = {
            "album" : albumData,
            "tracks" : albumTracks
          };

          dust.render("album", data, function(err, out) {

            var content = document.getElementById("content");

            content.innerHTML = out;

            displayPlayer();

            bindAlbumLink();

            setupPlayer();

            bindArtistLink();

            bindTracksDelete();

            bindEditTrackName();

          });

        }

      }
    }

    function addAlbumToHistory(href, addHistory){
      if((("undefined" == typeof addHistory)
        || (addHistory === null))
        || addHistory==true){
        var state = {
          'function' : 'drawAlbum',
          'href'   : href
        };

        addToHistory(JSON.stringify(state), "/#" + href);
      }
    }

    function bindAlbumLink(){
      var albums = document.querySelectorAll(".album-link");

      for (var elem = 0; elem < albums.length; ++elem) {
      //console.log(albums[elem])
      albums[elem].onclick = drawAlbum;
    }
  }

  function bindAlbumDelete(){
    var albums = document.querySelectorAll(".delete-btn");

    for (var elem = 0; elem < albums.length; ++elem) {
      //console.log(albums[elem])
      albums[elem].onclick = deleteAlbum;
    }
  }

function deleteAlbum(e){

    var href;
    var target = e.target;

    if(e && e.target){
        e.preventDefault();
        href = target.getAttribute("href");
    }

    var albumID = href.split("/")[1]

    //remove all tracks that belong to the Album
    doJSONRequest("GET", "/tracks", null, null, removeAlbumTracks);

    function removeAlbumTracks(tracks) {

        tracks.forEach(function (track) {
            if (track.album._id == albumID) {

                var trackToDelete = "tracks/" + track._id

                //execute the AJAX call to delete a single track
                doJSONRequest("DELETE", trackToDelete, null, null, removeTrack);

                function removeTrack() {
                    //track removed from database - will then not be rendered in tracks view
                }

            }
        })

        //get albums artist
        var getAlbum = "albums/" + albumID
        doJSONRequest("GET", getAlbum, null, null, getAlbumArtist);
        function getAlbumArtist(album) {

            //console.log(album)

            var artistID = album.artist._id;


            //Only now execute the AJAX call to the delete a single album
            doJSONRequest("DELETE", href, null, null, removeAlbumCheckArtist);

            function removeAlbumCheckArtist() {

                var toDelete = target.parentNode.parentNode;
                var parent = document.getElementById("albums-list");

                parent.removeChild(toDelete);


                //check all other albums - if there is no other with just-deleted-album-ARTIST, -> remove artist
                doJSONRequest("GET", "/albums", null, null, checkOtherAlbums)
                function checkOtherAlbums(albums) {
                    var otherAlbum = false;

                    //console.log(albums)

                    albums.forEach(function(album) {
                        if (album.artist._id == artistID) {
                            otherAlbum = true;
                        }
                    })

                    if (!otherAlbum) {
                        //console.log("no other albums!!")
                        var toRemoveArtist = "artists/" + artistID
                        doJSONRequest("DELETE", toRemoveArtist, null, null, artistRemoved);

                        function artistRemoved() {
                            //artist removed from database - will not be rendered in artists view
                        }
                    }
                }
            }
        }
    }
}
  /* Albums */

  /* UI */

  /* History Navigation */

  /*
 * The addToHistory function push the @param{state} and the @param{url} in the history State
 *
 * @param {JSON String} state The current state of the search form's button
 * @param {String} url The current url as long with the hash
 */
 function addToHistory(state, url){

  history.pushState(state, null, url);

  //console.log("Added to history: " + url + ", state: " + state);

}

/*
 * The updatePage function handles the update of the page when an onpopstate or onload event is fired.
 * The function gets the hash and the current state, calls the ajaxFind function to update the view
 * and update the form's input value with the data retrieved from the hash
 *
 * @param {JSON String} state The current state of the search form's button
 * @param {String} url The current url as long with the hash
 */
 function updatePage(event) {

  //get reference to the hash and to the current state
  var hash = document.location.hash;
  if(event && event.state)
    var currentState = JSON.parse(event.state);

  if(currentState){

    //console.log(hash);
    //console.log(currentState);

    if(currentState.function == 'drawLibrary')
      drawLibrary(null, false);
    else if(currentState.function == 'drawArtist')
      drawArtist(currentState.href, false);
    else if(currentState.function == 'drawAlbum')
      drawAlbum(currentState.href, false);
    else if(currentState.function == 'drawAlbums')
      drawAlbums(null, false);
    else if(currentState.function == 'drawArtists')
      drawArtists(null, false);

  } else if(hash){

    //console.log(hash);
    //console.log(currentState);

    if(hash.indexOf("library") > -1)
      drawLibrary(null, false);
    else if(hash.indexOf("#artists/") > -1)
      drawArtist(hash.replace("#",""), false);
    else if(hash.indexOf("#albums/") > -1)
      drawAlbum(hash.replace("#",""), false);
    else if(hash.indexOf("albums") > -1)
      drawAlbums(null, false);
    else if(hash.indexOf("artists") > -1)
      drawArtists(null, false);

  } else {
    drawLibrary(null, false);
  }

}

//bind the window onpopstate event to the updatePage function
window.onpopstate = updatePage;

/* History Navigation */

/* Playlist: Not working after the switch to AJAX */
function setupPlaylists() {
    //currently implemented with specific user from seed: ID -> 547db3471547ae200c3368f3
    //var userID = "5486d72319bd68a12accbf0e"
    var userID = sessionStorage.getItem("user")


    loadPlaylistsFromDatabase();

    var createPlBtn = document.getElementById("create-pl-btn");
    createPlBtn.addEventListener('click', function () {

        //still used to maintain playlist count.. needed?
        localStorage.pl_cnt = localStorage.pl_cnt || 0;
        var cnt = localStorage.pl_cnt;
        var _id = "pl-" + cnt
        var name = 'New Playlist ' + (++cnt);
        var newPlaylist = {"name" : name,
            "tracks" : []}

        //update localStorage counter
        localStorage.pl_cnt = cnt;

        //persist to localStorage (??)
        // savePlaylist(newPlaylist);


        //save to DATABASE
        // >> Get all current playlists
        // >> Add newly added playlist to list of playlists
        // >> PUT new list of playlists in database
        doJSONRequest("GET", "/users/" + userID + "/playlists", null, null, addNewPlaylist);

        function addNewPlaylist(playlists) {

            var newPlaylistList = playlists
            newPlaylistList[newPlaylistList.length] = newPlaylist;

            doJSONRequest("PUT", "/users/" + userID + "/playlists", null, newPlaylistList, newPlaylistAdded)

            function newPlaylistAdded() {

                doJSONRequest("GET", "/users/" + userID + "/playlists", null, null, getNewPlaylist)

                function getNewPlaylist(newPlaylists) {

                    var newlyAddedPlaylist = newPlaylists[newPlaylists.length-1]
                    appendNewPlaylistToMenu(newlyAddedPlaylist);

                }
            }


        }

    })

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            return onEditPlaylistClicked(e.target)
        }

        if (e.target.classList.contains('pl-name-input')) {
            return e.preventDefault();
        }

        if (e.target.classList.contains('pl-name')) {
            e.preventDefault();
            return onPlaylistClicked(e.target)
        }

        //the click was outside an edit element, close currently edited ones
        var currentlyEditing = document.querySelectorAll('#playlists > li.edit .edit-btn');
        for (var i = currentlyEditing.length - 1; i >= 0; i--) {
            onEditPlaylistClicked(currentlyEditing[i]);
        }
        ;

    });

}

function loadPlaylistsFromDatabase() {

    console.log("loadPlaylists")

    //get user playlists
    //currently implemented with specific user from seed: ID -> 547db3471547ae200c3368f3
    //var userID = "5486d72319bd68a12accbf0e"
    var userID = sessionStorage.getItem("user")


    doJSONRequest("GET", "/users/" + userID + "/playlists", null, null, renderPlaylists);

    function renderPlaylists(playlists) {

        console.log("renderPlaylists")

        playlists.forEach(function(pl) {

            appendNewPlaylistToMenu(pl)
        })
    }

}

function allowDrop(evt) {
  evt.preventDefault();
}

function drag(evt) {
  evt.dataTransfer.setData("text/plain", evt.currentTarget.id);
}

function drop(evt) {
  evt.preventDefault();
  var trackId = evt.dataTransfer.getData("text/plain");
  var playlistId = evt.currentTarget.id
  addTrackToPlaylist(playlistId, trackId)
}

function addTrackToPlaylist(playlistId, trackId) {

    var userID = sessionStorage.getItem("user")

    //var userID = "5486d72319bd68a12accbf0e"
    //get playlist
    doJSONRequest("GET", "/users/" + userID + "/playlists", null, null, updatePlaylistTracks)

    function updatePlaylistTracks(playlists) {

        var newPlaylists = playlists;

        //find specific playlist
        playlists.forEach(function (playlist) {

            if (playlist._id == playlistId) {

                console.log("Current tracks: ", playlist.tracks)
                //add new track to old trackslist
                playlist.tracks[playlist.tracks.length] = trackId
                console.log("Updated tracks: ", playlist.tracks)


                //var tracksArrayJSON = JSON.parse(JSON.stringify(playlist.tracks))

                doJSONRequest("PUT", "/users/" + userID + "/playlists", null, newPlaylists, updatePlaylist)

                function updatePlaylist(something) {
                    console.log(something)
                }

            }
        })
    }
}

function onPlaylistClicked(link){

    console.log("onPlaylistClicked")
    var userID = sessionStorage.getItem("user")
    //var userID = "5486d72319bd68a12accbf0e"


    //get clicked playlist name
    var href = link.href
    var hrefElements = href.split("/")
    var playlistName = decodeURI(href.split("/")[hrefElements.length-1])
    console.log(playlistName)

    //find playlist with corresponding tracks
    doJSONRequest("GET", "users/" + userID + "/playlists", null, null, renderPlaylistTracks);

    function renderPlaylistTracks(playlists) {

        playlists.forEach(function(playlist) {
            if (playlist.name == playlistName) {
                console.log("Found playlist: ", playlist.name, playlistName)

                //in case playlist just added with no added tracks
                var container = document.getElementById('content')
                if (tracks.length < 1) {
                    container.innerHTML = playlist.name + " is empty."
                }

                else {

                    var tracksList = []

                    //get all tracks
                    doJSONRequest("GET", "/tracks", null, null, renderPlaylistTracks)

                    function renderPlaylistTracks(tracks) {

                        //find matching track objects with given track IDs
                        for (var i = 0; i < playlist.tracks.length; i++) {
                            for (var j = 0; j < tracks.length; j++) {
                                if (playlist.tracks[i] == tracks[j]._id) {
                                    tracksList[i] = tracks[j]
                                }
                            }
                        }

                        console.log("trackslist: ", tracksList)

                        //render view with new content
                        var tracksData = buildTracksData(tracksList);

                        var data = {
                            "tracks" : tracksData
                        };

                        dust.render("tracks", data, function(err, out) {

                            var content = document.getElementById("content");

                            content.innerHTML = out;

                            displayPlayer();

                            setupPlayer();

                            bindAlbumLink();

                            bindArtistLink();

                            bindTracksDelete();

                            bindPLTracksDelete(playlistID);

                            bindEditTrackName();

                        });

                    }

                }
            }
        })
    }

}

function bindPLTracksDelete(playlistID){

    console.log("reached bindPL")

    var tracks = document.querySelectorAll(".fl-tl-delete a");

    for (var elem = 0; elem < tracks.length; ++elem) {
        tracks[elem].setAttribute("plID", playlistID)
        tracks[elem].onclick = deletePLTrack;
    }

    console.log(tracks)
}
function deletePLTrack(e) {
    var href;
    var target = e.target;

    if(e && e.target){
        e.preventDefault();
        href = target.getAttribute("href");
    }

    console.log("deletePLTrack")
    console.log(e)
    console.log(e.target.getAttribute("plid"))

    var trackID = href.split("/")[1]
    var playlistID = e.target.getAttribute("plid")
    var userID = sessionStorage.getItem("user")



    doJSONRequest("DELETE", "users/" + userID +"/" + playlistID + "/" + trackID, null, null, trackRemoved)
    //execute the AJAX call to the delete a single album

    function trackRemoved() {
        console.log("removed PLtrack")

        var toDelete = target.parentNode.parentNode;
        var parent = document.getElementById("tracks-list");

        parent.removeChild(toDelete);
    }

}

function onEditPlaylistClicked(btn){
    var id = btn.dataset["for"];
    var el = document.getElementById(id);
    var input = document.querySelector('#'+id + " > input[type='text']");

    if(el.classList.contains("edit")){
        el.classList.remove('edit')
        btn.innerHTML = '<i class="fa fa-pencil" ></i>'
        var input = document.querySelector('#'+id + " > input[type='text']");
        var nameLink =  document.querySelector('#'+id + " > .pl-name");

        //return on empty string
        if(input.value.trim() == '') return;

        nameLink.innerHTML = '<i class="nav-menu-icon fa fa-bars"></i> ' + input.value;
        nameLink.href = "playlists/" + encodeURI(input.value)

        //persist change
        var playlists =  JSON.parse(localStorage.playlists);
        playlists[id]["name"] = input.value;
        localStorage.playlists = JSON.stringify(playlists);
    }else{
        el.classList.add('edit')
        btn.innerHTML = '<i class="fa fa-check" ></i>'
        input.focus();
    }
}



function appendNewPlaylistToMenu(pl){
    console.log("reached appendPlaylist")
    var id = pl._id;
    var name = pl.name;
    var newHtml ='';
    newHtml += '  <li id="' + id + '" ondrop="drop(event)" ondragover="allowDrop(event)">';
    newHtml += '    <a class="pl-name" data-for="' + id + '" href="playlists/' + encodeURI(name) + '">';
    newHtml += '      <i class="nav-menu-icon fa fa-bars"></i>' + name;
    newHtml += '    </a>';
    newHtml += '    <a class="edit-btn" data-for="' + id + '" href="#"><i class="fa fa-pencil"></i></a>';
    newHtml += '    <input  class="pl-name-input" name="' + id + '" type="text" value="' + name + '">';
    newHtml += '  </li>';

    document.getElementById('playlists').innerHTML += newHtml;
}
/* Playlist: Not working after the switch to AJAX */

/* Player */

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

function findTrackIndexById(trackID){
    for (var i = 0 , j = tracks.length; i < j; i++) {
        if (tracks[i]._id == trackID) return i;
    }
    return -1;
}

var tracks = [];
var CurrentSong = 0;
var oldCurrentSong;
var lastSelectedTrack;

function setupPlayer(selectedTrack){

    function setTrack(index, audioElement,tracks){

        if(oldCurrentSong >= 0){
            try{
                var oldTrackId = tracks[oldCurrentSong]._id;
                changePointer(oldTrackId,false)
            } catch (err){}

        }

        var track = tracks[index];

        var trackInfo = document.getElementsByClassName("pl-info-wrapper")[0];
        // set artwork
        trackInfo.firstChild.firstChild.firstChild.setAttribute("style", "background-image: url("+track.album.artwork+")");
        // set title/album
        trackInfo.lastChild.firstChild.setAttribute("href", "#albums/"+track.album._id);
        trackInfo.lastChild.firstChild.innerHTML = track.album.name;
        trackInfo.lastChild.lastChild.firstChild.setAttribute("title", track.artist.name);
        trackInfo.lastChild.lastChild.firstChild.setAttribute("href", "#artists/"+track.artist._id);
        trackInfo.lastChild.lastChild.firstChild.innerHTML = track.name;

        audioElement.src = tracks[index].file;
        changePointer(tracks[index]._id,true);
    }

    function SetPlayback(selectedTrackId, currentId, audioElement){
        if (document.getElementById("shuffle").innerHTML == "shuffle"){

            tracks = shuffleArray(tracks);

            var index = findTrackIndexById(selectedTrackId);
            var b = tracks[index];
            tracks[index] = tracks[0];
            tracks[0] = b;

            CurrentSong = [0];
            oldCurrentSong = findTrackIndexById(currentId);

            setTrack(CurrentSong,audioElement,tracks);

        } else {

            oldCurrentSong = findTrackIndexById(currentId);
            CurrentSong = findTrackIndexById(selectedTrackId);
            setTrack(CurrentSong,audioElement,tracks);
        }
    }

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    function changePointer(id,boolean){
        try{
            var childNodes = document.querySelector('#tracks-list').childNodes;
            for( var i = 0 , j = childNodes.length; i < j ; i++ ){
                if(childNodes[i].id == id ){
                    var pointer = '<i class="fa fa-volume-up"></i>&nbsp;&nbsp;';
                    var str = childNodes[i].firstChild.firstChild.innerHTML
                    if(boolean){

                        childNodes[i].firstChild.firstChild.innerHTML = pointer + str;
                    } else{
                        childNodes[i].firstChild.firstChild.innerHTML = str.substr(pointer.length)
                    }



                    return;
                }
            }
        }catch (err){}
    }


    doJSONRequest("GET", "/tracks", null, null, setupAudioElement);

    function setupAudioElement(trackList) {

        function setTrackListFromHtml(track){
            var songs = [];
            for(var i = 0; i < track.parentNode.childNodes.length; i++){
                songs.push(track.parentNode.childNodes[i].id)
            }
            tracks = [];
            for (var i in trackList){
                if (songs.indexOf(trackList[i]._id) > -1){
                    tracks.push(trackList[i]);
                }
            }
        }

        if (selectedTrack) {
            lastSelectedTrack = selectedTrack;
            var selectedTrackId = selectedTrack.id,
                currentId = tracks[CurrentSong]._id,
                audioElement = document.getElementsByTagName("audio")[0],
                state;
            if (audioElement.paused == false) state = true;

            setTrackListFromHtml(selectedTrack);
            SetPlayback(selectedTrackId, currentId, audioElement);

            if (!state) document.getElementById("play-pause").click();

            audioElement.play();

        } else if (! document.getElementsByTagName("audio")[0]) {
            tracks = [];
            for (var i in trackList) {
                tracks.push(trackList[i]);
            }


            // Buttons
            var playButton = document.getElementById("play-pause");
            var next = document.getElementById("next");
            var previous = document.getElementById("previous");
            //            var fullScreenButton = document.getElementById("full-screen");
            var volumeOff = document.getElementById("volume-off");
            var volumeUp = document.getElementById("volume-up");
            var shuffle = document.getElementById("shuffle");

            // Sliders
            var seekRail = document.getElementById("pl-timeline-rail");
            var seekBar = document.getElementById("pl-timeline-bar");
            var volumeRail = document.getElementById("pl-volume-rail");
            var volumeBar = document.getElementById("pl-volume-bar");

            // Labels
            var timeElapsed = document.getElementById("time-elapsed");
            var timeTotal = document.getElementById("time-total");

            // audio
            var audio = document.createElement('audio');

            audio.addEventListener("loadedmetadata", function () {
                //set total time
                timeTotal.innerHTML = formatTime(Math.floor(audio.duration));

                //set volume
                volumeBar.style.width = (audio.volume * 100) + "%";
            });

            // Set the first track by default
            setTrack(0, audio, tracks);

            document.body.appendChild(audio);

            audio.addEventListener("ended", function () {
                var state = true;
                if (playButton.classList.contains('fa-play')) state = false;
                oldCurrentSong = CurrentSong;
                CurrentSong++;
                if (tracks[CurrentSong]) {
                    setTrack(CurrentSong, audio, tracks);
                    if (state) audio.play();
                } else {
                    CurrentSong = 0;
                    setTrack(CurrentSong, audio, tracks);
                    // Update the seek bar
                    seekBar.style.width = 0 + "%";
                    // Update the elapsed time
                    timeElapsed.innerHTML = formatTime(Math.floor(0));

                    // Update the button icon to 'Pause'
                    playButton.classList.add('fa-play')
                    playButton.classList.remove('fa-pause')
                }
            });

            // Event listener for the play/pause button
            playButton.addEventListener("click", function () {
                if (audio.paused == true) {
                    // Play the track
                    audio.play();

                    // Update the button icon to 'Pause'
                    playButton.classList.remove('fa-play')
                    playButton.classList.add('fa-pause')
                } else {
                    // Pause the track
                    audio.pause();

                    // Update the button icon to 'Play'
                    playButton.classList.remove('fa-pause')
                    playButton.classList.add('fa-play')
                }
            });
            next.addEventListener("click", function () {
                var state = false;
                if (audio.paused == false) state = true;
                oldCurrentSong = CurrentSong;
                CurrentSong++;
                if (tracks[CurrentSong]) {
                    setTrack(CurrentSong, audio, tracks);
                    if (state) audio.play();
                } else {
                    CurrentSong = 0;
                    setTrack(CurrentSong, audio, tracks);
                    // Update the seek bar
                    seekBar.style.width = 0 + "%";
                    // Update the elapsed time
                    timeElapsed.innerHTML = formatTime(Math.floor(0));

                    // Update the button icon to 'Pause'
                    playButton.classList.add('fa-play')
                    playButton.classList.remove('fa-pause')
                }
                audio.currentTime = 0;
                seekBar.style.width = 0 + "%";
                timeElapsed.innerHTML = formatTime(Math.floor(0));
            });

            previous.addEventListener("click", function () {
                if (audio.currentTime < 1.5) {
                    var state;
                    if (audio.paused == false) state = true;
                    oldCurrentSong = CurrentSong;
                    CurrentSong--;
                    if (tracks[CurrentSong]) {
                        setTrack(CurrentSong, audio, tracks);
                        if (state) audio.play();
                    } else {
                        CurrentSong = 0;
                        setTrack(CurrentSong, audio, tracks);
                        // Update the seek bar
                        seekBar.style.width = 0 + "%";
                        // Update the elapsed time
                        timeElapsed.innerHTML = formatTime(Math.floor(0));

                        // Update the button icon to 'Pause'
                        playButton.classList.add('fa-play')
                        playButton.classList.remove('fa-pause')
                    }
                }
                audio.currentTime = 0;
                seekBar.style.width = 0 + "%";
                timeElapsed.innerHTML = formatTime(Math.floor(0));
            });

            shuffle.addEventListener("click", function () {
                var currentId;
                if (shuffle.value == "normal") {

                    shuffle.value = "shuffle";
                    shuffle.classList.add('fa-random');
                    shuffle.classList.remove('fa-retweet');

                    currentId = tracks[CurrentSong]._id;

                    tracks = shuffleArray(tracks);
                    for (var i = 0 , j = tracks.length; i < j; i++) {
                        if (tracks[i]._id == currentId) {
                            var b = tracks[i];
                            tracks[i] = tracks[0];
                            tracks[0] = b;
                            CurrentSong = 0;
                            return
                        }
                    }
                } else {
                    shuffle.value = "normal";
                    shuffle.classList.add('fa-retweet');
                    shuffle.classList.remove('fa-random');

                    currentId = tracks[CurrentSong]._id;
                    if (lastSelectedTrack){
                        setTrackListFromHtml(lastSelectedTrack);
                    } else{
                        tracks = [];
                        for (var i in trackList) {
                            tracks.push(trackList[i]);
                        }
                    }
                    for (var i = 0 , j = tracks.length; i < j; i++) {
                        if (tracks[i]._id == currentId) {
                            CurrentSong = i;
                        }
                    }
                }
            });

            // Event listener for the seek bar
            seekRail.addEventListener("click", function (evt) {
                var frac = (evt.offsetX / seekRail.offsetWidth)
                seekBar.style.width = (frac * 100) + "%";

                // Calculate the new time
                audio.currentTime = audio.duration * frac;
                ;
            });

            // Update the seek bar as the track plays
            audio.addEventListener("timeupdate", function () {
                // Calculate the slider value
                var value = (100 / audio.duration) * audio.currentTime;

                // Update the seek bar
                seekBar.style.width = value + "%";

                // Update the elapsed time
                timeElapsed.innerHTML = formatTime(Math.floor(audio.currentTime));
            });

            // Event listener for the volume bar
            volumeRail.addEventListener("click", function (evt) {
                var frac = (evt.offsetX / volumeRail.offsetWidth)
                volumeBar.style.width = (frac * 100) + "%";

                audio.volume = frac;
            });

            var prevCounter = 0;
            var nextCounter = 0;

            document.addEventListener('keyup',function(evt){
                if (document.activeElement.id != 'main-search' && document.getElementsByClassName('player')[0].getAttribute("style") != "display:none") {
                    if (evt.keyCode == 32) {
                        evt.preventDefault()
                        playButton.click();
                    }
                    else if (evt.keyCode == 37) {
                        evt.preventDefault()
                        if (prevCounter < 5) previous.click();
                        prevCounter = 0;
                    }
                    else if (evt.keyCode == 39) {
                        evt.preventDefault()
                        if (nextCounter < 5) next.click();
                        nextCounter = 0;
                    }
                    else if (evt.keyCode == 80) {
                        evt.preventDefault()
                        shuffle.click()
                    }
                }
            });

            document.addEventListener('keydown',function(evt){
                if (document.activeElement.id != 'main-search' && document.getElementsByClassName('player')[0].getAttribute("style") != "display:none") {
                    if (evt.keyCode == 32) {
                        evt.preventDefault()
                    }
                    else if (evt.keyCode == 38) {
                        evt.preventDefault()
                        if (audio.volume + 0.05 > 1) audio.volume = 1;
                        else audio.volume += 0.05
                        volumeBar.style.width = (audio.volume * 100) + "%";
                    }
                    else if (evt.keyCode == 40) {
                        evt.preventDefault()
                        if (audio.volume - 0.05 < 0) audio.volume = 0;
                        else audio.volume -= 0.05
                        volumeBar.style.width = (audio.volume * 100) + "%";
                    }
                    else if (evt.keyCode == 37) {
                        evt.preventDefault()
                        prevCounter += 1;
                        if (prevCounter > 4) {
                            audio.currentTime -= 0.001 * prevCounter*prevCounter;
                        }
                    }
                    else if (evt.keyCode == 39) {
                        evt.preventDefault()
                        nextCounter += 1;
                        if (nextCounter > 4) {
                            audio.currentTime += 0.001 * nextCounter*nextCounter;
                        }
                    }
                }
            });

            //Click listener for volume buttons
            volumeOff.addEventListener("click", function (evt) {
                volumeBar.style.width = "0%";
                audio.volume = 0;

                volumeOff.classList.add("active")
                volumeUp.classList.remove("active")
            });

            volumeUp.addEventListener("click", function (evt) {
                volumeBar.style.width = "100%";
                audio.volume = 1;

                volumeUp.classList.add("active")
                volumeOff.classList.remove("active")
            });
            console.log("ECCOMIIIII")
        }
        else {
            changePointer(tracks[CurrentSong]._id,true);
        }
    }
}

/* Player */

/*-------------   AddTrack  (Mastery 10)-------------   */
function setupAddTrack() {
    document.getElementById("create-track-btn").addEventListener('click', drawForm);
}

function drawForm(evt) {
    evt.preventDefault();
    dust.render("addTrack", null, function (err, out) {
        var content = document.getElementById("content");
        content.innerHTML = out;
    });
}

function upload() {
    var form = document.getElementById("upload-form");
    var formData = new FormData();
    var audioType = "audio/mp3";
    for (var i = 0; i < form.length - 1; i++) {
        var elem = form.elements[i];
        var name = elem.name;
        var value = elem.value;
        if (name == "file") {
            var file = elem.files[0];
            var filename = value;
            formData.append(name, file, filename);
        } else if (name == "duration") {
            var duration = convertDuration(value);
            formData.append(name, duration);
        } else {
            formData.append(name, value);
        }
    }
    if (file && file.type === audioType) {
        sendAjaxForm("/upload", "post", formData, function () {
            alert("upload successful!!!");
            loadPage();
        });
    } else {
        throw new Error("file not supported");
    }
}

var convertDuration = function (duration) {
    var time = duration.split(':');
    return parseInt(time[0]) * 60 + parseInt(time[1]);
};

/*-------------   Search  (Mastery 8)-------------   */

function setupSearch(){
    var lastValue = '';
    var searchBox = document.getElementById("main-search");
    searchBox.addEventListener("keyup",function(evt){
        var term = this.value;

        if (term != lastValue) {
            lastValue = term;
            listSuggestions(term);
        }
        else if (evt.keyCode == 13){
            search(window.location.hash,term)
        }
    });
}

function listSuggestions(term) {
    if (term === '') document.getElementById('auto_completion').innerHTML = '';
    else{
        if(window.location.hash.indexOf('#library') == 0) doJSONRequest('GET','/tracks',null,null, function(tracksObj){
            searchAndDisplay(tracksObj, term)
        });
        else if(window.location.hash.indexOf('#artists') == 0) doJSONRequest('GET','/artists',null,null, function(artistsObj){
            searchAndDisplay(artistsObj, term)
        });
        else doJSONRequest('GET','/albums',null,null, function(albumsObj){
                searchAndDisplay(albumsObj, term)
            });
    }
}

function searchAndDisplay(jsonObj, term){
    var list = '';
    jsonObj.forEach(function(item){
        if(item.name.toLowerCase().indexOf(term.toLowerCase()) > -1){
            list +='<option value="'+item.name+'">'+item.name+'</option>';
        }
    });
    document.getElementById('auto_completion').innerHTML = list;
}

function search(location,term) {

    if (!location){
        location = "#library";
    }

    var tracksHTML = '<h1>Tracks</h1>',
        albumsHTML = '<h1>Albums</h1>',
        artistsHTML = '<h1>Artists</h1>',
        counter = 0;


    function contentRender(url) {
        doJSONRequest('GET', url, null, null, function (jsonObj) {
            var lis = [];
            jsonObj.forEach(function (item) {
                if (item.name.toLowerCase().indexOf(term.toLowerCase()) != -1)
                    lis.push(item);
            });

            if (url.indexOf('tracks') > -1) {
                if (lis.length == 0) tracksHTML = '<h1>No tracks found</h1>';
                else
                    dust.render('tracks', {tracks: lis}, function (err, html) {
                        tracksHTML += html
                    });
                displayRes();
            }
            else if (url.indexOf('albums') > -1) {
                if (lis.length == 0) albumsHTML = '<h1>No albums found</h1>';
                else
                    dust.render('albums', {albums: lis}, function (err, html) {
                        albumsHTML += html;
                    });
                displayRes();
            } else if (url.indexOf('artists') > -1) {
                if (lis.length == 0) artistsHTML = '<h1>No artists found</h1>';
                else
                    dust.render('artists', {artists: lis}, function (err, html) {
                        artistsHTML += html;
                    });
                displayRes();
            }
        });
    }

    function displayRes(){
        counter ++;
        if (counter == 3){
            counter = 0;
            if (location.indexOf('library') > -1) document.getElementById('content').innerHTML = tracksHTML+artistsHTML+albumsHTML;
            else if (location.indexOf('albums') > -1) document.getElementById('content').innerHTML = albumsHTML+tracksHTML+artistsHTML;
            else if (location.indexOf('artists') > -1) document.getElementById('content').innerHTML = artistsHTML+tracksHTML+albumsHTML;

            setupPlayer();
        }
    }
    contentRender('/tracks');
    contentRender('/albums');
    contentRender('/artists');
}


function drawFriends(e, addHistory){
    if(e && e.target)
        e.preventDefault();


        dust.render("test",null, function(err, out) {

            var content = document.getElementById("content");


            content.style.height = "550px";
            content.style.width = "100%";

            content.innerHTML = out;

            content.setAttribute("style","height:715px")
            document.getElementsByClassName('player')[0].setAttribute("style","display:none")
        });



}

/*****@ Playlist Sharing ******/

function setupFollowedPlaylists() {
    console.log("reached")

    loadFollowedPlaylistsFromDatabase()

    var followPlBtn = document.getElementById("create-follow-btn");
    followPlBtn.addEventListener('click', function () {

        console.log("following")
        choosePlaylist()

    })

    document.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-btn')) {
            return onEditPlaylistClicked(e.target)
        }

        if (e.target.classList.contains('pl-name-input')) {
            return e.preventDefault();
        }

        if (e.target.classList.contains('pl-name')) {
            e.preventDefault();
            return onFollowedPlaylistClicked(e.target)
        }


    })
}

function choosePlaylist() {

    console.log("choosePlaylist")

    //will consist of every playlist from each user (will need to remove OWN playlists (if userID != user._id)
    var allPlaylists = []
    var i = 0;

    //get all users
    doJSONRequest("GET", "users/", null, null, getUserPlaylist)

    function getUserPlaylist(users) {
        users.forEach(function(user) {

            //get all playlists of single user
            doJSONRequest("GET", "users/" + user._id + "/playlists", null, null, collectPlaylists)

            //collect all playlists together
            function collectPlaylists(playlists) {
                playlists.forEach(function(playlist){
                    allPlaylists[i] = playlist;
                    i++
                })

                console.log(allPlaylists)

                //render chooseFLplaylists view
                renderPlaylists(allPlaylists)


            }
        })
    }

}
function renderPlaylists(playlists) {

    var data = {
        "playlists" : playlists
    };

    dust.render("tempFollowPlaylist", data, function(err, out) {

        var content = document.getElementById("content");

        content.innerHTML = out;
    })
    //attach event to each playlist
    bindPlaylist()

}

function bindPlaylist() {
    var playlists = document.querySelectorAll(".followPl");
    console.log("Playlists: ", playlists)

    for (var elem = 0; elem < playlists.length; ++elem) {
        //console.log(playlists[elem].attributes.value.value)
        //var playlistID = playlists[elem].attributes.id.value
        playlists[elem].onclick = followPlaylist;
    }
}

function followPlaylist(e) {

    var userID = sessionStorage.getItem("user")

    console.log("followplaylist - e following")
    console.log(e)

    console.log("lets try")
    console.log(e.srcElement.innerText)
    console.log(e.srcElement.id)

    var playlistName = e.srcElement.innerText;
    var playlistID = e.srcElement.id;


    var playlistObject = { "name" : playlistName,
        "playlistID" : playlistID}

    //put new followedPlaylist in database
    doJSONRequest("GET", "users/" + userID + "/followedPlaylists", null, null, currentFollowedPlaylists)

    function currentFollowedPlaylists(followedPlaylists) {

        var newFollowedPlaylistList = followedPlaylists;
        newFollowedPlaylistList[newFollowedPlaylistList.length] = playlistObject;

        doJSONRequest("PUT", "users/" + userID + "/followedPlaylists", null, newFollowedPlaylistList, updated)

        function updated() {
            console.log("updated")

            doJSONRequest("GET", "users/" + userID + "/followedPlaylists", null, null, updatedFollowedPlaylists)
            function updatedFollowedPlaylists(FLplaylists) {
                var newlyAddedFLPlaylist = FLplaylists[FLplaylists.length-1]

                console.log("about to append new FL playlist")
                console.log(newlyAddedFLPlaylist)
                appendNewFollowedPlaylistToMenu(newlyAddedFLPlaylist)

            }

        }
    }
}


function loadFollowedPlaylistsFromDatabase() {

    console.log("loadFollowedPlaylists")

    //get user playlists
    //currently implemented with specific user from seed: ID -> 547db3471547ae200c3368f3
    //var userID = "5486d72319bd68a12accbf0e"
    var userID = sessionStorage.getItem("user")


    doJSONRequest("GET", "/users/" + userID + "/FollowedPlaylists", null, null, renderFollowedPlaylists);

    function renderFollowedPlaylists(FLplaylists) {

        console.log("renderFollowedPlaylists")

        FLplaylists.forEach(function(pl) {

            appendNewFollowedPlaylistToMenu(pl)
        })
    }

}


function appendNewFollowedPlaylistToMenu(pl) {
    console.log("cefkjbvbwkbvkbvjaebvkbkjb")

    var FLplaylists = document.querySelectorAll("#followedPlaylists > li");
    console.log("querySelector: ", FLplaylists)
    console.log(typeof(FLplaylists))

    var playlistID = pl.playlistID
    var id = pl._id;
    var name = pl.name;

    var alreadyExists = false;
    for (var i=0; i<FLplaylists.length; i++){
        console.log(FLplaylists[i])
        console.log(typeof(FLplaylists[i]))
        console.log(FLplaylists[i].getAttribute("plid"))
        if (FLplaylists[i].getAttribute("plid") == playlistID) {
            alreadyExists = true;
        }
    }


    if (!alreadyExists) {

        var newHtml = '';
        newHtml += '  <li id="' + playlistID + '" plID="' + playlistID + '" +  ondrop="drop(event)" ondragover="allowDrop(event)">';
        newHtml += '    <a class="pl-name" data-for="' + playlistID + '" href="playlists/' + encodeURI(name) + '">';
        newHtml += '      <i class="nav-menu-icon fa fa-bars"></i>' + name;
        newHtml += '    </a>';
        newHtml += '  </li>';

        document.getElementById('followedPlaylists').innerHTML += newHtml;
    }
}


function onFollowedPlaylistClicked(link){
    console.log("onfollowedplaylistclicked")

    var FLplaylistID = link.dataset["for"]
    console.log("FLPLID: ", FLplaylistID)


//        //get clicked playlist name
//        var href = link.href
//        var hrefElements = href.split("/")
//        var FLplaylistName = decodeURI(href.split("/")[hrefElements.length-1])

    //find playlist with corresponding tracks
    doJSONRequest("GET", "users/", null, null, searchInUsers)
    function searchInUsers(users) {

        users.forEach(function(user) {

            doJSONRequest("GET", "/users/" + user._id +"/playlists", null, null, renderFollowedPlaylistTracks)

            function renderFollowedPlaylistTracks(playlists) {
                playlists.forEach(function(playlist){
                    if(playlist._id == FLplaylistID) {
                        renderFollowedPlaylist(playlist)
                    }
                })
            }
        })

    }

}

function getOriginalFLPlaylist(playlistID) {

    doJSONRequest("GET", "users/", null, null, searchUser)

    function searchUser(users) {

        users.forEach(function(user) {

            doJSONRequest("GET", "users/" + user._id + "/playlists", null, null, searchPlaylists)

            function searchPlaylists(playlists) {

                console.log("looking into playlists")

                playlists.forEach(function(playlist) {
                    //console.log("PLID given: ", playlistID)

                    //console.log(playlist)
                    if (playlist._id == playlistID) {

                        console.log("current PLID: ", playlist._id)

                        console.log("FOUND THE PLAYLIST!!!")
                        console.log(playlist)
                        //return playlist;

                        renderFollowedPlaylist(playlist)
                    }
                })
            }
        })
    }
}

function renderFollowedPlaylist(pl) {

    console.log("about to render playlist")
    var playlist = pl
    console.log("this is the playlist: ", pl)
    var tracksList = []

    var playlistID = pl._id
    //get all tracks
    doJSONRequest("GET", "/tracks", null, null, renderFLPlaylistTracks)

    function renderFLPlaylistTracks(tracks) {

        //find matching track objects with given track IDs
        for (var i = 0; i < playlist.tracks.length; i++) {
            for (var j = 0; j < tracks.length; j++) {
                if (playlist.tracks[i] == tracks[j]._id) {
                    tracksList[i] = tracks[j]
                }
            }
        }

        console.log("trackslist: ", tracksList)

        //render view with new content
        var tracksData = buildTracksData(tracksList);

        var data = {
            "tracks" : tracksData
        };

        dust.render("tracks", data, function(err, out) {

            var content = document.getElementById("content");

            content.innerHTML = out;

            bindAlbumLink();

            bindArtistLink();

            bindPLTracksDelete(playlistID);

            //bindPlaylistEditTrackName();

        });

    }
}




