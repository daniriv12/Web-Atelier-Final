/**
 * Created by Daniel on 04/12/14.
 */

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var config = require("../../config");

router.all('/', middleware.supportedMethods('GET'));



router.get('/', function(req, res, next) {

    delete req.session.user_id;
    res.redirect('/login');
});

module.exports = router;