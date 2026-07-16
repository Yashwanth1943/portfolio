import dns from "dns";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dns.setDefaultResultOrder("ipv4first");
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Mail configuration error:", error);
    } else {
        console.log("✅ Mail server is ready");
    }
});

export default transporter;