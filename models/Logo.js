const mongoose = require('mongoose');

const logoSchema = new mongoose.Schema({
    imageurl:{
        type:String,
        required:true,
        unique:true,
        trim: true
    },
    companyname:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
},
{ timestamps : true }
);

module.exports = mongoose.model("Logo",logoSchema);