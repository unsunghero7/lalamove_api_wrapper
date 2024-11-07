const express = require("express");
const router = express.Router();
const {getShopList, createShop, updateShop, deleteShop } = require("../controllers/shop");

router
    .get('/', getShopList)
    .post('', createShop)
    .put('/:shopId', updateShop)
    .delete('/:shopId', deleteShop);

module.exports = router;
