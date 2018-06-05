const express = require('express');
var passport = require("passport");
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");
var bcrypt   = require('bcrypt-nodejs');
const User = require('../models/user');

var router  = express.Router();


// forgot password
router.get('/forgot', function(req, res) {
    res.render('forgot');
  });
  
  router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(30, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
            req.flash('error', 'No account with that email address exists.');
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
          service: 'Gmail', 
          auth: {
            user: 'akshat.koderunners@gmail.com',
            pass: '9051799755'
          }
        });
        var mailOptions = {
          to: user.email,
          from: 'Koderunners',
          subject: 'KodeRunners Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
          req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
        });
      }
    ], function(err) {
      if (err) return next(err);
      res.redirect('/forgot');
    });
  });
  
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
     
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            User.findOneAndUpdate({
                resetPasswordToken: req.params.token
            },{
                resetPasswordToken: undefined,
                resetPasswordExpires: undefined,
                password: bcrypt.hashSync(req.body.password,bcrypt.genSaltSync(10), null)
            }).then((user)=>{
               
                    var smtpTransport = nodemailer.createTransport({
                      service: 'Gmail', 
                      auth: {
                        user: 'akshat.koderunners@gmail.com',
                        pass: '9051799755'
                      }
                    });
                    var mailOptions = {
                      to: user.email,
                      from: 'Koderunners',
                      subject: 'Your password has been changed',
                      text: 'Hello,\n\n' +
                        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
                    };
                    smtpTransport.sendMail(mailOptions, function(err) {
                      
                      done(err);
                    });
                    req.flash('message', 'Success! Your password has been changed.');
                    res.redirect("/login");
            },(e)=>{
                console.log(e);
            }).catch((e)=>{
                console.log("catch");
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
    
    ], function(err) {
      res.redirect('/campgrounds');
    });
  });

  module.exports = router;