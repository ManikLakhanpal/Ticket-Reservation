import express from "express";
import fs from "fs";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import paymentRoutes from "./routes/razorpayRoutes.js";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

const logStream = fs.createWriteStream('access.log', { flags: 'a' });

// * MiddleWares
app.use(morgan("combined", { stream: logStream }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.set('view engine', 'ejs');

// * Routes below
app.use("/api/auth", authRoutes); 
app.use("/", mainRoutes);
app.use("/api", paymentRoutes);

// Error handling middleware
app.get(/.*/, (req, res, next) => {
    const error = new Error("Invalid request");
    error.status = 404;
    return next(error);
})

app.use((err, req, res, next) => {
    res.status(err.status).json({ success: false, message: err.message });
})

app.listen(port, () => 
    console.log(`Server running on port http://localhost:${port}`)
);
