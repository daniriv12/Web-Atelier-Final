/** @module models/Playlist
* The Playlist Model.
* Schema:
* _id           String       required   unique identifier of the playlist.
* name          String       required   name of the playlist.
* tracks        [ObjectId]   optional   tracks that this playlist contains. They should be `_id`s of Track model documents.
* dateCreated   Date         required   date the playlist was created. Default: Date.now()
*/

'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;


/** @constructor
* @param {Object} definition
*/
var FollowPlaylistSchema = new mongoose.Schema(
  {
    ownerID : { type: String, required: true },
    playlistID : { type: String, required: true }
  }

);


//register model

mongoose.model('FollowPlaylist', FollowPlaylistSchema);
module.exports = FollowPlaylistSchema;
