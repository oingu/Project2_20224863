const joi = require("joi");
const {
    postTitleField,
    descriptionField,
    imageUrlField,
    postContentField
} = require("../sharedFields.schema");

const postSchema = joi.object({
    body: joi.object({
        title: postTitleField,
        description: descriptionField,
        thumbnail: imageUrlField,
        content: postContentField
    })
});

module.exports = {
    postSchema
}
