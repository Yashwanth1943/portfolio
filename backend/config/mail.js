import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
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