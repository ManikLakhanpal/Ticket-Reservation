import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    movieName: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const Order = mongoose.model("Orders", orderSchema);

export default Order;