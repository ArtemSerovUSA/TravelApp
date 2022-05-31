const dotenv = require('dotenv');
dotenv.config();
let projectData = {};
// Require Express to run server and routes
const express = require('express');
// Start up an instance of app
const app = express();
module.exports = app
/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
// Dependencies
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());
// Initialize the main project folder
//app.use(express.static('src/client/views'));
//app.use(express.static('src/client'));

app.use(express.static('dist'));
app.use(express.static('images'));
app.get('/', function (req, res) {
    res.sendFile('dist/index.html')
})
// Setup Server
const port = 8000;
const server = app.listen(port, listening);

function listening(){
    console.log('Server is running');
    console.log(`We are using port:${port}`);
}

// (GET) route
app.get('/all', function (req, res){

    res.send(projectData);
    //console.log(projectData);
});

// (POST) route
app.post('/add', function (req, res){
    projectData = req.body;
    res.send(projectData);
    //console.log(projectData);

});


/*
// GET for testing server
app.get('/test', function (req, res){
    res.json({message: 'testing'})
});
// Initialize dotenv get route.
app.get('/dotenv', (req, res) => {
    res.send({
        geonamesUsername: process.env.geonamesUsername,
        weatherbitKey: process.env.weatherbitKey,
        pixabayKey: process.env.pixabayKey,
        rapidApiKey: process.env.rapidApiKey

    });
});
*/
