const joi = require("joi");
const {
    folderNameField,
    descriptionField,
    tagField,
    booleanField,
    flashcardId
} = require("../sharedFields.schema");

const folderSchema = joi.object({
    body: joi.object({
        name: folderNameField,
        description: descriptionField,
        tags: tagField,
        isPublic: booleanField.required()
    })
});

const folderAddFlashcardSchema = joi.object({
    body: joi.object({
        flashcardId: flashcardId.required()
    })
});


module.exports = {
    folderSchema,
    folderAddFlashcardSchema
};