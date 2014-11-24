'use strict';

var mongoose = require('mongoose');
var Playlist = mongoose.model('Playlist');
var ObjectId = mongoose.Types.ObjectId;

var artists = {
    name : 'Artist',
    data : [
        //0
        {
            "_id"          : ObjectId(),
            "name"         : "Iron Maiden",
            "genre"        : "New Wave of British Heavy Metal",
            "artwork"      : "http://piratevinyldecals.com/wps/wp-content/uploads/2014/01/Iron-Maiden-Army-pv194.png",
            "dateCreated"  : "Sat Sep 27 2014 10:39:20 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "AC/DC",
            "genre"        : "Hard Rock",
            "artwork"      : "http://images.plixid.com/imager/w_500/h_/5dcf8b1cc667012c55e0e497a5d71eaa.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:40:40 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Metallica",
            "genre"        : "Thrash Metal",
            "artwork"      : "http://rock-jazz-pop.com/wp-content/uploads/2011/11/Metallica_500.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:20 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Slayer",
            "genre"        : "Thrash Metal",
            "artwork"      : "http://zumic.com/wp-content/uploads/2014/04/slayer-implode-youtube-free-download-2014.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "God is an Astronaut",
            "genre"        : "Post Rock",
            "artwork"      : "http://38.media.tumblr.com/bb80c0bb50ad6cdd93aacf43621b8466/tumblr_n4s5k2Rn3c1qb48t9o1_500.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)"
        },

        //Added

        {
            "_id"          : ObjectId(),
            "name"         : "Queen",
            "genre"        : "Rock",
            "artwork"      : "https://secure.static.tumblr.com/236eb245fbeb38c447ba69d557812e81/eiurajm/Irdn3btpe/tumblr_static_cover_photo1.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Charli XCX",
            "genre"        : "Pop punk",
            "artwork"      : "http://fc07.deviantart.net/fs71/i/2013/250/0/4/charli_xcx_by_zitapun-d6lc9ph.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Lilly Wood & The Prick and Robin Schulz",
            "genre"        : "Alternative, Pop",
            "artwork"      : "http://www.diamondsindasky.com/wp-content/uploads/2014/06/prayerincfi.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Meghan Trainor",
            "genre"        : "Pop",
            "artwork"      : "http://upload.wikimedia.org/wikipedia/en/2/24/Meghan_Trainor_-_All_About_That_Bass_%28Official_Single_Cover%29.png",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Bee Gees",
            "genre"        : "Pop Rock",
            "artwork"      : "http://gloriamillermusic.com/yahoo_site_admin/assets/images/BootlegBeeGees01.9443731_std.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        //10
        {
            "_id"          : ObjectId(),
            "name"         : "Tom Odell",
            "genre"        : "Indie Pop",
            "artwork"      : "http://zumic.com/wp-content/uploads/2014/04/slayer-implode-youtube-free-download-2014.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Guns n' Roses",
            "genre"        : "Hard Rock",
            "artwork"      : "http://www.nicboo.com/sites/default/files/field/image/guns-n-roses.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "name"         : "Bob Dylan",
            "genre"        : "Rock",
            "artwork"      : "http://images2.fanpop.com/images/photos/7500000/Bob-Dylan-bob-dylan-7568748-1280-800.jpg",
            "dateCreated"  : "Sat Sep 27 2014 10:41:43 GMT+0200 (CEST)"
        }


    ]
}

var albums = {
    name : 'Album',
    data : [
        //0
        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[0]._id,
            "name"         : "Somewhere in Time",
            "artwork"      : "http://sp4.fotolog.com/photo/36/22/82/felix_deadman/1250566555189_f.jpg",
            "dateReleased" : "Mon Sep 29 1986 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "EMI"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[0]._id,
            "name"         : "Seventh Son of a Seventh Son",
            "artwork"      : "http://4.bp.blogspot.com/_jbyI24EsknA/TAi-EMVNVHI/AAAAAAAABPk/3bPMaQ2iC7w/s1600/Iron_Maiden_-_Seventh_Son_Of_A_Seve.jpg",
            "dateReleased" : "Mon Apr 11 1988",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "EMI"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "name"         : "Back in Black",
            "artwork"      : "http://www.ar15.com/media/mediaFiles/1715/47731.JPG",
            "dateReleased" : "Fri Jul 25 1980",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Albert/Atlantic Records"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "name"         : "The Razors Edge",
            "artwork"      : "http://www.tasawakonline.com/uploads/2014/04/Razors+Edge+ACDC.jpg",
            "dateReleased" : "Mon Sep 24 1990",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Atco Records, Albert/EMI"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[2]._id,
            "name"         : "Ride the Lightning",
            "artwork"      : "http://www.metal-archives.com/images/5/4/4/544.jpg",
            "dateReleased" : "Fri Jul 27 1984",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Megaforce"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[2]._id,
            "name"         : "Master of Puppets",
            "artwork"      : "http://www.blogdosedupla.com.br/wp-content/uploads/2012/12/Master+of+Puppets+PNG.png",
            "dateReleased" : "Mon Feb 24 1986",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Elektra/Asylum"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[3]._id,
            "name"         : "Reign in Blood",
            "artwork"      : "http://www.metal411.com/wp-content/uploads/2013/10/reign-in-blood.png",
            "dateReleased" : "Tue Oct 07 1986",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Def Jam"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[3]._id,
            "name"         : "South of Heaven",
            "artwork"      : "http://metalholic.com/wp-content/uploads/2013/03/slayer-south_of_heaven.jpg",
            "dateReleased" : "Tue Jul 05 1988",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Def Jam"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[4]._id,
            "name"         : "All Is Violent, All Is Bright",
            "artwork"      : "http://i53.fastpic.ru/big/2013/0201/f3/b9f8026551c2fb3ce375797aeef73bf3.jpg",
            "dateReleased" : "Fri Feb 04 2005",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Revive Records"
        },

        //Added

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[5]._id,
            "name"         : "The Game",
            "artwork"      : "http://eil.com/images/main/Queen-The-Game---Black-334622.jpg",
            "dateReleased" : "July 1979",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "EMI"
        },

        //10

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[6]._id,
            "name"         : "The Fault in Our Stars",
            "artwork"      : "http://fc09.deviantart.net/fs70/f/2014/145/7/c/_32_charli_xcx___boom_clap_by_kingtapir-d7jemos.png",
            "dateReleased" : "May 01 2014",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Atlantic"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[7]._id,
            "name"         : "Prayer in C",
            "artwork"      : "http://i2.cdnds.net/14/35/618x618/lilly-wood-robin-schulz-prayer-in-c-artwork.jpg",
            "dateReleased" : "June 06 2014",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Warner Music"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[8]._id,
            "name"         : "All About That Bass",
            "artwork"      : "http://alexdang.info/wp-content/uploads/2014/07/Meghan-Trainor-All-About-That-Bass-Single.jpg",
            "dateReleased" : "June 02 2014",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Epic"
        },


        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "name"         : "Highway To Hell",
            "artwork"      : "http://www.jesus-is-savior.com/Evils%20in%20America/Rock-n-Roll/highway_to_hell-large.jpg",
            "dateReleased" : "July 27 1979",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Albert/Atlantic"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "name"         : "T.N.T",
            "artwork"      : "http://rymimg.com/lk/f/l/20588d3401f763ca6a446f6877add7b8/1209288.jpg",
            "dateReleased" : "December 01 1975",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Albert"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[9]._id,
            "name"         : "Children of the World",
            "artwork"      : "http://farm4.static.flickr.com/3044/2662631621_d0a2d5853f.jpg",
            "dateReleased" : "September 01 1976",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "RSO"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[10]._id,
            "name"         : "Long Way Down",
            "artwork"      : "http://images.junostatic.com/full/CS494987-01A-BIG.jpg",
            "dateReleased" : "June 24 2013",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Columbia"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "name"         : "Appetite for Destruction",
            "artwork"      : "http://static.nme.com/images/gallery/AppetiteForDestructionGunsNRoses600.jpg",
            "dateReleased" : "July 21 1987",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Geffen"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "name"         : "Use Your Illusion I",
            "artwork"      : "http://www.thetimeisdead.com/wp-content/uploads/2013/06/Guns_N_Roses-Use_Your_Illusion_I-Frontal.jpg",
            "dateReleased" : "September 17 1991",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Geffen"
        },

        //20
        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "name"         : "Use Your Illusion II",
            "artwork"      : "http://assets.rollingstone.com/assets/images/list/ccc99759f0d6e8464082896511455136edb1d1c4.jpg",
            "dateReleased" : "September 17 1991",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Geffen"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[12]._id,
            "name"         : "Desire",
            "artwork"      : "http://upload.wikimedia.org/wikipedia/en/0/0e/Bob_Dylan_-_Desire.jpg",
            "dateReleased" : "January 05 1976",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Columbia"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[12]._id,
            "name"         : "Pat Garret & Billy the Kid",
            "artwork"      : "http://upload.wikimedia.org/wikipedia/en/9/9d/Bob_Dylan_-_Pat_Garrett_%26_Billy_the_Kid.jpg",
            "dateReleased" : "July 13 1973",
            "dateCreated"  : "Sat Sep 27 2014 10:42:10 GMT+0200 (CEST)",
            "label"        : "Columbia"
        }
    ]
}

