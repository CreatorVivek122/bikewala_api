const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema(
    {
        assetname: {
            type: String,
            required : true,
            unique: true,
            trim:true
        },
        imageurl: {
            type: String,
            required:true,
            trim: true
        },
        price:{
            type: Number,
            required:true,
            trim:true
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Asset", assetSchema);