'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Robot3D = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isNear, setIsNear] = useState(false);
  const [hexagons, setHexagons] = useState([]);
  const [dataStreams, setDataStreams] = useState([]);
  const robotRef = useRef(null);

  // Mouse tracking dengan advanced 3D
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (robotRef.current) {
        const rect = robotRef.current.getBoundingClientRect();
        const robotCenterX = rect.left + rect.width / 2;
        const robotCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - robotCenterX;
        const deltaY = e.clientY - robotCenterY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        setIsNear(distance < 250);

        const maxRotation = 20;
        const rotateY = (deltaX / window.innerWidth) * maxRotation;
        const rotateX = -(deltaY / window.innerHeight) * maxRotation;

        const maxEyeMove = 10;
        const eyeX = (deltaX / window.innerWidth) * maxEyeMove;
        const eyeY = (deltaY / window.innerHeight) * maxEyeMove;

        setMousePosition({
          x: eyeX,
          y: eyeY,
          rotateX,
          rotateY,
          distance
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating hexagon particles generator
  useEffect(() => {
    const interval = setInterval(() => {
      const newHex = {
        id: Math.random(),
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 3,
      };
      setHexagons(prev => [...prev.slice(-8), newHex]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  // Data stream particles
  useEffect(() => {
    const interval = setInterval(() => {
      const newStream = {
        id: Math.random(),
        x: Math.random() * 100,
        opacity: Math.random() * 0.5 + 0.3,
      };
      setDataStreams(prev => [...prev.slice(-12), newStream]);
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={robotRef} className="relative w-full h-full flex items-center justify-center perspective-container">

      {/* Floating Hexagon Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hexagons.map(hex => (
          <motion.div
            key={hex.id}
            initial={{ y: '-10%', x: `${hex.x}%`, opacity: 0, rotate: 0 }}
            animate={{
              y: '110%',
              opacity: [0, 0.6, 0.6, 0],
              rotate: 360,
            }}
            transition={{
              duration: hex.duration,
              ease: 'linear',
              delay: hex.delay,
            }}
            className="absolute w-6 h-6"
            style={{
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
            }}
          >
            <div className="w-full h-full border border-gray-400/40 bg-gray-500/10"></div>
          </motion.div>
        ))}
      </div>

      {/* Data Stream Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dataStreams.map(stream => (
          <motion.div
            key={stream.id}
            initial={{ y: -20, x: `${stream.x}%` }}
            animate={{ y: '100%' }}
            transition={{ duration: 2, ease: 'linear' }}
            className="absolute"
          >
            <div
              className="w-px h-16 bg-gradient-to-b from-transparent via-gray-400 to-transparent"
              style={{ opacity: stream.opacity }}
            ></div>
          </motion.div>
        ))}
      </div>

      {/* Main Robot Container */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotateZ: [0, 1, 0, -1, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="relative"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Holographic Aura */}
        <motion.div
          className="absolute inset-0 blur-2xl"
          animate={{
            opacity: isNear ? [0.3, 0.6, 0.3] : [0.15, 0.3, 0.15],
            scale: isNear ? [1, 1.3, 1] : [1, 1.15, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-56 h-56 mx-auto bg-gradient-to-br from-white via-gray-400 to-gray-600 rounded-full opacity-40"></div>
        </motion.div>

        {/* Glitch Overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none z-40 opacity-20"
          animate={{
            x: [0, -2, 2, -2, 0],
            opacity: [0.2, 0.3, 0.1, 0.3, 0.2],
          }}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          <div className="w-full h-full mix-blend-difference bg-gradient-to-r from-transparent via-white to-transparent"></div>
        </motion.div>

        {/* Robot Body */}
        <div className="relative z-10" style={{ transformStyle: 'preserve-3d' }}>

          {/* Holographic Ring Scanner */}
          <motion.div
            className="absolute -top-16 left-1/2 transform -translate-x-1/2"
            animate={{
              rotateZ: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotateZ: { duration: 8, repeat: Infinity, ease: 'linear' },
              scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
            }}
          >
            <div className="w-40 h-40 rounded-full border border-gray-400/30"
              style={{
                background: 'radial-gradient(circle, transparent 60%, rgba(150,150,150,0.1) 60%, rgba(150,150,150,0.1) 70%, transparent 70%)',
              }}
            >
              {/* Ring particles */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <motion.div
                  key={angle}
                  className="absolute w-1 h-1 bg-gray-300 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(70px)`,
                  }}
                  animate={{
                    opacity: [0.3, 1, 0.3],
                    scale: [1, 1.5, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: angle / 80,
                  }}
                />
              ))}
            </div>
          </motion.div>

          {/* HEAD - Glass Sphere with Neural Network */}
          <motion.div
            animate={{
              rotateY: mousePosition.rotateY || 0,
              rotateX: mousePosition.rotateX || 0,
              scale: isNear ? 1.08 : 1,
            }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="relative mb-4"
            style={{
              transformStyle: 'preserve-3d',
              transform: 'translateZ(40px)'
            }}
          >
            {/* Glass Head Container */}
            <div className="w-36 h-36 mx-auto rounded-full relative"
              style={{
                background: 'linear-gradient(135deg, rgba(200,200,200,0.15) 0%, rgba(100,100,100,0.25) 50%, rgba(50,50,50,0.15) 100%)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                boxShadow: `
                  inset 0 10px 30px rgba(255,255,255,0.15),
                  inset 0 -10px 20px rgba(0,0,0,0.3),
                  0 0 40px rgba(150,150,150,0.3),
                  0 20px 40px rgba(0,0,0,0.4)
                `,
              }}
            >
              {/* Glass shine effect */}
              <div className="absolute top-2 left-4 w-16 h-16 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-md"></div>

              {/* Neural Network Lines (Brain) */}
              <div className="absolute inset-4 opacity-30">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <motion.path
                    d="M 50,20 Q 30,30 20,50 T 50,80"
                    stroke="url(#gradient1)"
                    strokeWidth="0.5"
                    fill="none"
                    animate={{
                      pathLength: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.path
                    d="M 50,20 Q 70,30 80,50 T 50,80"
                    stroke="url(#gradient1)"
                    strokeWidth="0.5"
                    fill="none"
                    animate={{
                      pathLength: [0, 1, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear",
                      delay: 0.5,
                    }}
                  />
                  <circle cx="50" cy="30" r="2" fill="#999" opacity="0.6" />
                  <circle cx="30" cy="50" r="2" fill="#999" opacity="0.6" />
                  <circle cx="70" cy="50" r="2" fill="#999" opacity="0.6" />
                  <circle cx="50" cy="70" r="2" fill="#999" opacity="0.6" />

                  <defs>
                    <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#666" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#aaa" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* HUD Eyes - Digital Display */}
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 flex gap-8" style={{ transformStyle: 'preserve-3d' }}>
                {/* Left Eye */}
                <div className="relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="w-11 h-11 rounded-full relative overflow-hidden"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.6) 40%, rgba(100,100,100,0.3) 100%)',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(200,200,200,0.4)',
                    }}
                  >
                    {/* HUD Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-600 transform -translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gray-600 transform -translate-x-1/2"></div>
                        <div className="absolute left-0 top-1/2 h-px w-2 bg-gray-600 transform -translate-y-1/2"></div>
                        <div className="absolute right-0 top-1/2 h-px w-2 bg-gray-600 transform -translate-y-1/2"></div>

                        <motion.div
                          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border border-gray-600 transform -translate-x-1/2 -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    </div>

                    {/* Pupil */}
                    <motion.div
                      className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        background: 'radial-gradient(circle, #1a1a1a 30%, #333 60%, #000 100%)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.3)',
                      }}
                      animate={{
                        x: mousePosition.x * 0.3,
                        y: mousePosition.y * 0.3,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      {/* Light reflection */}
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
                    </motion.div>
                  </div>

                  {/* HUD Info Lines */}
                  <motion.div
                    className="absolute -right-8 top-1/2 transform -translate-y-1/2"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex flex-col gap-0.5">
                      <div className="w-6 h-px bg-gray-400"></div>
                      <div className="w-4 h-px bg-gray-500"></div>
                      <div className="w-5 h-px bg-gray-400"></div>
                    </div>
                  </motion.div>
                </div>

                {/* Right Eye */}
                <div className="relative" style={{ transform: 'translateZ(20px)' }}>
                  <div className="w-11 h-11 rounded-full relative overflow-hidden"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(200,200,200,0.6) 40%, rgba(100,100,100,0.3) 100%)',
                      boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.3), 0 0 15px rgba(200,200,200,0.4)',
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-8 h-8">
                        <div className="absolute top-0 left-1/2 w-px h-2 bg-gray-600 transform -translate-x-1/2"></div>
                        <div className="absolute bottom-0 left-1/2 w-px h-2 bg-gray-600 transform -translate-x-1/2"></div>
                        <div className="absolute left-0 top-1/2 h-px w-2 bg-gray-600 transform -translate-y-1/2"></div>
                        <div className="absolute right-0 top-1/2 h-px w-2 bg-gray-600 transform -translate-y-1/2"></div>

                        <motion.div
                          className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full border border-gray-600 transform -translate-x-1/2 -translate-y-1/2"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                        />
                      </div>
                    </div>

                    <motion.div
                      className="absolute top-1/2 left-1/2 w-4 h-4 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                      style={{
                        background: 'radial-gradient(circle, #1a1a1a 30%, #333 60%, #000 100%)',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.6), inset 0 1px 3px rgba(255,255,255,0.3)',
                      }}
                      animate={{
                        x: mousePosition.x * 0.3,
                        y: mousePosition.y * 0.3,
                      }}
                      transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    >
                      <div className="absolute top-1 left-1 w-1.5 h-1.5 bg-white rounded-full opacity-70"></div>
                    </motion.div>
                  </div>

                  <motion.div
                    className="absolute -left-8 top-1/2 transform -translate-y-1/2"
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  >
                    <div className="flex flex-col gap-0.5 items-end">
                      <div className="w-6 h-px bg-gray-400"></div>
                      <div className="w-4 h-px bg-gray-500"></div>
                      <div className="w-5 h-px bg-gray-400"></div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Data Display - Mouth Area */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-24 h-4 overflow-hidden">
                <motion.div
                  className="flex gap-1 items-end justify-center h-full"
                  animate={{
                    opacity: isNear ? [0.6, 1, 0.6] : [0.4, 0.7, 0.4],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                >
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 bg-gray-400 rounded-t"
                      animate={{
                        height: [`${20 + Math.random() * 30}%`, `${40 + Math.random() * 40}%`, `${20 + Math.random() * 30}%`],
                      }}
                      transition={{
                        duration: 0.8,
                        repeat: Infinity,
                        delay: i * 0.1,
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Hexagon Tech Pattern */}
              <div className="absolute inset-0 opacity-10 overflow-hidden rounded-full">
                <div
                  className="w-full h-full"
                  style={{
                    backgroundImage: `radial-gradient(circle, transparent 20%, rgba(200,200,200,0.3) 20%, rgba(200,200,200,0.3) 22%, transparent 22%)`,
                    backgroundSize: '12px 12px',
                  }}
                ></div>
              </div>
            </div>
          </motion.div>

          {/* Neck - Transparent Cylinder */}
          <div className="w-12 h-6 mx-auto relative mb-2"
            style={{
              background: 'linear-gradient(to bottom, rgba(150,150,150,0.2), rgba(100,100,100,0.3))',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '8px',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.1), 0 4px 8px rgba(0,0,0,0.3)',
            }}
          >
            {/* Tech lines */}
            <div className="absolute inset-0 flex items-center justify-center gap-1">
              <div className="w-px h-full bg-gray-500/30"></div>
              <div className="w-px h-full bg-gray-500/30"></div>
              <div className="w-px h-full bg-gray-500/30"></div>
            </div>
          </div>

          {/* BODY - Transparent Glass Torso */}
          <div className="relative" style={{ transform: 'translateZ(0px)' }}>
            <div className="w-40 h-44 mx-auto rounded-3xl relative"
              style={{
                background: 'linear-gradient(135deg, rgba(200,200,200,0.12) 0%, rgba(100,100,100,0.2) 50%, rgba(50,50,50,0.12) 100%)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255,255,255,0.25)',
                boxShadow: `
                  inset 0 15px 40px rgba(255,255,255,0.12),
                  inset 0 -15px 30px rgba(0,0,0,0.25),
                  0 0 50px rgba(150,150,150,0.25),
                  0 25px 50px rgba(0,0,0,0.4)
                `,
              }}
            >
              {/* Glass reflection */}
              <div className="absolute top-4 left-6 w-20 h-24 rounded-2xl bg-gradient-to-br from-white/30 to-transparent blur-xl"></div>

              {/* Holographic Core Reactor */}
              <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-24 h-24">
                <motion.div
                  className="relative w-full h-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
                >
                  {/* Outer hexagon */}
                  <div
                    className="absolute inset-0 border-2 border-gray-400/40"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                  ></div>

                  {/* Mid hexagon */}
                  <motion.div
                    className="absolute inset-3 border-2 border-gray-300/60"
                    style={{
                      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
                    }}
                    animate={{ rotate: -360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  ></motion.div>

                  {/* Inner core */}
                  <motion.div
                    className="absolute inset-6 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(200,200,200,0.5) 40%, transparent 70%)',
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.6, 1, 0.6],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="absolute inset-2 rounded-full bg-white/60 blur-sm"></div>
                  </motion.div>

                  {/* Energy particles */}
                  {[0, 60, 120, 180, 240, 300].map((angle) => (
                    <motion.div
                      key={angle}
                      className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(35px)`,
                      }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.5, 1],
                        boxShadow: [
                          '0 0 5px rgba(255,255,255,0.5)',
                          '0 0 15px rgba(255,255,255,0.9)',
                          '0 0 5px rgba(255,255,255,0.5)',
                        ],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: angle / 180,
                      }}
                    />
                  ))}
                </motion.div>
              </div>

              {/* Circuit Board Pattern */}
              <div className="absolute inset-4 opacity-20">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <line x1="10" y1="20" x2="30" y2="20" stroke="#999" strokeWidth="0.5" />
                  <line x1="30" y1="20" x2="30" y2="40" stroke="#999" strokeWidth="0.5" />
                  <line x1="70" y1="20" x2="90" y2="20" stroke="#999" strokeWidth="0.5" />
                  <line x1="70" y1="20" x2="70" y2="40" stroke="#999" strokeWidth="0.5" />
                  <circle cx="30" cy="20" r="2" fill="#aaa" />
                  <circle cx="70" cy="20" r="2" fill="#aaa" />
                  <circle cx="30" cy="40" r="2" fill="#aaa" />
                  <circle cx="70" cy="40" r="2" fill="#aaa" />
                </svg>
              </div>

              {/* Status LEDs */}
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    className="w-2 h-2 rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255,255,255,0.9), rgba(150,150,150,0.5))',
                      boxShadow: '0 0 8px rgba(200,200,200,0.6)',
                    }}
                    animate={{
                      opacity: [0.3, 1, 0.3],
                      boxShadow: [
                        '0 0 5px rgba(200,200,200,0.4)',
                        '0 0 15px rgba(255,255,255,0.8)',
                        '0 0 5px rgba(200,200,200,0.4)',
                      ],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: i * 0.4,
                    }}
                  />
                ))}
              </div>

              {/* ARMS - Sleek Cyberpunk Style */}
              <div className="absolute top-8 left-0 right-0">
                {/* Left Arm */}
                <motion.div
                  className="absolute -left-12 top-0"
                  animate={{
                    rotate: isNear ? [0, -25, -10, -25, 0] : [0, -15, 0],
                  }}
                  transition={{
                    duration: isNear ? 2.5 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  {/* Shoulder joint */}
                  <div className="w-5 h-5 mx-auto rounded-full mb-1"
                    style={{
                      background: 'radial-gradient(circle, rgba(200,200,200,0.5), rgba(100,100,100,0.3))',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)',
                    }}
                  />

                  {/* Upper arm */}
                  <div className="w-6 h-24 rounded-full relative"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(180,180,180,0.15), rgba(100,100,100,0.25))',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset 2px 0 6px rgba(255,255,255,0.1), inset -2px 0 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.25)',
                    }}
                  >
                    {/* Tech lines */}
                    <div className="absolute right-0.5 top-1/4 w-3 h-px bg-gray-400/40"></div>
                    <div className="absolute right-0.5 top-1/2 w-3 h-px bg-gray-400/40"></div>
                    <div className="absolute right-0.5 top-3/4 w-3 h-px bg-gray-400/40"></div>
                  </div>

                  {/* Elbow */}
                  <div className="w-5 h-5 mx-auto rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(200,200,200,0.5), rgba(100,100,100,0.3))',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)',
                    }}
                  />

                  {/* Lower arm */}
                  <motion.div
                    animate={{
                      rotate: isNear ? [0, 35, 15, 35, 0] : [0, 20, 0],
                    }}
                    transition={{
                      duration: isNear ? 2.5 : 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                    style={{ transformOrigin: 'top center' }}
                  >
                    <div className="w-5 h-20 rounded-full"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(160,160,160,0.15), rgba(80,80,80,0.25))',
                        border: '1px solid rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: 'inset 2px 0 6px rgba(255,255,255,0.1), inset -2px 0 6px rgba(0,0,0,0.2)',
                      }}
                    />

                    {/* Hand */}
                    <div className="w-6 h-6 mx-auto rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(200,200,200,0.3), rgba(100,100,100,0.4))',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* Right Arm - Mirror */}
                <motion.div
                  className="absolute -right-12 top-0"
                  animate={{
                    rotate: isNear ? [0, 25, 10, 25, 0] : [0, 15, 0],
                  }}
                  transition={{
                    duration: isNear ? 2.5 : 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    transformOrigin: 'top center',
                    transformStyle: 'preserve-3d'
                  }}
                >
                  <div className="w-5 h-5 mx-auto rounded-full mb-1"
                    style={{
                      background: 'radial-gradient(circle, rgba(200,200,200,0.5), rgba(100,100,100,0.3))',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)',
                    }}
                  />

                  <div className="w-6 h-24 rounded-full relative"
                    style={{
                      background: 'linear-gradient(to bottom, rgba(180,180,180,0.15), rgba(100,100,100,0.25))',
                      border: '1px solid rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(8px)',
                      boxShadow: 'inset -2px 0 6px rgba(255,255,255,0.1), inset 2px 0 6px rgba(0,0,0,0.2), 0 4px 12px rgba(0,0,0,0.25)',
                    }}
                  >
                    <div className="absolute left-0.5 top-1/4 w-3 h-px bg-gray-400/40"></div>
                    <div className="absolute left-0.5 top-1/2 w-3 h-px bg-gray-400/40"></div>
                    <div className="absolute left-0.5 top-3/4 w-3 h-px bg-gray-400/40"></div>
                  </div>

                  <div className="w-5 h-5 mx-auto rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(200,200,200,0.5), rgba(100,100,100,0.3))',
                      border: '1px solid rgba(255,255,255,0.4)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3), inset 0 1px 3px rgba(255,255,255,0.3)',
                    }}
                  />

                  <motion.div
                    animate={{
                      rotate: isNear ? [0, -35, -15, -35, 0] : [0, -20, 0],
                    }}
                    transition={{
                      duration: isNear ? 2.5 : 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.3
                    }}
                    style={{ transformOrigin: 'top center' }}
                  >
                    <div className="w-5 h-20 rounded-full"
                      style={{
                        background: 'linear-gradient(to bottom, rgba(160,160,160,0.15), rgba(80,80,80,0.25))',
                        border: '1px solid rgba(255,255,255,0.25)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: 'inset -2px 0 6px rgba(255,255,255,0.1), inset 2px 0 6px rgba(0,0,0,0.2)',
                      }}
                    />

                    <div className="w-6 h-6 mx-auto rounded-lg"
                      style={{
                        background: 'linear-gradient(135deg, rgba(200,200,200,0.3), rgba(100,100,100,0.4))',
                        border: '1px solid rgba(255,255,255,0.3)',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.2)',
                      }}
                    >
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                        <div className="w-0.5 h-2 bg-gray-400/40 rounded-sm"></div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Holographic Ground Shadow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-36 h-8"
              style={{
                background: 'radial-gradient(ellipse, rgba(150,150,150,0.4) 0%, transparent 70%)',
                filter: 'blur(8px)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Custom Styles */}
      <style jsx>{`
        .perspective-container {
          perspective: 1200px;
          perspective-origin: center center;
        }
      `}</style>
    </div>
  );
};

export default Robot3D;
