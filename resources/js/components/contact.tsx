import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FaGithub,
    FaInstagram,
    FaTiktok,
    FaPaperPlane,
    FaUser,
    FaEnvelope,
    FaComment,
    FaCamera,
    FaHeart,
    FaReply,
    FaLinkedin,
    FaTwitter,
    FaYoutube,
    FaGlobe,
} from 'react-icons/fa';
import { SiTiktok, SiLinkedin } from 'react-icons/si';
import { socialMediaApi, contactApi, commentApi, uploadApi } from '@/lib/api';

// Icon mapping for social media platforms
const socialMediaIconMap: Record<string, any> = {
    FaGithub: FaGithub,
    FaInstagram: FaInstagram,
    FaTiktok: FaTiktok,
    SiTiktok: SiTiktok,
    FaLinkedin: FaLinkedin,
    SiLinkedin: SiLinkedin,
    FaTwitter: FaTwitter,
    FaYoutube: FaYoutube,
    FaEnvelope: FaEnvelope,
    FaGlobe: FaGlobe,
};

const renderSocialIcon = (iconName: string) => {
    const IconComponent = socialMediaIconMap[iconName];
    if (IconComponent) {
        return <IconComponent />;
    }
    return <span>{iconName || '='}</span>;
};

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

interface CommentFormData {
    name: string;
    message: string;
    photo: File | null;
    photoPreview: string | null;
}

interface Comment {
    id: number;
    name: string;
    message: string;
    photo: string;
    timestamp: string;
    likes: number;
}

interface SocialLink {
    name: string;
    icon: JSX.Element;
    url: string;
    color: string;
    hoverColor: string;
}

