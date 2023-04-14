const nodemailer = require('nodemailer');

// Create a transporter object using SMTP transport
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: 'youremail@gmail.com',
        pass: 'yourpassword'
    }
});

// Define the email options
const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'recipientemail@example.com',
    subject: 'Test Email',
    text: 'This is a test email sent from Node.js'
};

// Send the email
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log(error);
    } else {
        console.log('Email sent: ' + info.response);
    }
});
