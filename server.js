import express from "express";
import fs from "fs";
import connectDB from "./database/db.js";
import authRoutes from "./routes/authRoutes.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer"; // ✅ Added for email

dotenv.config();

const app = express();
const port = process.env.PORT;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');
app.use("/api/auth", authRoutes); 

const movies = JSON.parse(fs.readFileSync("./data/movies.json"), "utf8");

// ✅ Setup Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// ✅ Function to send booking confirmation
const sendBookingConfirmation = (email, movie) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: `🎟️ Your Ticket for ${movie.title} is Confirmed!`,
        html: `
            <h2>Booking Confirmation</h2>
            <p><strong>Movie:</strong> ${movie.title}</p>
            <p><strong>Genre:</strong> ${movie.genre}</p>
            <p><strong>Duration:</strong> ${movie.duration}</p>
            <p><strong>Languages:</strong> ${movie.languages}</p>
            <p>Enjoy the show! 🍿</p>
        `
    };

    transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
            console.error("Error sending email:", err);
        } else {
            console.log("Email sent:", info.response);
        }
    });
};

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

app.post("/pay", (req, res) => {
    const { email, movieId } = req.body;
    if (!email || !movieId) return res.status(400).json({ message: "Email and movieId are required" });

    const movie = movies[movieId.replace(/%20/g, " ")];
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    console.log(`Payment initiated for ${email}`);

    sendBookingConfirmation(email, movie); // ✅ Send confirmation email

    res.json({ message: "Payment successful! Confirmation email sent." });
});

app.get("/login", (req, res) => res.render("login"));

app.listen(port, () => 
    console.log(`Server running on port ${port}`)
);
