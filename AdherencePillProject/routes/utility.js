var exports = module.exports = {};
var utility = require('utility');
var mail = require('../common/mail');

//Add an object according to the type (Patient or Doctor)
function addPerson (userInfo, type, callback) {
  console.log("add Person");
  var Person = new Parse.Object.extend(type);
  var newPerson = new Person();
  newPerson.set("userAccount", userInfo.user);
  if (type === "Doctor") {
    newPerson.set("hospitalName", userInfo.addtionInfo.hospitalName);
    newPerson.set("hospitalAddress", userInfo.addtionInfo.hospitalAddress);
    newPerson.set("hospitalCity", userInfo.addtionInfo.hospitalCity);
  }
  newPerson.save(null ,{
    success: function (person) {
      return callback.success(person);
    },
    error: function (person, error) {
      return callback.error(error);
    }
  });
}

//Sign up a new user
exports.signUpUser = function(userInfo, type, callback) {
  // TODO: Check body
  var newUser = new Parse.User();

  // TODO: Check parameters value valid
  newUser.set("username", userInfo.email);
  newUser.set("password", userInfo.password);
  newUser.set("email", userInfo.email);
  newUser.set("phone", userInfo.phone);
  newUser.set("firstname", userInfo.firstname);
  newUser.set("lastname", userInfo.lastname);
  newUser.set("gender", userInfo.gender);
  newUser.set("dateOfBirth", {__type: "Date", iso: userInfo.dob});

  // TODO: Check if registered before
  // Do not check, signup check it by itself
  newUser.signUp(null, {
    success: function (user) {
      addPerson({user: user, addtionInfo: userInfo}, type, {
        success: function (person) {
          console.log(type + " " + person.id + " saved");
          var pointer = type.toLowerCase() + "Pointer";
          console.log(pointer);
          user.set(pointer, person);
          user.save(null, {
            success: function() {
              var email = user.get('email');
              var firstname = user.get('firstname');
              var token = utility.md5(email + firstname + "test");
              mail.activateEmail(email, token, firstname, {
                success: function success () {
                  console.log("Email Sent!");
                },
                error: function error() {
                  console.log("Email not Sent");
                }
              });
              Parse.User.logIn(userInfo.email, userInfo.password, {
                success: function(user) {
                  callback.success(user);
                },
                error: function(user, error) {
                  callback.error(error);
                }
              });
            },
            error: function(error) {console.log(error);}
          });
        },
        error: function (error) {
          callback.error(error);
        }
      });
    },
    //TODO If error is invalid session token, consider using master key
    error: function (user, error) {
      callback.error(error);
    }
  })
}
//
//exports.getUserProfile = function(userInfo, type, callback) {
//  Parse.User.become(userInfo, {
//    success: function(user) {
//      console.log(user);
//      if (user) {
//        if (type === "Doctor") {
//          user.
//        }
//        return callback.success(user);
//      } else {
//        return callback.error({code: 209, message: "Invalid Session Token"});
//      }
//    },
//    error: function(error) {
//      return callback.error({code: error.code, message: error.message});
//    }
//  });
//}

exports.addPatientDoctorRelation = function(patient, doctor, callback) {
  var query = new Parse.Query(Parse.Object.extend("PatientDoctor"));
  query.equalTo("patient", patient);
  query.equalTo("doctor", doctor);
  query.first({
    success: function(result) {
      if (result === undefined) {
        var relation = new Parse.Object("PatientDoctor");
        relation.set("patient", patient);
        relation.set("doctor", doctor);
        relation.save(null, {
          success: function(relation) {
            return callback.success(relation);
          },
          error: function(relation, error) {
            return callback.error(error);
          }
        });
      }
      else {
        return callback.success(result);
      }

    },
    error: function(error) {
      return callback.error(error);
    }
  })
}
