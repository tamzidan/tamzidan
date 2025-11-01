import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaExternalLinkAlt, FaTimes, FaDownload } from 'react-icons/fa';
import { PiCodeBold } from 'react-icons/pi';
import { LuBadge } from 'react-icons/lu';
import { LiaLayerGroupSolid } from 'react-icons/lia';
import { renderTechIcon } from '@/utils/iconMapping';
import { portfolioApi, certificateApi, techStackApi } from '@/lib/api';

interface Portfolio {
    id: number;
    title: string;
    description: string;
    image: string;
    github_url?: string;
    live_url?: string;
    technologies: string[];
    category: string;
    featured: boolean;
}

interface Certificate {
    id: number;
    title: string;
    issuer: string;
    date: string;
    link: string;
    image: string;
    issue_date?: string;
    image_url?: string;
    pdf_url?: string;
}

interface TechItem {
    name: string;
    icon: string;
}

interface TechStack {
    [category: string]: TechItem[];
}

// HELPER COMPONENTS
interface LineShadowTextProps {
    children: React.ReactNode;
    className?: string;
    shadowColor?: string;
}

const LineShadowText: React.FC<LineShadowTextProps> = ({
    children,
    className = '',
    shadowColor = '#4079ff',
}) => {
    return (
        <motion.span
            style={{ '--shadow-color': shadowColor } as React.CSSProperties}
            className={`relative z-0 line-shadow-effect ${className}`}
            data-text={children}
        >
            {children}
        </motion.span>
    );
};

// CERTIFICATE CARD COMPONENT
interface CertificateCardProps {
    cert: Certificate;
    onClick: (cert: Certificate) => void;
}

const CertificateCard: React.FC<CertificateCardProps> = ({ cert, onClick }) => {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="group relative cursor-pointer"
            whileHover={{ y: -8 }}
            onClick={() => onClick(cert)}
        >
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-lg bg-white/5 backdrop-blur-sm border border-white/10 hover:border-gray-400/30 transition-all duration-500">
                <div className="absolute inset-0">
                    <img
                        src={cert.image}
                        alt={cert.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/60 to-slate-900/30 group-hover:from-slate-900/95 transition-all duration-500"></div>
                </div>
                <div className="absolute inset-0 p-5 flex flex-col justify-between">
                    <div className="flex-1 flex items-start justify-between">
                        <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
                            <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">
                                {cert.issuer}
                            </span>
                        </div>
                        <div className="bg-gray-500/20 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-400/30">
                            <span className="text-xs font-bold text-gray-300">{cert.date}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div>
                            <h3 className="text-lg sm:text-xl font-bold text-white line-clamp-2 leading-tight">
                                {cert.title}
                            </h3>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-slate-300">
                                <FaDownload className="text-sm" />
                                <span className="text-sm font-medium">View Certificate</span>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="bg-gray-500/20 backdrop-blur-md p-2 rounded-full border border-gray-400/30">
                                    <FaExternalLinkAlt className="text-gray-300 text-sm" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-500/0 via-transparent to-gray-500/0 group-hover:from-gray-500/10 group-hover:to-gray-500/10 transition-all duration-500"></div>
            </div>
        </motion.div>
    );
};

// CERTIFICATE PREVIEW MODAL
interface CertificatePreviewModalProps {
    certificate: Certificate | null;
    onClose: () => void;
}

