const joi = require("joi");
const {roleTitleField, descriptionField} = require("../sharedFields.schema");

const roleSchema = joi.object({
    body: joi.object({
        title: roleTitleField,
        description: descriptionField
    }),
});

module.exports = {
    roleSchema
};