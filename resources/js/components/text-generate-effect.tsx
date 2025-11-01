import { useEffect } from 'react';
import { motion, stagger, useAnimate } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TextGenerateEffectProps {
    words: string;
    className?: string;
    filter?: boolean;
    duration?: number;
}

const TextGenerateEffect: React.FC<TextGenerateEffectProps> = ({
    words,
    className,
    filter = true,
    duration = 0.5,
}) => {
    const [scope, animate] = useAnimate();
    let wordsArray = words.split(' ');

    useEffect(() => {
        animate(
            'span',
            {
                opacity: 0.6,
                filter: filter ? 'blur(0px)' : 'none',
            },
            {
                duration: duration,
                delay: stagger(0.2),
            }
        );
    }, [scope]);

    const renderWords = () => {
        return (
            <motion.div ref={scope}>
                {wordsArray.map((word, idx) => (
                    <motion.span
                        key={word + idx}
                        className="dark:text-white text-white opacity-0"
                        style={{
                            filter: filter ? 'blur(10px)' : 'none',
                        }}
                    >
                        {word}{' '}
                    </motion.span>
                ))}
            </motion.div>
        );
    };

    return (
        <div className={cn('font-cascadia', className)}>
            <div className="mt-4">
                <div className="dark:text-white text-white text-md leading-snug tracking-wide sm:text-center md:text-center lg:text-left">
                    {renderWords()}
                </div>
            </div>
        </div>
    );
};

export default TextGenerateEffect;
