Parse.Cloud.define('signup', function(req, res) {
    //var email = req.body.email;
    //var password = req.body.password;
    //var firstName = req.body.firstname;
    //var lastName = req.body.lastname;
    //var gender = req.body.gender;

    var patient = new Parse.Object('X');
    patient.add('username', 'hahahah');
    console.log('*****');
    console.log(req);
    console.log('*****');
    patient.save(null, {
        success: function success(patient) {
            console.log(patient);
            console.log('hah entry add success');
        },
        error: function error(err) {
            console.log('entry add fail');
        }
    });
    res.success('success');
});

Parse.Cloud.define('retriveObjectInfo', function(req, res) {
    var objectType = req.params.type;
    console.log(objectType);
    var object = Parse.Object.extend("X");
    var query = new Parse.Query(object);
    query.equalTo("username", "hahahah");
    query.find({
        success: function success(object) {
            console.log('yes');
            console.log(object);
        },
        error: function error(err) {
            console.log('no');
            console.log(err);
        }
    });
    //var username = req.params.username;
    //var user = new Parse.User('X');
    //user.set('username', "hahahah");
    //user.set('password', "123");
    //user.signUp(null, {
    //    success: function success(user) {
    //        console.log(user);
    //        console.log('yes');
    //    },
    //    error: function error(err) {
    //        console.log(err);
    //        console.log('no');
    //    }
    //});
    //Parse.User.logIn("hahahah", "123", {
    //    success: function success(user) {
    //        console.log(user);
    //        console.log('yes');
    //    },
    //    error: function error(err) {
    //        console.log(err);
    //        console.log('no');
    //    }
    //});
});

Parse.Cloud.define('addNewObject', function(req, res) {

});

Parse.Cloud.define('changeObjectInfo', function(req, res) {

});

