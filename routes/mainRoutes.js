import fs from "fs";
import sendBookingConfirmation from "../controllers/emailController.js";
import auth from "../middleware/auth.js";
import Order from "../models/order.js";
import { Router } from "express";

const router = Router();

const movies = JSON.parse(fs.readFileSync("./data/movies.json"), "utf8");

router.get("/", auth, (req, res) => {
  res.render("home", { movies: Object.keys(movies) });
});

router.get("/movie/:id", auth, (req, res) => {
  const movieId = decodeURIComponent(req.params.id);
  const movie = movies[movieId];

  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  res.render("movie", { movie });
});

router.get("/book/:id", auth, (req, res) => {
  const movieId = decodeURIComponent(req.params.id);
  const movie = movies[movieId];

  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  res.render("book", { movie });
});

// TODO: Razorpay will be added here in near future.
router.post("/pay", auth, async (req, res) => {
  const { movieTitle } = req.body;
  const { uid, email } = req.user;

  if (!email || !movieTitle) {
    return res.status(400).json({ message: "Email and movieTitle are required." });
  }

  const movie = movies[movieTitle];
  if (!movie) {
    return res.status(404).json({ message: "Movie not found." });
  }

  try {
    console.log(`Payment initiated for ${email}`);

    const newOrder = new Order({ uid, movieName: movieTitle });
    await newOrder.save();

    sendBookingConfirmation(email, movie);

    res.json({ message: "Payment successful! Confirmation email sent." });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});


export default router;
