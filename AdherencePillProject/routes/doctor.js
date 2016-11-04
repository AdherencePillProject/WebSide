var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;
var getUserProfile = utility.getUserProfile;

/* GET doctor lists. */
router.get('/', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  //sessionToken = "r:6df887928c5246c46b3641df518e09e2";
  Parse.User.become(sessionToken, {
    success: function(user) {
      var query = new Parse.Query(Parse.User);
      query.include("doctorPointer");
      query.exists("doctorPointer");
      query.find({
        success: function success(doctors) {
          var ret = new Array();
          for (var i=0; i< doctors.length; i++) {
            ret.push({
              user: {
                firstname:doctors[i].get("firstname"),
                lastname: doctors[i].get("lastname"),
              },
              objectId: doctors[i].get("doctorPointer").id,
              hospitalName: doctors[i].get("doctorPointer").get("hospitalName")
            });
          }
          res.status(200)
              .json(ret);
        },
        error: function error(error) {
          res.status(401)
              .json({code: error.code, message: error.message});
        }
      })
    },
    error: function error(error) {
      res.status(401)
          .json({code: error.code, message: error.message});
    }
  })
});

/* GET user profile */
router.get('/profile', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  getUserProfile(sessionToken, "Doctor", {
    success: function success(user) {
      res.status(200).json({user: user});
    },
    error: function error(error) {
      res.status(401).json({"code": error.code, "message": error.message});
    }
  });
});

/* POST get the prescription bottle information of all patients of this doctor */
router.get('/patientsPrescriptions', function(req, res) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function success(user) {
      var Doctor = new Parse.Object.extend("Doctor");
      var doctor = new Doctor();
      doctor.id = user.get("doctorPointer").id;
      console.log(user.get("doctorPointer").id);

      var Appointment = new Parse.Object.extend("Appointment");
      var query = new Parse.Query(Appointment);
      query.equalTo("doctor", doctor);
      query.find({
        success: function success(patients) {
          var Bottle = new Parse.Object.extend("Bottle");
          var newQuery = new Parse.Query(Bottle);
          newQuery.equalTo("owner", patients);
          newQuery.find({
            success: function success(prescriptions) {
              res.status(200)
                  .json({code: 1, data: prescriptions});
            },
            error: function error(error) {
              res.status(401)
                  .json({code: error.code, message: error.message});
            }
          });
        },
        error: function error(error) {
          res.status(401)
              .json({code: error.code, message: error.message});
        }
      });
    },
    error: function error(error) {
      res.status(401)
          .json({code: error.code, message: error.messsage});
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
