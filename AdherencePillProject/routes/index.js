var express = require('express');
var router = express.Router();
var controller = require('../controller');
var login = controller.login;
var logout = controller.logout;
var account = controller.account;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* login */
router.post('/login', login.login);

/* logout */
router.get('/logout', logout.logout);

///* activate email, the name of this API should change to /account/verification, this will be changed to the PUT method */
//router.get('/account/email', account.activateEmail);
//
///* send the email to the user's email for resetting password, this function's name should be better */
//router.get('/account/password', account.sendPasswordResettingEmail);
//
///* update password */
//router.put('/account/password', account.resetPassword);
//
///* update basic information of a user, do we need to combine updata password with basic information, is there any
// * place for change password in the user's profile page?
// */
//router.put('/account/info', account.editAccount);

module.exports = router;
