const express = require('express');
const multiparty = require('multiparty'),
    util = require('util'),
    fs = require('fs'),
    nodemailer = require('nodemailer');


let router = express.Router(),
    // create reusable transporter object using the default SMTP transport
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'oleg.kyrpenko@gmail.com',
            pass: 'Abvargl3'
        }
    });
let send = function(params){
    return new Promise((resolve, reject) => {
        let mailOptions = {
            from: '"Fred Foo" <oleg.kyrpenko@gmail.com>', // sender address
            to: params.address, // list of receivers
            subject: params.subject,
            text: params.body,
            attachments: [{
                content: params.buffer,
                filename: 'invoice-8.pdf'
            }]
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info);
            }
        });
    });

};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.post('/', function(req, res, next) {

    let form = new multiparty.Form();

    form.parse(req, function(err, fields, files) {

        var buf = Buffer.from(fields.attachment[0], 'base64');
        send({
            address: fields.address[0],
            subject: fields.subject[0],
            body: fields.body[0],
            buffer: buf
        }).then((info) => {
            console.log('The file has been saved!');
            res.writeHead(200, {'content-type': 'text/plain'});
            res.end('received upload:\n\n');
            //res.end(util.inspect({fields: fields, files: files}));
        });
        //fs.writeFile('D:\\Projects\\MailSender\\tmp\\i.pdf', buf, function(err){
        //    if (err) throw err;
        //});


    });
    //res.render('index', { title: 'Express' });
});



module.exports = router;