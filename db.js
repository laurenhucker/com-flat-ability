var jsonfile = require('jsonfile');
var exports = module.exports = {};

var file = "./data/db.json";

var users = [
    {
        name: "Lena",
        age: 20,
        occupation: "Student",
        studying: "Commerce",
        photo: "a file",
        desc: "Vegan, Dog owner",
        suburb: "Aro valley",
        priceRange: "150-200",
        spotify: songs={name: "s", artist: "d", album: "d"}
    },
    {
        name: "Bob",
        age: 19,
        occupation: "student",
        studying: "Bio Med",
        photo: "a file",
        desc: "Allergic to cats",
        suburb: "Mt Vic",
        priceRange: "150-200",
        spotify: {}
    }];

var flats = [{
    address: "1 two lane",
    numRoomsTotal: 5,
    numRoomsAvailable: 1,
    numBathrooms: 1,
    parking: "Garage",
    gender: "mix",
    pets: true,
    photos: ["a file"],
    rent: 150,
    desc: "Pets allowed",
    spotify: {}
}];

function getUsers(){
    return users;
}

function getFlats(){
    return flats;
}

function getUser(i){
    return users[i];
}
function getFlat(i){
    return flats[i];
}
function addUser(user){
    users.push(user)
}

function addFlat(flat){
    users.push(flat);
}

var obj = {users: getUsers(), flats: getFlats()};

function writeToFile(){
    jsonfile.writeFileSync(file, obj, { flag: 'w'});
}

function readFile(){
    console.dir(jsonfile.readFileSync(file));
}

exports.getUsers = getUsers;
exports.getFlats = getFlats;
exports.getUser = getUser;
exports.getFlat = getFlat;
exports.addFlat = addFlat;
exports.addUser = addUser;
exports.writeToFile = writeToFile;
exports.readFile = readFile;