import dns from "dns";
dns.setDefaultResultOrder("ipv4first");

import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    family: 4, // Explicitly force IPv4 socket connection
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Optional: Check SMTP connection when server starts
transporter.verify((error, success) => {
    if (error) {
        console.log("❌ Mail configuration error:", error.message);
    } else {
        console.log("✅ Mail server is ready");
    }
});

export default transporter;