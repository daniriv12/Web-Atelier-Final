/** @module users/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var config = require("../../config");
var session;

//supported methods
router.all('/', middleware.supportedMethods('GET, POST, OPTIONS'));

//login or library
router.get('/', function(req, res, next) {
  session=req.session;
  if(session.userName) {
    res.render('library');
  } else {
    res.render('login');
  }
});

router.post('/', function(req, res, next) {

  User.findOne({userName: req.body.userName}, function(err, user) {
    if (err) return next(err);
    session=req.session;
    if (!user) {
      res.json({user: 'invalid'})
    } else {
      user.isValidPassword(req.body.password, function (n, isMatch) {
        if (isMatch) {
          session.userName = req.body.userName;
          res.json(user)
        } else {
          res.json({password: 'invalid'})
        }
      });
    }
  })
});

/** router for /root */
module.exports = router;
