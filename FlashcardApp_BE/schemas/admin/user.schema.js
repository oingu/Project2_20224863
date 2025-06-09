const joi = require('joi');
const {
    emailField,
    passwordField,
    fullNameField,
    addressField,
    phoneField,
    objectIdField
} = require("../sharedFields.schema");

const registerVerifySchema = joi.object({
    body: joi.object({
        email: emailField,
        password: passwordField,
        fullName: fullNameField,
        address: addressField,
        phone: phoneField,
        roleId: objectIdField
    }),
});