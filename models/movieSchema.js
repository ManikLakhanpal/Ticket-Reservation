import mongoose from "mongoose";

const personSchema = new mongoose.Schema(
  {
    name: String,
    role: String,
    image: String,
  },
  { _id: false }
);

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: String,
  genre: String,
  duration: String,
  languages: String,
  description: String,
  poster: String,
  cast: [personSchema],
  crew: [personSchema],
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;