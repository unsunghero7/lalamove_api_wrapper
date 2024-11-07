const express = require("express");
const router = express.Router();
const {
    createQuotation,
    getQuotationDetails,
    placeOrder,
    getOrderDetails,
    getDriverDetails,
    editOrder,
    cancelOrder,
    changeDriver
} = require("../controllers/lalamove");

const {verifyApiKey} =require('../middleware')

router.post('/quotation',verifyApiKey, createQuotation);
router.get('/quotation/:quotationId',verifyApiKey, getQuotationDetails);
router.post('/order',verifyApiKey, placeOrder);
router.get('/order/:orderId',verifyApiKey, getOrderDetails);
router.get('/order/:orderId/driver/:driverId',verifyApiKey, getDriverDetails);
router.put('/order/:orderId',verifyApiKey, editOrder);
router.delete('/order/:orderId',verifyApiKey, cancelOrder);
router.put('/order/:orderId/driver/:driverId',verifyApiKey, changeDriver);

module.exports = router;
