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
};

/**
 * Render icon berdasarkan nama atau emoji
 * @param iconName - Nama icon (e.g., 'FaReact') atau emoji
 * @param className - CSS classes
 * @returns Rendered icon
 */
export const renderTechIcon = (iconName: string, className: string = 'text-2xl'): JSX.Element => {
    // Jika iconName adalah komponen React Icon
    if (techStackIconMap[iconName]) {
        const IconComponent = techStackIconMap[iconName];
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

/**
 * Icon suggestions berdasarkan tech name
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
        redux: 'SiRedux',
        graphql: 'SiGraphql',
    };

    return suggestions[name] || 'FaCode';
};
