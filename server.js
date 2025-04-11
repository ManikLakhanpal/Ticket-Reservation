import express from "express";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import mainRoutes from "./routes/mainRoutes.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

// * MiddleWares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.set('view engine', 'ejs');
app.use("/api/auth", authRoutes); 
app.use("/", mainRoutes);

app.listen(port, () => 
    console.log(`Server running on port http://localhost:${port}`)
);
