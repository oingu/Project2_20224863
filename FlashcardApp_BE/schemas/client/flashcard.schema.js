const joi = require("joi");

const { searchField } = require("../sharedFields.schema");

const searchSchema = joi.object({
    query: joi.object({
        word: joi
            .string()
            .pattern(/^[a-zA-Z]+$/)
            .min(1)
            .max(50)
            .required(),
    }),
});

module.exports = {
    searchSchema,
};
