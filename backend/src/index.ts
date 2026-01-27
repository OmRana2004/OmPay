import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/pageRoutes";

dotenv.config();

const app = express();

/* ================= CORS ================= */

const allowedOrigins = [
  "http://localhost:3000",
  "https://ompay.vercel.app",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server / Postman / mobile apps
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true, // cookies allowed
  })
);

/* ======================================== */

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", router);

/* ================= PORT ================= */

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

