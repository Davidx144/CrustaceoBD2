var mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const salt=10;

const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 200
    },
    gender: {
        type: String,
        required: true,
        maxlength: 100
    },
    img: {
        type: String,
        required: true,
        maxlength: 500
    },
    synopsis: {
        type: String,
        required: true,
        maxlength: 500
    },
    format: {
        type: String,
        required: true,
        maxlength: 100

    },
    value: {
        type: String,
        required: true,
        maxlength: 100
    },
    hour: {
        type: String,
        required: true,
        maxlength: 100
    },
});

/* movieSchema.pre('save', function (next) {
    var movie = this;

    if (movie.isModified('password')) {
        bcrypt.genSalt(salt, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);
                user.password = hash;
                user.password2 = hash;
                next();
            })

        })
    }
    else {
        next();
    }
});

userSchema.methods.comparepassword=function(password,cb){
    bcrypt.compare(password,this.password,function(err,isMatch){
        if(err) return cb(next);
        cb(null,isMatch);
    });
}

// generate token

userSchema.methods.generateToken=function(cb){
    var user =this;
    var token=jwt.sign(user._id.toHexString(),confiq.SECRET);

    user.token=token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

// find by token
userSchema.statics.findByToken=function(token,cb){
    var user=this;

    jwt.verify(token,confiq.SECRET,function(err,decode){
        user.findOne({"_id": decode, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
};


//delete token

userSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.update({$unset : {token :1}},function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
} */



module.exports = mongoose.model('Movie', movieSchema);