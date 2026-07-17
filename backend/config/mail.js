import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

console.log("BREVO_USER:", process.env.BREVO_USER);
console.log("BREVO_PASS:", process.env.BREVO_PASS ? "Loaded" : "Missing");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },
});

transporter.verify((err, success) => {
    if (err) {
        console.error("SMTP VERIFY:", err);
    } else {
        console.log("SMTP READY");
    }
});

export default transporter;