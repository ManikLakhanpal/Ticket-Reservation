import auth from "../middleware/auth.js";
import Movie from "../models/movieSchema.js";
import Order from "../models/order.js";
import { Router } from "express";

const router = Router();

// * HomePage route below
router.get("/", auth, async (_, res) => {
  try {
    const allMovies = await Movie.find({});
    const featuredMovies = allMovies.filter(movie =>
      ["John Wick", "Interstellar"].includes(movie.title)
    );

    res.render("home", {
      movies: allMovies,
      featuredMovies
    });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Server error");
  }
});

// * MoviePage route below
router.get("/movie/:id", auth, async (req, res) => {
  try {
    const movieId = decodeURIComponent(req.params.id);
    const movie = await Movie.findOne({ title: movieId });

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    res.render("movie", { movie });
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).send("Server error");
  }
});

// * Order Page route below

router.get("/orders", async(req, res) => {

  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.render('order', { orders });
  } catch (err) {
    res.status(500).send("Error fetching orders");
  }

});

// * Route for login page
router.get("/login", (req, res) => {
  res.render("login");
});

export default router;