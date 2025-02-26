import e from "express";
import dotenv from "dotenv";

const app = e();
dotenv.config();

app.get("/", (req, res) => {
  res.send("hello from server");
});

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`server is running on port ${process.env.PORT}`);
});
