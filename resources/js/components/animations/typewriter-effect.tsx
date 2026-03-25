import { cn } from '@/lib/utils';
import { motion, stagger, useAnimate, useInView } from 'framer-motion';
import { useEffect } from 'react';

interface Word {
    text: string;
    className?: string;
}

interface TypewriterEffectProps {
    words: Word[];
    className?: string;
    cursorClassName?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
    words,
    className,
    cursorClassName,
}) => {
    const wordsArray = words.map((word) => ({
        ...word,
        text: word.text.split(''),
    }));

    const [scope, animate] = useAnimate();
    const isInView = useInView(scope);

    useEffect(() => {
        if (isInView) {
            animate(
                'span',
                {
                    display: 'inline-block',
                    opacity: 1,
                    width: 'fit-content',
                },
                {
                    duration: 0.3,
                    delay: stagger(0.1),
                    ease: 'easeInOut',
                }
            );
        }
    }, [isInView, animate]);

    const renderWords = () => (
        <motion.div ref={scope} className="inline">
            {wordsArray.map((word, idx) => (
                <div key={`word-${idx}`} className="inline-block">
                    {word.text.map((char, index) => (
                        <motion.span
                            initial={{}}
                            key={`char-${index}`}
                            className={cn(`dark:text-white text-black opacity-0 hidden`, word.className)}
                        >
                            {char}
                        </motion.span>
                    ))}
                    {' '}
                </div>
            ))}
        </motion.div>
    );

    return (
        <div className={cn('text-sm sm:text-lg md:text-xl lg:text-2xl text-left', className)}>
            {renderWords()}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn('inline-block rounded-sm w-[4px] h-4 md:h-6 lg:h-10 bg-gray-500', cursorClassName)}
            />
        </div>
    );
};

export const TypewriterEffectSmooth: React.FC<TypewriterEffectProps> = ({
    words,
    className,
    cursorClassName,
}) => {
    const wordsArray = words.map((word) => ({
        ...word,
        text: word.text.split(''),
    }));

    const renderWords = () => (
        <div>
            {wordsArray.map((word, idx) => (
                <div key={`word-${idx}`} className="inline-block">
                    {word.text.map((char, index) => (
                        <span key={`char-${index}`} className={cn(`dark:text-white text-black `, word.className)}>
                            {char}
                        </span>
                    ))}
                </div>
            ))}
        </div>
    );

    return (
        <div className={cn('flex space-x-1 my-6', className)}>
            <motion.div
                className="overflow-hidden pb-2"
                initial={{ width: '0%' }}
                whileInView={{ width: 'fit-content' }}
                transition={{
                    duration: 2,
                    ease: 'linear',
                    delay: 1,
                }}
            >
                <div className="text-xs sm:text-base md:text-xl lg:text:3xl xl:text-5xl" style={{ whiteSpace: 'nowrap' }}>
                    {renderWords()}{' '}
                </div>
            </motion.div>
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    repeatType: 'reverse',
                }}
                className={cn('block rounded-sm w-[4px] h-4 sm:h-6 xl:h-12 bg-gray-500', cursorClassName)}
            />
        </div>
    );
};

export default TypewriterEffect;
