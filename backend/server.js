import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import transporter from "./config/mail.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dns.setDefaultResultOrder("ipv4first");

dotenv.config({ path: path.join(__dirname, ".env") });

const app = express();
const DB_RETRY_DELAY_MS = 5000;
const DB_CONNECT_TIMEOUT_MS = 5000;
const DB_SOCKET_TIMEOUT_MS = 10000;
const CONTACT_CREATE_TIMEOUT_MS = 10000;

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:10000",
  "https://yashwanthkosuri.in",
  "https://portfolio-two-pi-ddymchiwqd.vercel.app"
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  return /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);
};

const saveContactFallback = async (data) => {
  try {
    const filePath = path.join(process.cwd(), "submissions.json");
    let currentData = [];
    try {
      const fileContent = await fs.readFile(filePath, "utf-8");
      currentData = JSON.parse(fileContent);
    } catch (e) {
      // File doesn't exist or is invalid, start with empty array
    }
    const newEntry = {
      ...data,
      Timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      }),
      fallback: true
    };
    currentData.push(newEntry);
    await fs.writeFile(filePath, JSON.stringify(currentData, null, 2), "utf-8");
    return newEntry;
  } catch (err) {
    console.error("Fallback save failed:", err);
    throw err;
  }
};

app.use(
  cors({
    origin: (origin, callback) => {
      if (isAllowedOrigin(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "50kb" }));

mongoose.set("bufferCommands", false);

const isDbReady = () => mongoose.connection.readyState === 1;

let isConnectingToDb = false;
let reconnectTimer = null;

const clearReconnectTimer = () => {
  if (!reconnectTimer) {
    return;
  }

  clearTimeout(reconnectTimer);
  reconnectTimer = null;
};

const scheduleReconnect = (delayMs = DB_RETRY_DELAY_MS) => {
  if (isDbReady() || isConnectingToDb || reconnectTimer) {
    return;
  }

  reconnectTimer = setTimeout(() => {
    reconnectTimer = null;
    void connectToDb();
  }, delayMs);
};

const withTimeout = (promise, timeoutMs, label) =>
  new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`${label} timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((value) => {
        clearTimeout(timeoutId);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });

const connectToDb = async () => {
  if (isDbReady() || isConnectingToDb) {
    return;
  }

  if (!process.env.MONGO_URI) {
    console.warn("MONGO_URI environment variable is missing. MongoDB connection skipped, running in fallback mode.");
    return;
  }

  isConnectingToDb = true;
  clearReconnectTimer();

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: DB_CONNECT_TIMEOUT_MS,
      socketTimeoutMS: DB_SOCKET_TIMEOUT_MS,
      maxPoolSize: 10,
    });
  } catch (err) {
    console.error("MongoDB connection error:", err);
    scheduleReconnect();
  } finally {
    isConnectingToDb = false;
  }
};

mongoose.connection.on("connected", () => {
  clearReconnectTimer();
});

mongoose.connection.on("disconnected", () => {
  console.warn("MongoDB disconnected");
  scheduleReconnect(2000);
});

mongoose.connection.on("error", () => {
  scheduleReconnect();
});

void connectToDb();

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  message: String,
  Timestamp: {
    type: String,
    default: () =>
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
        dateStyle: "medium",
        timeStyle: "medium",
      }),
  },
});

const Contact = mongoose.model("Contact", contactSchema);

app.get("/api/health", (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbReady = isDbReady();

  return res.status(200).json({
    status: "ready",
    dbReady,
    dbState,
    fallbackEnabled: true,
  });
});

app.post("/api/contact", async (req, res) => {
  const start = Date.now();

  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim();
  const message = req.body?.message?.trim() || "";

  console.log(`📨 Received contact request from: ${name} (${email})`);

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  let savedData = null;
  let savedInDb = false;

  // 1. Try to save to MongoDB
  if (isDbReady()) {
    try {
      savedData = await withTimeout(
        Contact.create({ name, email, message }),
        CONTACT_CREATE_TIMEOUT_MS,
        "Contact save"
      );
      savedInDb = true;
      console.log("💾 Saved to MongoDB successfully!");
    } catch (dbError) {
      console.error("❌ MongoDB save failed, attempting fallback...", dbError);
    }
  } else {
    console.log("⚠️ MongoDB is not ready, checking connection...");
    void connectToDb();
  }

  // 2. Fallback save to file if DB save failed
  if (!savedInDb) {
    try {
      savedData = await saveContactFallback({ name, email, message });
      console.log("💾 Saved to submissions.json (fallback) successfully!");
    } catch (fallbackError) {
      console.error("❌ Fallback save failed:", fallbackError);
    }
  }

  // 3. Try to send Email notification to owner
  try {
    console.log("📧 Sending email notification to owner...");
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `New Portfolio Contact - ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });
    console.log("✅ Notification email sent to owner! Message ID:", info.messageId);
  } catch (emailError) {
    console.error("❌ Failed to send notification email to owner:", emailError.message);
  }

  // 3b. Try to send auto-reply confirmation email to visitor
  try {
    console.log(`📧 Sending confirmation email to visitor: ${email}...`);
    const info = await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Thank you for reaching out! - Yashwanth",
      html: `
        <h3>Hi ${name},</h3>
        <p>Thank you for connecting! I have received your message and will get back to you as soon as possible.</p>
        <br/>
        <p>Best regards,</p>
        <p><strong>Yashwanth</strong></p>
      `,
    });
    console.log("✅ Confirmation email sent to visitor! Message ID:", info.messageId);
  } catch (visitorEmailError) {
    console.error("❌ Failed to send confirmation email to visitor:", visitorEmailError.message);
  }

  // 4. Return response
  if (savedData) {
    return res.status(201).json({
      message: "Form submitted successfully!",
      saved: savedData,
    });
  } else {
    return res.status(500).json({ error: "Failed to submit form" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
