const nodemailer = require("nodemailer")

const sendEmail = async (htmlContent, recipientEmail, subject) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.USER_EMAIL,
            pass: process.env.USER_PASS,
        },
    })

    const emailDetails = {
        from: process.env.USER_EMAIL,
        to: recipientEmail,
        subject: subject,
        html: htmlContent,
    }

    mailTransporter.sendMail(emailDetails, err => {
        if (err) {
            console.error("Error sending email:", err)
            return false
        } else {
            console.log("Email sent successfully")
            return true
        }
    })
}

module.exports = { sendEmail }

