myFlix: a Movie API Application
===============================

## Objective:

To build the server-side component of a “movies” web application. The web application will provide users with access to information about different movies, directors, and genres. Users will be able to sign up, update their personal information, and create a list of their favorite movies.

## User Goals:

-   Users should be able to receive information on movies, directors, and genres so that they can learn more about movies they’ve watched or are interested in.
-   Users should be able to create a profile so they can save data about their favorite movies.

## Essential Features:

-   Allow new users to register
-   Allow users to update their user info (username, password, email, date of birth)
-   Allow existing users to deregister
-   Return a list of ALL movies to the user
-   Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user
-   Return data about a genre (description) by name/title (e.g., “Thriller”)
-   Return data about a director (bio, birth year, death year) by name
-   Allow users to add a movie to their list of favorites
-   Allow users to remove a movie from their list of favorites

## Endpoint Documentation:

Description                               | Method | URL             | Query Param | Body of Request                                             | Body of Response
------------------------------------------|--------|-----------------|-------------|-------------------------------------------------------------|-----------------
Allow new users to register               |POST    |/users           |none         |A JSON object holding data about the user to register        |A JSON object containing data about the user that was registered
Allow users to update their user info     |PUT     |/users/:Username |username     |A JSON object holding the new data about the user to register|A message indicating the user info was successfully updated
Allow existing users to deregister        |DELETE  |/users/:Username |username     |none                                                         |A message indicating the user was successfully deregistered
Return a list of all the movies           |GET     |/movies          |none         |none                                                |A JSON object containing data about all movies
Return data about a single movie by title |GET     |/movies/:Title   |title        |none       |A JSON object containing data (description, genre, director, image URL, whether it’s featured or not) about the movie
Return data about a genre (description) by name/title |GET |/movies/genres/:Name |genre |none |A JSON object containing a description of the requested genre
Return data about a director (bio, birth year, death year) by name |GET |/movies/directors/:Name |name |none |A JSON object containing data about the requested director
Allow users to add a movie to their list of favorites |POST |/user/:Username/favorites |favorites |A JSON Object holding data about the movies to add to the favorites list |A message indicating the movie was successfully added from the favorites list
Allow users to remove a movie to their list of favorites |DELETE |/users/:Username/Movies/:MovieID |none |none |A message indicating the movie was successfully deleted from the favorites list
