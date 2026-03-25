import React from 'react';

interface StarfieldProps {
    shootingStarCount?: number;
}

const Starfield: React.FC<StarfieldProps> = ({ shootingStarCount = 5 }) => {
    const shootingStars = Array.from({ length: shootingStarCount }).map((_, i) => (
        <div
            key={`shooting-star-${i}`}
            className="shooting-star"
            style={{
                top: `${Math.random() * 80}%`,
                left: `${Math.random() * 100}%`,
                animationDuration: `${Math.random() * 2 + 1}s`,
                animationDelay: `${Math.random() * 5 + 1}s`,
            }}
        />
    ));

    return (
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
            {shootingStars}
            <style>{`
                .shooting-star {
                    position: absolute;
                    width: 2px;
                    height: 2px;
                    background: white;
                    border-radius: 50%;
                    box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.8);
                    animation: shoot linear infinite;
                }

                @keyframes shoot {
                    0% {
                        transform: translateX(0) translateY(0);
                        opacity: 1;
                    }
                    100% {
                        transform: translateX(-300px) translateY(300px);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default Starfield;
