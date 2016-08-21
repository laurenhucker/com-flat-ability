var jsonfile = require('jsonfile');
var exports = module.exports = {};

var file = "./data/db.json";

var users = [
    {
        name: "Nina",
        age: 20,
        occupation: "Student",
        studying: "Commerce",
        photo: "images/nina.jpg",
        desc: "Vegan, Dog owner",
        suburb: "Aro valley",
        priceRange: "150-200",
        spotify: songs=[{title: "s", artist: "d", album: "f"}, {title: "k", artist: "9", album: "6"}]
    },
    {
        name: "Bob",
        age: 19,
        occupation: "Student",
        studying: "Computer Science",
        photo: "a file",
        desc: "Has a cat",
        suburb: "Te Aro",
        priceRange: "150-200",
        spotify: {}
    },
    {
        name: "Harry",
        age: 20,
        occupation: "Young Professional",
        studying: "Barista",
        photo: "a file",
        desc: "Vegan",
        suburb: "Mt Vic",
        priceRange: "150-200",
        spotify: {}
    },
    {
        name: "Mandy",
        age: 18,
        occupation: "student",
        studying: "Psychology",
        photo: "a file",
        desc: "Allergic to cats",
        suburb: "Mt Vic",
        priceRange: "150-200",
        spotify: {}
    },
    {
        name: "Katherine",
        age: 23,
        occupation: "Young Professional",
        studying: "Checkout chick",
        photo: "a file",
        desc: "Has a child",
        suburb: "Mt Vic",
        priceRange: "150-200",
        spotify: {}
    },
    {
        name: "Mandy",
        age: 18,
        occupation: "student",
        studying: "Psychology",
        photo: "a file",
        desc: "Allergic to cats",
        suburb: "Mt Vic",
        priceRange: "150-200",
        spotify: {}
    }
];

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
