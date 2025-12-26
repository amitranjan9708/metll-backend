import "dotenv/config";
import express from "express";
import cors from "cors";
import { waitlistRouter } from "./routes/waitlist.js";
import { formRouter } from "./routes/form.js";

const app = express();
const PORT = process.env.BACKEND_PORT || 3001;

// Middleware
const allowedOrigins = [
  "https://metll.in",
  "http://localhost:8080",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", message: "Backend server is running" });
});

// API routes
app.use("/api/waitlist", waitlistRouter);
app.use("/api/form", formRouter);

// Error handling middleware
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
});

