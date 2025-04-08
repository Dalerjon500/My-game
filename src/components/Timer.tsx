import { motion } from 'framer-motion';

type TimerProps = {
    timeLeft: number;
};

export default function Timer({ timeLeft }: TimerProps) {
    const isLow = timeLeft <= 5;

    return (
        <div className="text-center">
            <motion.div
                key={timeLeft}
                initial={{ scale: 0.9 }}
                animate={{ scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12 }}
                className={`fw-bold fs-4 ${isLow ? 'text-danger' : 'text-primary'} ${isLow ? 'pulse' : ''}`}
                aria-live="polite"
            >
                ⏱️ Qolgan vaqt: {timeLeft} s
            </motion.div>
        </div>
    );
}
