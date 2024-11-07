const Joi = require('joi');

const schemas = {
  addNewShop: Joi.object().keys({
    email: Joi.string().email({ tlds: { allow: false } }).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().valid('user', 'admin', 'editor').required(),
    access_level: Joi.string().valid('basic', 'extended').optional().allow(''),
  })

};
module.exports = schemas;
