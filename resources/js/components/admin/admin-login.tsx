import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaLock, FaTimes, FaShieldAlt } from 'react-icons/fa';
import { authApi } from '@/lib/auth';

interface AdminLoginProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await authApi.login({ email, password });
            if (response.success) {
                onSuccess();
                setEmail('');
                setPassword('');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid credentials');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

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
                    className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full border border-slate-600/50 hover:border-gray-400/50 transition-all duration-300"
                    >
                        <FaTimes className="text-slate-400 hover:text-gray-300" />
                    </button>

                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-600 to-gray-700 p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
                            <FaShieldAlt className="text-white text-3xl" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Admin Login</h2>
                        <p className="text-gray-200 text-sm">Enter your credentials to access the admin panel</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-300 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}

                        {/* Email Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-gray-400 transition-colors duration-300" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="admin@admin.com"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="group">
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-gray-400 transition-colors duration-300" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <motion.button
                            type="submit"
                            disabled={isLoading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-gray-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Logging in...</span>
                                </div>
                            ) : (
                                'Login'
                            )}
                        </motion.button>

                        {/* Info */}
                        <div className="text-center text-xs text-slate-400">
                            <p>Default credentials:</p>
                            <p className="font-mono mt-1">
                                admin@admin.com / admin123
                            </p>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default AdminLogin;
