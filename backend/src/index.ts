import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/pageRoutes";

dotenv.config();

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 3001;

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://ompay.vercel.app",
];

/* ================= MIDDLEWARES ================= */

// CORS
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    credentials: true, // allow cookies
  })
);

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

/* ================= ROUTES ================= */

app.use("/api/v1", router);

/* ================= SERVER ================= */

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
