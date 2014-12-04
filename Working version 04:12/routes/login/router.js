/**
 * Created by Daniel on 07/11/14.
 */
var express = require('express');
var router = express.Router();
var middleware =  require('../middleware');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var User = mongoose.model('User');
var config = require("../../config")

var session;

router.all('/', middleware.supportedMethods('GET, POST'));



router.get('/', function(req, res, next) {

    res.render('login');


});

router.post('/', function (req, res) {
    console.log("huh");
    var post = req.body;
    console.log(post);


    var query = User.where({userName : post.username});

    query.findOne(function(err, user){
        if (err) { return err};
        if (user){
            console.log(user);
            console.log("check this out")

            if (post.password == user.password){

                console.log("yes!");
                req.session.user_id = user._id;
                console.log(req.session.user_id);
                res.redirect('/home');
           //     res.redirect('/home#' + user.userName );
            }
            else{
                console.log("no")
                res.redirect('/signup');
            }

        }
        else{
            console.log("no user");
            res.redirect('/signup');
        }


    });


////
//    if (post.username === 'john' && post.password === 'johnspassword') {
//        req.session.user_id = johns_user_id_here;
//        res.redirect('/home');
//    } else {
//        res.redirect('/signup');
//    }
});



module.exports = router;