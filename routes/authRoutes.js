import express from "express";
import { loginUser, signupUser } from "../controllers/authController.js";  

const router = express.Router();

// Define Login & Signup Routes
router.post("/login", loginUser);
router.post("/signup", signupUser);  

export default router;
