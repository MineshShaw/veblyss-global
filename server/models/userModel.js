const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartdata:{
        type: Object,
        default:{}
    },
    wishlistdata:{
        type: Object,
        default:{}
    },
    orderdata:{
        type: Object,
        default:{}
    },
    addressdata:{
        type: Object,
        default:{}
    },
    admin:{
        type: Boolean,
        default: false
    }
},{minimize: false});

const userModel = mongoose.model.User || mongoose.model('User',userSchema)

module.exports = userModel