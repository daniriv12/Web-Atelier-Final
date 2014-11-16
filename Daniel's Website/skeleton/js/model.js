/**
* Creates a user object.
* @constructor
* @param {string} _id The unique identifier of the user
* @param {string} userName The username of the user
* @param {string} email The email address of the user
* @param {string} password The password for the user account
* @param {string} [firstName] The first name of the user. Default: username
* @param {string} [lastName] The last name of the user. Default: username
* @param {Date} [date_created] The date the user was created.  Default: Date.now()
* @param {Array} [playlists] The playlists of the user. Default: []
* @returns {Object} The newly created user instance
*/
function user(_id, userName, email, password, firstName, lastName, date_created, playlists){
  //implement user constructor here


    var User = {
        _id :  _id,
        userName : userName,
        email :email,
        password : password,
        firstName : (firstName || userName),
        lastName : (lastName || userName),
        date_created : (date_created || Date.now()),
        playlists: (playlists || [])
    };

    if(!User._id || !User.userName || !User.email){ throw new Error()}

    return User;

}

/**
* Creates a track object.
* @constructor
* @param {string} _id The unique identifier of the track
* @param {string} artist The artist who performs or composed the track. It should be the `_id` of an artist object.
* @param {Number} duration The duration of the track in seconds
* @param {string} file The url of the location of the mp3 file of the track
* @param {string} [album] The album this track is in. It should be the `_id` of an album object. Default: ''
* @param {Array} [id3Tags] An array of the id3Tags of the mp3 file of the track. Default: []
* @param {Date} [release_date] The date the track was released. Default: Date.now()
* @param {Date} [date_created ]The date the track was created. Default: Date.now()
* @returns {Object} The newly created track instance
*/
function track(_id, name, artist, duration, file, album, id3Tags, release_date, date_created){
  //implement track constructor here


    var Track = {
        _id :  _id,
        name : name,
        artist : artist,
        duration : duration,
        file: file,
        album : album || "",
        id3Tags : id3Tags || [],
        release_date: release_date || Date.now(),
        date_created : (date_created || Date.now())
    };

    if(!Track._id || !Track.name || !Track.duration || !Track.file){ throw new Error()}

    return Track;
}

/**
* Creates an artist object.
* @constructor
* @param {string} _id The unique identifier of the artist
* @param {string} name The full name of the artist or band
* @param {string} [genre] The genre of the artist. Default: 'rock'
* @param {string} [artwork] The URL of the artwork picture for the artist.  Default: ''
* @param {Date} [date_created] The date the artist was created. Default: Date.now()
* @returns {Object} The newly created artist instance
*/
function artist(_id, name, genre, artwork, date_created){
  //implement artist constructor here

    var Artist = {
        _id : _id,
        name : name,
        genre : genre || "rock",
        artwork: artwork || "",
        date_created : date_created || Date.now()
    };

    if(!Artist._id || !Artist.name){throw new Error()}

    return Artist;
}

/**
* Creates an abstractSoundCollection object.
* @constructor
* @param {string} _id The unique identifier of the abstractSoundCollection
* @param {string} name The name of the abstractSoundCollection
* @param {string[]} tracks The tracks that this abstractSoundCollection contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the abstractSoundCollection was created. Default: Date.now()
* @returns {Object} The newly created abstractSoundCollection instance
*/
function abstractSoundCollection(_id, name, tracks, date_created){
  //implement abstractSoundCollection constructor here

    var Collection = {
        _id: _id,
        name:name,
        tracks:tracks || [],
        date_created:date_created || Date.now()

    };

    if (!Collection._id || !Collection.name || !Collection.tracks){throw new Error("blanaba")}

    return Collection;
}

/**
* Creates an album object.
* @constructor
* @param {string} _id The unique identifier of the album
* @param {string} name The name of the album
* @param {string} artist The artist who performs in this album. It should be the `_id` of an artist object.
* @param {string} artwork The URL of the artwork picture for the album
* @param {string[]} tracks The tracks that this album contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the album was created. Default: Date.now()
* @param {Date} [release_date] The date the album was released. Default: Date.now()
* @param {string} [label] The record label of this album. Default: 'USI-INF records'
* @returns {Object} The newly created album instance
*/
function album(_id, name, artist, artwork, tracks, date_created, release_date, label){
  //implement abstractSoundCollection here


    var Album = abstractSoundCollection(_id, name, tracks, date_created);

        Album.artist =artist;
        Album.artwork =artwork,
        Album.release_date = release_date || Date.now(),
        Album.label =label || "USI-INF records"



    if(!Album.artist){throw new Error()}

    return Album;
}

/**
* Creates a playlist object.
* @constructor
* @param {string} _id The unique identifier of the playlist
* @param {string} name The name of the playlist
* @param {string} owner The owner of this playlist. It should be the `_id` of a user object.
* @param {string[]} tracks The tracks that this playlist contains. They should be `_id`s of track objects.
* @param {Date} [date_created] The date the playlist was created. Default: Date.now()
* @returns {Object} The newly created playlist instance
*/
function playlist(_id, name, owner, tracks, date_created){
  //implement playlist here

    var Playlist = abstractSoundCollection(_id, name, tracks, date_created);

    Playlist.owner = owner;

    if(!Playlist.owner){throw new Error()}

    return Playlist;
}

/**
* saves a playlist in localStorage
* - Each playlist is an object with the same schema as model playlists. That is, it has
* the following properties: _id, owner, name, tracks, date_created.
*
* - The playlist is stored in localStorage.playlists[_id]
*
* @param {playlist} pl The playlist instance to save
*/

function savePlaylist(pl){
  //implement savePlaylist here

 //   localStorage.playlists = JSON.stringify(pl);
    var object = JSON.parse(localStorage.playlists || "{}");

    object[pl["_id"]] = pl;

    localStorage.playlists = JSON.stringify(object);
    console.log(localStorage.playlists);




}

/**
* This function helps us search the library.
* It iterates over the arr of  objects. For each object it checks if the
* 'prop' in property has term as a substring, . For example, by searching
* "clair", I might find "The Clairvoyant".
* @param {Array}  arr  Array of objects to search
* @param {String} prop The property to be searched inside the objects
* @param {String} term The term that has to match for the search to succeed
* @returns {Array} An array of matching objects
*/
function fuzzyFind(arr, prop, term){
 //implement fuzzyFind here
    var matches = [];
    for (var i = 0; i < arr.length; i++){
                if (arr[i][prop].toLowerCase().search(term.toLowerCase()) != -1){matches.push(arr[i]);}
    }
    return matches;
}

