const mongoose = require('mongoose');
const { Schema } = mongoose;

const quotationSchema = new Schema({
    shopId:{
        type:String,
        index:true
    },
    quotationId:{
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
    isOrderPlaced:{
        type:Boolean,
        default:false
    },
    commission: {
        type: Number,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Quotation = mongoose.model('Quotation', quotationSchema);

module.exports = Quotation;
