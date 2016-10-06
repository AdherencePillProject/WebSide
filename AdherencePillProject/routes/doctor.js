var express = require('express');
var router = express.Router();

/* GET - get a doctor's info. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* POST - add a doctor's info. */
router.post('/', function(req, res) {
  Parse.Cloud.run('addInfo', {}, {
    success: function success(user) {
      console.log('yes');
      res.json({type: 'success'});
    },
    error: function error(err) {
      console.log('no');
      res.json({type: 'no', error: err});
    }
  })
});

/* POST - add a hospital info. */
router.post('/hospital', function(req, res) {

});

/* PUT - change a doctor's info. */
router.put('/', function(req, res){

});

module.exports = router;
