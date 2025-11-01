import React from 'react';
import { motion } from 'framer-motion';
import {
    FaCode,
    FaLaptopCode,
    FaDatabase,
    FaPalette,
    FaRocket,
    FaGraduationCap,
    FaBriefcase,
    FaHeart,
    FaGamepad,
    FaMusic,
    FaCamera,
    FaBook,
} from 'react-icons/fa';

// ===================================
// DATA ABOUT - MUDAH DIKELOLA
// ===================================

// Informasi Pribadi
const personalInfo = {
    name: 'Tamzidan Mahdiyin',
    title: 'Full Stack Developer & 3D Designer',
    bio: 'Saya adalah seorang developer yang passionate dalam menciptakan solusi digital yang inovatif dan user-friendly. Dengan pengalaman di bidang web development dan 3D design, saya selalu berusaha untuk terus belajar dan berkembang.',
    tagline: 'Turning ideas into reality through code and design',
    image: '/assets/images/tamzidan.jpg', // Sesuaikan dengan path gambar Anda
    location: 'Indonesia',
    email: 'tamzidan01@gmail.com', // Sesuaikan
    yearsOfExperience: 2,
};

// Statistik
const stats = [
    {
        icon: <FaCode />,
        value: '50+',
        label: 'Projects Completed',
        color: 'text-white',
    },
    {
        icon: <FaBriefcase />,
        value: `${personalInfo.yearsOfExperience}+`,
        label: 'Years Experience',
        color: 'text-gray-300',
    },
    {
        icon: <FaGraduationCap />,
        value: '13+',
        label: 'Certificates',
        color: 'text-gray-400',
    },
    {
        icon: <FaRocket />,
        value: '100%',
        label: 'Client Satisfaction',
        color: 'text-gray-200',
    },
];

// Skills berdasarkan kategori
const skillCategories = [
    {
        title: 'Frontend Development',
        icon: <FaLaptopCode />,
        skills: [
            { name: 'React.js', level: 90 },
            { name: 'Next.js', level: 85 },
            { name: 'JavaScript', level: 88 },
            { name: 'Tailwind CSS', level: 92 },
            { name: 'HTML/CSS', level: 95 },
        ],
    },
    {
        title: 'Backend Development',
        icon: <FaCode />,
        skills: [
            { name: 'Node.js', level: 80 },
            { name: 'Express.js', level: 78 },
            { name: 'REST API', level: 82 },
            { name: 'JWT Auth', level: 75 },
        ],
    },
    {
        title: 'Database & Tools',
        icon: <FaDatabase />,
        skills: [
            { name: 'MongoDB', level: 80 },
            { name: 'PostgreSQL', level: 75 },
            { name: 'Prisma ORM', level: 78 },
            { name: 'Git & GitHub', level: 88 },
        ],
    },
    {
        title: 'Design & 3D',
        icon: <FaPalette />,
        skills: [
            { name: 'Figma', level: 85 },
            { name: 'Spline 3D', level: 80 },
            { name: 'Blender', level: 70 },
            { name: 'UI/UX Design', level: 82 },
        ],
    },
];

// Interests/Hobbies
const interests = [
    { icon: <FaCode />, name: 'Coding', description: 'Building innovative solutions' },
    { icon: <FaGamepad />, name: 'Gaming', description: 'Competitive & casual gaming' },
    { icon: <FaMusic />, name: 'Music', description: 'Listening to various genres' },
    { icon: <FaCamera />, name: 'Photography', description: 'Capturing moments' },
    { icon: <FaBook />, name: 'Reading', description: 'Tech blogs & novels' },
    { icon: <FaPalette />, name: 'Design', description: 'Creating visual experiences' },
];

// ===================================
// KOMPONEN
// ===================================

// Skill Bar Component
interface SkillBarProps {
    name: string;
    level: number;
}

