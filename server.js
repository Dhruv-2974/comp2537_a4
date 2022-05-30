const express = require('express')
const app = express()
const cors = require('cors');
app.use(cors());
app.set('view engine', 'ejs')
var session = require('express-session');

app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));

const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://comp2537a3:comp2537@cluster0.anrlv.mongodb.net/?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    shoppingCart: [Object]
});

const userModel = mongoose.model("users", userSchema);

username = ""
password = ""

app.listen(process.env.PORT || 5020, function (err) {
    if (err)
        console.log(err);
})


const https = require("https");

users = [
    {
        username: "user1",
        password: "pass1",
        shoppingCart: [
            {
                pokeID: 25,
                price: 12,
                quantity: 2
            }, {
                pokeID: 4,
                price: 25,
                quantity: 4
            }
        ]
    }, {
        username: "user2",
        password: "pass2"
    }
]

function auth(req, res, next) {
    if (req.session.authenticated)
        // res.send(`Hi ${req.session.user} !`)
        next();
    else {
        res.redirect('/login')
    }
    next();
}

app.get('/', auth, function (req, res) {
    res.send("Welcome to the Home Page")
})

app.get("/userProfile", function (req, res) {
    // res.write(`Welcome ${req.params.name}\n`);
    // res.write(JSON.stringify(users.filter( x => x.username == req.params.name)[0].shoppingCart));

    //get data from database, find user from database

    userModel.find({
        $and: [{ username: req.session.user }, { password: password }]
    }, function (err, currentUser) {
        if (err) {
            console.log("Error " + err);
        } else {
            console.log("Data " + currentUser);
        }
        // res.send(currentUser);
        console.log(currentUser[0].shoppingCart)

        cartLength = currentUser[0].shoppingCart.length;
        listOfPokemon = []
        for(i=0; i<cartLength; i++){
            listOfPokemon.push(currentUser[0].shoppingCart[i].pokeID)
            console.log(listOfPokemon)
        }

        res.render("userProfile.ejs", {
            "user": currentUser[0].username,
            cartList: currentUser[0].shoppingCart[0].pokeID
        })
    });
})

app.get('/login/', function (req, res, next) {
    res.send("Please provide the credentials through the URL")
})

app.get('/login/:user/:pass', function (req, res, next) {
    if (
        users.filter(
            user => { return user.username == req.params.user })
        [0].password
        ==
        req.params.pass) {
        // if (users[req.params.user] == req.params.pass) {
        req.session.authenticated = true;
        req.session.user = req.params.user;
        //res.send("Successful Login!")
        username = req.params.user;
        password = req.params.pass;
        console.log(username);
        console.log(password);
        res.redirect("/index.html")
        // res.redirect(`/userProfile/${req.session.user}`)
    } else {
        req.session.authenticated = false
        res.send("Failed Login!")
    }

})

app.get("/profile/:id", function (req, res) {

    const url = `https://pokeapi.co/api/v2/pokemon/${req.params.id}`
    data = ""
    //req.params.id;
    //console.log(req);

    // res.write(` <h1> Hello, this pokemon has the id ${req.params.id} </h1>`)
    // res.write(` <h1> This pokemon has the id ${req.params.id} </h1>`)
    // res.write(` <h1> Id of pokemon: ${req.params.id} </h1>`)
    // res.send();

    https.get(url, function (https_res) {
        https_res.on("data", function (chunk) {
            // console.log(JSON.parse(data))
            data += chunk;
        })
        https_res.on("end", function () {
            // console.log(JSON.parse(data))
            data = JSON.parse(data)

            // z = data.stats.filter((obj_) =>{
            //     return obj_.stat.name == "hp"
            // })

            // returns the value
            // console.log(z[0].base_stat)

            // returns the value as an array
            // CAN COMBINE WITH Z VARIABLE DECLARATION ABOVE
            // console.log(z.map((obj2) => {
            //     return obj2.base_stat
            // }))

            hp = data.stats.filter((obj_) => {
                return obj_.stat.name == "hp"
            }).map((obj2) => {
                return obj2.base_stat
            })

            atk = data.stats.filter((obj_) => {
                return obj_.stat.name == "attack"
            }).map((obj2) => {
                return obj2.base_stat
            })

            def = data.stats.filter((obj_) => {
                return obj_.stat.name == "defense"
            }).map((obj2) => {
                return obj2.base_stat
            })

            spAtk = data.stats.filter((obj_) => {
                return obj_.stat.name == "special-attack"
            }).map((obj2) => {
                return obj2.base_stat
            })

            spDef = data.stats.filter((obj_) => {
                return obj_.stat.name == "special-defense"
            }).map((obj2) => {
                return obj2.base_stat
            })

            spd = data.stats.filter((obj_) => {
                return obj_.stat.name == "speed"
            }).map((obj2) => {
                return obj2.base_stat
            })

            typeList = []
            for (i = 0; i < data.types.length; i++) {
                typeList.push(data.types[i].type.name)
            }

            evolutionChain = `https://pokeapi.co/api/v2/evolution-chain/${req.params.id}`;

            console.log(evolutionChain);

            console.log("name: " + data.name);
            // sends an entire html page
            res.render("profile.ejs", {
                "id": req.params.id,
                "name": data.name,
                "hp": hp[0],
                "attack": atk[0],
                "defense": def[0],
                "specialAttack": spAtk[0],
                "specialDefense": spDef[0],
                "speed": spd[0],
                "typeList": typeList,
            });
        })
    });

    // console.log("name: " + data.name);
    // // sends an entire html page
    // res.render("profile.ejs", {
    //     "id": req.params.id,
    //     "name": data.name,
    //     "hp": "?"
    // });

    // res.json({
    //     "k1": "v1",

    //     "k2": "v1",

    //     "k3": "v1"

    // })
})

// app.use enables a middleware
// HAS TO HAVE index.html INSIDE PUBLIC FOLDER
app.use(express.static('public'));

function f_1() {
    console.log("dummy middleware");
}

app.use(f_1)