var express = require('express');
var router = express.Router();
var db = require('../db');

var request = require('request');

var db = require('./../db.js');

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

router.get('/personList', function (req, res) {
    var users = db.getUsers();
    res.render("pages/personList", {candidates: users,candidate_name: "Cat", candidate_match_percent: 69});
});

router.get('/profile', function (req, res) {
    var u = db.getUsers()[0];

    getGeniusPlaylistJSON('1281597756','1ok2P5ointA9iZqPGQGSLQ','1281597756','0WecQF718OOPVmSsDizFou').then(function(result){
        console.log(result);
        var info = {
            userName: u.name,
            userAge: u.age,
            userOccupation: u.occupation,
            address: u.suburb,
            rent: u.priceRange,
            occupationDetails: u.studying,
            extraDetails: u.desc,
            songs: result
        };
        res.render("pages/profile", info);
    });
});


router.get('/success', function (req, res) {
    console.log('hello');

    /*getAverageAudioFeaturesFromPlaylist('1281597756','1ok2P5ointA9iZqPGQGSLQ').then(function(result){
        getAverageAudioFeaturesFromPlaylist('1246385134', '4Br383P0RJHkziU0rdLQGt').then(function(result2){
            console.log('yowza');

            getPercentageMatchFromAverages(result,result2).then(function(result3){
                console.log(result3);
            });
        });
    }).catch(function(error){
        console.log(error);
    });
    res.send('asdnasdk');*/
    /*getPlaylist('1246385134', '4Br383P0RJHkziU0rdLQGt').then(function(result){
        console.log(result);
        res.send('hello');
    });*/
});

function getPercentageMatchFromAverages(averages1,averages2){
    console.log('in here');
    return new Promise(function(fulfill,reject){
        var difference = 0;
        difference += Math.abs(averages1.danceability - averages2.danceability);
        difference += Math.abs(averages1.energy - averages2.energy);
        //difference += Math.abs(Math.abs(averages1.loudness) - Math.abs(averages2.loudness));
        difference += Math.abs(averages1.speechiness - averages2.speechiness);
        difference += Math.abs(averages1.acousticness - averages2.acousticness);
        difference += Math.abs(averages1.instrumentalness - averages2.instrumentalness);
        difference += Math.abs(averages1.liveness - averages2.liveness);
        //difference += Math.abs(averages1.tempo - averages2.tempo);
        fulfill(difference*100 + '%');
    }).catch(function(error){
        console.log(error);
    });
}

function getPercentageMatchFromPlaylists(userID1, playlistID1, userID2, playlistID2){
    return new Promise(function(fulfill,reject){
        getAverageAudioFeaturesFromPlaylist(userID1, playlistID1).then(function(result){
            var averages1 = result;
            getAverageAudioFeaturesFromPlaylist(userID2, playlistID2).then(function(result2){
                var averages2 = result2;
                var difference = 0;
                difference += Math.abs(averages1.danceability - averages2.danceability);
                difference += Math.abs(averages1.energy - averages2.energy);
                //difference += Math.abs(Math.abs(averages1.loudness) - Math.abs(averages2.loudness));
                difference += Math.abs(averages1.speechiness - averages2.speechiness);
                difference += Math.abs(averages1.acousticness - averages2.acousticness);
                difference += Math.abs(averages1.instrumentalness - averages2.instrumentalness);
                difference += Math.abs(averages1.liveness - averages2.liveness);
                //difference += Math.abs(averages1.tempo - averages2.tempo);
                fulfill(difference*100 + '%');
            }).catch(function(error){
                console.log(error);
            });
        });
    });
}
//returns array of useful audio features
function getUsefulAudioFeaturesFromPlaylist(userID, playlistID){
    return new Promise(function(fulfill,reject){
        getAudioFeaturesFromPlaylist(userID, playlistID).then(function(result){
            console.log(result);
            console.log('hello');
            var newFeatures = [];
            var audioFeatures= result.audio_features;
            for(var i = 0; i < audioFeatures.length; i++){
                console.log('daswiDFBNUOABFUJ');
                var danceability = audioFeatures[i].danceability;
                var energy = audioFeatures[i].energy;
                var loudness = audioFeatures[i].loudness;
                var speechiness = audioFeatures[i].speechiness;
                var acousticness = audioFeatures[i].acousticness;
                var instrumentalness = audioFeatures[i].instrumentalness;
                var liveness = audioFeatures[i].liveness;
                var tempo = audioFeatures[i].tempo;
                newFeatures.push({danceability:danceability,
                    energy:energy,
                    loudness:loudness,
                    speechiness:speechiness,
                    instrumentalness:instrumentalness,
                    liveness:liveness,
                    tempo:tempo,
                    acousticness:acousticness
                });
            }
            console.log(newFeatures);
            fulfill(newFeatures);
        }).catch(function(error){
            console.log(error);
        });
    });
}

