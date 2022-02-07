
const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const db = require('./config/config').get(process.env.NODE_ENV);
const User = require('./models/user');
const Movie = require('./models/movie');
const Booking = require('./models/booking');


const { auth } = require('./middlewares/auth');
// Ensallo
const cors = require("cors");
const movie = require('./models/movie');
const booking = require('./models/booking');
const corsOptions = {
    origin: '*',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200,
}


const app = express();
// app use
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

// database connection
mongoose.Promise = global.Promise;
mongoose.connect(db.DATABASE, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) console.log(err);
    console.log("database is connected");
});


app.get('/', function (req, res) {
    res.status(200).send(`Welcome to api`);
});

// listening port
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`app is live at ${PORT}`);
});

// adding new user (sign-up route)
app.post('/api/register', function (req, res) {
    // taking a user
    const newuser = new User(req.body);

    if (newuser.password != newuser.password2) return res.status(400).json({ message: "password not match" });

    User.findOne({ email: newuser.email }, function (err, user) {
        if (user) return res.status(400).json({ auth: false, message: "email exits" });

        newuser.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                succes: true,
                user: doc
            });
        });
    });
});


// login user
app.post('/api/login', function (req, res) {
    let token = req.cookies.auth;
    User.findByToken(token, (err, user) => {
        if (err) return res(err);
        if (user) return res.status(400).json({
            error: true,
            message: "You are already logged in"
        });

        else {
            User.findOne({ 'email': req.body.email }, function (err, user) {
                if (!user) return res.json({ isAuth: false, message: ' Auth failed ,email not found' });

                user.comparepassword(req.body.password, (err, isMatch) => {
                    if (!isMatch) return res.json({ isAuth: false, message: "password doesn't match" });

                    user.generateToken((err, user) => {
                        if (err) return res.status(400).send(err);
                        res.cookie('auth', user.token).json({
                            isAuth: true,
                            id: user._id
                            , email: user.email
                            , type: user.userType
                        });
                    });
                });
            });
        }
    });
});


// get logged in user
app.get('/api/profile', auth, function (req, res) {
    res.json({
        isAuth: true,
        id: req.user._id,
        email: req.user.email,
        name: req.user.firstname + " " + req.user.lastname,
        type: req.user.userType
    })
});


//logout user
app.get('/api/logout', auth, function (req, res) {
    req.user.deleteToken(req.token, (err, user) => {
        if (err) return res.status(400).send(err);
        res.sendStatus(200);
    });

});
/* var coll = db.collection('Notifies');
app.get('/api/notes', auth, function (req, res) {
    coll.find({}).toArray(function (err, result) {
        if (err) {
            res.send(err);
        } else {

            res.send(JSON.stringify(result));
        }
    })

}); */


// ensallo
app.use(cors(corsOptions)) // Use this after the variable declaration


// adding new movie 
app.post('/api/registerMovie', function (req, res) {
    // taking a user
    const newmovie = new Movie(req.body)
    Movie.findOne({ title: newmovie.title }, function (err, movie) {
        if (movie) return res.status(400).json({ auth: false, message: "movie exits" });

        newmovie.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                succes: true,
                movie: doc
            });
        });
    });
});


app.get('/api/movies', function (req, res) {
    Movie.find({}).then((movies) => {
        res.json(movies)
    })
});

app.get('/api/info/:id', function (req, res) {
    Movie.find({ _id: (req.params.id) }).then((movies) => {
        res.json(movies)
    })
});


app.delete('/api/delete/:id', function (req, res) {
    Movie.findByIdAndDelete(req.params.id, function (err, doc) {
        if (err) return res.status(400).send(err);
        if (!doc) return res.status(404).json({ message: "NOt found" });
        res.status(200).json({
            delete: true,
            note: doc
        });
    })
});

app.put('/api/update/:id', function (req, res) {
    Movie.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        gender: req.body.gender,
        img: req.body.img,
        synopsis: req.body.synopsis,
        format: req.body.format,
        value: req.body.value,
        hour: req.body.hour,
        duration: req.body.duration,
        trailer: req.body.trailer
    }, { new: true }, function (err, doc) {
        if(err) return res.status(400).send(err);
        
        if(!doc) return res.status(404).json({message : "No note with this id has been found"});

        res.status(200).json({
            update : true,
            note : doc
        });
    })
});


//Reservas
app.post('/api/registerBooking', function (req, res) {
    // taking a user
    const newbooking = new Booking(req.body)
    Booking.findOne({ title: newbooking.title }, function (err, booking) {
        /* if (booking) return res.status(400).json({ auth: false, message: "booking exits" }); */

        newbooking.save((err, doc) => {
            if (err) {
                console.log(err);
                return res.status(400).json({ success: false });
            }
            res.status(200).json({
                succes: true,
                booking: doc
            });
        });
    });
});

app.get('/api/bookingsMovie/:id', function (req, res) {
    Booking.find({ movie: (req.params.id_movie) }).then((bookings) => {
        res.json(bookings)
    })
});

app.get('/api/bookingsUser/:id', function (req, res) {
    Booking.find({ _id: (req.params.id) }).then((bookings) => {
        res.json(bookings)
    })
});

app.get('/api/bookings', function (req, res) {
    Booking.find({}).then((bookings) => {
        res.json(bookings)
    })
});





/* let peliculas = new mongoose.Schema({
    titulo: { type: String, required: true }
});

let peli = mongoose.model("movies", peliculas); */
/*     peli.find({}, (error, data) => {
        if (data) {
            res.json(data)
        } else {
            res.json(error)
        }
    }) */



/* app.get('/api/pelis', function (req, res) {

    const peli = new Movie(req.body)
    Movie.find({ title: ''}, function (err, movie) {
        console.log(movie)

    });
}); */

/* var coll = db.collection('movies');

coll.find({}).toArray(function (err, result) {
    if (err) {
        res.send(err);
    } else {

        res.send(JSON.stringify(result));
    }
}) */

/* app.get('/api/movies', function (res) {
    res.json({
        title: movie.title,
        gender: movie.gender,
        img: movie.img,
        type: movie.synopsis
    })
});

exports = async function (payload, response) {

    // Querying a mongodb service:
    return await context.services.get("mongodb-atlas").db("test").collection("movies").find({}).limit(50);

}; */
/* app.get('/api/notes',function (req, res) {
    Movie.find(res.json);
}); */

//delete a Note with noteId
app.delete('/api/delete', function (req, res) {

});





// find a note by id
/* exports.findone=function(req,res){
    Note.findById(req.params.noteId,function(err,doc){
        if(err) return res.status(400).send(err);
        if(!doc) return res.status(404).json({message : "Note with given Id is not found"});
        res.status(200).json(doc);
    })
}; */

 // adding new user (sign-up route)
/* app.post('/api/register',function(req,res){
    // taking a user
    const newuser=new User(req.body);

   if(newuser.password!=newuser.password2)return res.status(400).json({message: "password not match"});

    User.findOne({email:newuser.email},function(err,user){
        if(user) return res.status(400).json({ auth : false, message :"email exits"});

        newuser.save((err,doc)=>{
            if(err) {console.log(err);
                return res.status(400).json({ success : false});}
            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
 }); */