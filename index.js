const express = require('express'),
  morgan = require('morgan');

const app = express();

// logging
app.use(morgan('common'));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.use(express.static('public'));


// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to myFlix!');
});

app.get('/movies', (req, res) => {
    res.json([
        {movie1: 'top1'},
        {movie2: 'top2'},
        {movie3: 'top3'},
        {movie4: 'top4'},
        {movie5: 'top5'},
        {movie6: 'top6'},
        {movie7: 'top7'},
        {movie8: 'top8'},
        {movie9: 'top9'},
        {movie10: 'top10'}
    ]);
});

app.get('/documentation.html', (req, res) => {
    res.sendFile('public/documentation.html', { root: __dirname });
});
  

// listen for requests
app.listen(8080, () => {
    console.log('Your app is listening on port 8080.');
});