var tracks = {
    name : 'Track',
    data : [
        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[0]._id,
            "album"        : albums.data[0]._id,
            "name"         : "Caught Somewhere in Time",
            "duration"     : 442,
            "file"         : "tracks_folder/1.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Mon Sep 29 1986 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[0]._id,
            "album"        : albums.data[1]._id,
            "name"         : "The Clairvoyant",
            "duration"     : 268,
            "file"         : "tracks_folder/2.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Mon Apr 11 1988 00:00:00 GMT+0200 (CEST)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "album"        : albums.data[2]._id,
            "name"         : "Thunderstruck",
            "duration"     : 292,
            "file"         : "tracks_folder/3.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "album"        : albums.data[3]._id,
            "name"         : "Hells Bells",
            "duration"     : 310,
            "file"         : "tracks_folder/4.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Mon Sep 24 1990 00:00:00 GMT+0200 (CEST)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[2]._id,
            "album"        : albums.data[4]._id,
            "name"         : "The Call of Ktulu",
            "duration"     : 535,
            "file"         : "tracks_folder/5.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Jul 27 1984 00:00:00 GMT+0200 (CEST)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[2]._id,
            "album"        : albums.data[5]._id,
            "name"         : "Master of Puppets",
            "duration"     : 515,
            "file"         : "tracks_folder/6.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Mon Feb 24 1986 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[2]._id,
            "album"        : albums.data[5]._id,
            "name"         : "Orion",
            "duration"     : 507,
            "file"         : "tracks_folder/7.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Mon Feb 24 1986 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[3]._id,
            "album"        : albums.data[6]._id,
            "name"         : "Raining Blood",
            "duration"     : 298,
            "file"         : "tracks_folder/8.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Tue Oct 07 1986 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[3]._id,
            "album"        : albums.data[7]._id,
            "name"         : "South of Heaven",
            "duration"     : 299,
            "file"         : "tracks_folder/8.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Tue Jul 05 1988 00:00:00 GMT+0200 (CEST)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[4]._id,
            "album"        : albums.data[8]._id,
            "name"         : "All Is Violent, All Is Bright",
            "duration"     : 255,
            "file"         : "tracks_folder/10.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[4]._id,
            "album"        : albums.data[8]._id,
            "name"         : "A Deafening Distance",
            "duration"     : 229,
            "file"         : "tracks_folder/11.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        //Added

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[5]._id,
            "album"        : albums.data[9]._id,
            "name"         : "Another One Bites The Dust",
            "duration"     : 215,
            "file"         : "tracks_folder/12.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[5]._id,
            "album"        : albums.data[9]._id,
            "name"         : "Crazy Little Thing Called Love",
            "duration"     : 163,
            "file"         : "tracks_folder/13.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[5]._id,
            "album"        : albums.data[9]._id,
            "name"         : "Rock It",
            "duration"     : 273,
            "file"         : "tracks_folder/14.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[5]._id,
            "album"        : albums.data[9]._id,
            "name"         : "Save Me",
            "duration"     : 230,
            "file"         : "tracks_folder/15.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[6]._id,
            "album"        : albums.data[10]._id,
            "name"         : "Boom Clap",
            "duration"     : 234,
            "file"         : "tracks_folder/16.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[7]._id,
            "album"        : albums.data[11]._id,
            "name"         : "Prayer in C",
            "duration"     : 274,
            "file"         : "tracks_folder/17.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[8]._id,
            "album"        : albums.data[12]._id,
            "name"         : "All About That Bass",
            "duration"     : 339,
            "file"         : "tracks_folder/18.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "album"        : albums.data[2]._id,
            "name"         : "You Shook Me All Night Long",
            "duration"     : 210,
            "file"         : "tracks_folder/19.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "album"        : albums.data[13]._id,
            "name"         : "Highway To Hell",
            "duration"     : 209,
            "file"         : "tracks_folder/20.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[1]._id,
            "album"        : albums.data[14]._id,
            "name"         : "T.N.T",
            "duration"     : 215,
            "file"         : "tracks_folder/21.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[9]._id,
            "album"        : albums.data[15]._id,
            "name"         : "You Should Be Dancing",
            "duration"     : 258,
            "file"         : "tracks_folder/22.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[9]._id,
            "album"        : albums.data[15]._id,
            "name"         : "Jive Talkin'",
            "duration"     : 215,
            "file"         : "tracks_folder/23.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[10]._id,
            "album"        : albums.data[16]._id,
            "name"         : "Another Love",
            "duration"     : 244,
            "file"         : "tracks_folder/24.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[10]._id,
            "album"        : albums.data[16]._id,
            "name"         : "Grow Old With Me",
            "duration"     : 183,
            "file"         : "tracks_folder/25.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[10]._id,
            "album"        : albums.data[16]._id,
            "name"         : "Long Way Down",
            "duration"     : 150,
            "file"         : "tracks_folder/26.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "album"        : albums.data[17]._id,
            "name"         : "Sweet Child Of Mine",
            "duration"     : 201,
            "file"         : "tracks_folder/27.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "album"        : albums.data[17]._id,
            "name"         : "Welcome To The Jungle",
            "duration"     : 274,
            "file"         : "tracks_folder/28.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "album"        : albums.data[18]._id,
            "name"         : "November Rain",
            "duration"     : 536,
            "file"         : "tracks_folder/29.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "album"        : albums.data[19]._id,
            "name"         : "Knockin' On Heavens Door",
            "duration"     : 335,
            "file"         : "tracks_folder/30.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[11]._id,
            "album"        : albums.data[17]._id,
            "name"         : "Paradise City",
            "duration"     : 406,
            "file"         : "tracks_folder/31.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[12]._id,
            "album"        : albums.data[20]._id,
            "name"         : "Hurricane",
            "duration"     : 514,
            "file"         : "tracks_folder/32.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        },

        {
            "_id"          : ObjectId(),
            "artist"       : artists.data[12]._id,
            "album"        : albums.data[21]._id,
            "name"         : "Knocking On Heavens Door",
            "duration"     : 148,
            "file"         : "tracks_folder/33.mp3",
            "id3Tags"      : "",
            "dateReleased" : "Fri Feb 04 2005 00:00:00 GMT+0100 (CET)",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)"
        }
    ]
}

