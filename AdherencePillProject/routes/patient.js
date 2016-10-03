var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/', function(req, res, next) {
  var response = {
    'ret': 1
  };
  res.json(response);
});

module.exports = router;
