var express = require('express');
var router = express.Router();

var request = require('request');
//var Base64 = require('base64-js');

var SpotifyWebApi = require('spotify-web-api-node');
var credentials = {
  client_id : '5b3fe858f8074daba7c88c148532de17',
  client_secret : '18fe72f57cc34431bdd84e513539cb37',
  redirect_uri : 'http://localhost:3000/callback',
};
var spotifyApi = new SpotifyWebApi(credentials);

router.get('/', function (req, res) {
  //res.render('pages/index',{link:'/auth'})
  res.send('Hello<br><a href="/auth">Log in with Spotify</a>');
});

router.get('/flat', function (req, res) {
    res.render('./views/flat.ejs', {photos: ["PHOTO 1","PHOTO 2", "PHOTO 3" ]});
});

router.get('/auth', function (req, res) {
  var client_id = credentials.client_id;
  var response_type = 'code';
  var redirect_uri = credentials.redirect_uri;
  res.redirect('https://accounts.spotify.com/authorize?client_id='+client_id+'&response_type='+response_type+'&redirect_uri='+redirect_uri);
});

router.get('/callback', function (req, res) {
    var key = req.query.code;
    //res.send(key);
    post(key, res);
});

router.get('/test', function (req, res) {
    res.render("pages/test", {candidates: ['hi', 'poo'],candidate_name: "Cat", candidate_match_percent: 69});
});

router.get('/success', function (req, res) {
    console.log('hello');
    getCommonIDs('1281597756','1ok2P5ointA9iZqPGQGSLQ','1281597756','0WecQF718OOPVmSsDizFou').then(function(result){
        console.log(result);
    })
    res.send("Success baby");

    /*getAudioFeaturesFromPlaylist('1281597756','1ok2P5ointA9iZqPGQGSLQ').then(function(result){
        console.log(result);
    })*/
    /*getIdsFromPlaylist('1281597756','0WecQF718OOPVmSsDizFou').then(function(result){
        var firstIDs = result;
        console.log(firstIDs);
        getIdsFromPlaylist('1281597756','1ok2P5ointA9iZqPGQGSLQ').then(function(result2){
            var secondIDs = result2;
            console.log(secondIDs);
            getGeniusFromIDs(firstIDs, secondIDs).then(function(result3){
                console.log(result3);
            });
        });
    });*/
    /*getPlaylist('1281597756','1ok2P5ointA9iZqPGQGSLQ').then(function(result){
        console.log(result);
    });*/
    /*getTrack('4Ju8pNta5r29QBLCSMvwdn').then(function(result){
        console.log(result);
    });*/
    /*getAudioFeaturesForTrack('4Ju8pNta5r29QBLCSMvwdn').then(function(result){
        console.log(result);
    });*/
    /*getIdsFromPlaylist('1281597756','1ok2P5ointA9iZqPGQGSLQ').then(function(result){
        //console.log(result);
        getAudioFeaturesForTracks(result).then(function(result2){
            console.log(result2);
            for(var i = 0; i < result2.body.audio_features.length; i++){
                console.log(result2.body.audio_features[i]);
            }
        });
    });*/
});
//array of IDs
function getCommonIDs(userID1, playlistID1, userID2, playlistID2){
    return new Promise(function(fulfill, reject){
        getIdsFromPlaylist(userID1,playlistID1).then(function(result){
            var firstIDs = result;
            getIdsFromPlaylist(userID2,playlistID2).then(function(result2){
                var secondIDs = result2;
                getGeniusFromIDs(firstIDs, secondIDs).then(function(result3){
                    fulfill(result3);
                });
            });
        });
    })
}
//JSON of audio feaures
function getAudioFeaturesFromPlaylist(userID, playlistID){
    return new Promise(function(fulfill, reject){
        getIdsFromPlaylist(userID, playlistID).then(function(result){
            getAudioFeaturesForTracks(result).then(function(result2){
                fulfill(result2.body);
            });
        });
    });

}
//array of IDS
function getGeniusFromIDs(first_IDs, second_IDs){
    return new Promise(function (fulfill, reject){
        var commonIDs = [];
        for (var i = 0; i < first_IDs.length; i++){
            for(var x = 0; x < second_IDs.length; x++){
                if(first_IDs[i] === second_IDs[x]){
                    commonIDs.push(first_IDs[i]);
                    break;
                }
            }
        }
        fulfill(commonIDs);
    });
}
//JSON of audio features
function getAudioFeaturesForTrack(track_id){
    return new Promise(function (fulfill, reject){
        spotifyApi.getAudioFeaturesForTrack(track_id)
            .then(function(data) {
                fulfill(data);
            }, function(err) {
                reject(err);
            });
    });
}
//JSON of multiple audio features
function getAudioFeaturesForTracks(track_ids){
    return new Promise(function (fulfill, reject){
        spotifyApi.getAudioFeaturesForTracks(track_ids)
            .then(function(data) {
                fulfill(data)
            }, function(err) {
                reject(err);
            });
    });
}
//JSON of a single track
function getTrack(track_id){
    return new Promise(function (fulfill, reject){
        spotifyApi.getTrack(track_id)
            .then(function(data) {
                fulfill(data)
            }, function(err) {
                reject(err);
            });
    });
}
//JSON of playlist
function getPlaylist(user_id, playlist_id){
    return new Promise(function(fulfill, reject){
        spotifyApi.getPlaylist(user_id, playlist_id)
            .then(function(data) {
                fulfill(data.body.tracks.items);
            }, function(err) {
                reject(err);
            });
    });
}
//array of IDS from playlist
function getIdsFromPlaylist(user_id, playlist_id){
    return new Promise(function(fulfill, reject){
        spotifyApi.getPlaylist(user_id, playlist_id)
            .then(function(data) {
                var track_ids = [];
                for(var i = 0; i < 100; i++){
                    var track_id = data.body.tracks.items[i].track.id;
                    if(track_id != null)
                        track_ids.push(track_id);
                }
                fulfill(track_ids);
            }, function(err) {
                console.log(err);
                reject(err);
            });
    });
}

function post(key, res) {
  //var encoded_auth = Base64.toByteArray('5b3fe858f8074daba7c88c148532de17:18fe72f57cc34431bdd84e513539cb37');
  var encoded_auth = (new Buffer("5b3fe858f8074daba7c88c148532de17:18fe72f57cc34431bdd84e513539cb37").toString("base64"));
  request.post(
      'https://accounts.spotify.com/api/token',
      {
        form: {
          grant_type: 'authorization_code',
          code: key,
          redirect_uri: 'http://localhost:3000/callback'
        },
        headers: {
          Authorization: 'Basic ' + encoded_auth
        },
      },
      function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var token = JSON.parse(body).access_token;
            //console.log(token);
            spotifyApi.setAccessToken(token);
            res.redirect("http://localhost:3000/success");
        } else {
          //console.log(body);
          console.log(response.statusCode);
        }
      }
  );
}


/*Working playlists + IDs
 *'1281597756','1ok2P5ointA9iZqPGQGSLQ'
 * '1281597756','0WecQF718OOPVmSsDizFou'
 */
module.exports = router;
