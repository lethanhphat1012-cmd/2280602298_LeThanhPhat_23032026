const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "4f0a75b83eda29",
    pass: "37f2a25703412a"
    }
});

module.exports = transporter;