var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  var user = new Parse.User();

  res.json(user);
});
router.post('/', function(req, res, next) {
  // TODO: Check body
  var currentUser = Parse.User.current();
  console.log(currentUser);
  // TODO: Check parameters value valid
  var newUser = new Parse.User();
  newUser.set("username", req.body.email);
  newUser.set("password", req.body.password);
  newUser.set("email", req.body.email);
  newUser.set("phone", req.body.phone);
  newUser.set("firstname", req.body.firstname);
  newUser.set("lastname", req.body.lastname);
  newUser.set("gender", req.body.gender);

  // TODO: Check if registered before


  newUser.signUp(null, {
    success: function (user) {
      addPatient(user, {
        success: function (patient) {
          console.log("Patient " + patient.id + " saved");
          Parse.User.logIn(req.body.email, req.body.password, {
            success: function(user) {
              console.log(user);
              res.status(201).json({"code": 1, "sessionToken": user.attributes.sessionToken});
            },
            error: function(user, error) {
              res.status(400)
                .json({"code": error.code, "message": error.message});
            }
          })

        },
        error: function (error) {
          res.status(400)
            .json({"code": error.code, "message": error.message});
        }
      });
    },
    error: function (user, error) {
      res.status(400)
        .json({"code": error.code, "message": error.message});
    }
  })

});

function addPatient(user, callback) {
  var newPatient = new Parse.Object("Patient");
  newPatient.set("user", user);
  newPatient.save(null ,{
    success: function (patient) {
      return callback.success(patient);
    },
    error: function (patient, error) {
      return callback.error(error);
    }
  })
}

module.exports = router;
