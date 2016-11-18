var express = require('express');
var router = express.Router();
var utility = require('./utility');
var signUpUser = utility.signUpUser;
var checkSession = utility.checkSession;
var isDoctor = utility.isDoctor;
var findPatient = utility.findPatient;
var findPill = utility.findPill;

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
            // user: doctor;
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
                    firstName: results[i].get("patient").get("user").get("firstname"),
                    lastName: results[i].get("patient").get("user").get("lastname"),
                    dateOfBirth: results[i].get("patient").get("user").get("dateOfBirth"),
                    phone: results[i].get("patient").get("user").get("phone"),
                    email: results[i].get("patient").get("user").get("email"),
                    gender: results[i].get("patient").get("user").get("gender"),
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

router.post('/patient/prescription', function(req, res, next) {
  checkSession(req.get("x-parse-session-token"), {
    success: function(user) {
      isDoctor(user.id, {
        success: function(doctor) {
          findPatient(req.body.patientId, {
            success: function(patient) {
              findPill(req.body.pillId, {
                success: function(pill) {
                  var Schedule = new Parse.Object.extend("Schedule");
                  var schedule = new Schedule();
                  schedule.set("times", req.body.times);
                  schedule.save(null, {
                    success: function(schedule) {
                      var Prescription = new Parse.Object.extend("Prescription");
                      var prescription = new Prescription();
                      prescription.set("name", req.body.name);
                      prescription.set("schedule", schedule);
                      prescription.set("note", req.body.note);
                      prescription.set("doctor", doctor);
                      prescription.set("patient", patient);
                      prescription.set("pill", pill);
                      prescription.save(null, {
                        success: function(prescription) {
                          res.status(201).json({code: 1});
                        },
                        error: function(error) {
                          res.status(400).json(error);
                        }
                      })
                    },
                    error: function(error) {
                      res.status(400).json(error);
                    }
                  }); //schedule.save
                },
                error: function(error) {
                  res.status(400).json(error);
                }
              }); //findPill
            },
            error: function(error) {
              res.status(400).json(error);
            }
          }); //findPatient
        },
        error: function(error) {
          res.status(400).json(error);
        }
      }); //isDoctor
    },
    error: function(error) {
      res.status(400).json(error);
    }
  }); //checkSession
});

router.get('/patient/prescription', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  if (sessionToken) {
    Parse.User.become(sessionToken, {
      success: function(user) {
        var doctors = Parse.Object.extend("Doctor");
        var users = Parse.Object.extend("_User");
        var _user = new users();
        _user.id = user.id;
        var query = new Parse.Query(doctors);
        query.include("user");
        query.equalTo("user", _user);
        query.first({
          success: function(doctor) {
            var patient = Parse.Object.extend("Patient");
            var query = new Parse.Query(patient);
            query.equalTo("objectId", req.query.patientId);
            query.first({
              success: function(patient) {
                var Prescription = new Parse.Object.extend("Prescription");
                var query = new Parse.Query(Prescription);
                var doctors = Parse.Object.extend("Doctor");
                var _doctor = new doctors();
                _doctor.id = doctor.id;
                var patients = Parse.Object.extend("Patient");
                var _patient = new patients();
                _patient.id = patient.id;
                query.include("schedule");
                query.include("pill");
                query.equalTo("doctor", _doctor);
                query.equalTo("patient", _patient);
                query.find({
                  success: function(results) {
                    var ret = new Array();
                    for (var i=0; i<results.length; i++) {
                      ret.push({
                        id: results[i].id,
                        name: results[i].get("name"),
                        pill: results[i].get("pill"),
                        note: results[i].get("note"),
                        times: results[i].get("schedule").get("times")
                      });
                    }
                    res.status(200).json(ret);
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
            res.status(400).json(error);
          }
        });
      },
      error: function(error) {
        res.status(400).json(error);
      }
    });
  }
  else {
    res.status(403).json({code: 201, massage: "Invalid session"});
  }
})

router.delete('/patient/prescription', function(req, res, next) {
  var sessionToken = req.get("x-parse-session-token");
  if (sessionToken) {
    Parse.User.become(sessionToken, {
      success: function(user) {
        var doctors = Parse.Object.extend("Doctor");
        var users = Parse.Object.extend("_User");
        var _user = new users();
        _user.id = user.id;
        var query = new Parse.Query(doctors);
        query.equalTo("user", _user);
        query.first({
          success: function(doctor) {
            var Prescription = Parse.Object.extend("Prescription");
            var query = new Parse.Query(Prescription);
            query.equalTo("objectId", req.query.prescriptionId);
            query.first({
              success: function(result) {
                result.destroy({
                  success: function(result) {
                    res.status(200).json({code: 1});
                  },
                  error: function(error) {
                    res.status(400).json(error);
                  }
                });
              },
              error: function(error) {
                res.status(400).json(error);
              }
            });
          },
          error: function(error) {
            res.status(400).json(error);
          }
        });
      },
      error: function(error) {
        res.status(400).json(error);
      }
    });
  }
  else {
    res.status(403).json({code: 201, massage: "Invalid session"});
  }
})

router.get('/appointments', function(req, res, next) {
  checkSession(req.get("x-parse-session-token"), {
    success: function(user) {
      isDoctor(user.id, {
        success: function(doctor) {
          var Appointment = new Parse.Object.extend("Appointment");
          var query = new Parse.Query(Appointment);
          query.equalTo("doctor", doctor);
          query.include("patient");
          query.include("patient.user");
          query.ascending("time");
          query.find({
            success: function(results) {
              console.log(results);
              var ret = new Array();
              for (var i=0; i<results.length; i++) {
                ret.push({
                  time: results[i].get("time"),
                  patient: {
                    id: results[i].get("patient").id,
                    firstname: results[i].get("patient").get("user").get("firstname"),
                    lastname: results[i].get("patient").get("user").get("lastname"),
                    gender: results[i].get("patient").get("user").get("gender"),
                    dateOfBirth: results[i].get("patient").get("user").get("dateOfBirth")
                  }
                });
              }
              res.status(200).json(ret);
            },
            error: function(error) {
              res.status(400).json(error);
            }
          }); //query.find
        },
        error: function(error) {
          res.status(400).json(error);
        }
      }); //isDoctor
    },
    error: function(error) {
      res.status(400).json(error);
    }
  }); //checkSession
});

router.post('/appointment', function(req, res, next) {
  checkSession(req.get("x-parse-session-token"), {
    success: function(user) {
      isDoctor(user.id, {
        success: function(doctor) {
          findPatient(req.body.patientId, {
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
                        res.status(200).json({code: 1});
                      },
                      error: function(error) {
                        res.status(400).json(error);
                      }
                    }); //appointment.save
                  }
                  else {
                    res.status(400).json({code: 0, message: "Already exists!"});
                  }
                },
                error: function(error) {
                  res.status(400).json(error);
                }
              }); //newquery.first
            },
            error: function(error) {
              res.status(400).json(error);
            }
          }); //findPatient
        },
        error: function(error) {
          res.status(400).json(error);
        }
      }); //isDoctor
    },
    error: function(error) {
      res.status(400).json(error);
    }
  }); //checkSession
});

module.exports = router;
