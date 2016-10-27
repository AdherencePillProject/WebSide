var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;
var addPatientDoctorRelation = utility.addPatientDoctorRelation;
/* GET users listing. */
// router.get('/', function(req, res, next) {
//   var user = new Parse.User();
//
//   res.json(user);
// });
router.post('/', function(req, res, next) {
  signUpUser(req.body, "Patient", {
    success: function success (user) {
      res.status(201).json({"code": 1, "sessionToken": user.attributes.sessionToken});
    },
    error: function error (error) {
      res.status(400)
          .json({"code": error.code, "message": error.message});
    }
  });
});

router.post('/appointment', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function() {
      var user = Parse.User.current();
      console.log(req.body);
      var doctor = Parse.Object.extend("Doctor");
      var query = new Parse.Query(doctor);
      query.equalTo("objectId", req.body.doctorId);
      query.first({
        success: function(doctor) {
          var patient = Parse.Object.extend("Patient");
          var users = Parse.Object.extend("_User");
          var _user = new users();
          _user.id = user.id;
          var query = new Parse.Query(patient);
          query.include("user");
          query.equalTo("user", _user);
          query.first({
            success: function(patient) {
              var appointment = new Parse.Object("Appointment");
              appointment.set("doctor", doctor);
              appointment.set("patient", patient);
              appointment.set("time", {__type: "Date", iso: req.body.date});
              appointment.save(null, {
                success: function(appointment) {
                  addPatientDoctorRelation(patient, doctor, {
                    success: function(relation) {
                      res.status(200).json({code: 1});
                    },
                    error: function(error) {
                      res.status(400).json(error);
                    }
                  })
                },
                error: function(appointment, error) {
                  res.status(400).json(error);
                }
              })
            },
            error: function(error) {
              res.status(400).json(error);
            }
          })
        },
        error: function(error) {
          res.status(400).json(error);
        }
      })

    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  })
});

router.get('/appointment', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function() {
      var user = Parse.User.current();
      var patient = Parse.Object.extend("Patient");
      var users = Parse.Object.extend("_User");
      var _user = new users();
      _user.id = user.id;
      var query = new Parse.Query(patient);
      query.include("user");
      query.equalTo("user", _user);
      query.first({
        success: function(patient) {
          var appointment = Parse.Object.extend("Appointment");
          var query = new Parse.Query(appointment);
          query.select("time", "doctor.user.firstname", "doctor.user.lastname",
            "doctor.hospitalName", "doctor.hospitalAddress", "doctor.hospitalCity");
          query.include("doctor");
          query.include("doctor.user");
          query.ascending("time");
          query.equalTo("patient", patient);
          query.find({
            success: function(results) {
              var ret = new Array();
              for (var i=0; i<results.length; i++) {
                ret.push({
                  doctorFirstName: results[i].get("doctor").get("user").get("firstname"),
                  doctorLastName: results[i].get("doctor").get("user").get("lastname"),
                  hospitalName: results[i].get("doctor").get("hospitalName"),
                  hospitalCity: results[i].get("doctor").get("hospitalCity"),
                  hospitalAddress: results[i].get("doctor").get("hospitalAddress"),
                  date: results[i].get("time")
                });
              }
              res.status(200).json(ret);
            },
            error: function(error) {
              res.status(200).json([]);
            }
          })
        },
        error: function(patient, error) {
          res.status(400).json(error);
        }
      });
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  })
});

module.exports = router;
