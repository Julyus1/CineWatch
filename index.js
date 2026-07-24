import express from "express"
import axios from "axios"
import bodyParser from "body-parser"
import dotenv from 'dotenv';
import path from "path";
import { fileURLToPath } from "url";



const app = express()


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const port = process.env.PORT;

const API_URL = "https://api.themoviedb.org/3/"
const myToken = process.env.SECRET_TOKEN;

const config = { headers: { 'Authorization': `Bearer ${myToken}` } }

app.use(bodyParser.urlencoded({ extended: true }));

const mood = { happy: 35, sad: 18, angry: [80, 53], excited: [28, 12], scared: 27, curious: [9648, 878], tense: 53, adventurous: [12, 14], motivated: [18, 36] };


app.use(express.static("public"));

app.get("/", (req, res) => {

    res.render("index.ejs")
})
app.post("/recommend", async (req, res) => {
    let moodValue = req.body.mood;
    let genreIds = mood[moodValue];

    if (Array.isArray(genreIds)) {
        genreIds = genreIds.join(",");
    }

    try {

        const response = await axios.get(API_URL + "discover/movie?with_genres=" + genreIds, config);

        const genresResponse = await axios.get(API_URL + "genre/movie/list", config);


        const movies = response.data.results
        const size = movies.length;

        function randomizer(n) {
            return Math.floor(Math.random() * n);
        }
        let randomNumber = randomizer(size);
        while (randomNumber < 8) {
            randomNumber = randomizer(size);
        }

        const sampleMovies = movies.slice((randomNumber - 8), randomNumber);


        res.render("index", { movies: sampleMovies, posterUrl: "https://image.tmdb.org/t/p/w400", genres: genresResponse.data.genres });


    } catch (error) {
        console.log(error.message)
    }
})
app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})