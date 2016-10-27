var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;

/* GET users listing. */
router.get('/', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function() {
      var doctors = Parse.Object.extend("Doctor");
      var users = Parse.Object.extend("_User");
      var user = new users();
      var Query = new Parse.Query(doctors);
      Query.select("hospitalName", "hospitalAddress", "hospitalCity",
        "user.firstname", "user.lastname", "user.email");
      Query.exists("hospitalName");
      Query.include("user");
      Query.notEqualTo("hospitalName", "");
      Query.find({
        success: function(results) {
          results.forEach(function(doctor) {
            console.log(doctor.get("user"));
          });
          res.status(200).json(results);
        },
        error: function(error) {
          res.status(200).json({});
        }
      });
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  });
});
router.post('/', function(req, res, next) {
  signUpUser(req.body, "Doctor", {
    success: function success (user) {
      var sessionToken = user.getSessionToken();
      res.status(201).json({"code": 1, "sessionToken": sessionToken});
    },
    error: function error (error) {
      res.status(400)
          .json({"code": error.code, "message": error.message});
    }
  });
});

router.get('/patients', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function() {
      var user = Parse.User.current();
      var doctor = Parse.Object.extend("Doctor");
      var users = Parse.Object.extend("_User");
      var _user = new users();
      _user.id = user.id;
      var query = new Parse.Query(doctor);
      query.include("user");
      query.equalTo("user", _user);
      query.first({
        success: function(doctor) {
          if (doctor === undefined) {
            res.status(401).json({code:201, message:"Invalid session"});
          }
          else {
            var relation = Parse.Object.extend("PatientDoctor");
            var doctors = Parse.Object.extend("Doctor");
            var _doctor = new doctors();
            _doctor.id = doctor.id;
            // query.select("", "", "patient.user.firstname", "patient.user.lastname",
              // "patient.user.dateOfBirth", "patient.user.phone");
            var query = new Parse.Query(relation);
            query.include("patient");
            query.include("patient.user");
            query.equalTo("doctor", _doctor);
            query.find({
              success: function(results) {
                var ret = new Array();
                for (var i=0; i<results.length; i++) {
                  ret.push({
                    patientFirstName: results[i].get("patient").get("user").get("firstname"),
                    patientLastName: results[i].get("patient").get("user").get("lastname"),
                    patientDateOfBirth: results[i].get("patient").get("user").get("dateOfBirth"),
                    patientPhone: results[i].get("patient").get("user").get("phone"),
                    patientEmail: results[i].get("patient").get("user").get("email"),
                    patientGender: results[i].get("patient").get("user").get("gender"),
                    patientId: results[i].get("patient").id
                  });
                }
                res.status(200).json(ret);
              },
              error: function(error) {
                res.status(400).json(error);
              }
            })
          }

        },
        error: function(error) {
          res.status(400).json(error);
        }
      });
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  });
})

module.exports = router;
