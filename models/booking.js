var mongoose = require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const salt=10;

const bookingSchema = mongoose.Schema({
    id_movie: {
        type: String,
        required: true,
        maxlength: 500
    },
    id_user: {
        type: String,
        required: true,
        maxlength: 100
    },
    chairs: {
        type: Array,
        required: true
    },
    movieValue: {
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

module.exports = mongoose.model('Booking', bookingSchema);