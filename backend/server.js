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
  "https://www.yashwanthkosuri.in",
  "https://portfolio-two-pi-ddymchiwqd.vercel.app"
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  if (/^http:\/\/localhost:\d+$/.test(origin)) return true;
  if (/^https:\/\/(?:www\.)?yashwanthkosuri\.in$/.test(origin)) return true;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.vercel\.app$/.test(origin)) return true;
  if (/^https:\/\/[a-zA-Z0-9.-]+\.(?:on)?render\.com$/.test(origin)) return true;
  return false;
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
        console.warn("CORS blocked request from origin:", origin);
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

  // 3. Send notification email to owner
  try {
    console.log("📧 Sending email notification to owner...");

    const info = await transporter.sendMail({
      from: '"Yashwanth Portfolio" <yashwanthkosuri@gmail.com>',
      to: process.env.EMAIL_USER,
      subject: `📩 New Portfolio Contact - ${name}`,
      html: `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
</head>

<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td align="center">

<table width="600" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:18px;overflow:hidden;margin:40px 0;box-shadow:0 15px 40px rgba(0,0,0,.08);">

<tr>
<td style="padding:35px;background:linear-gradient(135deg,#4F46E5,#7C3AED,#9333EA);text-align:center;color:white;">

<h1 style="margin:0;font-size:28px;">
🚀 New Portfolio Contact
</h1>

<p style="margin-top:10px;font-size:15px;opacity:.9;">
Someone contacted you through your portfolio.
</p>

</td>
</tr>

<tr>

<td style="padding:35px;">

<table width="100%" cellpadding="10">

<tr>
<td width="120"><strong>Name</strong></td>
<td>${name}</td>
</tr>

<tr>
<td><strong>Email</strong></td>
<td>
<a href="mailto:${email}">
${email}
</a>
</td>
</tr>

<tr>
<td valign="top"><strong>Message</strong></td>

<td>

<div style="
background:#f8fafc;
padding:18px;
border-radius:10px;
border-left:5px solid #6366F1;
line-height:1.8;
">

${message}

</div>

</td>

</tr>

</table>

<br>

<div align="center">

<a href="mailto:${email}"

style="
display:inline-block;
padding:14px 28px;
background:#4F46E5;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">

Reply Now

</a>

</div>

</td>

</tr>

<tr>

<td
style="
padding:20px;
background:#f8fafc;
text-align:center;
font-size:13px;
color:#64748b;
">

© ${new Date().getFullYear()} Yashwanth Portfolio

</td>

</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`,
    });

    console.log("✅ Notification email sent! Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ Owner mail failed:", error);
  }


  // 4. Send confirmation email to visitor
  try {
    console.log(`📧 Sending confirmation email to ${email}...`);

    const info = await transporter.sendMail({
      from: '"Yashwanth Portfolio" <yashwanthkosuri@gmail.com>',
      to: email,
      subject: "Thank you for reaching out! - Yashwanth",
      html: `
<!DOCTYPE html>

<html>

<head>

<meta charset="UTF-8">

</head>

<body style="margin:0;background:#eef2ff;font-family:Arial,sans-serif;">

<table width="100%">

<tr>

<td align="center">

<table width="600"

style="
background:white;
margin:40px;
border-radius:18px;
overflow:hidden;
box-shadow:0 15px 35px rgba(0,0,0,.08);
">

<tr>

<td

style="
background:linear-gradient(135deg,#4F46E5,#9333EA);
padding:45px;
text-align:center;
color:white;
">

<h1>

Thanks for contacting me 👋

</h1>

<p>

I'll get back to you very soon.

</p>

</td>

</tr>

<tr>

<td style="padding:35px;">

<h2>

Hello ${name},

</h2>

<p style="line-height:1.9;color:#475569;">

Thank you for contacting me through my portfolio website.

Your message has been received successfully.

I appreciate your interest and I'll reply as soon as possible.

</p>

<br>

<div

style="
background:#f8fafc;
padding:20px;
border-radius:12px;
border-left:4px solid #6366F1;
">

<strong>Your Message</strong>

<br><br>

${message}

</div>

<br><br>

<div align="center">

<a

href="https://yashwanthkosuri.in"

style="
display:inline-block;
padding:15px 30px;
background:#4F46E5;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">

Visit Portfolio

</a>

&nbsp;&nbsp;

<a

href="https://linkedin.com/in/YOUR-LINKEDIN"

style="
display:inline-block;
padding:15px 30px;
background:#0A66C2;
color:white;
text-decoration:none;
border-radius:8px;
font-weight:bold;
">

LinkedIn

</a>

</div>

<br><br>

Regards,

<br>

<b>Yashwanth</b>

<br>

Full Stack Developer

</td>

</tr>

<tr>

<td

style="
background:#f8fafc;
padding:18px;
text-align:center;
font-size:13px;
color:#64748b;
">

© ${new Date().getFullYear()} Yashwanth Portfolio

</td>

</tr>

</table>

</td>

</tr>

</table>

</body>

</html>
`,
    });

    console.log("✅ Visitor confirmation mail sent! Message ID:", info.messageId);

  } catch (error) {
    console.error("❌ Visitor mail failed:", error);
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
