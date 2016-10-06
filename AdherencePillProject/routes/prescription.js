/**
 * Created by yichengwang on 7/10/2016.
 */
var express = require('express');
var router = express.Router();

/* GET */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

/* POST */
router.post('/', function(req, res) {
    Parse.Cloud.run('signup', {}, {
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

module.exports = router;
