import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaShareAlt,
    FaPlus,
    FaEdit,
    FaTrash,
    FaTimes,
    FaCheckCircle,
    FaCircle,
    FaGithub,
    FaLinkedin,
    FaInstagram,
    FaTwitter,
    FaYoutube,
    FaEnvelope,
    FaGlobe,
    FaTiktok,
} from 'react-icons/fa';
import { socialMediaApi } from '@/lib/api';

interface SocialMedia {
    id: number;
    platform: string;
    name: string;
    url: string;
    icon: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

const platforms = [
    { value: 'github', label: 'GitHub', icon: FaGithub },
    { value: 'linkedin', label: 'LinkedIn', icon: FaLinkedin },
    { value: 'instagram', label: 'Instagram', icon: FaInstagram },
    { value: 'twitter', label: 'Twitter', icon: FaTwitter },
    { value: 'youtube', label: 'YouTube', icon: FaYoutube },
    { value: 'email', label: 'Email', icon: FaEnvelope },
    { value: 'tiktok', label: 'TikTok', icon: FaTiktok },
    { value: 'website', label: 'Website', icon: FaGlobe },
];

export const SocialMediaTab: React.FC = () => {
    const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        platform: 'github',
        name: '',
        url: '',
        icon: 'FaGithub',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchSocialMedia();
    }, []);

    const fetchSocialMedia = async () => {
        setIsLoading(true);
        try {
            const response = await socialMediaApi.getAll();
            setSocialMedia(response.data.data);
        } catch (error) {
            console.error('Error fetching social media:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            platform: 'github',
            name: '',
            url: '',
            icon: 'FaGithub',
            display_order: 0,
            is_active: true,
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (social: SocialMedia) => {
        setFormData({
            platform: social.platform,
            name: social.name,
            url: social.url,
            icon: social.icon,
            display_order: social.display_order,
            is_active: social.is_active,
        });
        setEditingId(social.id);
        setIsAdding(false);
    };

    const handlePlatformChange = (platform: string) => {
        const platformData = platforms.find((p) => p.value === platform);
        if (platformData) {
            setFormData({
                ...formData,
                platform,
                icon: platformData.icon.name,
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (editingId) {
                await socialMediaApi.update(editingId, formData);
            } else {
                await socialMediaApi.create(formData);
            }

            await fetchSocialMedia();
            resetForm();
        } catch (error) {
            console.error('Error saving social media:', error);
            alert('Failed to save social media');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this social media link?')) return;

        try {
            await socialMediaApi.delete(id);
            setSocialMedia(socialMedia.filter((s) => s.id !== id));
        } catch (error) {
            console.error('Error deleting social media:', error);
            alert('Failed to delete social media');
        }
    };

    const renderPlatformIcon = (iconName: string) => {
        const platform = platforms.find((p) => p.icon.name === iconName);
        if (platform) {
            const IconComponent = platform.icon;
            return <IconComponent className="text-2xl" />;
        }
        return <FaGlobe className="text-2xl" />;
    };

    const getPlatformColor = (platform: string) => {
        const colors: Record<string, string> = {
            github: 'from-gray-700 to-gray-800',
            linkedin: 'from-blue-600 to-blue-700',
            instagram: 'from-pink-600 to-purple-600',
            twitter: 'from-blue-400 to-blue-500',
            youtube: 'from-red-600 to-red-700',
            email: 'from-green-600 to-green-700',
            tiktok: 'from-black to-gray-900',
            website: 'from-indigo-600 to-indigo-700',
        };
        return colors[platform] || 'from-gray-600 to-gray-700';
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading social media...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Social Media Management</h3>
                    <p className="text-gray-400">Manage your social media profiles and contact links</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl border border-green-500/50 hover:border-green-400/50 transition-all duration-300"
                >
                    <FaPlus />
                    Add Social Link
                </button>
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-blue-500/50 p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Social Media' : 'Add New Social Media'}
                            </h4>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="text-gray-400 hover:text-white"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Platform <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.platform}
                                    onChange={(e) => handlePlatformChange(e.target.value)}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                    required
                                >
                                    {platforms.map((platform) => (
                                        <option key={platform.value} value={platform.value}>
                                            {platform.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Display Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                    placeholder="My GitHub"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                URL <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="url"
                                value={formData.url}
                                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                placeholder="https://..."
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Display Order
                            </label>
                            <input
                                type="number"
                                value={formData.display_order}
                                onChange={(e) =>
                                    setFormData({ ...formData, display_order: parseInt(e.target.value) })
                                }
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active_social"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-600 text-blue-500 focus:ring-blue-500"
                            />
                            <label htmlFor="is_active_social" className="text-sm text-gray-300 flex items-center gap-2">
                                <FaCheckCircle className="text-blue-400" />
                                Active
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 font-medium"
                            >
                                {editingId ? 'Update Social Media' : 'Create Social Media'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-xl border border-slate-600/50 transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Social Media Grid */}
            {socialMedia.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaShareAlt className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Social Media Links Yet</h3>
                        <p className="text-gray-400">Add your first social media profile</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {socialMedia
                        .sort((a, b) => a.display_order - b.display_order)
                        .map((social) => (
                            <motion.div
                                key={social.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-blue-400/30 transition-all duration-300"
                            >
                                <div className="flex flex-col items-center text-center space-y-4">
                                    <div
                                        className={`w-16 h-16 bg-gradient-to-br ${getPlatformColor(
                                            social.platform
                                        )} rounded-xl flex items-center justify-center text-white`}
                                    >
                                        {renderPlatformIcon(social.icon)}
                                    </div>

                                    <div className="w-full">
                                        <h4 className="text-lg font-bold text-white mb-1">{social.name}</h4>
                                        <p className="text-gray-400 text-xs capitalize mb-2">{social.platform}</p>
                                        <a
                                            href={social.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:text-blue-300 text-sm break-all line-clamp-1"
                                        >
                                            {social.url}
                                        </a>
                                    </div>

                                    <div className="flex items-center gap-3 text-xs">
                                        {social.is_active ? (
                                            <span className="flex items-center gap-1 text-green-400">
                                                <FaCheckCircle />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-gray-500">
                                                <FaCircle />
                                                Inactive
                                            </span>
                                        )}
                                        <span className="text-gray-500">Order: {social.display_order}</span>
                                    </div>

                                    <div className="flex gap-2 pt-2 w-full border-t border-white/10">
                                        <button
                                            onClick={() => handleEdit(social)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 text-sm"
                                        >
                                            <FaEdit />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(social.id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-2 rounded-xl border border-red-500/50 hover:border-red-400/50 transition-all duration-300 text-sm"
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                </div>
            )}
        </div>
    );
};
