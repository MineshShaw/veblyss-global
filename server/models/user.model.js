import mongoose from "mongoose";

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
        default:{
            productId: "",
            quantity: 0,
            name: "",
            price: 0,
            image: "",
        }
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
        default:{
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "",
            phone: "",
        }
    },
},{minimize: false});

const User = mongoose.model.User || mongoose.model('User',userSchema)

export default User