import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import morganMiddleware from "./config/morgan";
import connectDB from "./config/dbConfig";

//configurations

const app = express();
dotenv.config();
connectDB();
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(morganMiddleware)

//routes

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//server

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
