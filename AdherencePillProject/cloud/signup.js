/**
 * Created by yichengwang on 5/10/2016.
 */
Parse.Cloud.define('signup', function(req, res) {
  //var email = req.body.email;
  //var password = req.body.password;
  //var firstName = req.body.firstname;
  //var lastName = req.body.lastname;
  //var gender = req.body.gender;

  var patient = new Parse.Object('X');
  patient.add('name', 'hahahah');
  console.log('*****');
  console.log(req);
  console.log('*****');
  console.log(req.body.name);
  patient.save(null, {
    success: function error(patient) {
      console.log(req);
      console.log('hah entry add success');
    },
    error: function error(err) {
      console.log('entry add fail');
    }
  });
  res.success('success');
});
