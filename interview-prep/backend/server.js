import "dotenv/config";
import express from "express";
import cors from "cors";
import { clerkMiddleware } from "@clerk/express";
import codeRoutes from "./routes/code.js";
import interviewRoutes from "./routes/interview.js";
import hrRoutes from "./routes/hr.js";
import resumeRoutes from "./routes/resume.js";
import adminRoutes from "./routes/admin.js";

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL
  })
);
app.use(express.json());
app.use(clerkMiddleware());

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/code", codeRoutes);
app.use("/api/interview", interviewRoutes);
app.use("/api/hr", hrRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/admin", adminRoutes);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
