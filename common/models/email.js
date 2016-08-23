/*module.exports = function(Email) {

};*/
var server = require('../../server/server');

module.exports = function(Email) {
  Email.observe('after save', function (ctx, next) {
    var nodemailer = require('nodemailer');
    var smtpTransport = require('nodemailer-smtp-transport');
    var transporter = nodemailer.createTransport(smtpTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: 'ishafoodcourt@gmail.com',   //ishafoodcourt@gmail.com,  pwd:  Monica@2016
        pass: 'Monica@2016'
      }
    }));
    //  var transporter = nodemailer.createTransport('smtps://stay.valuable%40vdeets.com:pass@recovervdeets%401');
    var mailOptions = {
      from: "'Yitsol' <ishafoodcourt@gmail.com>",
      to: ctx.instance.to,
      subject:ctx.instance.subject, // Subject line
      text:ctx.instance.text, // plaintext body
      html: ctx.instance.html // html body
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: ' + info.response);
    });


    next();

  });
};
