// src/wordBank.js

const WORD_BANK = [
    {
        word: "react",
        hint: "A popular JavaScript library for building user interfaces."
    },
    {
        word: "javascript",
        hint: "A versatile scripting language for web development."
    },
    {
        word: "computer",
        hint: "An electronic device that processes data."
    },
    {
        word: "keyboard",
        hint: "An input device used to type characters."
    },
    {
        word: "internet",
        hint: "A global network connecting millions of computers."
    },
    {
        word: "developer",
        hint: "Someone who creates software or applications."
    },
    {
        word: "variable",
        hint: "A storage location paired with an associated symbolic name."
    },
    {
        word: "function",
        hint: "A block of code which only runs when it is called."
    },
    {
        word: "style",
        hint: "Concerned with the appearance or design of elements."
    },
    {
        word: "galaxy",
        hint: "A massive system of stars, gas, dust, and dark matter."
    },
    {
        word: "mountain",
        hint: "A large natural elevation of the earth's surface."
    },
    {
        word: "ocean",
        hint: "A very large expanse of sea."
    },
    // Add more words and hints here!
];

// Function to shuffle the letters of a word
export const scrambleWord = (word) => {
    const letters = word.split('');
    let scrambled = word;
    // Ensure it's actually scrambled (for words > 1 letter)
    while (scrambled === word && word.length > 1) {
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]]; // Swap elements
        }
        scrambled = letters.join('');
    }
    return scrambled;
};

// Function to get a new word data object
export const getNewWordData = () => {
    if (!WORD_BANK || WORD_BANK.length === 0) {
        return { word: 'ERROR', hint: 'Word bank is empty!', scrambled: 'ERROR' };
    }
    const randomIndex = Math.floor(Math.random() * WORD_BANK.length);
    const selectedWordData = WORD_BANK[randomIndex];
    const scrambled = scrambleWord(selectedWordData.word);
    return { ...selectedWordData, scrambled };
};