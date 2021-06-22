const express = require('express'),
  morgan = require('morgan');
  bodyParser = require('body-parser');
const { parse } = require('uuid');
        
const app = express();
  
app.use(bodyParser.json());
  
//Get documentation
app.use(express.static('public'));
app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});

let ourMovies = [
    {
        title: 'Harry Potter',
        description: 'Harry Potter is a film series based on the eponymous novels by J. K. Rowling. The series is distributed by Warner Bros. and consists of eight fantasy films',
        genre: {
            name: 'Fantasy',
            description: 'Fantasy films are films with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: 'Chris Columbus, David Yates'
    },
    {
        title: 'Avengers',
		description:'The director of the agency S.H.I.E.L.D., Nick Fury, sets in motion project Avengers, joining Tony Stark a.k.a. the Iron Man; Steve Rogers, a.k.a. Captain America; Bruce Banner, a.k.a. The Hulk; Thor; Natasha Romanoff, a.k.a. Black Widow; and Clint Barton, a.k.a. Hawkeye, to save the world from the powerful Loki and the alien invasion.',
		genre: {
            name: 'Superhero',
            description: 'Films that focuses on the actions of superheroes: individuals who usually possess extraordinary – generally superhuman – abilities and are dedicated to protecting the public.'
        },
        director: '',    
    }
]

//Starting request
app.get('/', (req, res) => {
	res.send('Welcome to myFlix!');
});

//ENDPOINT DOC START HERE
//Allow new users to register
app.post('/users', (req, res) => {
    res.send('Successful registration of new user!')
});

//Allow users to update their user info

//Allow existing users to deregister

//Return a list of all movies
app.get('/movies', (req, res) => {
    res.json(ourMovies);
});

//Return data about a single movie by title to the user

//Return data about a genre (description) by name/title

//Return data about a director (bio, birth year, death year) by name

//Allow users to add a movie to their list of favorites

//Allow users to remove a movie to their list of favorites



// logging
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});



