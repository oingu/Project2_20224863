const mongoose = require("mongoose");
const { type } = require("os");

const folderFlashcard_schema = new mongoose.Schema(
    {
        folderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Folder",
            required: true,
        },
        flashcardId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Flashcard",
            required: true,
        },
        addedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);
folderFlashcard_schema.index({ folderId: 1, flashcardId: 1 }, { unique: true });
const FolderFlashcard = mongoose.model("FolderFlashcard", folderFlashcard_schema, "folder_flashcards");
module.exports = FolderFlashcard;