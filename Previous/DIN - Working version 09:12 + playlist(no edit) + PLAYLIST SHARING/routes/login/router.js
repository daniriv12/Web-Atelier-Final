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

var session;

router.all('/', middleware.supportedMethods('GET, POST'));



router.get('/', function(req, res, next) {

    res.render('login');


});

router.post('/', function (req, res) {
    var post = req.body;

    var query = User.where({userName : post.username});

    query.findOne(function(err, user){
        if (err) { return err}
        if (user) {

            user.isValidPassword(post.password, function(n, isMatch){
                if(isMatch) {
                    req.session.user_id = user._id;


                    res.redirect('/home?' + user._id);
                } else{

                    res.redirect('/signup');
                }
            });}




        else{
            res.redirect('/signup');
        }


    });


});



module.exports = router;