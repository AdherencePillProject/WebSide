var express = require('express');
var router = express.Router();
var path = require('path');
var mail = require('../common/mail');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/test.html'));
});

//mail.activateEmail("yichengwang2015@u.northwestern.edu", "SHvsMK", "SHvsMK", '../views/activateAccount.ejs');
module.exports = router;
