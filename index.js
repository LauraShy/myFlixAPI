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
        director: {
			name:'Chris Joseph Columbus',
			bio:' Born in 1958. Columbus was born in Spangler, Pennsylvania and raised in Champion, Ohio, the only child born to Mary Irene (née Puskar), a factory worker, and Alex Michael Columbus, an aluminum plant worker and coal miner.[2][3] He is of Italian and Czech descent.[4] As a child, he enjoyed drawing storyboards and began making 8mm films in high school'
		}
    },
    {
        title: 'Avengers',
		description:'The director of the agency S.H.I.E.L.D., Nick Fury, sets in motion project Avengers, joining Tony Stark a.k.a. the Iron Man; Steve Rogers, a.k.a. Captain America; Bruce Banner, a.k.a. The Hulk; Thor; Natasha Romanoff, a.k.a. Black Widow; and Clint Barton, a.k.a. Hawkeye, to save the world from the powerful Loki and the alien invasion.',
		genre: {
            name: 'Superhero',
            description: 'Films that focuses on the actions of superheroes: individuals who usually possess extraordinary – generally superhuman – abilities and are dedicated to protecting the public.'
        },
        director: {
			name:'Joss Whedon',
			bio: 'Born in 1964. He is an American film director, producer, writer, and composer. He is the founder of Mutant Enemy Productions, he co-founded Bellwether Pictures, and is best known as the creator of several television series.'
		}   
    },
    {
        title: 'Fantastic Beasts',
        description: 'A spinoff and prequel to Harry Potter- The adventures of writer Newt Scamander in New Yorks secret community of witches and wizards seventy years before Harry Potter reads his book in school.',
        genre: {
            name: 'Fantasy',
            description: 'Fantasy films are films with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: {
            name: 'David Yates',
            bio: 'born8 October 1963) is an English film director who has directed films, short films, and television productions. He is best known for directing the later four films in the Harry Potter series and Fantastic Beasts.'
        }
    },
    {
        title: 'Lord of the Rings',
        description: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
        genre: {
            name: 'Fantasy',
            description: 'Fantasy films are films with fantastic themes, usually magic, supernatural events, mythology, folklore, or exotic fantasy worlds.'
        },
        director: {
            name: 'Peter Jackson',
            bio: 'born 31 October 1961) is a New Zealand film director, producer, and screenwriter. He is best known as the director, writer, and producer of the Lord of the Rings and Hobbit trilogies.'
        }
    },
    {
        title: 'Creed',
        description: 'The former World Heavyweight Champion Rocky Balboa serves as a trainer and mentor to Adonis Johnson, the son of his late friend and former rival Apollo Creed.',
        genre: {
            name: 'Sports Drama',
            description: 'A type of drama whose source of conflict is the struggle of an athlete or team as they rise to the top of a chosen sport'
        },
        director: {
            name: 'Ryan Coogler',
            bio: 'Ryan Coogler was born on May 23, 1986 in Oakland, California, USA as Ryan Kyle Coogler. He is a producer and director, known for Black Panther (2018), Creed (2015) and Fruitvale Station (2013). He has been married to Zinzi Coogler since 2016.'
        }
    },
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
app.put('/users/:username', (req, res) => {
    res.status(201).send('User has changed their user information');	
});

//Allow existing users to deregister
app.get('/users/:username/delete', function(req, res) {
    res.send('Successfully deleted user account');
});
/* app.delete('/users/:username', (req, res) => {
    let users = users.find((username) => { return users.username === req.params.username });
  
    if (username) {
      users = users.filter((obj) => { return obj.username !== req.params.username });
      res.status(201).send('User ' + req.params.username + ' was deleted.');
    }
}); */

//Return a list of all movies
app.get('/movies', (req, res) => {
    res.json(ourMovies);
});

//Return data about a single movie by title to the user
app.get('/movies/:title', (req, res) => {
    res.json(ourMovies.find((movie) =>
      { return movie.title === req.params.title }));
});

//Return data about a genre (description) by name/title
app.get('/movie/:genre', (req, res) => {
	res.json(ourMovies.find((movie) =>
	{ return movie.genre.description === req.params.genre.description }));
});

//Return data about a director (bio, birth year, death year) by name
app.get('/movies/:director/:name', (req, res) => {
	res.json(ourMovies.find((movie) =>
      { return movie.director.bio === req.params.director.title }));
});

//Allow users to add a movie to their list of favorites
app.post('/movies/:username/favorites', (req, res) => {
    let newMovie = req.body;
  
    if(!newMovie.title) {
      const message = 'Missing "title" in request body';
      res.status(400).send(message);
    } else {
      newMovie.id = uuid.v4();
      ourMovies.push(newMovie);
      res.status(201).send(newMovie);
    }
});

//Allow users to remove a movie to their list of favorites
app.delete('/movies/:username/favorites/:title', (req, res) => {
    let movie = ourMovies.find((movie) => { return movie.title === req.params.title });
  
    if (movie) {
      ourMovies = ourMovies.filter((obj) => { return obj.title !== req.params.title });
      res.status(201).send('Movie ' + req.params.title + ' was deleted.');
    }
});


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



