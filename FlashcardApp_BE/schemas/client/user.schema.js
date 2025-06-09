const joi = require("joi");
const { otpField, emailField } = require("../sharedFields.schema");

const verifyEmailSchema = joi.object({
    body: joi.object({
        otp: otpField,
    }),
});

const changeEmailSchema = joi.object({
    body: joi.object({
        newEmail: emailField,
    }),
});

module.exports = {
    verifyEmailSchema,
    changeEmailSchema,
};
