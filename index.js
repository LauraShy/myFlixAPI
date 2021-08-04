const mongoose = require('mongoose');
const Models = require('./models.js');

const Movies = Models.Movie;
const Users = Models.User;
const Genres = Models.Genre;
const Directors = Models.Director;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
			name:'Chris Columbus',
			bio:' Born in 1958. Columbus was born in Spangler, Pennsylvania and raised in Champion, Ohio, the only child born to Mary Irene (née Puskar), a factory worker, and Alex Michael Columbus, an aluminum plant worker and coal miner.[2][3] He is of Italian and Czech descent.[4] As a child, he enjoyed drawing storyboards and began making 8mm films in high school'
		}
    },
    {
        title: 'Avengers',
		description:'The director of the agency S.H.I.E.L.D., Nick Fury, sets in motion project Avengers, joining the Iron Man, Captain America, The Hulk, Thor, Black Widow, and Hawkeye, to save the world from the powerful Loki and the alien invasion.',
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
            bio: 'Ryan Coogler is a producer and director, known for Black Panther, Creed and Fruitvale Station. His first feature film, Fruitvale Station, won the top audience and grand jury awards at the 2013 Sundance Film Festival.'
        }
    },
]

//Starting request
app.get('/', (req, res) => {
	res.send('Welcome to myFlix!');
});

//ENDPOINT DOC START HERE
//Allow new users to register
/* We’ll expect JSON in this format
    ID: Integer,
    Username: String,
    Password: String,
    Email: String,
    Birthday: Date
*/
app.post('/users', (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists');
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
          .then((user) =>{res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send('Error: ' + error);
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send('Error: ' + error);
    });
});

//Allow users to update their user info
/* We’ll expect JSON in this format 
    Username: String, (required)
    Password: String, (required)
    Email: String, (required)
    Birthday: Date
*/
app.put('/users/:Username', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
    {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  },
  { new: true }, // Ensures updated doc is returned
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow existing users to deregister
app.delete('/users/:Username', (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of all users
app.get('/users', (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of all movies
app.get('/movies', (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).json(movies);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of all genres
app.get('/genres', (req, res) => {
  Genres.find()
    .then((genres) => {
      res.status(201).json(genres);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return a list of all directors
app.get('/directors', (req, res) => {
  Directors.find()
    .then((directors) => {
      res.status(201).json(directors);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a specific user by username
app.get('/users/:Username', (req, res) => {
  Users.findOne({ Username: req.params.Username })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a single movie by title
app.get('/movies/:Title', (req, res) => {
  Movies.findOne({ Title: req.params.Title })
    .then((movie) => {
      res.json(movie);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a genre (description) by name/title
app.get('/genres/:Name', (req, res) => {
  Genres.findOne({ Name: req.params.Name })
    .then((genre) => {
      res.json(genre);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Return data about a director (bio, birth year, death year) by name
app.get('/directors/:Name', (req, res) => {
  Directors.findOne({ Name: req.params.Name })
    .then((directorName) => {
      res.json(directorName);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

//Allow users to add a movie to their list of favorites
app.post('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // Ensures updated doc is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

//Allow users to remove a movie to their list of favorites
app.delete('/users/:Username/movies/:MovieID', (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $pull: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // Ensures updated doc is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
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



