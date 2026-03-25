import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaShieldAlt } from 'react-icons/fa';

const CLIP_PATH = 'polygon(0 0, 100% 0, 100% 80%, 68% 80%, 64% 100%, 36% 100%, 32% 80%, 0 80%)';

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => (
    <li>
        <a
            href={href}
            className="relative block text-light-text dark:text-dark-text font-[Rubik] font-bold text-base tracking-wider py-2 transition-transform duration-300 hover:scale-110 group"
        >
            {children}
            <span className="absolute bottom-1 left-0 block h-[2px] w-0 bg-[#888888] transition-all duration-500 group-hover:w-full"></span>
        </a>
    </li>
);

interface HeaderProps {
    isNavbarVisible?: boolean;
    onAdminClick?: () => void;
    isAuthenticated?: boolean;
}

const Header: React.FC<HeaderProps> = ({
    isNavbarVisible = true,
    onAdminClick,
    isAuthenticated = false,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAdminAccess = () => {
        if (onAdminClick) {
            onAdminClick();
        }
    };

    return (
        <>
            <AnimatePresence>
                {isNavbarVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: -60 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -60 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="fixed top-0 left-0 w-full z-50 pointer-events-none"
                    >
                        {/* Drop Shadow Gradient Animated */}
                        {!isScrolled && (
                            <div
                                className="pointer-events-none absolute left-0 right-0 z-10 from-gray-400 via-gray-300 to-gray-500 dark:from-gray-700 dark:via-gray-600 dark:to-gray-800"
                                style={{
                                    top: '0',
                                    height: '90px',
                                    WebkitClipPath: CLIP_PATH,
                                    clipPath: CLIP_PATH,
                                    background: 'linear-gradient(90deg, var(--tw-gradient-stops))',
                                    backgroundSize: '300% 100%',
                                    animation: 'gradientShadowMove 6s linear infinite',
                                    opacity: 1,
                                    filter: 'drop-shadow(0 16px 24px rgba(128,128,128,0.35))',
                                }}
                            ></div>
                        )}

                        {/* Navbar */}
                        <header
                            className={`pt-3 pb-3 relative z-20 pointer-events-auto transition-all duration-300 ${
                                isScrolled
                                    ? 'glassmorphism-header'
                                    : 'bg-light-navbar dark:bg-dark-navbar'
                            }`}
                            style={{
                                WebkitClipPath: CLIP_PATH,
                                clipPath: CLIP_PATH,
                                ...(isScrolled
                                    ? {
                                          backgroundColor: 'var(--tw-bg-opacity-71)',
                                          backdropFilter: 'blur(7px) saturate(180%)',
                                          WebkitBackdropFilter: 'blur(7px) saturate(180%)',
                                          border: '1px solid rgba(255,255,255,0.125)',
                                      }
                                    : {}),
                            }}
                        >
                            {/* =========== REFACTORED NAVIGATION =========== */}
                            <nav className="container mx-auto flex items-center justify-between flex-wrap pb-4 px-4">
                                {/* --- MOBILE HEADER --- */}
                                <div className="w-full flex items-center justify-between md:hidden">
                                    {/* Mobile: Brand Logo & Text (Left) */}
                                    <a href="#home" className="flex items-center gap-3">
                                        <div>
                                            <h1 className="font-moderniz text-sm text-gray-400 dark:text-gray-300 whitespace-nowrap">
                                                Tamzidan Mahdiyin
                                            </h1>
                                            <p
                                                className="font-moderniz text-[9px] text-gray-700 dark:text-gray-600"
                                                style={{
                                                    textShadow:
                                                        '0.5px 0.5px 0 #888888, -0.5px -0.5px 0 #888888, 0.5px -0.5px 0 #888888, -0.5px 0.5px 0 #888888',
                                                }}
                                            >
                                                Let's see the awesome Experience
                                            </p>
                                        </div>
                                    </a>
                                    {/* Mobile: Hamburger Button (Right) */}
                                    <button
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="text-gray-400 dark:text-gray-300 text-3xl pointer-events-auto"
                                    >
                                        &#9776;
                                    </button>
                                </div>

                                {/* --- DESKTOP HEADER --- */}
                                <div className="hidden w-full md:flex items-center justify-around">
                                    {/* Desktop: Left Navigation */}
                                    <ul className="flex items-center list-none gap-x-20">
                                        <NavLink href="#home">Home</NavLink>
                                        <NavLink href="#about">About</NavLink>
                                    </ul>

                                    {/* Desktop: Center Logo & Text */}
                                    <a href="#home" className="flex items-center gap-3">
                                        <div className="block">
                                            <h1 className="font-moderniz text-base text-gray-400 dark:text-gray-300">
                                                Tamzidan Mahdiyin
                                            </h1>
                                            <p
                                                className="font-moderniz text-[10px] text-gray-700 dark:text-gray-600"
                                                style={{
                                                    textShadow:
                                                        '0.5px 0.5px 0 #888888, -0.5px -0.5px 0 #888888, 0.5px -0.5px 0 #888888, -0.5px 0.5px 0 #888888',
                                                }}
                                            >
                                                Let's see the awesome Experience
                                            </p>
                                        </div>
                                    </a>

                                    {/* Desktop: Right Navigation & Admin Button */}
                                    <div className="flex items-center gap-4">
                                        <ul className="flex items-center list-none gap-16">
                                            <NavLink href="#project">Project</NavLink>
                                            <NavLink href="#contact">Contact</NavLink>
                                        </ul>
                                        <button
                                            onClick={handleAdminAccess}
                                            className="flex items-center gap-2 text-slate-400 hover:text-gray-300 transition-colors duration-300 pointer-events-auto"
                                            title={isAuthenticated ? 'Admin Dashboard' : 'Admin Login'}
                                        >
                                            <FaShieldAlt
                                                className={`text-lg ${
                                                    isAuthenticated ? 'text-gray-400' : 'text-slate-400'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                {/* --- MOBILE DROPDOWN MENU --- */}
                                <AnimatePresence>
                                    {isMenuOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.4, ease: 'easeInOut' }}
                                            className="w-full basis-full md:hidden"
                                        >
                                            {/* This is the list that now appears in a row */}
                                            <ul className="flex flex-row flex-wrap justify-center items-center gap-x-8 gap-y-3 mt-4 list-none">
                                                <NavLink href="#home">Home</NavLink>
                                                <NavLink href="#about">About</NavLink>
                                                <NavLink href="#project">Project</NavLink>
                                                <NavLink href="#contact">Contact</NavLink>
                                                <li>
                                                    <button
                                                        onClick={handleAdminAccess}
                                                        className="flex items-center gap-2 text-slate-400 hover:text-gray-300 transition-colors duration-300"
                                                    >
                                                        <FaShieldAlt
                                                            className={`text-lg ${
                                                                isAuthenticated
                                                                    ? 'text-gray-400'
                                                                    : 'text-slate-400'
                                                            }`}
                                                        />
                                                        <span>Admin</span>
                                                    </button>
                                                </li>
                                            </ul>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </nav>
                        </header>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animasi gradient keyframes */}
            <style>
                {`
          @keyframes gradientShadowMove {
            0% { background-position: 0% 50%; }
            100% { background-position: 100% 50%; }
          }

          html {
            scroll-behavior: smooth;
          }
        `}
            </style>
        </>
    );
};

export default Header;
