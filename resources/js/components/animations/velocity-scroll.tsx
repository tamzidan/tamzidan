import {
    motion,
    useAnimationFrame,
    useMotionValue,
    useScroll,
    useSpring,
    useTransform,
    useVelocity,
} from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxTextProps {
    children: React.ReactNode;
    baseVelocity?: number;
}

function ParallaxText({ children, baseVelocity = 100, ...props }: ParallaxTextProps) {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400,
    });

    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false,
    });

    const [repetitions, setRepetitions] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const calculateRepetitions = () => {
            if (containerRef.current && textRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const textWidth = textRef.current.offsetWidth;
                if (textWidth > 0) {
                    const newRepetitions = Math.ceil(containerWidth / textWidth) + 2;
                    setRepetitions(newRepetitions);
                }
            }
        };

        calculateRepetitions();

        window.addEventListener('resize', calculateRepetitions);
        return () => window.removeEventListener('resize', calculateRepetitions);
    }, [children]);

    const x = useTransform(baseX, (v) => `${wrap(-100 / repetitions, 0, v)}%`);

    const directionFactor = React.useRef(1);
    useAnimationFrame((t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    return (
        <div ref={containerRef} className="w-full overflow-hidden whitespace-nowrap" {...props}>
            <motion.div className="inline-block" style={{ x }}>
                {Array.from({ length: Math.max(1, repetitions) }).map((_, i) => (
                    <span key={i} ref={i === 0 ? textRef : null}>
                        {children}{' '}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}

interface VelocityScrollProps {
    defaultVelocity?: number;
    numRows?: number;
    children: React.ReactNode;
    className?: string;
}

export function VelocityScroll({ defaultVelocity = 5, numRows = 2, children, className, ...props }: VelocityScrollProps) {
    return (
        <div
            className={cn(
                'relative w-full text-4xl font-bold tracking-[-0.02em] md:text-7xl md:leading-[5rem]',
                className
            )}
            {...props}
        >
            {Array.from({ length: Math.max(1, numRows) }).map((_, i) => (
                <ParallaxText key={i} baseVelocity={defaultVelocity * (i % 2 === 0 ? 1 : -1)}>
                    {children}
                </ParallaxText>
            ))}
        </div>
    );
}
