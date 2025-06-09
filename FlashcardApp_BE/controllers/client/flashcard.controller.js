const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
// Model
const User = require("../../models/user.model");
const Role = require("../../models/role.model");
const Flashcard = require("../../models/flashcard.model");
const UserInformation = require("../../models/userInformation.model");

module.exports.search = async (req, res) => {
    const word = req.query.word?.toLowerCase();
    try {
        const flashcardResult = await Flashcard.find({ word: word });
        if (flashcardResult.length == 0) {
            const wordSeachEndpoint = `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`;
            const wordSearchResponse = (await axios.get(wordSeachEndpoint)).data[0];
            let flashcard = {
                word: word,
                meanings: (wordSearchResponse.meanings || []).map((meaning) => {
                    return {
                        partOfSpeech: meaning.partOfSpeech || "",
                        definitions: (meaning.definitions || []).map((def) => {
                            return {
                                definition: def.definition?.trim() || "",
                                example: def.example?.trim() || "",
                            };
                        }),
                    };
                }),
                phonetics: (wordSearchResponse.phonetics || []).filter(phonetic => phonetic.text).map(
                    (phonetic) => {
                        return {
                            pronunciation: phonetic.text,
                            sound: phonetic.audio || "",
                        };
                    }
                ),
                vi_definition: "Tam thoi chua co",
            }
            let record = new Flashcard(flashcard);
            await record.save();
            console.log(`${new Date(Date.now())} --- word: '${word}' was added to database`);
            res.json({
                result: 1,
                flashcards: [{
                _id: record._id,
                word: word,
                meanings: (wordSearchResponse.meanings || []).map((meaning) => {
                    return {
                        partOfSpeech: meaning.partOfSpeech || "",
                        definitions: (meaning.definitions || []).map((def) => {
                            return {
                                definition: def.definition?.trim() || "",
                                example: def.example?.trim() || "",
                            };
                        }),
                    };
                }),
                phonetics: (wordSearchResponse.phonetics || []).filter(phonetic => phonetic.text).map(
                    (phonetic) => {
                        return {
                            pronunciation: phonetic.text,
                            sound: phonetic.audio || "",
                        };
                    }
                ),
                vi_definition: "Tam thoi chua co",
            }]
            });
        } else {
            res.json({
                result: flashcardResult.length,
                flashcards: flashcardResult,
            });
        }
    } catch (error) {
        if (
            String(error).startsWith(
                "AxiosError: Request failed with status code 404"
            )
        ) {
            return res.status(404).json({ message: "Word is not found." });
        }
        console.log(error);
        return res
            .status(500)
            .json({ message: "Something went wrong. Try again later" });
    }
};
