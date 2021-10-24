
require('dotenv').config()
const { response } = require("express");
const express = require("express");
const bodyParser = require("body-parser");

const https = require("https");

const app=express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req,res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    const city=req.body.cityName;
    const apiKey=process.env.API_KEY;
    const unit=req.body.unit;
    let dispayedUnit = "";

    if(unit === "standard") {
        dispayedUnit = "Kelvin;"
    } else if(unit === "metric") {
        dispayedUnit = "Celsius";
    } else {
        dispayedUnit = "Fahrenheit";
    }

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=" + unit;

    https.get(url, function(response) {

        response.on("data", function(data) {
            const weatherData=JSON.parse(data);
            const description=weatherData.weather[0].description;
            const temp=weatherData.main.temp;
            const icon=weatherData.weather[0].icon;
            const imageURL="http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write("<p>The weather is currently: " + description + "</p>");
            res.write("<h1> The temperature in " + city + " is: " + temp + " degree " + dispayedUnit + "</h1>");
            res.write("<img src=" + imageURL + ">");
            res.send();

        });
    });
});

app.listen(3000, function() {
    console.log("Server is running on port 3000.");
});