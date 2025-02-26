import { loginUser, registerUser } from "../controllers/authController";
import e from 'express'

const router = e.Router();

router
    .post("/login", loginUser)
    .post("/register", registerUser);

export default router