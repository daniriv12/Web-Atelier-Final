/** @module logout/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var config = require("../../config");
var session;

//supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//logout
router.get('/', function(req, res, next) {

    session=req.session;

    if(session.userName) {
        session.destroy();
        res.json({session: 'destroyed'});
    } else {
        res.redirect(302, '/');
    }
});

/** router for /logout */
module.exports = router;
