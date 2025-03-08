import e from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoConfig from "./configs/mongoConfig";
import globalErrorHandler from "./middlewares/globalErrorHandler";
import authRouter from "./routes/authRoute";
import { logInfo } from "./lib/utils/logger";

const app = e();
dotenv.config();
mongoConfig();

app.use(e.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use("/api/auth", authRouter);

app.use(globalErrorHandler);

const port: string = process.env.PORT || "3001";

app.listen(port, () => {
  logInfo(`server is running on port ${port}`);
});
