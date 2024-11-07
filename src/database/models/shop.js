const mongoose = require('mongoose');
const { Schema } = mongoose;

const shopSchema = new Schema({
    shopId: {
        type: String,
        required: true,
        unique: true
    },
    apiKey: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    commission: {
        type: Number,
        default: 3
    }
}, {
    timestamps: true
});

const Shop = mongoose.model('Shop', shopSchema);

module.exports = Shop;
