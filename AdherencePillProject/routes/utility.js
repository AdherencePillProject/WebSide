var exports = module.exports = {};

//Add an object according to the type (Patient or Doctor)
function addPerson (userInfo, type, callback) {
  console.log("add Person");
  var Person = new Parse.Object.extend(type);
  var newPerson = new Person();
  newPerson.set("user", userInfo.user);
  if (type === "Doctor") {
    newPerson.set("user", userInfo.user);
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
          var pointer = type + "Pointer";
          user.set(pointer, person);
          user.save(null, {
            success: function() {},
            error: function(error) {console.log(error);}
          });
          Parse.User.logIn(userInfo.email, userInfo.password, {
            success: function(user) {
              callback.success(user);
            },
            error: function(user, error) {
              callback.error(error);
            }
          })

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
