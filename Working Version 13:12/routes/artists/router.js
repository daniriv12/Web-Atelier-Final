/** @module artists/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Artist = mongoose.model('Artist');
var config = require("../../config");

//fields we don't want to show to the client
var fieldsFilter = { '__v': 0 };

//supported methods
router.all('/:artistid', middleware.supportedMethods('GET, PUT, DELETE, OPTIONS'));
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));

//list artists
router.get('/', function(req, res, next) {

  Artist.find({} , fieldsFilter).lean().exec(function(err, artists){
    if (err) return next (err);

    artists.forEach(function(artist){
      addLinks(artist);
    });
    res.json(artists);
  });
});

//create new artist
router.post('/', function(req, res, next) {

    var newArtist = new Artist(req.body);
    newArtist.save(onModelSave(res, 201, true));
});

//get a artist
router.get('/:artistid', function(req, res, next) {
  Artist.findById(req.params.artistid, fieldsFilter).lean().exec(function(err, artist){
    if (err) return next (err);
    if (!artist) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    addLinks(artist);
    res.json(artist);
  });
});

//update a artist
router.put('/:artistid', function(req, res, next) {
  var data = req.body;

  Artist.findById(req.params.artistid, fieldsFilter, function(err, artist){
    if (err) return next (err);
    if (artist){

        if(data.name) {
            artist.name = data.name;
        }
        else {
            artist.name = artist.name;
        }

        if(data.genre) {
            artist.genre = data.genre;
        }
        else {
            artist.genre = artist.genre
        }

        if(data.artwork) {
            artist.artwork = data.artwork
        }
        else {
            artist.artwork = artist.artwork
        }

        if(data.dateCreated) {
            artist.dateCreated = data.dateCreated
        }
        else {
            artist.dateCreated = artist.dateCreated
        }



      console.log("postArtist: ", artist)
      artist.save(onModelSave(res));
    }else{
      //artist does not exist create it
      var newArtist = new Artist(data);
      newArtist._id = ObjectId(req.params.artistid);
      newArtist.save(onModelSave(res, 201, true));
    }
  });
});

//remove a artist
router.delete('/:artistid', function(req, res, next) {
  Artist.findById(req.params.artistid, fieldsFilter, function(err, artist){
    if (err) return next (err);
    if (!artist) {
      res.status(404);
      res.json({
        statusCode: 404,
        message: "Not Found"
      });
      return;
    }
    artist.remove(function(err, removed){
      if (err) return next (err);
      res.status(204).end();
    })
  });
});

function onModelSave(res, status, sendItAsResponse){
  var statusCode = status || 204;
  var sendItAsResponse = sendItAsResponse || false;
  return function(err, saved){
    if (err) {
      if (err.name === 'ValidationError' 
        || err.name === 'TypeError' ) {
        res.status(400)
        return res.json({
          statusCode: 400,
          message: "Bad Request"
        });
      }else{
        return next (err);
      }
    }
    if( sendItAsResponse){
      var obj = saved.toObject();
      delete obj.password;
      delete obj.__v;
      addLinks(obj);
      return res.status(statusCode).json(obj);
    }else{
      return res.status(statusCode).end();
    }
  }
}

function addLinks(artist){
  artist.links = [
    { 
      "rel" : "self",
      "href" : config.url + "/artists/" + artist._id
    }
  ];
}

/** router for /artists */
module.exports = router;
