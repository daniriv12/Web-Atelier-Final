/**
 * Created by Daniel on 15/12/14.
 */


var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var config = require("../../config");

var session;

router.all('/', middleware.supportedMethods('GET, POST'));



router.get('/', function(req, res, next) {



    res.render('chats');


});

module.exports = router;