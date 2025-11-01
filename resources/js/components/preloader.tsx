import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, Instagram, Twitter, Youtube, Mail, Globe } from 'lucide-react';
import DotGrid from './background/dot-grid';
import { socialMediaApi } from '@/lib/api';

const socialIconMap: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    instagram: Instagram,
    twitter: Twitter,
    youtube: Youtube,
    email: Mail,
    website: Globe,
    tiktok: Instagram,
};

const getSocialIcon = (platform: string) => {
    const normalizedPlatform = platform.toLowerCase();
    return socialIconMap[normalizedPlatform] || Globe;
};

interface PreloaderProps {
    onFinished: () => void;
}

const Preloader: React.FC<PreloaderProps> = ({ onFinished }) => {
    const [typedText, setTypedText] = useState('');
    const [showContent, setShowContent] = useState(false);
    const [fadeOut, setFadeOut] = useState(false);
    const [socialLinks, setSocialLinks] = useState<any[]>([]);
    const fullText = 'tamzidan.com';

    useEffect(() => {
        const initialTimer = setTimeout(() => {
            setShowContent(true);
        }, 500);
        return () => clearTimeout(initialTimer);
    }, []);

    useEffect(() => {
        const fetchSocialMedia = async () => {
            try {
                const response = await socialMediaApi.getAll();
                const activeSocials = response.data.data
                    .filter((social: any) => social.is_active)
                    .sort((a: any, b: any) => a.display_order - b.display_order)
                    .slice(0, 3)
                    .map((social: any) => ({
                        name: social.name || social.platform,
                        platform: social.platform,
                        url: social.url,
                        Icon: getSocialIcon(social.platform),
                    }));
                setSocialLinks(activeSocials);
            } catch (error) {
                console.error('Failed to fetch social media:', error);
                setSocialLinks([]);
            }
        };

        fetchSocialMedia();
    }, []);

    useEffect(() => {
        if (showContent) {
            if (typedText.length < fullText.length) {
                const typingTimer = setTimeout(() => {
                    setTypedText(fullText.slice(0, typedText.length + 1));
                }, 120);
                return () => clearTimeout(typingTimer);
            } else if (typedText.length === fullText.length) {
                const exitTimer = setTimeout(() => {
                    setFadeOut(true);
                    setTimeout(onFinished, 1000);
                }, 2000);
                return () => clearTimeout(exitTimer);
            }
        }
    }, [typedText, showContent, fullText, onFinished]);

    return (
        <AnimatePresence>
            {!fadeOut && (
                <motion.div
                    exit={{
                        opacity: 0,
                        filter: 'blur(10px)',
                        transition: { duration: 1, ease: 'easeInOut' },
                    }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center text-white bg-[#060010]"
                >
                    <DotGrid />

                    {showContent && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeInOut' } }}
                            className="text-center relative z-10 p-4"
                        >
                            <motion.h1
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2, ease: 'easeOut' } }}
                                className="text-4xl md:text-6xl font-moderniz font-bold mb-4"
                            >
                                Tamzidan Mahdiyin
                            </motion.h1>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1, transition: { duration: 0.8, delay: 0.5 } }}
                                className="font-cascadia text-lg md:text-xl text-gray-400 mb-8 break-all"
                            >
                                <span>{typedText}</span>
                                <span className="animate-pulse">|</span>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.8 } }}
                                className="flex justify-center gap-6"
                            >
                                {socialLinks.length > 0 ? (
                                    socialLinks.map((social, index) => {
                                        const IconComponent = social.Icon;
                                        return (
                                            <a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="hover:text-[#888888] transition-all duration-300 transform hover:scale-110"
                                                aria-label={social.name}
                                            >
                                                <IconComponent size={32} />
                                            </a>
                                        );
                                    })
                                ) : (
                                    <span className="text-gray-500 text-sm">Loading...</span>
                                )}
                            </motion.div>
                        </motion.div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Preloader;
