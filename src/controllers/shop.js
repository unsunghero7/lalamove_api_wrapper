const Shop = require("../database/models/shop");
const { generateApiKey } = require("../middleware"); 

module.exports = {
    getShopList: async (req, res, next) => {
        try {
            const { start = 0, length = 10, search = { value: '' } } = req.query;
            const query = search.value ? {
                $or: [
                    { shopId: { $regex: search.value, $options: 'i' } },
                    { name: { $regex: search.value, $options: 'i' } },
                    { apiKey: { $regex: search.value, $options: 'i' } },
                ]
            } : {};

            const totalRecords = await Shop.countDocuments(query);
            const shops = await Shop.find(query)
                .skip(parseInt(start))
                .limit(parseInt(length));

            res.send({
                draw: req.query.draw,
                recordsTotal: totalRecords,
                recordsFiltered: totalRecords,
                data: shops
            });
        } catch (e) {
            next(e);
        }
    },
    // Create a new shop
    createShop: async (req, res, next) => {
        try {
            const { shopId, name, commission } = req.body;

            // Generate a unique API key
            const apiKey = generateApiKey();

            const newShop = new Shop({
                shopId,
                apiKey,
                name,
                commission
            });

            await newShop.save();

            res.status(201).send({
                success: true,
                message: "Shop created successfully",
                data: newShop
            });
        } catch (e) {
            next(e);
        }
    },

    // Update shop data
    updateShop: async (req, res, next) => {
        try {
            const { shopId } = req.params;
            const { name, commission } = req.body;

            const updatedShop = await Shop.findOneAndUpdate(
                { _id:shopId },
                { name, commission },
                { new: true }
            );

            if (!updatedShop) {
                return res.status(404).send({
                    success: false,
                    message: "Shop not found"
                });
            }

            res.send({
                success: true,
                message: "Shop updated successfully",
                data: updatedShop
            });
        } catch (e) {
            next(e);
        }
    },

    // Delete shop data
    deleteShop: async (req, res, next) => {
        try {
            const { shopId } = req.params;

            const deletedShop = await Shop.findOneAndDelete({ _id:shopId });

            if (!deletedShop) {
                return res.status(404).send({
                    success: false,
                    message: "Shop not found"
                });
            }

            res.send({
                success: true,
                message: "Shop deleted successfully",
                data: deletedShop
            });
        } catch (e) {
            next(e);
        }
    }
};