const CertificatePreviewModal: React.FC<CertificatePreviewModalProps> = ({
    certificate,
    onClose,
}) => {
    if (!certificate) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="relative max-w-4xl w-full bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10">
                    <button
                        onClick={onClose}
                        className="bg-gray-500/20 hover:bg-gray-500/30 backdrop-blur-md p-3 rounded-full border border-gray-400/30 transition-all duration-300 group"
                    >
                        <FaTimes className="text-gray-300 group-hover:text-gray-200" />
                    </button>
                </div>
                <div className="p-6 sm:p-8">
                    <div className="mb-6">
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                                    {certificate.title}
                                </h2>
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="bg-gray-500/20 px-4 py-2 rounded-full text-gray-300 font-semibold border border-gray-400/30">
                                        {certificate.issuer}
                                    </span>
                                    <span className="bg-gray-500/20 px-4 py-2 rounded-full text-gray-300 font-semibold border border-gray-400/30">
                                        {certificate.date}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                        <img
                            src={certificate.image}
                            alt={certificate.title}
                            className="w-full h-auto max-h-[60vh] object-contain"
                        />
                    </div>
                    <div className="mt-6 flex justify-center">
                        <a
                            href={certificate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 flex items-center space-x-2 shadow-lg hover:shadow-gray-500/25"
                        >
                            <FaDownload className="group-hover:scale-110 transition-transform duration-300" />
                            <span>Download Certificate</span>
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

// PROJECT CARD COMPONENT
interface ProjectCardProps {
    project: Portfolio;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const projectLink = project.live_url || project.github_url || '#';

    return (
        <a
            href={projectLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative h-64 sm:h-72 rounded-2xl overflow-hidden transition-shadow duration-300 hover:shadow-lg hover:shadow-gray-500/30"
            style={{
                background: `url('${project.image}') center/cover no-repeat`,
                cursor: 'pointer',
            }}
        >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/60 transition-colors duration-300 flex flex-col justify-between p-4 sm:p-6 text-white">
                <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-300">{project.title}</h3>
                    <p className="text-slate-300 mt-2 text-xs sm:text-sm leading-relaxed">
                        {project.description}
                    </p>
                </div>
                <div className="flex items-end justify-between">
                    <div className="flex flex-wrap gap-2 mt-4">
                        {(project.technologies || []).map((t, i) => (
                            <span
                                key={i}
                                className="flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full bg-gray-900/70 text-gray-200 border border-gray-800/30 backdrop-blur-sm"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <FaExternalLinkAlt className="text-slate-300 group-hover:text-gray-200 transition-colors duration-300" />
                </div>
            </div>
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-gray-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 rounded-2xl border border-gray-300/10 pointer-events-none"></div>
        </a>
    );
};

// MAIN PROJECT SECTION COMPONENT
const ProjectSection: React.FC = () => {
    const [activeTab, setActiveTab] = useState('Projects');
    const [projectCategory, setProjectCategory] = useState('Web/Apps');
    const [previewCertificate, setPreviewCertificate] = useState<Certificate | null>(null);

    // === State untuk data dari database ===
    const [projects, setProjects] = useState<Portfolio[]>([]);
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [techStack, setTechStack] = useState<TechStack>({});
    const [isLoading, setIsLoading] = useState(true);

    // === Show More/Less ===
    const INITIAL_CERTIFICATES_TO_SHOW = 6;
    const [visibleCertificatesCount, setVisibleCertificatesCount] = useState(
        INITIAL_CERTIFICATES_TO_SHOW
    );

    // === Fetch data dari API ===
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Fetch Portfolios
                const portfoliosRes = await portfolioApi.getAll();
                setProjects(portfoliosRes.data.data || []);

                // Fetch Certificates
                const certificatesRes = await certificateApi.getAll();
                const formattedCerts = certificatesRes.data.data.map((cert: any) => ({
                    id: cert.id,
                    title: cert.title,
                    issuer: cert.issuer,
                    date: new Date(cert.issue_date).toLocaleDateString('id-ID', {
                        year: 'numeric',
                        month: 'short',
                    }),
                    link: cert.pdf_url || '#',
                    image: cert.image_url || '/placeholder-cert.jpg',
                }));
                setCertificates(formattedCerts);

                // Fetch Tech Stack
                const techStackRes = await techStackApi.getAll();
                const grouped = techStackRes.data.data.reduce((acc: TechStack, tech: any) => {
                    if (!acc[tech.category]) {
                        acc[tech.category] = [];
                    }
                    acc[tech.category].push({
                        name: tech.name,
                        icon: tech.icon,
                    });
                    return acc;
                }, {});
                setTechStack(grouped);
            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const tabs = [
        { id: 'Projects', label: 'Projects', icon: <PiCodeBold className="text-[1.7em] mb-1" /> },
        {
            id: 'Certificate',
            label: 'Certificates',
            icon: <LuBadge className="text-[1.5em] mb-1" />,
        },
        {
            id: 'Tech Stack',
            label: 'Tech Stack',
            icon: <LiaLayerGroupSolid className="text-[1.5em] mb-1" />,
        },
    ];

    const filteredProjects = projects.filter((p) => p.category === projectCategory);

    const handleShowMore = () => {
        setVisibleCertificatesCount(certificates.length);
    };

    const handleShowLess = () => {
        setVisibleCertificatesCount(INITIAL_CERTIFICATES_TO_SHOW);
    };

    return (
        <section id="project" className="py-20">
            <style>{`
        @keyframes line-shadow-anim { 0% { background-position: 0 0; } 100% { background-position: 100% 100%; } }
        .line-shadow-effect::after { content: attr(data-text); position: absolute; z-index: -1; left: 0.04em; top: 0.04em; background-image: linear-gradient(45deg, transparent 45%, var(--shadow-color) 45%, var(--shadow-color) 55%, transparent 0); background-size: 0.06em 0.06em; -webkit-background-clip: text; background-clip: text; color: transparent; animation: line-shadow-anim 30s linear infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center mb-20"
            >
                <h2 className="text-4xl font-bold font-moderniz">
                    <span style={{ color: '#888888' }}>
                        <LineShadowText shadowColor="#666666">PORTFOLIO</LineShadowText>
                    </span>{' '}
                    <span style={{ color: '#fff' }}>
                        <LineShadowText shadowColor="#bbbbbb">SHOWCASE</LineShadowText>
                    </span>
                </h2>
            </motion.div>

            <div className="w-full">
                <div className="flex justify-center mb-12">
                    <motion.div
                        layout
                        className="inline-flex w-full max-w-4xl rounded-3xl p-2 shadow-lg border border-slate-800 bg-gradient-to-r from-[#0a0a0a] via-[#1a1a1a] to-[#2a2a2a] backdrop-blur-md"
                        style={{
                            background: 'linear-gradient(90deg, #0a0a0a 0%, #1a1a1a 50%, #2a2a2a 100%)',
                            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                        }}
                    >
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex flex-1 flex-col items-center justify-center px-2 py-7 rounded-2xl font-semibold text-base transition-colors duration-300 outline-none ${
                                    activeTab === tab.id
                                        ? 'text-white'
                                        : 'text-slate-400 hover:text-gray-300'
                                }`}
                                whileTap={{ scale: 0.97 }}
                                whileHover={{ scale: 1.03 }}
                                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                                style={{ zIndex: 1, minWidth: 0 }}
                            >
                                {activeTab === tab.id && (
                                    <motion.span
                                        layoutId="tab-underline"
                                        className="absolute inset-0 bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] rounded-2xl"
                                        transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                                        style={{ zIndex: -1, opacity: 0.96 }}
                                    />
                                )}
                                <span className="relative z-10 flex flex-col items-center gap-2">
                                    {tab.icon}
                                    <span className="font-bold">{tab.label}</span>
                                </span>
                            </motion.button>
                        ))}
                    </motion.div>
                </div>

                <div
                    className="rounded-3xl p-0 md:p-6 shadow-xl border border-slate-800/60 mx-auto max-w-7xl bg-clip-padding"
                    style={{
                        background: 'rgba(20, 20, 20, 0.55)',
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.4)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        backdropFilter: 'blur(16px)',
                        WebkitBackdropFilter: 'blur(16px)',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ y: 10, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -10, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="p-6 md:p-10"
                        >
                            {activeTab === 'Projects' && (
                                <>
                                    <div className="flex justify-center gap-4 mb-8">
                                        <button
                                            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 border ${
                                                projectCategory === 'Web/Apps'
                                                    ? 'bg-gray-700/80 text-white border-gray-400 shadow-gray-500/10 shadow-lg'
                                                    : 'bg-slate-900/60 text-gray-200 border-slate-700 hover:bg-gray-800/40 hover:text-white'
                                            }`}
                                            onClick={() => setProjectCategory('Web/Apps')}
                                        >
                                            Web/Apps
                                        </button>
                                        <button
                                            className={`px-5 py-2 rounded-full font-semibold transition-all duration-200 border ${
                                                projectCategory === '3D Design'
                                                    ? 'bg-gray-700/80 text-white border-gray-400 shadow-gray-500/10 shadow-lg'
                                                    : 'bg-slate-900/60 text-gray-200 border-slate-700 hover:bg-gray-800/40 hover:text-white'
                                            }`}
                                            onClick={() => setProjectCategory('3D Design')}
                                        >
                                            3D Design
                                        </button>
                                    </div>
                                    {isLoading ? (
                                        <div className="col-span-full text-center text-slate-400 py-12">
                                            Loading projects...
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {filteredProjects.length > 0 ? (
                                                filteredProjects.map((p, i) => (
                                                    <ProjectCard key={i} project={p} />
                                                ))
                                            ) : (
                                                <div className="col-span-full text-center text-slate-400 py-12">
                                                    No projects in this category yet.
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                            {activeTab === 'Certificate' && (
                                <div className="space-y-8">
                                    {isLoading ? (
                                        <div className="text-center text-slate-400 py-12">
                                            Loading certificates...
                                        </div>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                                                <AnimatePresence>
                                                    {certificates
                                                        .slice(0, visibleCertificatesCount)
                                                        .map((cert, i) => (
                                                            <CertificateCard
                                                                key={cert.id || i}
                                                                cert={cert}
                                                                onClick={setPreviewCertificate}
                                                            />
                                                        ))}
                                                </AnimatePresence>
                                            </div>
                                            {certificates.length > INITIAL_CERTIFICATES_TO_SHOW && (
                                                <div className="flex justify-center mt-12">
                                                    {visibleCertificatesCount < certificates.length ? (
                                                        <motion.button
                                                            onClick={handleShowMore}
                                                            className="group bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Show More
                                                        </motion.button>
                                                    ) : (
                                                        <motion.button
                                                            onClick={handleShowLess}
                                                            className="group bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 px-8 py-3 rounded-full text-white font-semibold transition-all duration-300 shadow-lg"
                                                            whileHover={{ scale: 1.05 }}
                                                            whileTap={{ scale: 0.95 }}
                                                        >
                                                            Show Less
                                                        </motion.button>
                                                    )}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}
                            {activeTab === 'Tech Stack' && (
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {isLoading ? (
                                        <div className="text-center text-slate-400 py-12">
                                            Loading tech stack...
                                        </div>
                                    ) : Object.keys(techStack).length === 0 ? (
                                        <div className="text-center text-slate-400 py-12">
                                            No tech stack data available.
                                        </div>
                                    ) : (
                                        Object.entries(techStack).map(([category, techs]) => (
                                            <div key={category}>
                                                <h3 className="text-xl font-bold text-gray-300 capitalize mb-4 border-b-2 border-slate-800 pb-2">
                                                    {category}
                                                </h3>
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                                    {techs.map((tech, i) => (
                                                        <div
                                                            key={i}
                                                            className="flex flex-col items-center justify-center gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800 transition-all duration-300 hover:bg-slate-800/50 hover:border-gray-500/30"
                                                        >
                                                            <div className="text-4xl">
                                                                {renderTechIcon(tech.icon, 'text-4xl')}
                                                            </div>
                                                            <p className="text-sm text-slate-300">
                                                                {tech.name}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            <AnimatePresence>
                {previewCertificate && (
                    <CertificatePreviewModal
                        certificate={previewCertificate}
                        onClose={() => setPreviewCertificate(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default ProjectSection;
