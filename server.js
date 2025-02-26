const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');

const movies = JSON.parse(fs.readFileSync(path.join(__dirname, "data", "movies.json"), "utf8"));

app.get('/', (req, res) => {
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

app.get('/main.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'main.html'));
})

app.get('/form.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
})

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
})

app.post('/submit-booking', (req, res) => {

    const newData = req.body;

    fs.readFile("Data.json", "utf-8", (err, data) => {

        let jsonData = [];

        if (!err && data) {
            jsonData = JSON.parse(data);
        }

        jsonData.push(newData);

        fs.writeFile("Data.json", JSON.stringify(jsonData, null, 2), (err) => {
            if (err) {
                res.status(500);
                res.send("error while submiting form");
            }
            res.status(200);
            res.send("Form submitted successfully");

        })
    })
})

app.listen(3000, () => {
    console.log(`Server is running at http://localhost:3000`);
});
