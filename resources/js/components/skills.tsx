import React from 'react';

const Skills: React.FC = () => {
    const skillsList = [
        'PHP',
        'Javascript',
        'Laravel',
        'React',
        'MYSQL',
        'TailwindCSS',
        'Git',
        'Figma',
        'UI/UX Design',
    ];

    return (
        <div className="flex flex-row flex-wrap gap-3 mt-6 justify-left w-full">
            {skillsList.map((skill) => (
                <div
                    key={skill}
                    className="px-5 py-2 text-sm text-white transition-all duration-300 ease-in-out border rounded-full cursor-pointer border-white/20 bg-white/10 backdrop-blur-sm hover:bg-white/20"
                >
                    {skill}
                </div>
            ))}
        </div>
    );
};

export default Skills;
