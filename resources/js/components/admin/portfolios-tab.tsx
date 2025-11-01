import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBriefcase, FaPlus, FaEdit, FaTrash, FaTimes, FaStar, FaGithub, FaExternalLinkAlt, FaUpload, FaImage } from 'react-icons/fa';
import { portfolioApi, uploadApi } from '@/lib/api';

interface Portfolio {
    id: number;
    title: string;
    description: string;
    image: string | null;
    github_url: string | null;
    live_url: string | null;
    technologies: string[];
    category: string;
    featured: boolean;
    created_at: string;
}

const categories = ['Web/Apps', 'Mobile', '3D Design', 'Other'];

export const PortfoliosTab: React.FC = () => {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        image: '',
        github_url: '',
        live_url: '',
        technologies: [] as string[],
        category: 'Web/Apps',
        featured: false,
    });
    const [techInput, setTechInput] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        fetchPortfolios();
    }, []);

    const fetchPortfolios = async () => {
        setIsLoading(true);
        try {
            const response = await portfolioApi.getAll();
            setPortfolios(response.data.data);
        } catch (error) {
            console.error('Error fetching portfolios:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            image: '',
            github_url: '',
            live_url: '',
            technologies: [],
            category: 'Web/Apps',
            featured: false,
        });
        setTechInput('');
        setImageFile(null);
        setImagePreview(null);
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (portfolio: Portfolio) => {
        setFormData({
            title: portfolio.title,
            description: portfolio.description,
            image: portfolio.image || '',
            github_url: portfolio.github_url || '',
            live_url: portfolio.live_url || '',
            technologies: portfolio.technologies || [],
            category: portfolio.category,
            featured: portfolio.featured,
        });
        setImageFile(null);
        setImagePreview(portfolio.image);
        setEditingId(portfolio.id);
        setIsAdding(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsUploading(true);

        try {
            let imageUrl = formData.image;

            // Upload image first if there's a new file
            if (imageFile) {
                try {
                    const uploadResponse = await uploadApi.uploadImage(imageFile, 'portfolio');
                    imageUrl = uploadResponse.data.data.url;
                } catch (uploadError) {
                    console.error('Failed to upload image:', uploadError);
                    alert('Gagal mengupload gambar. Portfolio akan disimpan tanpa gambar baru.');
                }
            }

            const submitData = {
                ...formData,
                image: imageUrl || null,
                github_url: formData.github_url || null,
                live_url: formData.live_url || null,
            };

            if (editingId) {
                await portfolioApi.update(editingId, submitData);
            } else {
                await portfolioApi.create(submitData);
            }

            await fetchPortfolios();
            resetForm();
        } catch (error) {
            console.error('Error saving portfolio:', error);
            alert('Failed to save portfolio');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this portfolio?')) return;

        try {
            await portfolioApi.delete(id);
            setPortfolios(portfolios.filter((p) => p.id !== id));
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            alert('Failed to delete portfolio');
        }
    };

    const addTechnology = () => {
        if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
            setFormData({
                ...formData,
                technologies: [...formData.technologies, techInput.trim()],
            });
            setTechInput('');
        }
    };

    const removeTechnology = (tech: string) => {
        setFormData({
            ...formData,
            technologies: formData.technologies.filter((t) => t !== tech),
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading portfolios...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Portfolios Management</h3>
                    <p className="text-gray-400">Manage your project portfolio and showcase your work</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl border border-green-500/50 hover:border-green-400/50 transition-all duration-300"
                >
                    <FaPlus />
                    Add Portfolio
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
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-purple-500/50 p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Portfolio' : 'Add New Portfolio'}
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
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Category <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description <span className="text-red-400">*</span>
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                rows={3}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Portfolio Image
                            </label>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600/50 rounded-xl cursor-pointer hover:border-purple-400/50 transition-all bg-slate-900/50">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            {imagePreview ? (
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="h-24 object-contain rounded-lg"
                                                />
                                            ) : (
                                                <>
                                                    <FaUpload className="text-3xl text-gray-400 mb-2" />
                                                    <p className="text-sm text-gray-400">
                                                        Click to upload image
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        PNG, JPG, GIF, WebP (max 5MB)
                                                    </p>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>
                                {imagePreview && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImageFile(null);
                                            setImagePreview(null);
                                            setFormData({ ...formData, image: '' });
                                        }}
                                        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-xl border border-red-500/50 transition-all"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    GitHub URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.github_url}
                                    onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    placeholder="https://github.com/..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Live URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.live_url}
                                    onChange={(e) => setFormData({ ...formData, live_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Technologies
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={techInput}
                                    onChange={(e) => setTechInput(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                                    className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all"
                                    placeholder="Add technology (press Enter)"
                                />
                                <button
                                    type="button"
                                    onClick={addTechnology}
                                    className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 rounded-xl border border-purple-500/50 transition-all"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.technologies.map((tech) => (
                                    <span
                                        key={tech}
                                        className="flex items-center gap-2 px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full border border-purple-500/50 text-sm"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTechnology(tech)}
                                            className="hover:text-white"
                                        >
                                            <FaTimes className="text-xs" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-600 text-purple-500 focus:ring-purple-500"
                            />
                            <label htmlFor="featured" className="text-sm text-gray-300 flex items-center gap-2">
                                <FaStar className="text-yellow-400" />
                                Mark as Featured
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                disabled={isUploading}
                                className="flex-1 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 px-4 py-3 rounded-xl border border-purple-500/50 hover:border-purple-400/50 transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-purple-300 border-t-transparent rounded-full animate-spin"></div>
                                        <span>Uploading...</span>
                                    </>
                                ) : (
                                    <span>{editingId ? 'Update Portfolio' : 'Create Portfolio'}</span>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                disabled={isUploading}
                                className="px-4 py-3 bg-slate-700/50 hover:bg-slate-600/50 text-gray-300 rounded-xl border border-slate-600/50 transition-all disabled:opacity-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            {/* Portfolios Grid */}
            {portfolios.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaBriefcase className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Portfolios Yet</h3>
                        <p className="text-gray-400">Add your first portfolio project to get started</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolios.map((portfolio) => (
                        <motion.div
                            key={portfolio.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-purple-400/30 transition-all duration-300"
                        >
                            {portfolio.image && (
                                <img
                                    src={portfolio.image}
                                    alt={portfolio.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <h4 className="text-lg font-bold text-white flex-1">{portfolio.title}</h4>
                                    {portfolio.featured && (
                                        <FaStar className="text-yellow-400 flex-shrink-0" />
                                    )}
                                </div>

                                <span className="inline-block px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/50">
                                    {portfolio.category}
                                </span>

                                <p className="text-gray-400 text-sm line-clamp-2">{portfolio.description}</p>

                                {portfolio.technologies && portfolio.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {portfolio.technologies.slice(0, 3).map((tech) => (
                                            <span
                                                key={tech}
                                                className="px-2 py-1 bg-slate-700/50 text-gray-300 rounded text-xs"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                        {portfolio.technologies.length > 3 && (
                                            <span className="px-2 py-1 bg-slate-700/50 text-gray-300 rounded text-xs">
                                                +{portfolio.technologies.length - 3}
                                            </span>
                                        )}
                                    </div>
                                )}

                                <div className="flex gap-2 pt-2">
                                    {portfolio.github_url && (
                                        <a
                                            href={portfolio.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                                        >
                                            <FaGithub />
                                        </a>
                                    )}
                                    {portfolio.live_url && (
                                        <a
                                            href={portfolio.live_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                                        >
                                            <FaExternalLinkAlt />
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-2 border-t border-white/10">
                                    <button
                                        onClick={() => handleEdit(portfolio)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 text-sm"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(portfolio.id)}
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
