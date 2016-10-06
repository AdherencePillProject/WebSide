var express = require('express');
var router = express.Router();

/* GET - get a patient's info */
router.get('/', function(req, res) {
  Parse.Cloud.run('retriveObjectInfo', {type: 'Patient'}, {
    success: function success(patient) {
      console.log('Retrive patient information succeed!');
      res.send(patient);
    },
    error: function error(err) {
      console.log('Retrive patient information failed!');
      res.json({error: err});
    }
  });
});

/* GET - get a patient's medicine schedule */
router.get('/schedule', function(req, req) {

});

/* GET - get a patient's prescription */
router.get('/prescription', function(req, res) {

});

/* POST - add a patient's info */
router.post('/', function(req, res) {
  Parse.Cloud.run('retriveObjectInfo', {type: 'Patient'}, {
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
