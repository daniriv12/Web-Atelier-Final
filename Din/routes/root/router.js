/** @module users/router */
'use strict';

var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var rootUrl = require("../../config").url;


//supported methods
router.all('/', middleware.supportedMethods('GET, OPTIONS'));

//list users
router.get('/', middleware.authorize,function(req, res, next) {
    console.log(req.session.user_id);
  res.render('library');

  
});
/** router for /users */
module.exports = router;
