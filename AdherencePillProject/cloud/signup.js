/**
 * Created by yichengwang on 5/10/2016.
 */
Parse.Cloud.define('signup', function(req, res) {
  //var email = req.body.email;
  //var password = req.body.password;
  //var firstName = req.body.firstname;
  //var lastName = req.body.lastname;
  //var gender = req.body.gender;

  var patient = new Parse.Object('Patient');
  patient.add('name', 'hahahah');
  patient.save(null, {
    success: function error(patient) {
      console.log('yes');
    },
    error: function error(err) {
      console.log(err);
    }
  });
  res.success('success');
});