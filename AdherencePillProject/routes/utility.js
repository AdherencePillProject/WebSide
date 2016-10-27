var exports = module.exports = {};

exports.addPatient = function(user, callback) {
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
exports.addDoctor = function(user, userInfo, callback) {
  var newDoctor = new Parse.Object("Doctor");
  newDoctor.set("user", user);
  newDoctor.set("hospitalName", userInfo.hospitalName);
  newDoctor.set("hospitalAddress", userInfo.hospitalAddress);
  newDoctor.set("hospitalCity", userInfo.hospitalCity);
  newDoctor.save(null ,{
    success: function (doctor) {
      return callback.success(doctor);
    },
    error: function (doctor, error) {
      return callback.error(error);
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