const Contact: React.FC = () => {
    const [contactForm, setContactForm] = useState<ContactFormData>({
        name: '',
        email: '',
        message: '',
    });
    const [isSubmittingContact, setIsSubmittingContact] = useState(false);

    const [commentForm, setCommentForm] = useState<CommentFormData>({
        name: '',
        message: '',
        photo: null,
        photoPreview: null,
    });
    const [comments, setComments] = useState<Comment[]>([]);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);
    const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
    const [isLoadingSocial, setIsLoadingSocial] = useState(true);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await commentApi.getAll();
                setComments(response.data.data || []);
            } catch (error) {
                console.error('Failed to fetch comments:', error);
            }
        };

        fetchComments();
    }, []);

    useEffect(() => {
        const fetchSocialMedia = async () => {
            setIsLoadingSocial(true);
            try {
                const response = await socialMediaApi.getAll();
                const activeSocials = response.data.data
                    .filter((social: any) => social.is_active)
                    .sort((a: any, b: any) => a.display_order - b.display_order)
                    .map((social: any) => ({
                        name: social.name || social.platform,
                        icon: renderSocialIcon(social.icon),
                        url: social.url,
                        color: 'from-gray-600 to-gray-800',
                        hoverColor: 'hover:shadow-gray-500/25',
                    }));
                setSocialLinks(activeSocials);
            } catch (error) {
                console.error('Failed to fetch social media:', error);
                setSocialLinks([]);
            } finally {
                setIsLoadingSocial(false);
            }
        };

        fetchSocialMedia();
    }, []);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmittingContact(true);

        try {
            await contactApi.create(contactForm);
            alert('Pesan berhasil dikirim! Terima kasih telah menghubungi saya.');
            setContactForm({ name: '', email: '', message: '' });
        } catch (error) {
            console.error('Failed to send message:', error);
            alert('Gagal mengirim pesan. Silakan coba lagi.');
        } finally {
            setIsSubmittingContact(false);
        }
    };

    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setCommentForm((prev) => ({
                    ...prev,
                    photo: file,
                    photoPreview: reader.result as string,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCommentSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentForm.name.trim() || !commentForm.message.trim()) return;

        setIsSubmittingComment(true);

        try {
            let photoUrl = null;

            // Upload photo first if exists
            if (commentForm.photo) {
                try {
                    const uploadResponse = await uploadApi.uploadCommentPhoto(commentForm.photo);
                    photoUrl = uploadResponse.data.data.url;
                } catch (uploadError) {
                    console.error('Failed to upload photo:', uploadError);
                    alert('Gagal mengupload foto. Komentar akan diposting tanpa foto.');
                }
            }

            // Then create comment with photo URL
            const commentData = {
                name: commentForm.name,
                message: commentForm.message,
                photo: photoUrl,
            };

            const response = await commentApi.create(commentData);
            const newComment = response.data.data;

            setComments([newComment, ...comments]);
            setCommentForm({ name: '', message: '', photo: null, photoPreview: null });
        } catch (error) {
            console.error('Failed to post comment:', error);
            alert('Gagal memposting komentar. Silakan coba lagi.');
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleLikeComment = async (commentId: number) => {
        try {
            await commentApi.like(commentId);
            const updatedComments = comments.map((comment) =>
                comment.id === commentId ? { ...comment, likes: comment.likes + 1 } : comment
            );
            setComments(updatedComments);
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    return (
        <section id="contact" className="py-20 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-gray-900/10 dark:from-black/20 dark:to-gray-900/10"></div>

            <div className="absolute top-20 left-10 w-20 h-20 bg-gray-500/10 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute bottom-20 right-10 w-32 h-32 bg-gray-400/10 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gray-600/10 rounded-full blur-xl animate-pulse delay-500"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-20 relative"
                >
                    <h2 className="text-5xl md:text-6xl font-bold font-moderniz mb-4">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-400 to-gray-600 bg-clip-text text-transparent">
                            GET IN
                        </span>{' '}
                        <span className="text-white dark:text-gray-200">TOUCH</span>
                    </h2>
                    <p className="text-xl text-slate-400 dark:text-slate-500 font-cascadia">
                        Mari berkolaborasi dan ciptakan sesuatu yang amazing!
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-slate-900/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 dark:border-gray-700/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-600 rounded-full">
                                        <FaPaperPlane className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white dark:text-gray-200">
                                            Hubungi Saya
                                        </h3>
                                        <p className="text-slate-400 dark:text-slate-500">
                                            Ada yang ingin didiskusikan? Kirim pesan ke saya!
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleContactSubmit} className="space-y-6">
                                    <div className="group">
                                        <div className="relative">
                                            <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-gray-400 transition-colors duration-300" />
                                            <input
                                                type="text"
                                                placeholder="Nama Anda"
                                                value={contactForm.name}
                                                onChange={(e) =>
                                                    setContactForm((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-600/50 dark:border-gray-700/50 rounded-xl text-white dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="relative">
                                            <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-gray-400 transition-colors duration-300" />
                                            <input
                                                type="email"
                                                placeholder="Email Anda"
                                                value={contactForm.email}
                                                onChange={(e) =>
                                                    setContactForm((prev) => ({
                                                        ...prev,
                                                        email: e.target.value,
                                                    }))
                                                }
                                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-600/50 dark:border-gray-700/50 rounded-xl text-white dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <div className="relative">
                                            <FaComment className="absolute left-4 top-6 text-slate-400 group-focus-within:text-gray-400 transition-colors duration-300" />
                                            <textarea
                                                placeholder="Pesan Anda"
                                                rows={4}
                                                value={contactForm.message}
                                                onChange={(e) =>
                                                    setContactForm((prev) => ({
                                                        ...prev,
                                                        message: e.target.value,
                                                    }))
                                                }
                                                className="w-full pl-12 pr-4 py-4 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-600/50 dark:border-gray-700/50 rounded-xl text-white dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300 resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmittingContact}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-gray-600 to-gray-600 hover:from-gray-500 hover:to-gray-500 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-gray-500/25 disabled:opacity-50"
                                    >
                                        {isSubmittingContact ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FaPaperPlane />
                                                <span>Kirim Pesan</span>
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                            <span className="text-slate-400 font-semibold">atau</span>
                            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                        </div>

                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-slate-900/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 dark:border-gray-700/50">
                                <h3 className="text-2xl font-bold text-white dark:text-gray-200 mb-6 text-center">
                                    Connect With Me
                                </h3>
                                {isLoadingSocial ? (
                                    <div className="text-center text-slate-400 py-8">
                                        Loading social media...
                                    </div>
                                ) : socialLinks.length === 0 ? (
                                    <div className="text-center text-slate-400 py-8">
                                        No social media links available.
                                    </div>
                                ) : (
                                    <div className="grid gap-4">
                                        {socialLinks.map((social, index) => (
                                            <motion.a
                                                key={social.name}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                initial={{ opacity: 0, y: 20 }}
                                                whileInView={{ opacity: 1, y: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                                whileHover={{ scale: 1.02, x: 10 }}
                                                className={`group flex items-center gap-4 p-4 bg-gradient-to-r ${social.color} rounded-xl text-white transition-all duration-300 ${social.hoverColor} hover:shadow-xl`}
                                            >
                                                <div className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                                    {social.icon}
                                                </div>
                                                <div className="flex-1">
                                                    <span className="font-semibold">{social.name}</span>
                                                    <p className="text-sm opacity-90">
                                                        Follow me on {social.name}
                                                    </p>
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <FaReply className="rotate-180" />
                                                </div>
                                            </motion.a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="space-y-8"
                    >
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-slate-900/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 dark:border-gray-700/50">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-3 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full">
                                        <FaComment className="text-white text-xl" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-bold text-white dark:text-gray-200">
                                            Leave a Comment
                                        </h3>
                                        <p className="text-slate-400 dark:text-slate-500">
                                            Share your thoughts!
                                        </p>
                                    </div>
                                </div>

                                <form onSubmit={handleCommentSubmit} className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="relative">
                                                <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden">
                                                    {commentForm.photoPreview ? (
                                                        <img
                                                            src={commentForm.photoPreview}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                                            <FaCamera />
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 bg-gray-600 text-white p-2 rounded-full cursor-pointer hover:bg-gray-500 transition-colors duration-300">
                                                    <FaCamera className="text-sm" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handlePhotoUpload}
                                                        className="hidden"
                                                    />
                                                </label>
                                            </div>
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <input
                                                type="text"
                                                placeholder="Your Name"
                                                value={commentForm.name}
                                                onChange={(e) =>
                                                    setCommentForm((prev) => ({
                                                        ...prev,
                                                        name: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-600/50 dark:border-gray-700/50 rounded-xl text-white dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300"
                                                required
                                            />
                                            <textarea
                                                placeholder="Write your comment..."
                                                rows={3}
                                                value={commentForm.message}
                                                onChange={(e) =>
                                                    setCommentForm((prev) => ({
                                                        ...prev,
                                                        message: e.target.value,
                                                    }))
                                                }
                                                className="w-full px-4 py-3 bg-slate-800/50 dark:bg-gray-800/50 border border-slate-600/50 dark:border-gray-700/50 rounded-xl text-white dark:text-gray-200 placeholder-slate-400 dark:placeholder-slate-500 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 transition-all duration-300 resize-none"
                                                required
                                            ></textarea>
                                        </div>
                                    </div>

                                    <motion.button
                                        type="submit"
                                        disabled={isSubmittingComment}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-gray-500/25 disabled:opacity-50"
                                    >
                                        {isSubmittingComment ? (
                                            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        ) : (
                                            <>
                                                <FaComment />
                                                <span>Post Comment</span>
                                            </>
                                        )}
                                    </motion.button>
                                </form>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h4 className="text-xl font-bold text-white dark:text-gray-200 flex items-center gap-2">
                                <FaComment className="text-gray-400" />
                                Comments ({comments.length})
                            </h4>

                            <div className="space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                                <AnimatePresence>
                                    {comments.map((comment, index) => (
                                        <motion.div
                                            key={comment.id}
                                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9, x: -100 }}
                                            transition={{ duration: 0.5, delay: index * 0.1 }}
                                            className="group relative bg-slate-800/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700/30 dark:border-gray-700/30 hover:border-gray-400/30 transition-all duration-300"
                                        >
                                            <div className="flex gap-4">
                                                <img
                                                    src={comment.photo}
                                                    alt={comment.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-600"
                                                />
                                                <div className="flex-1">
                                                    <div className="flex items-start justify-between">
                                                        <div>
                                                            <h5 className="font-semibold text-white dark:text-gray-200">
                                                                {comment.name}
                                                            </h5>
                                                            <p className="text-xs text-slate-400">
                                                                {new Date(comment.timestamp).toLocaleDateString(
                                                                    'id-ID',
                                                                    {
                                                                        year: 'numeric',
                                                                        month: 'long',
                                                                        day: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    }
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <p className="text-slate-300 dark:text-slate-400 mt-2 leading-relaxed">
                                                        {comment.message}
                                                    </p>
                                                    <div className="flex items-center gap-4 mt-4">
                                                        <button
                                                            onClick={() => handleLikeComment(comment.id)}
                                                            className="flex items-center gap-2 text-slate-400 hover:text-gray-300 transition-colors duration-300 group/like"
                                                        >
                                                            <FaHeart className="group-hover/like:scale-110 transition-transform duration-300" />
                                                            <span className="text-sm">{comment.likes}</span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>

                                {comments.length === 0 && (
                                    <div className="text-center py-12 text-slate-400">
                                        <FaComment className="text-4xl mx-auto mb-4 opacity-50" />
                                        <p>Belum ada komentar. Jadilah yang pertama!</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(51, 65, 85, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #6b7280, #4b5563);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #9ca3af, #6b7280);
        }
      `}</style>
        </section>
    );
};

export default Contact;
