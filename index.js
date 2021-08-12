const express = require('express'),
  morgan = require('morgan')
bodyParser = require('body-parser')
​
const app = express()
​
const mongoose = require('mongoose')
const Models = require('./models.js')
​
const Movies = Models.Movie
const Users = Models.User
​
mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
​
app.use(bodyParser.json())
app.use(express.static('public'))
​
const cors = require('cors')
app.use(cors())
​
let auth = require('./auth')(app)
const passport = require('passport')
require('./passport')
​
//Get documentation
app.get(
  '/documentation.html',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname })
  }
)
​
//Starting request
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!')
})
​
//ENDPOINT DOC START HERE
​
//Allow new users to register
app.post('/users', (req, res) => {
  let hashedPassword = Users.hashPassword(req.body.Password)
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + 'already exists')
      } else {
        Users.create({
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        })
          .then((user) => {
            res.status(201).json(user)
          })
          .catch((error) => {
            console.error(error)
            res.status(500).send('Error: ' + error)
          })
      }
    })
    .catch((error) => {
      console.error(error)
      res.status(500).send('Error: ' + error)
    })
})
​
//Allow users to update their user info
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $set: {
          Username: req.body.Username,
          Password: req.body.Password,
          Email: req.body.Email,
          Birthday: req.body.Birthday,
        },
      },
      { new: true }, // Ensures updated doc is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error: ' + err)
        } else {
          res.json(updatedUser)
        }
      }
    )
  }
)
​
//Allow existing users to deregister
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + ' was not found')
        } else {
          res.status(200).send(req.params.Username + ' was deleted.')
        }
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Return a list of all users
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Return data about a specific user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Allow users to add a movie to their list of favorites
app.post(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $push: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // Ensures updated doc is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error: ' + err)
        } else {
          res.json(updatedUser)
        }
      }
    )
  }
)
​
//Allow users to remove a movie to their list of favorites
app.delete(
  '/users/:Username/movies/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      {
        $pull: { FavoriteMovies: req.params.MovieID },
      },
      { new: true }, // Ensures updated doc is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err)
          res.status(500).send('Error: ' + err)
        } else {
          res.json(updatedUser)
        }
      }
    )
  }
)
​
​
//Return a list of all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Return data about a single movie by title
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Return data about a genre (description) by name/title
app.get(
  'movies/genre/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movies) => {
        res.json(movies.Genre)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
//Return data about a director (bio, birth year, death year) by name
app.get(
  '/movies/director/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movies) => {
        res.json(movies.Director)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Error: ' + err)
      })
  }
)
​
// //Return a list of all genres
// app.get('/genres', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Genres.find()
//     .then((genres) => {
//       res.status(201).json(genres);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });
​
// //Return a list of all directors
// app.get('/directors', passport.authenticate('jwt', { session: false }), (req, res) => {
//   Directors.find()
//     .then((directors) => {
//       res.status(201).json(directors);
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).send('Error: ' + err);
//     });
// });
​
​
// logging
app.use(morgan('common'))
​
// Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})
​
// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.')
})