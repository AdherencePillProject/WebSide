var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;
var addPatientDoctorRelation = utility.addPatientDoctorRelation;
var findDoctor = utility.findDoctor;
var checkSession = utility.checkSession;
var getPatientProfile = utility.getPatientProfile;

/* GET get the information of the patient */
router.get('/', function(req, res, next) {
  checkSession(req.get("x-parse-session-token"), {
    success: function success(user) {
      var ret = {
        firstname: user.get("firstname"),
        gender: user.get("gender"),
        email: user.get("email"),
        phone: user.get("phone")
      };
      res.status(200).json({code: 1, info: ret});
    },
    error: function error(error) {
      res.status(401)
          .json({code: error.code, message: error.message});
    }
  }); //checkSession
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
  checkSession(req.get('x-parse-session-token'), {
    success: function(user) {
      findDoctor(req.body.doctorId, {
        success: function(doctor) {
          getPatientProfile(user.id, {
            success: function(patient) {
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
                  }
                  else {
                    res.status(400)
                        .json({code: 0, message: "Already exists!"});
                  }
                },
                error: function(error) {
                  res.status(400).json(error);
                }
              }); //newQuery.first
            },
            error: function(error) {
              res.status(400).json(error);
            }
          }); //getPatientProfile
        },
        error: function(error) {
          res.status(400).json(error);
        }
      }); //findDoctor
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  }); //checkSession
});

/* retrieve the appintments of a patient */
router.get('/appointment', function(req, res, next) {
  checkSession(req.get("x-parse-session-token"), {
    success: function(user) {
      getPatientProfile(user.id, {
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
      }); //getPatientProfile
    },
    error: function(error) {
      res.status(401)
        .json({"code": error.code, "message": error.message});
    }
  }); //checkSession
});

/* Get precriptions of a patient */
router.get('/prescription', function(req, res) {
  checkSession(req.get('x-parse-session-token'), {
    success: function success(user) {
      getPatientProfile(user.id, {
        success: function(patient) {
          var Prescription = new Parse.Object.extend("Prescription");
          var query = new Parse.Query(Prescription);
          query.equalTo("patient", patient);
          query.include("schedule");
          query.include("pill");
          query.find({
            success: function success(prescritions) {
              var ret = new Array();
              for (var i=0; i<prescritions.length; i++) {
                ret.push({
                  name: prescritions[i].get("name"),
                  pill: prescritions[i].get("pill"),
                  note: prescritions[i].get("note"),
                  schedule: prescritions[i].get("schedule").get("times")
                })
              }
              res.status(200).json(ret);
            },
            error: function error(error) {
              res.status(400)
                  .json({code: error.code, message: error.message});
            }
          });
        },
        error: function(error) {
          res.status(400)
              .json({code: error.code, message: error.message});
        }
      });//getPatientProfile
    },
    error: function error(error) {
      res.status(409)
          .json({code: error.code, message: error.message});
    }
  });//checkSession
});

router.get('/pills', function(req, res) {
  checkSession(req.get('x-parse-session-token'), {
    success: function success(user) {
      getPatientProfile(user.id, {
        success: function(patient) {
          var Prescription = new Parse.Object.extend("Prescription");
          var query = new Parse.Query(Prescription);
          query.equalTo("patient", patient);
          query.include("pill");
          query.find({
            success: function success(prescritions) {
              var ret = new Array();
              for (var i=0; i<prescritions.length; i++) {
                ret.push({
                  pillName: prescritions[i].get("pill").get("pillName"),
                  pillInfo: prescritions[i].get("pill").get("pillInfo"),
                  pillInstruction: prescritions[i].get("pill").get("pillInstruction"),
                })
              }
              res.status(200).json(ret);
            },
            error: function error(error) {
              res.status(400)
                  .json({code: error.code, message: error.message});
            }
          });
        },
        error: function(error) {
          res.status(400)
              .json({code: error.code, message: error.message});
        }
      });//getPatientProfile
    },
    error: function error(error) {
      res.status(409)
          .json({code: error.code, message: error.message});
    }
  });//checkSession
});

module.exports = router;
