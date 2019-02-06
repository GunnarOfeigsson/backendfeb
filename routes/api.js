const mongoose = require('mongoose');
const passport = require('passport');
const config = require('../config/database');
 require ('../config/passport') (passport);
const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require("../models/user");
const Film = require("../models/film");

//create router for signup or register the new user

router.post('/signup', function(req, res){

    if (!req.body.email || !req.body.password) {
        res.json({success: false, msg: 'Please pass email and password'});
    }
    else {
        var newUser = new User({
            email: req.body.email,
            password: req.body.password
        });
        //save the user
        newUser.save(function(err) {
            if (err) {
                console.log(err);
                return res.json({success: false, msg: 'email already exists'});
                }
                res.json({success: true, msg: 'Successfully created new user'});
            });
            }
});
//SIGNING IN
router.post('/signin', function(req, res){

   User.findOne({
       email: req.body.email
   }, function (err, user) {
       if(err) {
           console.log(err);
           throw err;
       }
       if (!user) {
           res.status(401).send({success: false, msg: 'Authentication failed. User not found.'});
       }
       else {
           //check if password matches
           user.comparePassword(req.body.password, function (err, isMatch) {
               if (isMatch && !err) {
                   //if user is found and password is right create a token
                   var token = jwt.sign(user.toJSON(), config.secret);
                   //return the information including token as JSON
                   res.json({success: true, token: 'JWT ' + token});
               } else {


                   res.json({success: false, msg: 'Authentication failed. Wrong Password.'});
               }
           });
       }
   });
});

//CREATE FILM REVIEW
router.post('/film', passport.authenticate('jwt', {session: false}), function(req, res){
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newFilm = new Film ({

            title: req.body.title,
            director: req.body.director,
            studio: req.body.studio,
            year: req.body.year,
            review: req.body.review,
            reviewer: req.body.reviewer,
            img: req.body.img
        });

        newFilm.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Save film failed.'});
            }
            res.json({success: true, msg: 'Successfully created new film'});
        });
        }
        else {
        return res.status(403).send({success:false, msg: 'Unauthorized.'});
    }
});

getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        } //else {
        //return null
       //}
    }};
//GET ALL FILMS
router.get('/film', passport.authenticate('jwt', {session: false}), function(req, res) {
    var token = getToken(req.headers);
    if (token) {
        Film.find(function (err, films) {
        if (err) return (err);
        res.json(films);
        });
    }
    else {
        return res.status(403).send({success: false, msg: 'Unauthorized.'});
    }
});
//GET SINGLE FILM BY ID
router.get('/film:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var token = getToken (req.headers);
    if (token) {
        console.log("the id is: ");
        console.log( req,params.id);
        Film.findById (new mongoose.Types.ObjectId(req.params.id), function (err, post) {
            if (err) return next(err);
            res.json(post);
        });
    }
    else {return res.status(403).send({success: false, msg: 'Unauthorized. '});
    }
});
//UPDATE FILM REVIEW
router.put('/film:id', passport.authenticate('jwt', {session: false}), function(req, res, next) {
    var token = getToken(req.headers);
if (token) {
    Film.findOneAndUpdate({'_id':req.params.id}, req.body, function (err, post) {
        if (err) return next(err);
        res.json(post);
    });
} else {
    return res.status(403).send({success: false, msg: 'Unauthorized. '});
}
});
//DELETE FILM
router.delete ('/film:id', passport.authenticate ('jwt', {session: false}), function (req, res, next) {
    var token = getToken(req.headers);
    if (token) {
        Film.findOneAndRemove({'_id' :req.params.id}, req.body, function (err,post){
            if (err) return next(err);
            res.json(post);
            });
    } else {
        return res.status(403).send({success: false, msg: 'Unauthorized. '});
        }
});



module.exports = router;