import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaComments, FaTrash, FaEye, FaTimes, FaHeart, FaImage, FaEdit, FaSave, FaEyeSlash } from 'react-icons/fa';
import { commentApi } from '@/lib/api';

interface Comment {
    id: number;
    name: string;
    message: string;
    photo: string | null;
    likes: number;
    is_visible: boolean;
    created_at: string;
}

export const CommentsTab: React.FC = () => {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', message: '' });

    useEffect(() => {
        fetchComments();
    }, []);

    const fetchComments = async () => {
        setIsLoading(true);
        try {
            const response = await commentApi.getAll();
            setComments(response.data.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            await commentApi.delete(id);
            setComments(comments.filter((comment) => comment.id !== id));
            if (selectedComment?.id === id) {
                setShowDetailModal(false);
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
            alert('Failed to delete comment');
        }
    };

    const handleToggleVisibility = async (comment: Comment) => {
        try {
            await commentApi.update(comment.id, { is_visible: !comment.is_visible });
            setComments(
                comments.map((c) =>
                    c.id === comment.id ? { ...c, is_visible: !c.is_visible } : c
                )
            );
            if (selectedComment?.id === comment.id) {
                setSelectedComment({ ...selectedComment, is_visible: !selectedComment.is_visible });
            }
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment visibility');
        }
    };

    const handleViewDetail = (comment: Comment) => {
        setSelectedComment(comment);
        setShowDetailModal(true);
    };

    const handleStartEdit = (comment: Comment) => {
        setEditingId(comment.id);
        setEditForm({ name: comment.name, message: comment.message });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditForm({ name: '', message: '' });
    };

    const handleSaveEdit = async (id: number) => {
        try {
            await commentApi.update(id, editForm);
            setComments(
                comments.map((c) =>
                    c.id === id ? { ...c, name: editForm.name, message: editForm.message } : c
                )
            );
            setEditingId(null);
            setEditForm({ name: '', message: '' });
        } catch (error) {
            console.error('Error updating comment:', error);
            alert('Failed to update comment');
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
                    <p className="text-gray-400">Loading comments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Comments Management</h3>
                    <p className="text-gray-400">Manage user comments and their visibility</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm">
                        Total: <span className="text-white font-bold">{comments.length}</span>
                    </span>
                    <span className="text-gray-400 text-sm">
                        Visible:{' '}
                        <span className="text-green-400 font-bold">
                            {comments.filter((c) => c.is_visible).length}
                        </span>
                    </span>
                    <span className="text-gray-400 text-sm">
                        Hidden:{' '}
                        <span className="text-red-400 font-bold">
                            {comments.filter((c) => !c.is_visible).length}
                        </span>
                    </span>
                </div>
            </div>

            {comments.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <FaComments className="text-6xl text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-white mb-2">No Comments Yet</h3>
                        <p className="text-gray-400">User comments will appear here</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {comments.map((comment) => (
                        <motion.div
                            key={comment.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`bg-slate-800/50 backdrop-blur-xl rounded-2xl border ${
                                comment.is_visible ? 'border-green-500/50' : 'border-red-500/50'
                            } p-6 hover:border-gray-400/30 transition-all duration-300`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                        {comment.is_visible ? (
                                            <span className="text-xs bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/50">
                                                Visible
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/50">
                                                Hidden
                                            </span>
                                        )}
                                        <span className="text-xs text-gray-500">
                                            {formatDate(comment.created_at)}
                                        </span>
                                        <span className="flex items-center gap-1 text-xs text-gray-400">
                                            <FaHeart className="text-red-400" />
                                            {comment.likes}
                                        </span>
                                        {comment.photo && (
                                            <span className="flex items-center gap-1 text-xs text-blue-400">
                                                <FaImage />
                                                Photo
                                            </span>
                                        )}
                                    </div>

                                    {editingId === comment.id ? (
                                        <div className="space-y-3">
                                            <input
                                                type="text"
                                                value={editForm.name}
                                                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                                                placeholder="Name"
                                            />
                                            <textarea
                                                value={editForm.message}
                                                onChange={(e) => setEditForm({ ...editForm, message: e.target.value })}
                                                className="w-full px-3 py-2 bg-slate-900/50 border border-slate-600/50 rounded-lg text-white"
                                                rows={3}
                                                placeholder="Message"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleSaveEdit(comment.id)}
                                                    className="flex items-center gap-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 px-3 py-1 rounded-lg border border-green-500/50 text-sm"
                                                >
                                                    <FaSave />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex items-center gap-2 bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 px-3 py-1 rounded-lg border border-gray-500/50 text-sm"
                                                >
                                                    <FaTimes />
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <h4 className="text-lg font-bold text-white mb-2">{comment.name}</h4>
                                            <p className="text-gray-300 line-clamp-2">{comment.message}</p>
                                        </>
                                    )}
                                </div>

                                {editingId !== comment.id && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStartEdit(comment)}
                                            className="flex items-center gap-2 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 px-4 py-2 rounded-xl border border-yellow-500/50 hover:border-yellow-400/50 transition-all duration-300"
                                            title="Edit Comment"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            onClick={() => handleViewDetail(comment)}
                                            className="flex items-center gap-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-4 py-2 rounded-xl border border-blue-500/50 hover:border-blue-400/50 transition-all duration-300"
                                            title="View Details"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => handleToggleVisibility(comment)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                                                comment.is_visible
                                                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50 hover:border-red-400/50'
                                                    : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/50 hover:border-green-400/50'
                                            }`}
                                            title={comment.is_visible ? 'Hide Comment' : 'Show Comment'}
                                        >
                                            {comment.is_visible ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(comment.id)}
                                            className="flex items-center gap-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 px-4 py-2 rounded-xl border border-red-500/50 hover:border-red-400/50 transition-all duration-300"
                                            title="Delete Comment"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <AnimatePresence>
                {showDetailModal && selectedComment && (
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
                            <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 flex items-center justify-between border-b border-white/10">
                                <h3 className="text-2xl font-bold text-white">Comment Details</h3>
                                <button
                                    onClick={() => setShowDetailModal(false)}
                                    className="bg-slate-800/50 hover:bg-slate-700/50 p-2 rounded-full border border-slate-600/50 hover:border-gray-400/50 transition-all duration-300"
                                >
                                    <FaTimes className="text-slate-400 hover:text-gray-300" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <p className="text-white text-lg">{selectedComment.name}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Date
                                    </label>
                                    <p className="text-gray-300">
                                        {formatDate(selectedComment.created_at)}
                                    </p>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Visibility
                                        </label>
                                        {selectedComment.is_visible ? (
                                            <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full border border-green-500/50">
                                                Visible
                                            </span>
                                        ) : (
                                            <span className="text-sm bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/50">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Likes
                                        </label>
                                        <span className="flex items-center gap-2 text-white">
                                            <FaHeart className="text-red-400" />
                                            {selectedComment.likes}
                                        </span>
                                    </div>
                                </div>

                                {selectedComment.photo && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Attached Photo
                                        </label>
                                        <img
                                            src={selectedComment.photo}
                                            alt="Comment attachment"
                                            className="w-full max-w-md rounded-xl border border-white/10"
                                        />
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Message
                                    </label>
                                    <div className="bg-slate-800/50 border border-white/10 rounded-xl p-4">
                                        <p className="text-white whitespace-pre-wrap">
                                            {selectedComment.message}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        onClick={() => handleToggleVisibility(selectedComment)}
                                        className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
                                            selectedComment.is_visible
                                                ? 'bg-red-500/20 hover:bg-red-500/30 text-red-300 border-red-500/50 hover:border-red-400/50'
                                                : 'bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/50 hover:border-green-400/50'
                                        }`}
                                    >
                                        {selectedComment.is_visible ? 'Hide Comment' : 'Show Comment'}
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedComment.id);
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
