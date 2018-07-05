const express = require("express");
const router  = express.Router();
const nodemailer = require('nodemailer');
const smtpConfig = require('../config').smtp;
// Increase count
router.get("/", function(req, res){
	res.render('contact', {page_name: 'contact'});
});



router.post("/", function(req, res) {
    console.log(smtpConfig);
	let smtpTrans = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        service: 'Gmail',
        port: 465,
        secure: true,
        auth: {
          user: smtpConfig.GMAIL_USER,
          pass: smtpConfig.GMAIL_PASS
        }
    });

    let mailOptions = {
        from: req.body.name + ' &lt;' + req.body.email + '&gt;',
        to: smtpConfig.GMAIL_USER,
        subject: 'New message from sentiment contact form',
        text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
    };

   smtpTrans.sendMail(mailOptions, (error, info) => {
        if (error) {
            req.flash("danger", "The messaging service seems to be down.")
            console.log(error);
        } else {
            req.flash("success", "Your message has been submitted!");
            console.log('Message sent: %s', info.messageId);
        }
        res.redirect('/contact');
    });


});


module.exports = router;
