var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', function(req, res) {
  Parse.Cloud.run('signup', {}, {
    success: function success(user) {
      console.log(user);
      res.json({type: 'success'});
    },
    error: function error(err) {
      console.log(err);
      res.json({type: 'fail', error: err});
    }
  });
});

module.exports = router;
