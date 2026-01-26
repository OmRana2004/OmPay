import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import router from "./routes/pageRoutes";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // frontend
    credentials: true,               // allow cookies
  })
);

app.use(express.json());
app.use(cookieParser()); 

app.use("/api/v1", router);

app.listen(3001, () => {
  console.log("server is running on port 3001");
});
