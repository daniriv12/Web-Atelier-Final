/* Setup on Page Load */

//<!-- build:remove -->
window.onload = function(){

  bindMenu();

  updatePage();
  setupPlayer();

  //setupPlaylists();
  setupSearch();

}

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

      bindAlbumLink();

      bindArtistLink();

      bindTracksDelete();

      bindEditTrackName();

    });

  }
}

function buildTracksData(tracks){

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

//NOTE: Still used by setupSearch
function createHTMLLibrary(tracks){
  var newHtml = "";
  tracks.forEach(function(track){
    var artist = findOne(model.artists, "_id", track.artist);
    var album = findOne(model.albums, "_id", track.album);

    newHtml+= '<div id="'+ track._id +'"" class="fl-tl-row" draggable="true" ondragstart="drag(event)">';
    newHtml+= '<div class="fl-tl-cell fl-tl-name"><a href="#">'+ track.name + '</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-artist"><a href="artists/'+ encodeURI(artist.name)+ '">'+ artist.name +'</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-album"><a href="albums/'+ encodeURI(album.name)+ '">'+ album.name +'</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-time">'+ formatTime(track.duration) + '</div>\n';
    newHtml+= '</div>\n';
  })

  return newHtml;
}

function bindTracksDelete(){
  var tracks = document.querySelectorAll(".fl-tl-delete a");

  for (var elem = 0; elem < tracks.length; ++elem) {
    tracks[elem].onclick = deleteTrack;
  }
}

function deleteTrack(e){

  var href;
  var target = e.target;

  if(e && e.target){
    e.preventDefault();
    href = target.getAttribute("href");
  }

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeTrack);

    function removeTrack(){

      var toDelete = target.parentNode.parentNode;
      var parent = document.getElementById("tracks-list");

      parent.removeChild(toDelete);

    }

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

  function deleteArtist(e){

    var href;
    var target = e.target;

    if(e && e.target){
      e.preventDefault();
      href = target.getAttribute("href");
    }

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeArtist);

    function removeArtist(){

      //console.log(responseText);

      //console.log(target);

      var toDelete = target.parentNode.parentNode;
      var parent = document.getElementById("artists-list");

      parent.removeChild(toDelete);

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

            bindAlbumLink();

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

    //execute the AJAX call to the delete a single album
    doJSONRequest("DELETE", href, null, null, removeAlbum);

    function removeAlbum(){

      var toDelete = target.parentNode.parentNode;
      var parent = document.getElementById("albums-list");

      parent.removeChild(toDelete);

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

/* Search */

function setupSearch(){
  var searchBox = document.getElementById("main-search");
  searchBox.addEventListener("input", function(){
    var split = this.value.split(" ");

    result = fuzzyFind(model.tracks, "name", this.value);

    if(this.value.trim() === ""){
      drawLibrary();
      return;
    }


    var container = document.getElementById('tracks-list');
    var classList = container.classList;

    var newHtml = '<div class="fl-tl-thead fl-tl-row">\n\
    <div class="fl-tl-th fl-tl-name">Song</div>\n\
    <div class="fl-tl-th fl-tl-artist">Artist</div>\n\
    <div class="fl-tl-th fl-tl-album">Album</div>\n\
    <div class="fl-tl-th fl-tl-time">Time</div>\n\
    </div>';

    newHtml += createHTMLLibrary(result);

    container.innerHTML = newHtml;
  })
}

function find(arr, prop, val){
  var res = [];
  arr.forEach(function(item){
    if("undefined" !== item[prop]
      && item[prop] === val){
      res.push(item)
  }
});
  return res;
}

function findOne(arr, prop, val){
  for (var i=0, l=arr.length; i<l; i++){
    var item = arr[i];
    if("undefined" !== item[prop]
      && item[prop] === val){
      return item;
  }
}
}

/* Search */

/* Playlist: Not working after the switch to AJAX */
function setupPlaylists(){
  loadPlaylistsFromLocalStorage();

  var createPlBtn = document.getElementById("create-pl-btn");
  createPlBtn.addEventListener('click', function(){

    localStorage.pl_cnt =  localStorage.pl_cnt || 0;
    var cnt = localStorage.pl_cnt;
    var _id = "pl-"+cnt
    var name = 'New Playlist ' + (++cnt);
    var newPlaylist =  playlist(_id, name, model.users[0]._id, []);

    //update localStorage counter
    localStorage.pl_cnt = cnt;

    //persist to localStorage
    savePlaylist(newPlaylist);
    appendNewPlaylistToMenu(newPlaylist);
  })

  document.addEventListener('click', function (e) {
    if (e.target.classList.contains('edit-btn') ) {
      return onEditPlaylistClicked(e.target)
    }

    if (e.target.classList.contains('pl-name-input') ) {
      return e.preventDefault();
    }

    if (e.target.classList.contains('pl-name') ) {
      e.preventDefault();
      return onPlaylistClicked(e.target)
    }

    //the click was outside an edit element, close currently edited ones
    var currentlyEditing = document.querySelectorAll('#playlists > li.edit .edit-btn');
    for (var i = currentlyEditing.length - 1; i >= 0; i--) {
      onEditPlaylistClicked(currentlyEditing[i]);
    };

  });
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

function addTrackToPlaylist(playlistId, trackId){
  var playlists =  JSON.parse(localStorage.playlists);
  var pl = playlists[playlistId];
  if(typeof pl === "undefined"){
    throw new Error("playlist doesn't exist in localStorage")
  }

  var track = findOne(model.tracks, "_id", trackId);
  if(typeof track === "undefined" || track === null){
    throw new Error("track doesn't exist in the model")
  }

  pl.tracks.push(trackId);

  //persist
  playlists[playlistId]= pl;
  localStorage.playlists = JSON.stringify(playlists);
}

function onPlaylistClicked(link){
  localStorage.playlists = localStorage.playlists || JSON.stringify({});
  var playlists =  JSON.parse(localStorage.playlists);
  var id = link.dataset["for"];
  var playlist = playlists[id];
  var tracks = playlist.tracks;
  var container = document.getElementById('tracks-list');
  var classList = container.classList;

  if (tracks.length < 1){
    return container.innerHTML = "Playlist " + playlist.name + " is empty."
  }

  var newHtml = '<div class="fl-tl-thead fl-tl-row">\n\
  <div class="fl-tl-th fl-tl-name">Song</div>\n\
  <div class="fl-tl-th fl-tl-artist">Artist</div>\n\
  <div class="fl-tl-th fl-tl-album">Album</div>\n\
  <div class="fl-tl-th fl-tl-time">Time</div>\n\
  </div>';

  tracks.forEach(function(track){
    track = findOne(model.tracks, "_id", track)
    var artist = findOne(model.artists, "_id", track.artist);
    var album = findOne(model.albums, "_id", track.album);

    newHtml+= '<div id="'+ track._id +'"" class="fl-tl-row" draggable="true">'
    newHtml+= '<div class="fl-tl-cell fl-tl-name"><a href="#">'+ track.name + '</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-artist"><a href="artists/'+ encodeURI(artist.name)+ '">'+ artist.name +'</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-album"><a href="albums/'+ encodeURI(album.name)+ '">'+ album.name +'</a></div>\n';
    newHtml+= '<div class="fl-tl-cell fl-tl-time">'+ formatTime(track.duration) + '</div>\n';
    newHtml+= '</div>\n';
  })

  container.innerHTML = newHtml;
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

function loadPlaylistsFromLocalStorage(){
  localStorage.playlists = localStorage.playlists || JSON.stringify({});
  var playlists =  JSON.parse(localStorage.playlists);
  //merge localStorage playlists with model playlists
  /*
  model.playlists.forEach(function(playlist){
    if (!playlists.hasOwnProperty(playlist._id))
      playlists[playlist._id] = playlist;
  });
*/

var keys = Object.keys(playlists);
var newHtml ='';
keys.forEach(function(key){
  appendNewPlaylistToMenu(playlists[key]);
});

  //persist playlists
  localStorage.playlists = JSON.stringify(playlists);
}

function appendNewPlaylistToMenu(pl){
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
var CurrentSong = 0;
var oldCurrentSong;
function setupPlayer(trackId, shuffle){




    function setTrack(index, audioElement,tracks){

        if(oldCurrentSong >= 0){
            var oldTrackId = tracks[oldCurrentSong]._id;
            changeTrackColor(oldTrackId,"black")
        }

        var track = tracks[index];

        var tranckInfo = document.getElementsByClassName("pl-info-wrapper")[0];
        // set artwork
        tranckInfo.firstChild.firstChild.firstChild.setAttribute("style", "background-image: url("+track.album.artwork+")");
        // set title/album
        tranckInfo.lastChild.firstChild.setAttribute("href", "albums/"+track.album._id);
        tranckInfo.lastChild.firstChild.innerHTML = track.album.name;
        tranckInfo.lastChild.lastChild.firstChild.setAttribute("title", track.artist.name);
        tranckInfo.lastChild.lastChild.firstChild.setAttribute("href", "artists/"+track.artist._id);
        tranckInfo.lastChild.lastChild.firstChild.innerHTML = track.name;

        audioElement.src = tracks[index].file;
        changeTrackColor(tracks[index]._id,"#ff0000");
    }

    function changeTrackColor(id,color){
        try{
            var childNodes = document.querySelector('#tracks-list').childNodes;
            for( var i = 0 , j = childNodes.length; i < j ; i++ ){
                if(childNodes[i].id == id ){
                    childNodes[i].firstChild.style.color = color;
                    return;
                }
            }
        }catch (err){
//            NOTHING
        }


    }

    if (! document.getElementsByTagName('audio')[0]) {
        doJSONRequest("GET", "/tracks", null, null, setupAudioElement);

        function setupAudioElement(trackList) {
            var tracks = [];
            for(var i in trackList){
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
                oldCurrentSong = CurrentSong;
                CurrentSong++;
                if (tracks[CurrentSong]){
                    setTrack(CurrentSong, audio, tracks);
                    audio.play();
                } else{
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
                var state;
                if(audio.paused == false) state = true;
                oldCurrentSong = CurrentSong;
                CurrentSong++;
                if (tracks[CurrentSong]){
                    setTrack(CurrentSong, audio, tracks);
                    if(state) audio.play();
                } else{
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

            previous.addEventListener("click", function () {
                var state;
                if(audio.paused == false) state = true;
                oldCurrentSong = CurrentSong;
                CurrentSong--;
                if (tracks[CurrentSong]){
                    setTrack(CurrentSong, audio, tracks);
                    if(state) audio.play();
                } else{
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

            function shuffleArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
                return array;
            }

            shuffle.addEventListener("click", function () {
                var currentId;
                if(shuffle.innerHTML == "normal"){

                    shuffle.innerHTML = "shuffle";

                    currentId = tracks[CurrentSong]._id;

                    tracks = shuffleArray(tracks);
                    for( var i = 0 , j = tracks.length; i < j ; i++ ) {
                        if(tracks[i]._id == currentId){
                            var b = tracks[i];
                            tracks[i] = tracks[0];
                            tracks[0] = b;
                            CurrentSong = 0;
                            return
                        }
                    }
                } else{
                    shuffle.innerHTML = "normal";

                    currentId = tracks[CurrentSong]._id;

                    tracks = [];
                    for(var i in trackList){
                        tracks.push(trackList[i]);
                    }

                    for( var i = 0 , j = tracks.length; i < j ; i++ ) {
                        if(tracks[i]._id == currentId){
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
        }
    }


}

/* Player */

//<!-- /build -->
