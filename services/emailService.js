const transporter = require("../config/mail");

async function sendPasswordEmail(to, username, password) {
    await transporter.sendMail({
        from: '"Admin" <admin@test.com>',
        to: to,
        subject: "Account Information",
        html: `
            <h3>Hello ${username}</h3>
            <p>Your account has been created.</p>
            <p><b>Password:</b> ${password}</p>
        `
    });
}

module.exports = sendPasswordEmail;