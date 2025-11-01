import React, { useState, useEffect } from 'react';
import Preloader from '@/components/preloader';
import Header from '@/components/header';
import Squares from '@/components/background/squares';
import TextGenerateEffect from '@/components/text-generate-effect';
import LoopingGradientText from '@/components/animations/gradient-text';
import Skills from '@/components/skills';
import { motion } from 'framer-motion';
import {
    FaGithub,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
    FaEnvelope,
    FaTiktok,
    FaGlobe,
} from 'react-icons/fa';
import { SiTiktok, SiLinkedin } from 'react-icons/si';
import { VelocityScroll } from '@/components/animations/velocity-scroll';
import About from '@/components/about';
import ProjectSection from '@/components/projects';
import Contact from '@/components/contact';
import { socialMediaApi } from '@/lib/api';
import AdminLogin from '@/components/admin/admin-login';
import AdminDashboard from '@/components/admin/admin-dashboard';
import { isAuthenticated } from '@/lib/auth';

// Icon mapping for social media platforms
const socialIconMap: Record<string, any> = {
    FaGithub: FaGithub,
    FaInstagram: FaInstagram,
    FaLinkedin: FaLinkedin,
    SiLinkedin: SiLinkedin,
    FaTwitter: FaTwitter,
    FaYoutube: FaYoutube,
    FaEnvelope: FaEnvelope,
    FaTiktok: FaTiktok,
    SiTiktok: SiTiktok,
    FaGlobe: FaGlobe,
};

// Function to render social icon based on icon name
const renderSocialIcon = (iconName: string) => {
    const IconComponent = socialIconMap[iconName];
    if (IconComponent) {
        return <IconComponent className="h-6 w-6 text-slate-400 transition-all duration-300 group-hover:text-gray-300" />;
    }
    return <FaGlobe className="h-6 w-6 text-slate-400 transition-all duration-300 group-hover:text-gray-300" />;
};

interface SocialLink {
    name: string;
    platform: string;
    url: string;
    icon: string;
}

