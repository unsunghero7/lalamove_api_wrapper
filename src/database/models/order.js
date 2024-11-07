const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
    shopId:{
        type:String,
        index:true
    },
    orderId:{
        type:String,
        index:true
    },
    request: {
        type: Object,
        required: true
    },
    response: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
