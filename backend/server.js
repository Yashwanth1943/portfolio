import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
const DB_RETRY_DELAY_MS = 5000;
const DB_CONNECT_TIMEOUT_MS = 5000;
const DB_SOCKET_TIMEOUT_MS = 10000;
const CONTACT_CREATE_TIMEOUT_MS = 10000;

const allowedOrigins = new Set([
  "http://localhost:3000",
  "http://localhost:5173",
  "http://localhost:10000",
  "https://portofolio-neon-six.vercel.app",
]);

const isAllowedOrigin = (origin) => {
  if (!origin) return true;
  if (allowedOrigins.has(origin)) return true;
  return /^https:\/\/[a-zA-Z0-9-]+\.vercel\.app$/.test(origin);
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

  isConnectingToDb = true;
  clearReconnectTimer();

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: DB_CONNECT_TIMEOUT_MS,
      socketTimeoutMS: DB_SOCKET_TIMEOUT_MS,
      maxPoolSize: 10,
    });
    console.log("MongoDB connected");
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

  return res.status(dbReady ? 200 : 503).json({
    status: dbReady ? "ready" : dbState === 2 ? "connecting" : "waking_up",
    dbReady,
    dbState,
  });
});

app.post("/api/contact", async (req, res) => {
  const start = Date.now();

  if (!isDbReady()) {
    void connectToDb();
    res.set("Retry-After", "5");

    return res.status(503).json({
      error: "Service is waking up. Please try again in a few seconds.",
    });
  }

  const name = req.body?.name?.trim();
  const email = req.body?.email?.trim();
  const message = req.body?.message?.trim() || "";

  if (!name || !email) {
    return res.status(400).json({ error: "Name and email are required." });
  }

  try {
    const saved = await withTimeout(
      Contact.create({ name, email, message }),
      CONTACT_CREATE_TIMEOUT_MS,
      "Contact save"
    );

    const duration = Date.now() - start;
    console.log(`POST /api/contact completed in ${duration}ms`);

    return res.status(201).json({
      message: "Form submitted successfully!",
      saved,
    });
  } catch (error) {
    const duration = Date.now() - start;
    console.error(`POST /api/contact failed in ${duration}ms`, error);

    if (error?.message?.includes("timed out")) {
      return res.status(503).json({
        error: "Server is taking longer than expected. Please try again shortly.",
      });
    }

    return res.status(500).json({ error: "Failed to submit form" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
