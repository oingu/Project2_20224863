// src/WordScramble.js
import React, { useState, useEffect } from 'react';
import { getNewWordData } from './wordBank'; // Import from our data file
import './WordScramble.css'; // Import styling

function WordScramble() {
    const [originalWord, setOriginalWord] = useState('');
    const [scrambledWord, setScrambledWord] = useState('');
    const [hint, setHint] = useState('');
    const [guess, setGuess] = useState('');
    const [feedback, setFeedback] = useState('');
    const [isCorrect, setIsCorrect] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Function to load a new word
    const loadNewWord = () => {
        const newWordData = getNewWordData();
        setOriginalWord(newWordData.word);
        setScrambledWord(newWordData.scrambled);
        setHint(newWordData.hint);
        setGuess(''); // Clear previous guess
        setFeedback(''); // Clear feedback
        setIsCorrect(false); // Reset correctness state
        setAttempts(0); // Reset attempts
        console.log("New word:", newWordData.word); // Optional: Log answer for debugging
    };

    // Load the first word when the component mounts
    useEffect(() => {
        loadNewWord();
    }, []); // Empty dependency array means run only once on mount

    // Handle changes in the input field
    const handleInputChange = (event) => {
        setGuess(event.target.value);
    };

    // Handle guess submission
    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent form from refreshing the page
        if (!guess.trim() || isCorrect) {
            return; // Don't process empty guesses or if already correct
        }

        setAttempts(prev => prev + 1); // Increment attempts

        if (guess.trim().toLowerCase() === originalWord.toLowerCase()) {
            setFeedback(`Correct! 🎉 You guessed "${originalWord}" in ${attempts + 1} attempt(s).`);
            setIsCorrect(true);
        } else {
            setFeedback('Incorrect. Try again!');
        }
    };

    // Handle clicking the "Next Word" button
    const handleNextWord = () => {
        loadNewWord();
    };

    return (
        <div className="WordScramble">
            <header className="WordScramble-header">
                <h1>Word Scramble Game</h1>
            </header>
            <main className="game-container">
                {originalWord === 'ERROR' ? (
                    <p className="error-message">{hint}</p>
                ) : (
                    <>
                        <div className="hint-section">
                            <strong>Hint:</strong> {hint}
                        </div>

                        <div className="scrambled-word">
                            {scrambledWord}
                        </div>

                        <form onSubmit={handleSubmit} className="guess-form">
                            <input
                                type="text"
                                value={guess}
                                onChange={handleInputChange}
                                placeholder="Your guess..."
                                disabled={isCorrect} // Disable input after correct guess
                                aria-label="Enter your guess"
                            />
                            <button type="submit" disabled={isCorrect || !guess.trim()}>
                                Guess
                            </button>
                        </form>

                        {feedback && (
                            <p className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                                {feedback}
                            </p>
                        )}

                        {isCorrect && (
                            <button onClick={handleNextWord} className="next-button">
                                Next Word
                            </button>
                        )}
                    </>
                )}
            </main>
            <footer className="WordScramble-footer">
                <p>Arrange the letter correctly</p>
            </footer>
        </div>
    );
}

export default WordScramble;