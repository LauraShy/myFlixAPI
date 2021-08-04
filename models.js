const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: [{type: mongoose.Schema.Types.ObjectId, ref: 'Genre'}],
    Director: [{type: mongoose.Schema.Types.ObjectId, ref: 'Director'}],
    Actors: [String],
    ImagePath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema({
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

/* I typed out potential Schema for the other collections just in case it's needed. Tried using it but it said Something Broke! with a 500 err */
  
let genreSchema = mongoose.Schema({
    Name: {type: String},
    Description: {type: String}
}); 

let directorSchema = mongoose.Schema({
    Name: {type: String},
    Bio: {type: String},
    Birthday: Date,
}); 

let Movie = mongoose.model('Movie', movieSchema);
let User = mongoose.model('User', userSchema);
let Genre = mongoose.model('Genre', genreSchema);
let Director = mongoose.model('Director', directorSchema);

module.exports.Movie = Movie;
module.exports.User = User;
module.exports.Genre = Genre; 
module.exports.Director = Director;