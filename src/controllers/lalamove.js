const { createQuotation, getQuotationDetails, placeOrder, getOrderDetails, getDriverDetails, editOrder, cancelOrder, changeDriver } = require('../service/lalamove');
const response = require('../utils/response');

module.exports = {
    createQuotation:async (req, res, next) => {
        try {
            const result = await createQuotation(req.body,req.shop);
            if (result.success) {
                return response.successResponse(res, 'Quotation created successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    getQuotationDetails: async (req, res, next) => {
        try {
            const { quotationId } = req.params;
            const result = await getQuotationDetails(quotationId,req.shop);
            if (result.success) {
                return response.successResponse(res, 'Quotation details retrieved successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    placeOrder: async (req, res, next) => {
        try {
            const result = await placeOrder(req.body,req.shop);
            if (result.success) {
                return response.successResponse(res, 'Order placed successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    getOrderDetails: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await getOrderDetails(orderId);
            if (result.success) {
                return response.successResponse(res, 'Order details retrieved successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    getDriverDetails: async (req, res, next) => {
        try {
            const { orderId, driverId } = req.params;
            const result = await getDriverDetails(orderId, driverId);
            if (result.success) {
                return response.successResponse(res, 'Driver details retrieved successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    editOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const updatePayload = req.body;
            const result = await editOrder(orderId, updatePayload);
            if (result.success) {
                return response.successResponse(res, 'Order edited successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    cancelOrder: async (req, res, next) => {
        try {
            const { orderId } = req.params;
            const result = await cancelOrder(orderId);
            if (result.success) {
                return response.successResponse(res, 'Order canceled successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    },

    changeDriver: async (req, res, next) => {
        try {
            const { orderId, driverId } = req.params;
            const result = await changeDriver(orderId, driverId);
            if (result.success) {
                return response.successResponse(res, 'Driver changed successfully', result.data);
            } else {
                return response.errorResponse(res, 400, result.message);
            }
        } catch (e) {
            next(e);
        }
    }
};
