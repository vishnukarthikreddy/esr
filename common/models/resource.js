var server=require('../../server/server');
module.exports = function(Resource) {

  Resource.validatesUniquenessOf('phone', {message: 'Phone could be unique'});

  Resource.forgotPassword = function (phone, cb) {

    var cb = cb;

    var Resource = server.models.Resource;
    var SMS = server.models.SMS;
    var EmailN = server.models.EmailN;

    Resource.findOne({"where": {"email": phone}}, function (err, Resource) {

      if (err) {
        cb(null, err);
      } else if (Resource == undefined) {

        var error = new Error("Your are not registered to our application");
        cb(error, null);

      } else {
        var randomstring = require("randomstring");

        var otp = randomstring.generate({
          length: 6,
          charset: 'numeric'
        });



        var SMS = server.models.SMS;

        var smsMessage = 'Your temporary password is ' + otp + ' .Please change your password after logging in your account.  Thank you';
        var destination = Resource.phone;


        Resource.updateAttributes({"password": otp}, function (err, ResourceNext) {

console.log("email"+JSON.stringify(ResourceNext));
          var EmailN = server.models.Email;
          var Sms = server.models.Sms;
          EmailN.create({
            "to": ResourceNext.email,
            "from": "info@yitsol.com",
            "subject": "ActiveLife :Your temporary password for ActiveLifePlus",
            "text": "",
            "html": "Your temporary password is " + otp + " .Change your password after login. " + "<br>Thank You"
          }, function (err, email) {
            console.log(email);
            cb(null, email);

          });

        });
      }

    });

  };

  Resource.remoteMethod('forgotPassword', {
    description: "Enter mobile number to reset the password",
    returns: {
      arg: 'Resource',
      type: 'array'
    },
    accepts: [{arg: 'phone', type: 'string', http: {source: 'query'}}],
    http: {
      path: '/forgotPassword',
      verb: 'get'
    }
  });


  Resource.validateOTP = function (phone, otp, cb) {

    var cb = cb;
    var Resource = server.models.Resource;
    var SMS = server.models.SMS;
    var EmailN = server.models.EmailN;

    Resource.findOne({"where": {"phone": phone}}, function (err, Resource) {

      //console.log("Resource: "+ JSON.stringify(Resource));
      if (err) {
        cb(null, err);
      } else if (Resource == undefined) {

        var error = new Error("Your are not registered to our application");
        cb(error, null);

      } else {
        if (Resource.otp == otp) {

          Resource.updateAttributes({otpStatus: true}, function (err, ResourceNext) {
            var userName = ResourceNext.name;
            var smsMessage = "Dear "+ userName +", your registration for Food For Thought is now complete. Log-in and enjoy your favorite desserts delivered right to your doorstep.";
            var destination = ResourceNext.phone;

            SMS.create({destination: destination, message: smsMessage}, function (err, sms) {

            });

            cb(null, ResourceNext);
          });

        } else {
          var error = new Error("OTP is not matched");
          cb(error, null);
          //next();
        }
      }

    });

  };

  Resource.remoteMethod('validateOTP', {
    description: "Enter your otp to activate account",
    returns: {
      arg: 'Resource',
      type: 'array'
    },
    accepts: [{arg: 'phone', type: 'string', http: {source: 'query'}},
      {arg: 'otp', type: 'string', http: {source: 'query'}}],
    http: {
      path: '/validateOTP',
      verb: 'get'
    }
  });

  Resource.resendOTP = function (phone, cb) {

    var cb = cb;

    var Resource = server.models.Resource;
    var SMS = server.models.SMS;
    var EmailN = server.models.EmailN;

    Resource.findOne({"where": {"phone": phone}}, function (err, Resource) {

      if (err) {
        cb(null, err);
      } else if (Resource == undefined) {

        var error = new Error("New Registration");
        cb(error, null);

      } else {
        var randomstring = require("randomstring");

        var otp = randomstring.generate({
          length: 4,
          charset: 'numeric'
        });
        ;

        var SMS = server.models.SMS;

        var smsMessage = 'Your unique verification code for Food For Thought is ' + otp + ' Thank you';
        var destination = Resource.phone;


        Resource.updateAttributes({otpStatus: false, otp: otp}, function (err, ResourceNext) {

          SMS.create({destination: destination, message: smsMessage}, function (err, sms) {
            cb(null, sms);
          });

        });
      }

    });

  };

  Resource.remoteMethod('resendOTP', {
    description: "Enter your otp to activate account",
    returns: {
      arg: 'Resource',
      type: 'array'
    },
    accepts: [{arg: 'phone', type: 'string', http: {source: 'query'}}],
    http: {
      path: '/resendOTP',
      verb: 'get'
    }
  });



};
