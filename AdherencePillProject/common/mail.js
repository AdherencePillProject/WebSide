var mailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var handlebars = require('handlebars');
var fs = require('fs');

var mailOptions = {
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: process.env.EMAIL_PORT || 25,
    auth: {
        user: process.env.EMAIL_USER || "adherencepill@gmail.com",
        pass: process.env.EMAIL_PASSWORD || "adherencepill!"
    }
};

var transporter = mailer.createTransport(smtpTransport(mailOptions));

function sendEmail(data) {
    transporter.sendMail(data, function(error) {
        if (error) {
            console.log(error);
        } else {
            console.log('success');
        }
    });
}

function getTemplate(templateFile, callback) {
    fs.readFile(templateFile, 'utf8', function (err, template) {
        if (!err) {
            return callback.success(template);
        } else {
            return callback.error(err);
        }
    });
}

exports.activateEmail = function(email, token, firstname, templateFile) {
    var from = process.env.EMAIL_USER;
    var to = email;
    var subject = "Activate your account at";
    getTemplate(templateFile, {
        success: function success(template) {
            var source = template;
            var template = handlebars.compile(source);
            handlebars.registerHelper('link', function(host, token, firstname) {
                return new handlebars.SafeString(host + '/active_account?key=' + token + '&firstname=' + firstname);
            });
            var data = {
                firstname: firstname,
                host: process.env.SITE_ROOT_URL || "http://localhost:5000",
                token: token
            };
            var html = template(data);
            console.log(html);
            sendEmail({
                from: from,
                to: to,
                subject: subject,
                html: html
            });
        },
        error: function error(error) {
            console.log(error);
        }
    });
};