var users = {
    name : 'User',
    data : [
        {
            "_id"          : ObjectId(),
            "firstName"    : "Masiar",
            "lastName"     : "Babazadeh",
            "userName"     : "masiar",
            "email"        : "masiar.babazadeh@usi.ch",
            "password"     : "ciao",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)",
            "playlists"    : [
                new Playlist ({
                    "name" : 'Thrash Metal favs',
                    "tracks": [tracks.data[0]._id, tracks.data[1]._id]
                }),
                new Playlist ({
                    "name" : 'Thrash Metal favs 2',
                    "tracks": [tracks.data[3]._id, tracks.data[4]._id]
                })
            ]
        },

        {
            "_id"          : ObjectId(),
            "firstName"    : "Robert",
            "lastName"     : "Sapolsky",
            "userName"     : "rob",
            "email"        : "sapolsky@stanford.edu",
            "password"     : "baboon",
            "dateCreated"  : "Sat Sep 27 2014 10:26:46 GMT+0200 (CEST)",
            "playlists"    : [
                new Playlist ({
                    "name" : 'Thrash Metal favs',
                    "tracks": [tracks.data[0]._id, tracks.data[1]._id]
                }),
                new Playlist ({
                    "name" : 'Thrash Metal favs 2',
                    "tracks": [tracks.data[6]._id, tracks.data[7]._id]
                })
            ]
        },

        {
            "_id"          : ObjectId(),
            "firstName"    : "Vasileios",
            "lastName"     : "Triglianos",
            "userName"     : "vassilis",
            "email"        : "vasileios.triglianos@usi.ch",
            "password"     : "ciao",
            "dateCreated"  : "Sat Sep 27 2014 10:28:21 GMT+0200 (CEST)",
            "playlists"    : [
                new Playlist ({
                    "name" : 'Iron maiden',
                    "tracks": [tracks.data[0]._id, tracks.data[1]._id]
                }),
                new Playlist ({
                    "name" : 'Thrash Metal favs 3',
                    "tracks": [tracks.data[5]._id, tracks.data[6]._id]
                })
            ]
        }
    ]
}

var seedData = [];
seedData.push(artists);
seedData.push(albums);
seedData.push(tracks);
seedData.push(users);

module.exports = seedData;