const SkillBar: React.FC<SkillBarProps> = ({ name, level }) => {
    return (
        <div className="mb-4">
            <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-300">{name}</span>
                <span className="text-sm font-semibold text-gray-400">{level}%</span>
            </div>
            <div className="w-full bg-slate-800/50 rounded-full h-2.5 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"
                />
            </div>
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    stat: typeof stats[0];
    index: number;
}

const StatCard: React.FC<StatCardProps> = ({ stat, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="relative group"
        >
            <div className="bg-slate-900/80 backdrop-blur-xl rounded-2xl p-6 border border-slate-700/50 hover:border-gray-500/50 transition-all duration-300">
                <div className="flex flex-col items-center text-center">
                    <div className={`text-4xl mb-3 ${stat.color}`}>{stat.icon}</div>
                    <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
                    <p className="text-sm text-slate-400">{stat.label}</p>
                </div>
            </div>
        </motion.div>
    );
};

// Interest Card Component
interface InterestCardProps {
    interest: typeof interests[0];
    index: number;
}

const InterestCard: React.FC<InterestCardProps> = ({ interest, index }) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 hover:border-gray-500/30 transition-all duration-300"
        >
            <div className="text-3xl text-gray-300 mb-3">{interest.icon}</div>
            <h4 className="text-lg font-semibold text-white mb-1">{interest.name}</h4>
            <p className="text-sm text-slate-400">{interest.description}</p>
        </motion.div>
    );
};

// ===================================
// MAIN ABOUT COMPONENT
// ===================================

const About: React.FC = () => {
    return (
        <section id="about" className="py-20 px-4 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900/20 via-transparent to-gray-900/10"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 right-10 w-32 h-32 bg-gray-500/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-40 left-10 w-40 h-40 bg-gray-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Title */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-20"
                >
                    <h2 className="text-5xl md:text-6xl font-bold font-moderniz mb-4">
                        <span className="bg-gradient-to-r from-gray-400 via-gray-300 to-gray-500 bg-clip-text text-transparent">
                            ABOUT
                        </span>{' '}
                        <span className="text-white">ME</span>
                    </h2>
                    <p className="text-xl text-slate-400 font-cascadia max-w-2xl mx-auto">
                        {personalInfo.tagline}
                    </p>
                </motion.div>

                {/* Profile Section */}
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-20">
                    {/* Left - Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="relative"
                    >
                        <div className="relative group w-96 h-96 mx-auto lg:mx-0">
                            <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                            <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-full p-2 border border-slate-700/50 overflow-hidden">
                                <div className="relative rounded-full overflow-hidden">
                                    <img
                                        src={personalInfo.image}
                                        alt={personalInfo.name}
                                        className="rounded-full w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent"></div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right - Bio */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.3 }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="flex flex-col justify-center space-y-6"
                    >
                        <div>
                            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                {personalInfo.name}
                            </h3>
                            <p className="text-xl text-gray-400 font-semibold mb-4">
                                {personalInfo.title}
                            </p>
                            <p className="text-slate-300 leading-relaxed text-lg">{personalInfo.bio}</p>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                                <p className="text-sm text-slate-400 mb-1">Location</p>
                                <p className="text-white font-semibold">{personalInfo.location}</p>
                            </div>
                            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700/30">
                                <p className="text-sm text-slate-400 mb-1">Experience</p>
                                <p className="text-white font-semibold">
                                    {personalInfo.yearsOfExperience}+ Years
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Stats Section */}
                {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </motion.div> */}

                {/* Skills Section */}
                {/* <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Skills & Expertise
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {skillCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="relative group"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-gray-600 to-gray-700 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                <div className="relative bg-slate-900/80 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="text-2xl text-gray-300">{category.icon}</div>
                    <h4 className="text-xl font-bold text-white">{category.title}</h4>
                  </div>

                  <div className="space-y-4">
                    {category.skills.map((skill, skillIndex) => (
                      <SkillBar key={skillIndex} name={skill.name} level={skill.level} />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}

                {/* Interests Section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.8 }}
                >
                    <h3 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                        Interests & Hobbies
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                        {interests.map((interest, index) => (
                            <InterestCard key={index} interest={interest} index={index} />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default About;
