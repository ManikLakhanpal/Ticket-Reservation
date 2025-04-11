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
  const movie = movies[req.params.id.replace(/%20/g, " ")];
  if (movie) {
    res.render("movie", { movie });
  } else {
    res.status(404).send("Movie not found");
  }
});

router.get("/book/:id", auth, (req, res) => {
  const movie = movies[req.params.id.replace(/%20/g, " ")];
  console.log(req.params.id.replace(/%20/g, " "));
  if (movie) {
    res.render("book", { movie });
  } else {
    res.status(404).send("Movie not found");
  }
});

// TODO: Razorpay will be added here in near future.
router.post("/pay", auth, async (req, res) => {
  const { movieTitle } = req.body;
  const { uid, email } = req.user;

  if (!email || !movieTitle) {
    return res
      .status(400)
      .json({ message: "Email and movieTitle are required" });
  }

  const movie = movies[movieTitle];
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  console.log(`Payment initiated for ${email}`);

  const newOrder = new Order({ uid: uid, movieName: movieTitle });
  await newOrder.save();

  // * This sends confirmation email to the user.
  sendBookingConfirmation(email, movie);

  res.json({ message: "Payment successful! Confirmation email sent." });
});

router.get("/login", (req, res) => res.render("login"));

export default router;
