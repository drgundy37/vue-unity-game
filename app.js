var express = require("express");
var cors = require("cors");
var app = express();
var port = 8000;

const router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", router);
app.use(cors());
var mongoose = require('mongoose');
const { query } = require("express");
mongoose.connect('mongodb+srv://<username>:<password>@mongotest.cmznf.mongodb.net/posttest');
const delay = ms => new Promise(res => setTimeout(res, ms));




var nameSchema = new mongoose.Schema({
    username: String,
    wins: Number,
    score: Number,
    someArray: Array,
    walletId: String
  });

var users = mongoose.model("User", nameSchema);


//load game - for use not in Vue
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/index3.html");
// });


// receiving info from Unity on the endpoint
//find user and updates last name and score
//returns to the server with the updated record
app.post('/post-test', (req, res) => {
    console.log('Got body:', req.body);
    const {score, username, wins} = req.body;
    console.log(score, username, wins);
    const newFirstName = username;
    const newWins = wins;
    const newScore = score;

    console.log(`the first name is ${newFirstName} and the last name is ${newWins} with a score of ${newScore}`);
    
    async function updateDB()
    {
        users.updateOne({username:`${newFirstName}`}, {wins:`${newWins}`, score:`${newScore}`}, (err, found) => {
            if (!err) {
                var output = found;
                console.log(output);
            }
            else{
                res.send("ERROR");
                return;
            }
        });
        await delay(300);
        console.log("Waited .03s")
        users.find({username:`${newFirstName}`}, (err, found) => {
            if (!err) {
                let testJson = {
                    hello:"seriously hello!",
                    howGreat:"is this!",
                    howWonderful:[{
                        that:"we can have",
                        aDatabase:"that works",
                        works:3,
                        worksS:5
                    }]
                };
                console.log(testJson);
                // var output = found;
                // console.log(found);
                // res.send(found);
            }
            else{
                return;
            }
        });     
    };
    updateDB();
});


//testing endpoint for adding name from server-side
app.post("/addname", (req, res) => {
    var myData = users(req.body);
    const newFirstName = myData["firstName"];
    const newLastName = myData["lastName"];
    const {_id} = myData;
    console.log(`the first name is ${newFirstName} and the last name is ${newLastName} and they have an id of ${_id}`);
    users.updateOne({firstName:`${newFirstName}`}, {lastName:`${newLastName}`}, (err, found) => {
        if (!err) {
            var output = found;
            // res.send(output);
        }
        else{
            // res.send("ERROR");
            return;
        }
    });
    users.find({username:`${newFirstName}`}, (err, found) => {
        if (!err) {
            var output = found[0];
            res.send(output);
            console.log(output);
            // res.send(output);
        }
        else{
            res.send("ERROR");
            return;
        }
    });            
});


//the endpoint that Unity and FE hits looking for that :id
//returns any username that matches the :id param

app.get("/user/:id/", (req, res) => {


    const newFirstName = req.params["id"];
    console.log("looking for " + req.params["id"]);
    users.find({walletId:`${newFirstName}`},{ _id: 0}, (err, found) => {
        if (!err) {
            console.log("checking db");
            var output = found[0];
            console.log(output);
            res.json(output);
        }
        else {
            console.log("error");
            return;
        }
    });

});       



app.listen(port, () => {
    console.log("Server started on port " + port);
});
    


