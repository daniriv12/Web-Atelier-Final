/** @module users/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var config = require("../../config");
var session;

//supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//signup or library
router.get('/', function(req, res, next) {
    session=req.session;
    console.log(req.session);
    if(session.userName) {
        res.render('library')
    } else {
        res.render('signup');
    }
});

router.post('/', function(req, res, next) {
    var user = new User({
        userName: req.body.userName

    });
    console.log(p);
});

/** router for /signup */
module.exports = router;
