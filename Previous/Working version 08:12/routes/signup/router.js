/**
 * Created by Daniel on 07/11/14.
 */
var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var Track = mongoose.model('Track');
var config = require("../../config");


router.get('/', function(req, res, next) {

    res.render('signup');

});


module.exports = router;