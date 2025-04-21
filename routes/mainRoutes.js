import fs from "fs";
import auth from "../middleware/auth.js";
import { Router } from "express";

const router = Router();

router.use(auth);

const movies = JSON.parse(fs.readFileSync("./data/movies.json", "utf8"));

router.get("/", (_, res) => {
  res.render("home", { 
    movies: Object.values(movies),  
    featuredMovies: [movies["John Wick"], movies["Interstellar"]] 
  });
});

router.get("/movie/:id", (req, res) => {
  const movieId = decodeURIComponent(req.params.id);
  const movie = movies[movieId];

  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  res.render("movie", { movie });
});

router.get("/book/:id", (req, res) => {
  const movieId = decodeURIComponent(req.params.id);
  const movie = movies[movieId];

  if (!movie) {
    return res.status(404).send("Movie not found");
  }

  res.render("book", { movie });
});


export default router;
