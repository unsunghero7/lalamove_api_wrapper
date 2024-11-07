const SDKClient = require("@lalamove/lalamove-js");

const { Quotation, Order } = require('../database/models');

const sdkClient = new SDKClient.ClientModule(
    new SDKClient.Config(
        process.env.LALAMOVE_API_KEY,
        process.env.LALAMOVE_SECRET_KEY,
        "sandbox"
    )
);

module.exports = {
    createQuotation: async (payload, shop) => {
        try {
            const { sender, recipient, serviceType = "POOLED_ORDER", language = "en_MY" } = payload;

            const formattedStops = [
                {
                    coordinates: {
                        lat: parseFloat(sender.lat).toFixed(15),
                        lng: parseFloat(sender.lng).toFixed(15),
                    },
                    address: sender.address,
                },
                {
                    coordinates: {
                        lat: parseFloat(recipient.lat).toFixed(15),
                        lng: parseFloat(recipient.lng).toFixed(15),
                    },
                    address: recipient.address,
                }
            ];

            const quotationPayload = SDKClient.QuotationPayloadBuilder.quotationPayload()
                .withLanguage(language)
                .withServiceType(serviceType)
                .withStops(formattedStops)
                // .withScheduleAt(new Date(Date.now() + (5 * 60 * 1000))) // by adding 5min expire at,
                .build();

            const data = await sdkClient.Quotation.create("MY", quotationPayload);


            // Add commission to the price breakdown
            const commission = shop.commission || 0;
            const priceBreakdown = data.priceBreakdown;
            const addCommission = (amount) => (parseFloat(amount) + (parseFloat(amount) * (commission / 100))).toFixed(2);

            const adjustedPriceBreakdown = {
                ...priceBreakdown,
                base: addCommission(priceBreakdown.base),
                totalBeforeOptimization: addCommission(priceBreakdown.totalBeforeOptimization),
                totalExcludePriorityFee: addCommission(priceBreakdown.totalExcludePriorityFee),
                total: addCommission(priceBreakdown.total),
            };

            data.priceBreakdown = adjustedPriceBreakdown;

            const quotationRecord = new Quotation({
                request: payload,
                response: data,
                quotationId: data?.id,
                shopId: shop._id,
                commission: shop.commission
            });
            await quotationRecord.save();

            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e);
            return {
                success: false,
                message: e.message
            };
        }
    },

    getQuotationDetails: async (quotationId,shop) => {
        try {
            const data = await sdkClient.Quotation.retrieve("MY", quotationId);

            const commission = shop.commission || 0;
            const priceBreakdown = data.priceBreakdown;
            const addCommission = (amount) => (parseFloat(amount) + (parseFloat(amount) * (commission / 100))).toFixed(2);

            const adjustedPriceBreakdown = {
                ...priceBreakdown,
                base: addCommission(priceBreakdown.base),
                totalBeforeOptimization: addCommission(priceBreakdown.totalBeforeOptimization),
                totalExcludePriorityFee: addCommission(priceBreakdown.totalExcludePriorityFee),
                total: addCommission(priceBreakdown.total),
            };

            data.priceBreakdown = adjustedPriceBreakdown;

            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },

    placeOrder: async (payload) => {
        try {
            const { quotationId, sender, recipient, orderId } = payload
            const quotationData = await Quotation.findOne({ quotationId })

            if (!quotationData) {
                return {
                    success: false,
                    message: "Quotation not found"
                }
            }

            const orderPayload = SDKClient.OrderPayloadBuilder.orderPayload()
                .withQuotationID(quotationId)
                .withSender({
                    stopId: quotationData.response.stops[0].id,
                    name: sender?.name,
                    phone: sender?.phone,
                })
                .withRecipients([
                    {
                        stopId: quotationData.response.stops[1].id,
                        name: recipient?.name,
                        phone: recipient?.phone,
                    },
                ])
                .withMetadata({
                    "internalId": orderId
                })
                .build();

            const data = await sdkClient.Order.create("MY", orderPayload);

            const orderRecord = new Order({
                request: payload,
                response: data,
                orderId: data?.id,
                shopId: shop._id
            });
            await orderRecord.save();

            quotationData.isOrderPlaced = true
            await quotationData.save()

            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },

    getOrderDetails: async (orderId) => {
        try {
            const data = await sdkClient.Order.retrieve("MY", orderId);
            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },

    getDriverDetails: async (orderId, driverId) => {
        try {
            const data = await sdkClient.Driver.retrieve("MY", driverId, orderId);
            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },

    editOrder: async (orderId, updatePayload) => {
        try {
            const data = await sdkClient.Order.edit("MY", orderId, updatePayload);
            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },

    cancelOrder: async (orderId) => {
        try {
            const data = await sdkClient.Order.cancel("MY", orderId);
            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    },
    changeDriver: async (orderId, driverId) => {
        try {
            const data = await sdkClient.Driver.cancel("MY", driverId, orderId);
            return {
                success: true,
                data
            };
        } catch (e) {
            console.log(e)
            return {
                success: false,
                message: e.message
            };
        }
    }
};
