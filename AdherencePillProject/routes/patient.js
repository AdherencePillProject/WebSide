var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;
var addPatientDoctorRelation = utility.addPatientDoctorRelation;

/* GET get the information of the patient */
router.get('/', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  Parse.User.become(sessionToken, {
    success: function success(user) {
      if (user) {
        var ret = {
          firstname: user.get("firstname"),
          gender: user.get("gender"),
          email: user.get("email"),
          phone: user.get("phone")
        };
        res.status(200)
            .json({code: 1, info: ret});
      } else {
        res.status(401)
            .json({code: 401, message: ""});
      }
    },
    error: function error(error) {
      res.status(401)
          .json({code: error.code, message: error.message});
    }
  });
});

/* POST sign up a new patient */
router.post('/', function(req, res, next) {
  signUpUser(req.body, "Patient", {
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

/* add an appointment for a patient with the doctor selected */
router.post('/appointment', function(req, res) {
  var sessionToken = req.get("x-parse-session-token");
  console.log(req.body);
  Parse.User.become(sessionToken, {
    success: function(user) {
      var Doctor = new Parse.Object.extend("Doctor");
      var query = new Parse.Query(Doctor);
      var doctorId = req.body.doctorId;
      query.equalTo("objectId", doctorId);
      query.first({
        success: function success(doctor) {
          var patient = user.get("patientPointer");
          var Appointment = new Parse.Object.extend("Appointment");
          var appointment = new Appointment();
          var newQuery = new Parse.Query(Appointment);
          var time = {__type: "Date", iso: req.body.date};
          newQuery.equalTo("doctor", doctor);
          newQuery.equalTo("patient", patient);
          newQuery.equalTo("time", time);
          newQuery.first({
            success: function success(ret) {
              if (ret === undefined) {
                appointment.set("doctor", doctor);
                appointment.set("patient", patient);
                appointment.set("time", time);
                appointment.save(null, {
                  success: function(appointment) {
                    res.status(201).json({code: 1});
                  },
                  error: function(appointment, error) {
                    res.status(400).json(error);
                  }
                });
              } else {
                res.status(400)
                    .json({code: 0, message: "Already exists!"});
              }
            },
            error: function error(error) {
              res.status(400)
                  .json({code: error.code, message: error.message});
            }
          });
        },
        error: function error(error) {
          res.status(400)
              .json({code: error.code, message: error.message});
        }
      })
    },
    error: function(error) {
      res.status(401)
          .json({"code": error.code, "message": error.message});
    }
  });
});
//router.post('/appointment', function(req, res, next) {
//  var sessionToken = req.get("x-parse-session-token");
//  Parse.User.become(sessionToken, {
//    success: function() {
//      var user = Parse.User.current();
//      console.log(req.body);
//      var doctor = Parse.Object.extend("Doctor");
//      var query = new Parse.Query(doctor);
//      query.equalTo("objectId", req.body.doctorId);
//      query.first({
//        success: function(doctor) {
//          var patient = Parse.Object.extend("Patient");
//          var users = Parse.Object.extend("_User");
//          var _user = new users();
//          _user.id = user.id;
//          var query = new Parse.Query(patient);
//          query.include("user");
//          query.equalTo("user", _user);
//          query.first({
//            success: function(patient) {
//              var appointment = new Parse.Object("Appointment");
//              appointment.set("doctor", doctor);
//              appointment.set("patient", patient);
//              appointment.set("time", {__type: "Date", iso: req.body.date});
//              appointment.save(null, {
//                success: function(appointment) {
//                  addPatientDoctorRelation(patient, doctor, {
//                    success: function(relation) {
//                      res.status(200).json({code: 1});
//                    },
//                    error: function(error) {
//                      res.status(400).json(error);
//                    }
//                  })
//                },
//                error: function(appointment, error) {
//                  res.status(400).json(error);
//                }
//              })
//            },
//            error: function(error) {
//              res.status(400).json(error);
//            }
//          })
//        },
//        error: function(error) {
//          res.status(400).json(error);
//        }
//      })
//
//    },
//    error: function(error) {
//      res.status(401)
//        .json({"code": error.code, "message": error.message});
//    }
//  })
//});

/* retrieve the appintments of a patient */
router.get('/appointment', function(req, res) {
  var sessionToken = req.get("x-parse-session-token");
  sessionToken = "r:747c064fa2aeeba9cb19bfd541199cfa";
  Parse.User.become(sessionToken, {
    success: function success(user) {
      console.log("in");
      var patient = user.get("patientPointer");
      var Appointment = new Parse.Object.extend("Appointment");
      var query = new Parse.Query(Appointment);
      query.equalTo("patient", patient);
      query.include("doctor");
      query.include("doctor.userAccount");
      query.ascending("time");
      query.find({
        success: function success(appointments) {
          var ret = new Array();
          for (var i = 0; i < appointments.length; i++) {
            ret.push({
              doctorFirstName: appointments[i].get("doctor").get("userAccount").get("firstname"),
              doctorLastName: appointments[i].get("doctor").get("userAccount").get("lastname"),
              hospitalName: appointments[i].get("doctor").get("hospitalName"),
              hospitalCity: appointments[i].get("doctor").get("hospitalCity"),
              hospitalAddress: appointments[i].get("doctor").get("hospitalAddress"),
              date: appointments[i].get("time")
            });
          }
          res.json(ret);
        },
        error: function(patient, error) {
          res.status(400).json(error);
        }
      });
    },
    error: function error(error) {
      res.status(401)
          .json({"code": error.code, "message": error.message});
    }
  })
});

//router.get('/appointment', function(req, res, next) {
//  var sessionToken = req.get("x-parse-session-token");
//  Parse.User.become(sessionToken, {
//    success: function() {
//      var user = Parse.User.current();
//      var patient = Parse.Object.extend("Patient");
//      var users = Parse.Object.extend("_User");
//      var _user = new users();
//      _user.id = user.id;
//      var query = new Parse.Query(patient);
//      query.include("user");
//      query.equalTo("user", _user);
//      query.first({
//        success: function(patient) {
//          var appointment = Parse.Object.extend("Appointment");
//          var query = new Parse.Query(appointment);
//          query.select("time", "doctor.user.firstname", "doctor.user.lastname",
//            "doctor.hospitalName", "doctor.hospitalAddress", "doctor.hospitalCity");
//          query.include("doctor");
//          query.include("doctor.user");
//          query.ascending("time");
//          query.equalTo("patient", patient);
//          query.find({
//            success: function(results) {
//              var ret = new Array();
//              for (var i=0; i<results.length; i++) {
//                ret.push({
//                  doctorFirstName: results[i].get("doctor").get("user").get("firstname"),
//                  doctorLastName: results[i].get("doctor").get("user").get("lastname"),
//                  hospitalName: results[i].get("doctor").get("hospitalName"),
//                  hospitalCity: results[i].get("doctor").get("hospitalCity"),
//                  hospitalAddress: results[i].get("doctor").get("hospitalAddress"),
//                  date: results[i].get("time")
//                });
//              }
//              res.status(200).json(ret);
//            },
//            error: function(error) {
//              res.status(200).json([]);
//            }
//          })
//        },
//        error: function(patient, error) {
//          res.status(400).json(error);
//        }
//      });
//    },
//    error: function(error) {
//      res.status(401)
//        .json({"code": error.code, "message": error.message});
//    }
//  })
//});

/* Get precriptions of a patient */
router.get('/prescription', function(req, res) {
  var sessionToken = req.get('x-parse-session-token');
  Parse.User.become(sessionToken, {
    success: function success(user) {

      var Patient = new Parse.Object.extend("Patient");
      var patient = new Patient();
      patient.id = user.get("patientPointer").id;

      var Prescription = new Parse.Object.extend("Prescription");
      var query = new Parse.Query(Prescription);
      query.equalTo("patientID", patient);
      query.include("schedule");
      query.find({
        success: function success(prescritions) {
          res.status(200)
              .json({code: 1, data: prescritions});
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
});

module.exports = router;
