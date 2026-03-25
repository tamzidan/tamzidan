import React from 'react';
import {
    FaReact,
    FaNodeJs,
    FaHtml5,
    FaCss3Alt,
    FaJsSquare,
    FaTools,
    FaFigma,
    FaGithub,
    FaPython,
    FaJava,
    FaPhp,
    FaDocker,
    FaAws,
    FaDatabase,
    FaCode,
    FaLaptopCode,
    FaInstagram,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
    FaEnvelope,
    FaTiktok,
    FaGlobe,
    FaLinux,
} from 'react-icons/fa';

import {
    SiTailwindcss,
    SiNextdotjs,
    SiVercel,
    SiMongodb,
    SiExpress,
    SiPostgresql,
    SiMysql,
    SiPrisma,
    SiTypescript,
    SiRedux,
    SiGraphql,
    SiGit,
    SiReact,
    SiJavascript,
    SiNodedotjs,
    SiGithub,
    SiDocker,
    SiFigma,
    SiPhp,
    SiLaravel,
    SiPython,
    SiDjango,
    SiHtml5,
    SiCss3,
    SiSass,
    SiBootstrap,
    SiVuedotjs,
    SiTiktok,
    SiLinkedin,
    SiLinux,
} from 'react-icons/si';

/**
 * Icon mapping untuk Tech Stack
 * Nama icon disimpan sebagai string di database,
 * kemudian di-render menggunakan mapping ini
 */
export const techStackIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // React Icons - Font Awesome
    FaReact: FaReact,
    FaNodeJs: FaNodeJs,
    FaHtml5: FaHtml5,
    FaCss3Alt: FaCss3Alt,
    FaJsSquare: FaJsSquare,
    FaTools: FaTools,
    FaFigma: FaFigma,
    FaGithub: FaGithub,
    FaPython: FaPython,
    FaJava: FaJava,
    FaPhp: FaPhp,
    FaDocker: FaDocker,
    FaAws: FaAws,
    FaDatabase: FaDatabase,
    FaCode: FaCode,
    FaLaptopCode: FaLaptopCode,
    FaLinux: FaLinux,

    // Simple Icons
    SiTailwindcss: SiTailwindcss,
    SiNextdotjs: SiNextdotjs,
    SiVercel: SiVercel,
    SiMongodb: SiMongodb,
    SiExpress: SiExpress,
    SiPostgresql: SiPostgresql,
    SiMysql: SiMysql,
    SiPrisma: SiPrisma,
    SiTypescript: SiTypescript,
    SiRedux: SiRedux,
    SiGraphql: SiGraphql,
    SiGit: SiGit,
    SiReact: SiReact,
    SiJavascript: SiJavascript,
    SiNodedotjs: SiNodedotjs,
    SiGithub: SiGithub,
    SiDocker: SiDocker,
    SiFigma: SiFigma,
    SiPhp: SiPhp,
    SiLaravel: SiLaravel,
    SiPython: SiPython,
    SiDjango: SiDjango,
    SiHtml5: SiHtml5,
    SiCss3: SiCss3,
    SiSass: SiSass,
    SiBootstrap: SiBootstrap,
    SiVuedotjs: SiVuedotjs,
    SiLinux: SiLinux,
};

/**
 * Social media icon mapping
 * Maps both React icon keys (FaGithub) and lowercase platform names (github)
 */
export const socialMediaIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    // React icon keys
    FaGithub: FaGithub,
    FaInstagram: FaInstagram,
    FaLinkedin: FaLinkedin,
    SiLinkedin: SiLinkedin,
    FaTwitter: FaTwitter,
    FaYoutube: FaYoutube,
    FaTiktok: FaTiktok,
    SiTiktok: SiTiktok,
    FaEnvelope: FaEnvelope,
    FaGlobe: FaGlobe,
    // Lowercase platform names (from seeder)
    github: FaGithub,
    instagram: FaInstagram,
    linkedin: FaLinkedin,
    twitter: FaTwitter,
    youtube: FaYoutube,
    tiktok: FaTiktok,
    email: FaEnvelope,
    globe: FaGlobe,
};

/**
 * Render social media icon berdasarkan icon name atau platform name
 */
export const renderSocialIcon = (
    iconName: string,
    className: string = 'h-6 w-6',
): JSX.Element => {
    const IconComponent = socialMediaIconMap[iconName] || socialMediaIconMap[iconName.toLowerCase()];
    if (IconComponent) {
        return <IconComponent className={className} />;
    }
    return <FaGlobe className={className} />;
};

/**
 * Icon suggestions berdasarkan tech name (lowercase)
 */
export const suggestIcon = (techName: string): string => {
    const name = techName.toLowerCase();

    const suggestions: Record<string, string> = {
        react: 'FaReact',
        next: 'SiNextdotjs',
        nextjs: 'SiNextdotjs',
        'next.js': 'SiNextdotjs',
        javascript: 'FaJsSquare',
        js: 'FaJsSquare',
        typescript: 'SiTypescript',
        ts: 'SiTypescript',
        node: 'FaNodeJs',
        nodejs: 'FaNodeJs',
        'node.js': 'FaNodeJs',
        html: 'FaHtml5',
        html5: 'FaHtml5',
        css: 'FaCss3Alt',
        css3: 'FaCss3Alt',
        tailwind: 'SiTailwindcss',
        tailwindcss: 'SiTailwindcss',
        mongodb: 'SiMongodb',
        mongo: 'SiMongodb',
        postgresql: 'SiPostgresql',
        postgres: 'SiPostgresql',
        mysql: 'SiMysql',
        prisma: 'SiPrisma',
        express: 'SiExpress',
        expressjs: 'SiExpress',
        git: 'SiGit',
        github: 'FaGithub',
        vercel: 'SiVercel',
        figma: 'FaFigma',
        docker: 'FaDocker',
        aws: 'FaAws',
        python: 'FaPython',
        java: 'FaJava',
        php: 'FaPhp',
        laravel: 'SiLaravel',
        django: 'SiDjango',
        redux: 'SiRedux',
        graphql: 'SiGraphql',
        sass: 'SiSass',
        bootstrap: 'SiBootstrap',
        vuejs: 'SiVuedotjs',
        'vue.js': 'SiVuedotjs',
        vue: 'SiVuedotjs',
        linux: 'FaLinux',
    };

    return suggestions[name] || 'FaCode';
};

/**
 * Render icon berdasarkan nama icon key atau lowercase tech name
 * Supports both 'FaReact' format and 'react' format
 */
export const renderTechIcon = (iconName: string, className: string = 'text-2xl'): JSX.Element => {
    // Direct lookup by React icon key (e.g., 'FaReact')
    if (techStackIconMap[iconName]) {
        const IconComponent = techStackIconMap[iconName];
        return <IconComponent className={className} />;
    }

    // Try resolving lowercase name via suggestIcon (e.g., 'html5' → 'FaHtml5')
    const suggested = suggestIcon(iconName);
    if (techStackIconMap[suggested]) {
        const IconComponent = techStackIconMap[suggested];
        return <IconComponent className={className} />;
    }

    // Fallback: render sebagai emoji atau text
    return <span className={className}>{iconName || '🔧'}</span>;
};

/**
 * Get available icon options untuk dropdown di form
 */
export const getIconOptions = () => {
    return Object.keys(techStackIconMap).map((iconName) => ({
        value: iconName,
        label: iconName.replace('Fa', '').replace('Si', ''),
        icon: iconName,
    }));
};
