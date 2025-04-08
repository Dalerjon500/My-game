import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';


type GameOverProps = {
    onRestart: () => void;
    score: number;
    highScore: number;
};

export default function GameOver({ onRestart, score, highScore }: GameOverProps) {
    const [showConfetti, setShowConfetti] = useState(false);
    const isNewRecord = score > highScore;

    const getMedal = () => {
        if (score >= 50) return '🏅 Platinum';
        if (score >= 30) return '🥇 Gold';
        if (score >= 20) return '🥈 Silver';
        if (score >= 10) return '🥉 Bronze';
        return '🎖️ Participant';
    };

    useEffect(() => {

        if (isNewRecord) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, []);

    return (
        <div className="game-over-container position-relative overflow-hidden">
            <AnimatePresence>
                {showConfetti && (
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={500}
                        gravity={0.2}
                    />
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, type: 'spring' }}
                className="glass-card p-5 rounded-4 text-center"
                style={{
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}
            >

                <motion.div
                    animate={isNewRecord ? {
                        scale: [1, 1.1, 1],
                        textShadow: ['0 0 0px #fff', '0 0 10px #ff0', '0 0 0px #fff']
                    } : {}}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <h1 className="display-4 fw-bold mb-4 text-gradient">
                        O'YIN TUGADI!
                    </h1>
                </motion.div>

                <div className="score-display mb-4">
                    <motion.div
                        className="score-card p-3 mb-3 rounded-3"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.1) 100%)'
                        }}
                    >
                        <p className="fs-2 mb-1">Sizning balingiz</p>
                        <p className="display-2 fw-bold text-primary">{score}</p>
                    </motion.div>

                    <div className="d-flex justify-content-center gap-4">
                        <div className="high-score-card p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0.1) 100%)'
                        }}>
                            <p className="fs-5 mb-1">Rekord</p>
                            <p className="fs-3 fw-bold text-warning">{highScore}</p>
                        </div>

                        <div className="medal-card p-3 rounded-3" style={{
                            background: 'linear-gradient(135deg, rgba(192,192,192,0.2) 0%, rgba(192,192,192,0.1) 100%)'
                        }}>
                            <p className="fs-5 mb-1">Medal</p>
                            <p className="fs-3 fw-bold">{getMedal()}</p>
                        </div>
                    </div>
                </div>

                <AnimatePresence>
                    {isNewRecord && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ delay: 0.5 }}
                            className="new-record-badge mb-4 p-3 rounded-pill"
                            style={{
                                background: 'linear-gradient(90deg, #ff8a00, #e52e71)',
                                display: 'inline-block'
                            }}
                        >
                            <span className="fw-bold text-white">YANGI REKORD!</span>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="social-share mb-4">
                    <p className="text-muted mb-2">Do'stlaringizga ulashing</p>
                    <div className="d-flex justify-content-center gap-3">
                        {['twitter', 'facebook', 'telegram'].map((platform) => (
                            <motion.button
                                key={platform}
                                whileHover={{ y: -3 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-outline-light rounded-circle p-3"
                            >
                                <i className={`bi bi-${platform} fs-5`}></i>
                            </motion.button>
                        ))}
                    </div>
                </div>

                <motion.button
                    onClick={onRestart}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-primary btn-lg fw-bold py-3 px-5 rounded-pill"
                    style={{
                        background: 'linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)',
                        border: 'none',
                        fontSize: '1.2rem'
                    }}
                >
                    <i className="bi bi-arrow-repeat me-2"></i>
                    Qayta O'ynash
                </motion.button>
            </motion.div>

            <style>{`
        .text-gradient {
          background: linear-gradient(90deg, #ff0000, #ff8a00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-fill-color: transparent;
        }
        .glass-card {
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
        </div>
    );
}