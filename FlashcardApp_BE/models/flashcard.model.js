const mongoose = require("mongoose");
const slug = require("mongoose-slug-updater");
mongoose.plugin(slug);
const flashcard_schema = new mongoose.Schema(
    {
        word: {
            type: String,
            required: true,
            trim: true,
        },
        meanings: [
            {
                partOfSpeech: {type: String},
                definitions: [
                    {
                        definition: {type: String, trim: true},
                        example: {type: String, trim: true}
                    }
                ]
            }
        ],
        vi_definition: {
            type: String,
            required: true,
            trim: true,
        },
        phonetics:[
            {
                pronunciation: {type: String, required: true},
                sound: {type: String}
            }
        ],
        slug: {
            type: String,
            slug: "word",
            unique: true
        }
    },
    {
        timestamps: true,
    }
);

const Flashcard = mongoose.model("Flashcard", flashcard_schema, "flashcards");
module.exports = Flashcard;