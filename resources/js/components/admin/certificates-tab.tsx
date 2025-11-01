import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCertificate, FaPlus, FaEdit, FaTrash, FaTimes, FaFilePdf, FaImage } from 'react-icons/fa';
import { certificateApi } from '@/lib/api';

interface Certificate {
    id: number;
    title: string;
    issuer: string;
    description: string | null;
    image_url: string | null;
    pdf_url: string | null;
    issue_date: string;
    created_at: string;
}

export const CertificatesTab: React.FC = () => {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        description: '',
        image_url: '',
        pdf_url: '',
        issue_date: '',
    });

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        setIsLoading(true);
        try {
            const response = await certificateApi.getAll();
            setCertificates(response.data.data);
        } catch (error) {
            console.error('Error fetching certificates:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            issuer: '',
            description: '',
            image_url: '',
            pdf_url: '',
            issue_date: '',
        });
        setIsAdding(false);
        setEditingId(null);
    };

    const handleEdit = (certificate: Certificate) => {
        setFormData({
            title: certificate.title,
            issuer: certificate.issuer,
            description: certificate.description || '',
            image_url: certificate.image_url || '',
            pdf_url: certificate.pdf_url || '',
            issue_date: certificate.issue_date.split('T')[0],
        });
        setEditingId(certificate.id);
        setIsAdding(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const submitData = {
                ...formData,
                description: formData.description || null,
                image_url: formData.image_url || null,
                pdf_url: formData.pdf_url || null,
            };

            if (editingId) {
                await certificateApi.update(editingId, submitData);
            } else {
                await certificateApi.create(submitData);
            }

            await fetchCertificates();
            resetForm();
        } catch (error) {
            console.error('Error saving certificate:', error);
            alert('Failed to save certificate');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this certificate?')) return;

        try {
            await certificateApi.delete(id);
            setCertificates(certificates.filter((c) => c.id !== id));
        } catch (error) {
            console.error('Error deleting certificate:', error);
            alert('Failed to delete certificate');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading certificates...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Certificates Management</h3>
                    <p className="text-gray-400">Manage your certifications and achievements</p>
                </div>
                <button
                    onClick={() => {
                        resetForm();
                        setIsAdding(true);
                    }}
                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-4 py-2 rounded-xl border border-green-500/50 hover:border-green-400/50 transition-all duration-300"
                >
                    <FaPlus />
                    Add Certificate
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
                        className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-yellow-500/50 p-6 space-y-4"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-xl font-bold text-white">
                                {editingId ? 'Edit Certificate' : 'Add New Certificate'}
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
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Issuer <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.issuer}
                                    onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Description
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                rows={3}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Image URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.image_url}
                                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    PDF URL
                                </label>
                                <input
                                    type="url"
                                    value={formData.pdf_url}
                                    onChange={(e) => setFormData({ ...formData, pdf_url: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Issue Date <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="date"
                                    value={formData.issue_date}
                                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                    className="w-full px-4 py-2 bg-slate-900/50 border border-slate-600/50 rounded-xl text-white focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <button
                                type="submit"
                                className="flex-1 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-3 rounded-xl border border-yellow-500/50 hover:border-yellow-400/50 transition-all duration-300 font-medium"
                            >
                                {editingId ? 'Update Certificate' : 'Create Certificate'}
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

            {/* Certificates Grid */}
            {certificates.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaCertificate className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Certificates Yet</h3>
                        <p className="text-gray-400">Add your first certificate to showcase your achievements</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {certificates.map((certificate) => (
                        <motion.div
                            key={certificate.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:border-yellow-400/30 transition-all duration-300"
                        >
                            {certificate.image_url && (
                                <img
                                    src={certificate.image_url}
                                    alt={certificate.title}
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-6 space-y-3">
                                <h4 className="text-lg font-bold text-white">{certificate.title}</h4>
                                <p className="text-yellow-400 text-sm font-medium">{certificate.issuer}</p>

                                {certificate.description && (
                                    <p className="text-gray-400 text-sm line-clamp-2">{certificate.description}</p>
                                )}

                                <p className="text-gray-500 text-xs">
                                    Issued: {formatDate(certificate.issue_date)}
                                </p>

                                {certificate.pdf_url && (
                                    <a
                                        href={certificate.pdf_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        <FaFilePdf />
                                        View Certificate
                                    </a>
                                )}

                                <div className="flex gap-2 pt-2 border-t border-white/10">
                                    <button
                                        onClick={() => handleEdit(certificate)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300 text-sm"
                                    >
                                        <FaEdit />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(certificate.id)}
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