export default function HomePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isLoadingSocial, setIsLoadingSocial] = useState(true);
    const [showAdminLogin, setShowAdminLogin] = useState(false);
    const [showAdminDashboard, setShowAdminDashboard] = useState(false);
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

    const handlePreloaderFinish = () => {
        setIsLoading(false);
    };

    useEffect(() => {
        setIsAdminAuthenticated(isAuthenticated());
    }, []);

    const handleAdminClick = () => {
        if (isAuthenticated()) {
            setShowAdminDashboard(true);
        } else {
            setShowAdminLogin(true);
        }
    };

    const handleLoginSuccess = () => {
        setShowAdminLogin(false);
        setIsAdminAuthenticated(true);
        setShowAdminDashboard(true);
    };

    const handleDashboardClose = () => {
        setShowAdminDashboard(false);
        setIsAdminAuthenticated(isAuthenticated());
    };

    useEffect(() => {
        const fetchSocialMedia = async () => {
            setIsLoadingSocial(true);
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
                        icon: social.icon,
                    }));
                setSocialLinks(activeSocials);
            } catch (error) {
                console.error('Failed to fetch social media:', error);
                setSocialLinks([]);
            } finally {
                setIsLoadingSocial(false);
            }
        };

        fetchSocialMedia();
    }, []);

    return (
        <>
            {isLoading && <Preloader onFinished={handlePreloaderFinish} />}

            {!isLoading && (
                <div className="relative min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text overflow-hidden">
                    {/* BACKGROUND ANIMASI */}
                    <div className="absolute inset-0 z-0">
                        <Squares
                            speed={0.3}
                            squareSize={35}
                            direction="diagonal"
                            borderColor="rgba(255, 255, 255, 0.07)"
                            hoverFillColor="rgba(13, 13, 58, 0.45)"
                        />
                    </div>

                    {/* HEADER */}
                    <Header
                        onAdminClick={handleAdminClick}
                        isAuthenticated={isAdminAuthenticated}
                    />

                    <section className="py-20">
                        <VelocityScroll
                            defaultVelocity={2}
                            className="font-moderniz text-4xl font-bold text-light-heading dark:text-dark-heading"
                        >
                            WELCOMEdWELCOMEdWELCOMEdWELCOMEdWELCOMEdWELCOMEdWELCOME
                        </VelocityScroll>
                    </section>

                    {/* MAIN CONTENT */}
                    <main className="relative z-10 px-8 max-w-7xl mx-auto">
                        {/* HERO SECTION */}
                        <section
                            id="home"
                            className="flex flex-col md:flex-row items-center gap-10 pt-20 pb-16 lg:pt-0 lg:pb-20 mt-16 mb-16"
                        >
                            {/* TEXT BLOCK */}
                            <div className="flex-1 text-light-text dark:text-dark-text space-y-6 pt-16 md:pt-40 order-last md:order-none">
                                <motion.h1
                                    initial={{ opacity: 0, x: -60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.25, ease: 'easeOut' }}
                                    className="text-4xl md:text-4xl font-moderniz font-bold leading-tight select-none text-light-heading text-white dark:text-white dark:text-dark-heading"
                                    style={{
                                        textShadow: `2px 2px 0 var(--tw-shadow-color-1), 4px 4px 0 var(--tw-shadow-color-2), 0 4px 12px var(--tw-shadow-color-3), 0 1px 0 var(--tw-shadow-color-4)`,
                                    }}
                                >
                                    Hello, I'am
                                    <span style={{ display: 'block', marginTop: '0.4em' }}>
                                        Tamzidan Mahdiyin
                                    </span>
                                </motion.h1>
                                <motion.div
                                    initial={{ opacity: 0, x: 60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.7, delay: 0.4, ease: 'easeOut' }}
                                >
                                    <LoopingGradientText
                                        colors={[
                                            '#303131ff',
                                            '#464a53ff',
                                            '#303131ff',
                                            '#464a53ff',
                                            '#303131ff',
                                        ]}
                                        animationSpeed={3}
                                        className="custom-class font-cascadia font-bold"
                                    />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 0.55, ease: 'easeOut' }}
                                >
                                    <TextGenerateEffect words="I craft responsive and visually engaging websites using React, Tailwind CSS, and modern web technologies." />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7, delay: 0.7, ease: 'easeOut' }}
                                >
                                    <Skills />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.7, delay: 1.0, ease: 'easeOut' }}
                                    className="flex flex-row gap-4 mt-8"
                                >
                                    {isLoadingSocial ? (
                                        <span className="text-slate-400 text-sm">Loading...</span>
                                    ) : socialLinks.length > 0 ? (
                                        socialLinks.map((social, index) => (
                                            <a
                                                key={index}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                aria-label={`${social.name} Profile`}
                                                className="group relative flex h-12 w-12 items-center justify-center rounded-full border border-slate-700 bg-slate-900/[0.8] text-white transition-all duration-300 hover:border-gray-400 hover:bg-slate-800 hover:shadow-[0_0_24px_2px_#888888]"
                                            >
                                                {renderSocialIcon(social.icon)}
                                            </a>
                                        ))
                                    ) : null}
                                </motion.div>
                            </div>

                            {/* IMAGE BLOCK */}
                            <div className="flex-1 flex items-center justify-center order-first md:order-last">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
                                    className="relative w-full max-w-md h-96 flex items-center justify-center"
                                >
                                    <div className="w-full h-full flex items-center justify-center">
                                        <img
                                            src="/assets/images/tamzidan.jpg"
                                            alt="Tamzidan Mahdiyin"
                                            width={300}
                                            height={300}
                                            className="rounded-full border-4 border-gray-400 shadow-[0_0_24px_2px_#888888]"
                                        />
                                    </div>
                                </motion.div>
                            </div>
                        </section>

                        <About />

                        {/* PROJECT SECTION */}
                        <div className="py-16 mt-16">
                            <ProjectSection />
                        </div>

                        {/* CONTACT SECTION */}
                        <Contact />
                    </main>

                    <VelocityScroll
                        defaultVelocity={2}
                        className="font-moderniz text-4xl font-bold text-light-heading dark:text-dark-heading"
                    >
                        GOODBYEdGOODBYEdGOODBYEdGOODBYEdGOODBYEdGOODBYE
                    </VelocityScroll>
                </div>
            )}

            {/* Admin Modals */}
            <AdminLogin
                isOpen={showAdminLogin}
                onClose={() => setShowAdminLogin(false)}
                onSuccess={handleLoginSuccess}
            />
            <AdminDashboard
                isOpen={showAdminDashboard}
                onClose={handleDashboardClose}
            />
        </>
    );
}