function getGeniusPlaylistJSON(userID1, playlistID1, userID2, playlistID2){
    return new Promise(function(fulfill,reject){
        getCommonIDs(userID1, playlistID1, userID2, playlistID2).then(function(result){
            var commonIds = result;
            getTracks(commonIds).then(function(result2){
                getRelevantTrackInformation(result2).then(function(result3){
                    fulfill(result3);
                })
            });
        });
    });
}

function getRelevantTrackInformation(tracks){
    return new Promise(function(fulfill,reject){
        var tracksJSON = [];
        for(var i = 0; i < tracks.length; i++){
            var name = tracks[i].name;
            var popularity = tracks[i].popularity;
            var ID = tracks[i].id;
            var artists = tracks[i].artists[0].name;
            var album = tracks[i].album.name;
            tracksJSON.push({name:name, popularity:popularity, ID:ID, artists:artists,album:album});
        }
        fulfill(tracksJSON);
    });
}

//get JSON of tracks from array of IDs
function getTracks(IDs){
    return new Promise(function(fulfill,reject){
        spotifyApi.getTracks(IDs)
            .then(function(data) {
                fulfill(data.body.tracks);
            }, function(err) {
                reject(err);
            });
    });
}

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

function getAverageAudioFeaturesFromPlaylist(userID1, playlistID1){
    console.log("IN HERE  aWJDHBAJWD");
    return new Promise(function(fulfill, reject){
        getAudioFeaturesFromPlaylist(userID1, playlistID1).then(function(result){
            var features1 = result;

            var danceability1 = 0;
            var energy1 = 0;
            var loudness1 = 0;
            var speechiness1 = 0;
            var acousticness1 = 0;
            var instrumentalness1 = 0;
            var liveness1 = 0;
            var tempo1 = 0;

            for(var i = 0; i < features1.audio_features.length; i++){
                danceability1 += features1.audio_features[i].danceability;
                energy1 += features1.audio_features[i].energy;
                loudness1 += features1.audio_features[i].loudness;
                speechiness1 += features1.audio_features[i].speechiness;
                acousticness1 += features1.audio_features[i].acousticness;
                instrumentalness1 += features1.audio_features[i].instrumentalness;
                liveness1 += features1.audio_features[i].liveness;
                tempo1 += features1.audio_features[i].tempo;
            }
            var playlist_length = features1.audio_features.length;
            var average_features = {
                danceability: danceability1/playlist_length,
                energy: energy1/playlist_length,
                loudness: loudness1/playlist_length,
                speechiness: speechiness1/playlist_length,
                acousticness: acousticness1/playlist_length,
                instrumentalness: instrumentalness1/playlist_length,
                liveness: liveness1/playlist_length,
                tempo: tempo1/playlist_length
            };
            /*console.log("AVERAGE FEATURES FOR PLAYLIST 1:");
            console.log(average_features);*/
            fulfill(average_features);
        }).catch(function(error){
            console.log(error);
        })


    });

}

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
