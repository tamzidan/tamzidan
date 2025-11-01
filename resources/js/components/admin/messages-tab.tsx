import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaTrash, FaEye, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { contactMessageApi } from '@/lib/api';

interface Message {
    id: number;
    name: string;
    email: string;
    message: string;
    status: string;
    created_at: string;
}

export const MessagesTab: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setIsLoading(true);
        try {
            const response = await contactMessageApi.getAll();
            setMessages(response.data.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactMessageApi.delete(id);
            setMessages(messages.filter((msg) => msg.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
            alert('Failed to delete message');
        }
    };

    const handleMarkAsRead = async (message: Message) => {
        try {
            await contactMessageApi.update(message.id, { status: 'read' });
            setMessages(
                messages.map((msg) => (msg.id === message.id ? { ...msg, status: 'read' } : msg))
            );
        } catch (error) {
            console.error('Error updating message:', error);
            alert('Failed to update message status');
        }
    };

    const handleViewDetail = (message: Message) => {
        setSelectedMessage(message);
        setShowDetailModal(true);
        if (message.status === 'unread') {
            handleMarkAsRead(message);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-gray-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">Loading messages...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Contact Messages</h3>
                    <p className="text-gray-400">Manage and respond to contact form submissions</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                        Total: <span className="text-white font-bold">{messages.length}</span>
                    </span>
                    <span className="text-gray-400 text-sm">
                        Unread:{' '}
                        <span className="text-yellow-400 font-bold">
                            {messages.filter((msg) => msg.status === 'unread').length}
                        </span>
                    </span>
                </div>
            </div>

            {messages.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaEnvelope className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Messages Yet</h3>
                        <p className="text-gray-400">Contact form submissions will appear here</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {messages.map((message) => (
                        <motion.div
                            key={message.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl border ${
                                message.status === 'unread'
                                    ? 'border-yellow-500/50'
                                    : 'border-white/10'
                            } p-6 hover:border-gray-400/30 transition-all duration-300`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {message.status === 'unread' ? (
                                            <span className="flex items-center gap-1 text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/50">
                                                <FaExclamationCircle />
                                                Unread
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-1 text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/50">
                                                <FaCheckCircle />
                                                Read
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {formatDate(message.created_at)}
                                        </span>
                                    </div>
                                    <h4 className="text-lg font-bold text-white mb-2">{message.name}</h4>
                                    <p className="text-gray-400 text-sm mb-2">{message.email}</p>
                                    <p className="text-gray-300 line-clamp-2">{message.message}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleViewDetail(message)}
                                        className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300"
                                        title="View Details"
                                    >
                                        <FaEye />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(message.id)}
                                        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-500/50 hover:border-red-400/50 transition-all duration-300"
                                        title="Delete Message"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedMessage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[10000] p-4"
                        onClick={() => setShowDetailModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-2xl bg-slate-900/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 flex items-center justify-between border-b border-white/10">
                                <h3 className="text-2xl font-bold text-white">Message Details</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full border border-slate-600/50 hover:border-gray-400/50 transition-all duration-300"
                                >
                                    <FaTimes className="text-slate-400 hover:text-gray-300" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <p className="text-white text-lg">{selectedMessage.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Email
                                    </label>
                                    <a
                                        href={`mailto:${selectedMessage.email}`}
                                        className="text-blue-400 hover:text-blue-300 underline"
                                    >
                                        {selectedMessage.email}
                                    </a>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Date
                                    </label>
                                    <p className="text-gray-300">
                                        {formatDate(selectedMessage.created_at)}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Status
                                    </label>
                                    {selectedMessage.status === 'unread' ? (
                                        <span className="flex items-center gap-1 text-sm bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full border border-yellow-500/50 w-fit">
                                            <FaExclamationCircle />
                                            Unread
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/50 w-fit">
                                            <FaCheckCircle />
                                            Read
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Message
                                    </label>
                                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                                        <p className="text-white whitespace-pre-wrap">
                                            {selectedMessage.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <a
                                        href={`mailto:${selectedMessage.email}?subject=Re: Your message&body=Hi ${selectedMessage.name},%0A%0A`}
                                        className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-3 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300"
                                    >
                                        <FaEnvelope />
                                        Reply via Email
                                    </a>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedMessage.id);
                                            setShowDetailModal(false);
                                        }}
                                        className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-3 rounded-xl border border-red-500/50 hover:border-red-400/50 transition-all duration-300"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
