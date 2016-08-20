var express = require('express');
var router = express.Router();

var http = require("http");
var SpotifyWebApi = require('spotify-web-api-node');
var credentials = {
  client_id : '5b3fe858f8074daba7c88c148532de17',
  client_secret : '18fe72f57cc34431bdd84e513539cb37',
  redirect_uri : 'http://localhost:3000/callback',
};
var spotifyApi = new SpotifyWebApi(credentials);

router.get('/', function (req, res) {
  res.send('Hello<br><a href="/auth">Log in with Spotify</a>');
});

router.get('/auth', function (req, res) {
  var client_id = credentials.client_id;
  var response_type = 'code';
  var redirect_uri = credentials.redirect_uri;
  res.redirect('https://accounts.spotify.com/authorize?client_id='+client_id+'&response_type='+response_type+'&redirect_uri='+redirect_uri);
});

router.get('/callback', function (req, res) {
  var key = req.query.code;
  res.send(key);
});

var options = {
  hostname: 'https://accounts.spotify.com',
  port: 80,
  path: '/api/token',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};
var req = http.request(options, function(res) {
  console.log('Status: ' + res.statusCode);
  console.log('Headers: ' + JSON.stringify(res.headers));
  res.setEncoding('utf8');
  res.on('data', function (body) {
    console.log('Body: ' + body);
  });
});
req.on('error', function(e) {
  console.log('problem with request: ' + e.message);
});
// write data to request body
req.write('{"string": "Hello, World"}');
req.end();

module.exports = router;
