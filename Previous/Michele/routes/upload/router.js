/**
 * Created by michele on 02/12/14.
 */
/** @module upload/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware = require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Track = mongoose.model('Track');
var Artist = mongoose.model('Artist');
var Album = mongoose.model('Album');
var config = require("../../config");
var multer = require('multer');

router.all('/', middleware.supportedMethods('POST, OPTIONS'));

// use multer for track uploads
router.use(multer({
    dest: './public/',
    includeEmptyFields: true,
    rename: function (fieldname, filename) {
        return filename;
    }
}));

var onAlbumFound = function (req, res, next) {
    return function (err, found) {
        if (err) return next(err);
        if (found.length == 1) {
            console.log("album found");
            req.body.album = found[0]._id;
            var newTrack = new Track(req.body);
            newTrack.save();
            newTrack.save(onModelSave(res, 201, true));
        } else {
            console.log("new album created");
            var newAlbum = new Album({
                name: req.body.album,
                artist: req.body.artist
            });
            newAlbum.save(function (err, saved) {
                if (err) return next(err);
                if (saved) {
                    req.body.album = saved._id;
                    console.log("album saved");
                    var newTrack = new Track(req.body);
                    newTrack.save(onModelSave(res, 201, true));
                }
            });
        }
    }
};

var onArtistFound = function (req, res, next) {
    return function (err, found) {
        if (err) return next(err);
        if (found.length == 1) {
            console.log("artist found");
            req.body.artist = found[0]._id;
            Album.find({ name: req.body.album }, onAlbumFound(req, res, next));
        } else {
            console.log("new artist created");
            var newArtist = new Artist({
                name: req.body.artist
            });
            newArtist.save(function (err, saved) {
                if (err) return next(err);
                if (saved) {
                    req.body.artist = saved._id;
                    console.log("artist saved");
                    Album.find({ name: req.body.album }, onAlbumFound(req, res, next));
                }
            });
        }
    }
};

//create new track
router.post('/', function (req, res, next) {
    console.log(req.body);
    console.log(req.files);
    if (req.body.name && req.body.artist && req.body.album && req.body.duration) {
        req.body.file = req.files.file.path;
        req.body.duration = parseInt(req.body.duration);
        Artist.find({ name: req.body.artist }, onArtistFound(req, res, next));
    } else {
        res.status(400).end();
    }
});

function onModelSave(res, status, sendItAsResponse) {
    var statusCode = status || 204;
    var sendItAsResponse = sendItAsResponse || false;
    return function (err, saved) {
        if (err) {
            if (err.name === 'ValidationError'
                || err.name === 'TypeError') {
                res.status(400)
                return res.json({
                    statusCode: 400,
                    message: "Bad Request"
                });
            }
        }
//        else {
//            return next(err);
//        }
        if (sendItAsResponse) {
            var obj = saved.toObject();
            delete obj.password;
            delete obj.__v;
            addLinks(obj);
            return res.status(statusCode).json(obj);
        } else {
            return res.status(statusCode).end();
        }
    }
}

function addLinks(track) {
    track.links = [
        {
            "rel": "self",
            "href": config.url + "/tracks/" + track._id
        },
        {
            "rel": "artist",
            "href": config.url + "/artists/" + track.artist
        }
    ];

    if (track.album) {
        track.links.push({
            "rel": "album",
            "href": config.url + "/albums/" + track.album
        });
    }
}

module.exports = router;