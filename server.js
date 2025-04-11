import express from "express";
import fs from "fs";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import sendBookingConfirmation from "./controllers/emailController.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT;
const movies = JSON.parse(fs.readFileSync("./data/movies.json"), "utf8");

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use("/api/auth", authRoutes); 


app.get('/', (_, res) => {
    res.render('home', { movies: Object.keys(movies) });
});

app.get('/movie/:id', (req, res) => {
    const movie = movies[req.params.id.replace(/%20/g, " ")];
    if (movie) {
        res.render('movie', { movie });
    } else {
        res.status(404).send('Movie not found');
    }
});

app.get('/book/:id', (req, res) => {
    const movie = movies[req.params.id.replace(/%20/g, " ")];
    console.log(req.params.id.replace(/%20/g, " "))
    if (movie) {
        res.render('book', { movie });
    } else {
        res.status(404).send('Movie not found');
    }
});

// ✅ Updated this route to use movieTitle instead of movieId
app.post("/pay", (req, res) => {
    const { email, movieTitle } = req.body;
    if (!email || !movieTitle) {
        return res.status(400).json({ message: "Email and movieTitle are required" });
    }

    const movie = movies[movieTitle];
    if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
    }

    console.log(`Payment initiated for ${email}`);

    sendBookingConfirmation(email, movie); // ✅ Send confirmation email

    res.json({ message: "Payment successful! Confirmation email sent." });
});

app.get("/login", (req, res) => res.render("login"));

app.listen(port, () => 
    console.log(`Server running on port ${port}`)
);
