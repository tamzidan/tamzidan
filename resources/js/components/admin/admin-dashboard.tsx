import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaTimes,
    FaEnvelope,
    FaComments,
    FaBriefcase,
    FaCertificate,
    FaCode,
    FaShareAlt,
    FaSignOutAlt,
    FaUser,
    FaChartBar,
} from 'react-icons/fa';
import { authApi, getUser } from '@/lib/auth';
import type { User } from '@/lib/auth';
import { MessagesTab } from './messages-tab';
import { CommentsTab } from './comments-tab';
import { PortfoliosTab } from './portfolios-tab';
import { CertificatesTab } from './certificates-tab';
import { TechStackTab } from './techstack-tab';
import { SocialMediaTab } from './socialmedia-tab';
import {
    contactMessageApi,
    commentApi,
    portfolioApi,
    certificateApi,
    techStackApi,
    socialMediaApi,
} from '@/lib/api';

interface AdminDashboardProps {
    isOpen: boolean;
    onClose: () => void;
}

type TabType = 'overview' | 'messages' | 'comments' | 'portfolios' | 'certificates' | 'techstack' | 'social';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');
    const [user, setUser] = useState<User | null>(null);
    const [stats, setStats] = useState({
        messages: 0,
        comments: 0,
        portfolios: 0,
        certificates: 0,
        techStacks: 0,
        socialMedia: 0,
    });

    useEffect(() => {
        if (isOpen) {
            const currentUser = getUser();
            setUser(currentUser);
            fetchStats();
        }
    }, [isOpen]);

    const fetchStats = async () => {
        try {
            const [
                messagesRes,
                commentsRes,
                portfoliosRes,
                certificatesRes,
                techStacksRes,
                socialMediaRes,
            ] = await Promise.all([
                contactMessageApi.getAll(),
                commentApi.getAll(),
                portfolioApi.getAll(),
                certificateApi.getAll(),
                techStackApi.getAll(),
                socialMediaApi.getAll(),
            ]);

            setStats({
                messages: messagesRes.data.data.length,
                comments: commentsRes.data.data.length,
                portfolios: portfoliosRes.data.data.length,
                certificates: certificatesRes.data.data.length,
                techStacks: techStacksRes.data.data.length,
                socialMedia: socialMediaRes.data.data.length,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const handleLogout = async () => {
        try {
            await authApi.logout();
            onClose();
            window.location.reload();
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    if (!isOpen) return null;

    const tabs = [
        { id: 'overview' as const, label: 'Overview', icon: FaChartBar },
        { id: 'messages' as const, label: 'Messages', icon: FaEnvelope, count: stats.messages },
        { id: 'comments' as const, label: 'Comments', icon: FaComments, count: stats.comments },
        { id: 'portfolios' as const, label: 'Portfolios', icon: FaBriefcase, count: stats.portfolios },
        { id: 'certificates' as const, label: 'Certificates', icon: FaCertificate, count: stats.certificates },
        { id: 'techstack' as const, label: 'Tech Stack', icon: FaCode, count: stats.techStacks },
        { id: 'social' as const, label: 'Social Media', icon: FaShareAlt, count: stats.socialMedia },
    ];

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[9999] p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative w-full max-w-7xl h-[90vh] bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 flex items-center justify-between border-b border-white/10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                                <FaUser className="text-white text-xl" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white">Admin Dashboard</h2>
                                <p className="text-gray-200 text-sm">{user?.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-500/50 hover:border-red-400/50 transition-all duration-300"
                            >
                                <FaSignOutAlt />
                                <span>Logout</span>
                            </button>
                            <button
                                onClick={onClose}
                                className="bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full border border-slate-600/50 hover:border-gray-400/50 transition-all duration-300"
                            >
                                <FaTimes className="text-slate-400 hover:text-gray-300" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="bg-slate-800/50 border-b border-white/10 px-6 overflow-x-auto">
                        <div className="flex gap-2 min-w-max">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;

                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            relative flex items-center gap-2 px-6 py-4 transition-all duration-300
                                            ${isActive
                                                ? 'text-white'
                                                : 'text-gray-400 hover:text-gray-300'
                                            }
                                        `}
                                    >
                                        <Icon className="text-lg" />
                                        <span className="font-medium">{tab.label}</span>
                                        {tab.count !== undefined && tab.count > 0 && (
                                            <span className="bg-gray-500 text-white text-xs px-2 py-1 rounded-full">
                                                {tab.count}
                                            </span>
                                        )}

                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-400 to-gray-500"
                                                initial={false}
                                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto p-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="h-full"
                            >
                                {activeTab === 'overview' && <OverviewTab stats={stats} />}
                                {activeTab === 'messages' && <MessagesTab />}
                                {activeTab === 'comments' && <CommentsTab />}
                                {activeTab === 'portfolios' && <PortfoliosTab />}
                                {activeTab === 'certificates' && <CertificatesTab />}
                                {activeTab === 'techstack' && <TechStackTab />}
                                {activeTab === 'social' && <SocialMediaTab />}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// Overview Tab Component
const OverviewTab: React.FC<{ stats: any }> = ({ stats }) => {
    const statCards = [
        { label: 'Contact Messages', value: stats.messages, icon: FaEnvelope, color: 'from-blue-500 to-blue-600' },
        { label: 'Comments', value: stats.comments, icon: FaComments, color: 'from-green-500 to-green-600' },
        { label: 'Portfolios', value: stats.portfolios, icon: FaBriefcase, color: 'from-purple-500 to-purple-600' },
        { label: 'Certificates', value: stats.certificates, icon: FaCertificate, color: 'from-yellow-500 to-yellow-600' },
        { label: 'Tech Stack Items', value: stats.techStacks, icon: FaCode, color: 'from-red-500 to-red-600' },
        { label: 'Social Media Links', value: stats.socialMedia, icon: FaShareAlt, color: 'from-pink-500 to-pink-600' },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-2xl font-bold text-white mb-2">Dashboard Overview</h3>
                <p className="text-gray-400">Quick statistics and overview of your portfolio content</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-gray-400/30 transition-all duration-300"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                                    <Icon className="text-white text-xl" />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                                <p className="text-3xl font-bold text-white">{stat.value}</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default AdminDashboard;
