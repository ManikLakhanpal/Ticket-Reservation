import express from "express";
import fs from "fs";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set('view engine', 'ejs');

const movies = JSON.parse(fs.readFileSync("./data/movies.json"), "utf8");

app.get('/', (_, res) => {
    res.render('home', { movies: Object.keys(movies) });
});

app.get('/movie/:id', (req, res) => {
    const movie = movies[req.params.id];
    if (movie) {
        res.render('movie', { movie });
    } else {
        res.status(404).send('Movie not found');
    }
});

app.get('/book/:id', (req, res) => {
    const movie = movies[req.params.id];
    
    if (movie) {
        res.render('movie', { movie });
    } else {
        res.status(404).send('Movie not found');
    }
});

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});
