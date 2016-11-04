//Parse.Cloud.define('hello', function(req, res) {
//  res.success('Hi');
//});

Parse.Cloud.define('editUser', function(req, res) {
  //console.log(req);
  var email = req.params.email;
  console.log(email);
  Parse.Cloud.useMasterKey();
  var query = new Parse.Query(Parse.User);
  query.equalTo("email", email);
  query.first({success: function success(user) {
      console.log("yes in");
      console.log(user);
      user.set("emailVerified", true);
      user.save(null, {
        success: function success(user) {
          console.log("yep");
          res.success(user);
        },
        error: function error(error) {
          console.log("not");
          res.error(error);
        }
      });
    },
    error: function error(error) {
      res.error("fail");
    }
  });
});

//Parse.Cloud.run('editUser', {email: "yichengwang2015@u.northwestern.edu"}, {
//  success: function success(message) {
//    console.log(message);
//    res.json({code: 1, message: "success"});
//  },
//  error: function error(error) {
//    console.log(error);
//    res.json({code: 0, message: "fail"});
//  }
//});