const express = require("express");
const http = require("http");
const cors = require("cors");
require("dotenv").config();
const { initSocket } = require("./socket/socket");

const app = express();
const server = http.createServer(app);

// ================= MIDDLEWARE =================
app.use(
  cors({
    origin: (origin, callback) => {
      // allow requests with no origin (mobile apps, curl, etc)
      if (!origin) return callback(null, true);

      // 🔥 allow specific domain
      if (origin === "https://yourdomain.com") {
        return callback(null, true);
      }

      // 🔥 allow all others (like "*")
      return callback(null, true);
    },
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());

// ================= ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Watch Party Server Running");
});

// ================= SOCKET =================
initSocket(server);

// ================= START =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});