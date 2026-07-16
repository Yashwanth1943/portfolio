import dns from "dns";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Verify SMTP connection when server starts
transporter.verify((error) => {
    if (error) {
        console.error("❌ Mail configuration error:", error);
    } else {
        console.log("✅ Mail server is ready");
    }
});

export default transporter;