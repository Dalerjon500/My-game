import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Timer from './Timer';
import GameOver from './GameOver';

const words: string[] = [
    'apple', 'banana', 'cherry', 'dragonfruit', 'elderberry', 'fig', 'guava', 'honeydew', 'kiwi', 'lemon',
    'mango', 'nectarine', 'orange', 'papaya', 'quince', 'raspberry', 'strawberry', 'ugli', 'vanilla', 'watermelon', 'yellowfruit',
    'dalerjon', 'muslima', 'firdavs', 'bexruz', 'shohjahon', 'mahmud', 'nizom', 'jahon', 'jonibek', 'hasan',
];

export default function WordTypingGame() {
    const [currentWord, setCurrentWord] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(Number(localStorage.getItem('highScore')) || 0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [isRunning, setIsRunning] = useState(false); // ✅ Boshlash/pauza flag
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        generateWord();
        inputRef.current?.focus();
    }, []);

    useEffect(() => {
        if (!isRunning || gameOver) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setGameOver(true);
                    setIsRunning(false);
                    if (score > highScore) {
                        setHighScore(score);
                        localStorage.setItem('highScore', String(score));
                    }
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isRunning, gameOver]);
    const generateWord = () => {
        const randomIndex = Math.floor(Math.random() * words.length);
        setCurrentWord(words[randomIndex]);
    };

    const handleKeyPress = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!isRunning || gameOver) return;
        setUserInput(e.target.value);
    };

    const handleSubmit = () => {
        if (!isRunning || gameOver) return;
        if (userInput.trim().toLowerCase() === currentWord.toLowerCase()) {
            const newScore = score + 1;
            setScore(newScore);
            setCombo((prev) => {
                const newCombo = prev + 1;
                if (newCombo > maxCombo) setMaxCombo(newCombo);
                return newCombo;
            });
            setTimeLeft((prev) => Math.min(prev + 2, 30));
            generateWord();
            setUserInput('');
            inputRef.current?.focus();
        } else {
            setCombo(0);
        }
    };

    const handleRestart = () => {
        setScore(0);
        setTimeLeft(30);
        setGameOver(false);
        setUserInput('');
        setCombo(0);
        setIsRunning(false);
        generateWord();
        inputRef.current?.focus();
    };

    const handleStartPause = () => {
        if (gameOver) return;
        setIsRunning((prev) => !prev);
        inputRef.current?.focus();
    };

    const getComboColor = () => {
        if (combo >= 10) return '#ff0000';
        if (combo >= 7) return '#ff8a00';
        if (combo >= 4) return '#ffd700';
        return '#ffffff';
    };

    return (
        <div className="game-container position-relative vh-100 d-flex flex-column">
            {/* Background */}
            <div className="position-absolute w-100 h-100" style={{
                background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                zIndex: -1
            }}></div>

            {/* Header */}
            <header className="py-4 px-3 d-flex justify-content-between align-items-center">
                <motion.div
                    initial={{ x: -50 }}
                    animate={{ x: 0 }}
                    className="logo d-flex align-items-center"
                >
                    <span className="fs-3 me-2">⌨️</span>
                    <h1 className="m-0 fs-4 fw-bold text-success">WORD TYPING CHALLENGE</h1>
                </motion.div>
                <div className="d-flex gap-4">
                    <div className="score-display text-center">
                        <p className="m-0 text-muted">BALL</p>
                        <p className="m-0 fs-4 fw-bold text-white">{score}</p>
                    </div>
                    <div className="high-score-display text-center">
                        <p className="m-0 text-muted">REKORD</p>
                        <p className="m-0 fs-4 fw-bold text-warning">{highScore}</p>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="flex-grow-1 d-flex flex-column justify-content-center align-items-center p-3">
                {!gameOver ? (
                    <motion.div
                        className="game-card glass-card p-5 rounded-4 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ maxWidth: '800px', width: '100%' }}
                    >
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <Timer timeLeft={timeLeft} />
                            <AnimatePresence>
                                {combo > 0 && (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="combo-display px-3 py-2 rounded-pill"
                                        style={{ backgroundColor: 'rgba(0,0,0,0.3)', color: getComboColor() }}
                                    >
                                        <span className="fw-bold">{combo}x COMBO!</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Word Display */}
                        <motion.div
                            key={currentWord}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                            className="word-display mb-5"
                        >
                            <h2 className="display-1 fw-bold text-white">
                                {currentWord.split('').map((letter, index) => (
                                    <motion.span
                                        key={index}
                                        initial={{ color: '#ffffff' }}
                                        animate={{
                                            color: index < userInput.length
                                                ? userInput[index].toLowerCase() === letter.toLowerCase()
                                                    ? '#38b000' : '#ff0000'
                                                : '#ffffff'
                                        }}
                                        transition={{ duration: 0.1 }}
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </h2>
                        </motion.div>

                        {/* Input and Button */}
                        <div className="input-group mb-4">
                            <motion.input
                                ref={inputRef}
                                type="text"
                                className="form-control form-control-lg glass-input"
                                placeholder="So'zni kiriting..."
                                value={userInput}
                                onChange={handleKeyPress}
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                                disabled={!isRunning}
                                style={{
                                    background: 'rgba(255, 255, 255, 0.1)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                    color: 'white'
                                }}
                            />
                            <motion.button
                                onClick={handleSubmit}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-lg btn-primary"
                                disabled={!isRunning}
                                style={{
                                    background: 'linear-gradient(90deg, #38b000, #70e000)',
                                    border: 'none'
                                }}
                            >
                                ✅ Yuborish
                            </motion.button>
                        </div>

                        {/* Start/Pause Button */}
                        <motion.button
                            onClick={handleStartPause}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="btn mb-4 fw-bold text-white px-5 py-3 rounded-pill"
                            style={{
                                background: isRunning
                                    ? 'linear-gradient(135deg, #ff416c, #ff4b2b)' // Pauza ranglari
                                    : 'linear-gradient(135deg, #00c9ff, #92fe9d)', // Boshlash ranglari
                                boxShadow: '0 10px 20px rgba(0, 0, 0, 0.3)',
                                border: 'none',
                                fontSize: '1.25rem',
                                letterSpacing: '1px',
                            }}
                        >
                            {isRunning ? '⏸ Pauza' : '▶️ Boshlash'}
                        </motion.button>

                        {/* Time Bonus */}
                        <motion.div
                            animate={{
                                opacity: timeLeft > 25 ? 1 : 0.5,
                                scale: timeLeft > 25 ? 1.1 : 1
                            }}
                            className=" time-bonus-indicator text-white"
                        >
                            ⏱️ Har bir to'g'ri javob +2 soniya
                        </motion.div>
                    </motion.div>
                ) : (
                    <GameOver
                        onRestart={handleRestart}
                        score={score}
                        highScore={highScore}
                    />
                )}
            </main>

            <footer className="py-3 text-center text-muted">
                <p className="m-0">© 2023 Word Typing Challenge</p>
            </footer>
        </div>
    );
}
