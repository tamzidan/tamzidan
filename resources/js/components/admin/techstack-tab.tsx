import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaPlus, FaEdit, FaTrash, FaTimes, FaCheckCircle, FaCircle } from 'react-icons/fa';
import {
    SiReact, SiNextdotjs, SiTypescript, SiJavascript, SiTailwindcss,
    SiNodedotjs, SiExpress, SiMysql, SiMongodb, SiPostgresql,
    SiGit, SiGithub, SiDocker, SiFigma,
    SiPhp, SiLaravel, SiPython, SiDjango,
    SiHtml5, SiCss3, SiSass, SiBootstrap, SiVuedotjs,
} from 'react-icons/si';
import { techStackApi } from '@/lib/api';

interface TechStack {
    id: number;
    name: string;
    category: string;
    icon: string;
    proficiency: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

const categories = ['frontend', 'backend', 'database', 'tools', 'other'];
const proficiencies = ['beginner', 'intermediate', 'advanced', 'expert'];

// Icon mapping - sama seperti di Next.js
const iconOptions = [
    { name: 'SiReact', component: SiReact, label: 'React' },
    { name: 'SiNextdotjs', component: SiNextdotjs, label: 'Next.js' },
    { name: 'SiTypescript', component: SiTypescript, label: 'TypeScript' },
    { name: 'SiJavascript', component: SiJavascript, label: 'JavaScript' },
    { name: 'SiTailwindcss', component: SiTailwindcss, label: 'Tailwind CSS' },
    { name: 'SiNodedotjs', component: SiNodedotjs, label: 'Node.js' },
    { name: 'SiExpress', component: SiExpress, label: 'Express' },
    { name: 'SiMysql', component: SiMysql, label: 'MySQL' },
    { name: 'SiMongodb', component: SiMongodb, label: 'MongoDB' },
    { name: 'SiPostgresql', component: SiPostgresql, label: 'PostgreSQL' },
    { name: 'SiGit', component: SiGit, label: 'Git' },
    { name: 'SiGithub', component: SiGithub, label: 'GitHub' },
    { name: 'SiDocker', component: SiDocker, label: 'Docker' },
    { name: 'SiFigma', component: SiFigma, label: 'Figma' },
    // { name: 'SiVisualstudiocode', component: SiVisualstudiocode, label: 'VS Code' },
    { name: 'SiPhp', component: SiPhp, label: 'PHP' },
    { name: 'SiLaravel', component: SiLaravel, label: 'Laravel' },
    { name: 'SiPython', component: SiPython, label: 'Python' },
    { name: 'SiDjango', component: SiDjango, label: 'Django' },
    // { name: 'SiJava', component: SiJava, label: 'Java' },
    { name: 'SiHtml5', component: SiHtml5, label: 'HTML5' },
    { name: 'SiCss3', component: SiCss3, label: 'CSS3' },
    { name: 'SiSass', component: SiSass, label: 'Sass' },
    { name: 'SiBootstrap', component: SiBootstrap, label: 'Bootstrap' },
    { name: 'SiVuedotjs', component: SiVuedotjs, label: 'Vue.js' },
];

// Emoji fallback icons
const emojiIcons = ['⚛️', '🟨', '🔷', '🐘', '🐍', '☕', '🎨', '🛠️', '📱', '💻', '🌐', '⚙️'];

export const TechStackTab: React.FC = () => {
    const [techStacks, setTechStacks] = useState<TechStack[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [formData, setFormData] = useState({
        name: '',
        category: 'frontend',
        icon: 'SiReact',
        proficiency: 'intermediate',
        display_order: 0,
        is_active: true,
    });

    useEffect(() => {
        fetchTechStacks();
    }, []);

    const fetchTechStacks = async () => {
        setIsLoading(true);
        try {
            const response = await techStackApi.getAll();
            setTechStacks(response.data.data);
        } catch (error) {
            console.error('Error fetching tech stacks:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            category: 'frontend',
            icon: 'SiReact',
            proficiency: 'intermediate',
            display_order: 0,
            is_active: true,
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (tech: TechStack) => {
        setFormData({
            name: tech.name,
            category: tech.category,
            icon: tech.icon,
            proficiency: tech.proficiency || 'intermediate',
            display_order: tech.display_order,
            is_active: tech.is_active,
        });
        setEditingId(tech.id);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const submitData = {
                ...formData,
                proficiency: formData.proficiency || null,
            };

            if (editingId) {
                await techStackApi.update(editingId, submitData);
            } else {
                await techStackApi.create(submitData);
            }

            await fetchTechStacks();
            resetForm();
        } catch (error) {
            console.error('Error saving tech stack:', error);
            alert('Failed to save tech stack');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this tech stack?')) return;

        try {
            await techStackApi.delete(id);
            setTechStacks(techStacks.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting tech stack:', error);
            alert('Failed to delete tech stack');
        }
    };

    const renderIcon = (iconName: string) => {
        const iconOption = iconOptions.find((opt) => opt.name === iconName);
        if (iconOption) {
            const IconComponent = iconOption.component;
            return <IconComponent className="text-2xl" />;
        }
        // Check if it's an emoji
        if (emojiIcons.includes(iconName)) {
            return <span className="text-2xl">{iconName}</span>;
        }
        return <span className="text-2xl">🔧</span>;
    };

    const getProficiencyColor = (proficiency: string | null) => {
        switch (proficiency) {
            case 'beginner':
                return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
            case 'intermediate':
                return 'bg-green-500/20 text-green-400 border-green-500/50';
            case 'advanced':
                return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
            case 'expert':
                return 'bg-red-500/20 text-red-400 border-red-500/50';
            default:
                return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
        }
    };

    const filteredTechStacks =
        filterCategory === 'all'
            ? techStacks
            : techStacks.filter((tech) => tech.category === filterCategory);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading tech stacks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Tech Stack Management</h3>
                    <p className="text-gray-400">Manage your technology skills and tools</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl border border-green-500/50 hover:border-green-400/50 transition-all duration-300"
                >
                    <FaPlus />
                    Add Tech Stack
                </button>
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={() => setFilterCategory('all')}
                    className={`px-4 py-2 rounded-xl transition-all ${
                        filterCategory === 'all'
                            ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                            : 'bg-slate-800/50 text-gray-400 border border-slate-600/50 hover:border-gray-400/30'
                    }`}
                >
                    All
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-4 py-2 rounded-xl transition-all capitalize ${
                            filterCategory === cat
                                ? 'bg-green-500/30 text-green-300 border border-green-500/50'
                                : 'bg-slate-800/50 text-gray-400 border border-slate-600/50 hover:border-gray-400/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Add/Edit Form */}
            <AnimatePresence>
                {(isAdding || editingId) && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-green-500/50 p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Tech Stack' : 'Add New Tech Stack'}
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
                                    Name <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
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
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                                    required
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat} className="capitalize">
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Icon <span className="text-red-400">*</span>
                                </label>
                                <select
                                    value={formData.icon}
                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                                    required
                                >
                                    <optgroup label="React Icons">
                                        {iconOptions.map((icon) => (
                                            <option key={icon.name} value={icon.name}>
                                                {icon.label}
                                            </option>
                                        ))}
                                    </optgroup>
                                    <optgroup label="Emoji Icons">
                                        {emojiIcons.map((emoji) => (
                                            <option key={emoji} value={emoji}>
                                                {emoji} Emoji
                                            </option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Preview
                                </label>
                                <div className="flex items-center justify-center h-10 bg-slate-900/50 border border-slate-600/50 rounded-xl">
                                    {renderIcon(formData.icon)}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Proficiency
                                </label>
                                <select
                                    value={formData.proficiency}
                                    onChange={(e) => setFormData({ ...formData, proficiency: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                                >
                                    {proficiencies.map((prof) => (
                                        <option key={prof} value={prof} className="capitalize">
                                            {prof}
                                        </option>
                                    ))}
                                </select>
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
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="w-4 h-4 rounded border-slate-600 text-green-500 focus:ring-green-500"
                            />
                            <label htmlFor="is_active" className="text-sm text-gray-300 flex items-center gap-2">
                                <FaCheckCircle className="text-green-400" />
                                Active
                            </label>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-3 rounded-xl border border-green-500/50 hover:border-green-400/50 transition-all duration-300 font-medium"
                            >
                                {editingId ? 'Update Tech Stack' : 'Create Tech Stack'}
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

            {/* Tech Stacks Grid */}
            {filteredTechStacks.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaCode className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">
                            {filterCategory === 'all' ? 'No Tech Stacks Yet' : `No ${filterCategory} items`}
                        </h3>
                        <p className="text-gray-400">Add your first technology to showcase your skills</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredTechStacks.map((tech) => (
                        <motion.div
                            key={tech.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:border-green-400/30 transition-all duration-300"
                        >
                            <div className="flex flex-col items-center text-center space-y-3">
                                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center text-white">
                                    {renderIcon(tech.icon)}
                                </div>

                                <h4 className="text-lg font-bold text-white">{tech.name}</h4>

                                <div className="flex flex-wrap gap-2 justify-center">
                                    <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-xs border border-green-500/50 capitalize">
                                        {tech.category}
                                    </span>
                                    {tech.proficiency && (
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs border capitalize ${getProficiencyColor(
                                                tech.proficiency
                                            )}`}
                                        >
                                            {tech.proficiency}
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 text-xs">
                                    {tech.is_active ? (
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
                                    <span className="text-gray-500">Order: {tech.display_order}</span>
                                </div>

                                <div className="flex gap-2 pt-2 w-full border-t border-white/10">
                                    <button
                                        onClick={() => handleEdit(tech)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 text-sm"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(tech.id)}
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
