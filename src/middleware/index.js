const jwt = require('jsonwebtoken');
const User = require('../database/models/user');
const response = require('../utils/response')
const crypto = require('crypto');
const Shop = require('../database/models/shop');

module.exports = {

    generateNewToken: (user) => {   // generate new jwt token
        const auth_token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "10d" });
        return auth_token
    },
    generateApiKey: () => {
        return crypto.randomBytes(20).toString('hex');
    },
    verifyApiKey: async (req, res, next) => { // verify all user api key for get
        try {

            let apiKey = req.headers['api_key'];

            if (!apiKey) {
                return response.errorResponse(res, 401, 'please send apiKey in headers');
            }

            const shop = await Shop.findOne({ apiKey });

            if (!shop) {
                return response.errorResponse(res, 401, 'Shop not found');
            }

            req.shop = shop;
            next();
        } catch (error) {
            console.log(error)
            return response.errorResponse(res, 401, 'Not Authorized');
        }
    },
    verifyToken: async (req, res, next) => {  //verify jwt token

        try {

            if (!req.headers['authorization']) {
                return res.status(400).send({
                    success: false,
                    message: "please send token in header"
                })
            }

            const token = req.headers['authorization'].split(' ')[1]

            if (!token) {
                return res.status(401).send({
                    success: false,
                    message: "Not Authorized"
                })
            }

            const decode = await jwt.verify(token, process.env.JWT_SECRET)

            const user = await User.findOne({ _id: decode._id })

            if (!user) {
                return res.status(401).send({
                    success: false,
                    message: "User not found"
                })
            }

            req.user = user

            next()
        } catch (error) {
            return res.status(401).send({
                success: false,
                message: "Not Authorized"
            })
        }
    },
    validation: (schema) => {

        return (req, res, next) => {

            const { error, value } = schema.validate(req.body, { abortEarly: true });
            const valid = error == null;
            if (valid) {
                req.body = value;
                next();

            } else {
                const { details } = error;
                const message = details.map(e => e.message).join(',');
                response.errorResponse(res, 400, message)
            }
        }
    },

    routesNotFound: (req, res, next) => { //if any routes not found
        const error = new Error(`Url Not found -${req.originalUrl}`)
        res.statusCode = 404
        next(error)
    },
    globalErrorHandler: (error, req, res, next) => {  //if any error found
        console.log(error)
        return response.errorResponse(res, res.statusCode == 404 ? 404 : 500, error.message)
    }
}
