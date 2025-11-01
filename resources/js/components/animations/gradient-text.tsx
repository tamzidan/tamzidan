import { useState, useEffect } from 'react';

const TEXTS_TO_TYPE = ['Software Engineer', 'Fullstack Developer', 'UI/UX Enthusiast'];

interface LoopingGradientTextProps {
    className?: string;
    colors?: string[];
    animationSpeed?: number;
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    texts?: string[];
}

export default function LoopingGradientText({
    className = '',
    colors = ['#31210dff', '#3b0b0bff', '#331d03ff'],
    animationSpeed = 3,
    typingSpeed = 100,
    deletingSpeed = 75,
    pauseDuration = 2000,
    texts = TEXTS_TO_TYPE,
}: LoopingGradientTextProps) {
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        const handleTyping = () => {
            const currentText = texts[textIndex];

            if (isDeleting) {
                if (displayedText.length > 0) {
                    setDisplayedText(currentText.substring(0, displayedText.length - 1));
                } else {
                    setIsDeleting(false);
                    setTextIndex((prevIndex) => (prevIndex + 1) % texts.length);
                }
            } else {
                if (displayedText.length < currentText.length) {
                    setDisplayedText(currentText.substring(0, displayedText.length + 1));
                } else {
                    setTimeout(() => setIsDeleting(true), pauseDuration);
                }
            }
        };

        const typingInterval = isDeleting ? deletingSpeed : typingSpeed;
        const timer = setTimeout(handleTyping, typingInterval);

        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, textIndex, deletingSpeed, typingSpeed, pauseDuration, texts]);

    const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`,
        animationDuration: `${animationSpeed}s`,
    };

    return (
        <div className={`relative flex w-full items-center justify-start ${className}`}>
            <div
                className="inline-block relative z-2 text-left text-xl lg:text-3xl font-medium text-transparent bg-cover animate-gradient"
                style={{
                    ...gradientStyle,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    backgroundSize: '300% 100%',
                }}
            >
                <span>{displayedText}</span>
                <span
                    className="ml-1 inline-block h-5 w-0.5 animate-pulse bg-white"
                    style={{ height: '1.25em', verticalAlign: 'bottom' }}
                />
            </div>
        </div>
    );
}
