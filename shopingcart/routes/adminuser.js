var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/adminprofile', isLoggedIn, function(req, res, next){
    res.render('admin/adminprofile');
});

router.get('/logout', isLoggedIn,function(req, res, next){
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function(req, res, next){
    next();
});

router.get('/adminsignup', function(req, res, next){
    var messages = req.flash('error');
    res.render('admin/adminsignup', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length>0});
});

router.post('/adminsignup', passport.authenticate('local.adminsignup', {
    successRedirect: '/admin/adminprofile',
    failureRedirect: '/admin/adminsignup',
    failureFlash: true
}));

router.get('/adminsignin', function(req, res, next){
  var messages = req.flash('error');
  res.render('admin/adminsignin', {csrfToken: req.csrfToken(), messages: messages, hasError: messages.length>0});
});

router.post('/adminsignin', passport.authenticate('local.adminsignin',{
    successRedirect: '/admin/adminprofile',
    failureRedirect: '/admin/adminsignin',
    failureFlash: true
}));

module.exports = router;

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/shop/adminindex');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}