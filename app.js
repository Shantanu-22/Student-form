if(process.env.NOD_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const path = require("path");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));
const mysql = require("mysql2");
const newid = require("uniqid");
const multer  = require('multer');
const {cloudinary,storage}= require("./cloudeConfig");
const upload = multer({ storage});

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "student",
    password: process.env.pass,
});


app.get("/", (req, res) => {
    res.render("index.ejs");
});

app.get("/show", (req, res) => {
    let query = "SELECT * FROM user";
    
    connection.query(query, (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: 'Failed to fetch user data' });
        }
        res.render("show.ejs", { data: result });
    });
});

app.post("/show",upload.single('data[image]'), (req, res) => {
    var data = req.body.data;
    let url = req.file.path;
    console.log(url);
    // Server-side validation
    if (!validateUserData(data)) {
        return res.status(400).json({ message: 'Invalid user data' });
    }

    try {
        const query = "INSERT INTO user (id, name, email, phone, address, city, state, image) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const element = [newid(), data.name, data.email, data.phone, data.address, data.city, data.state, url];

        connection.query(query, element, (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Failed to register user' });
            }

            res.redirect("/show");
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


function validateUserData(data) {
    // Perform validation checks here
    if (!data || typeof data !== 'object') {
        return false;
    }
    // Add more validation checks based on your requirements
    return true;
}

app.listen("3000", () => {
    console.log("server start");
    process.on('SIGINT', function () {
        connection.end(function () {
            console.log('MySQL connection closed.');
            process.exit();
        });
    });
});
