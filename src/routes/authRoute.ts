import {
  loginUser,
  registerUser,
  logoutUser,
  refreshingToken,
} from "../controllers/authController";
import e from "express";

const router = e.Router();

router
  .post("/login", loginUser)
  .post("/register", registerUser)
  .post("/logout", logoutUser)
  .get("/refresh", refreshingToken);

export default router;
