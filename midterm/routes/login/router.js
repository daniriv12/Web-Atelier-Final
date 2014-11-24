/**
 * Created by Daniel on 07/11/14.
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

    res.render('login');


});



module.exports = router;