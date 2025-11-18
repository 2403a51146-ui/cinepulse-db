import { useEffect, useRef, useState } from 'react';

const Parallax3DBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#1a0505] to-[#0a0a0a]" />
      
      {/* Parallax layers */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          transform: `translate(${mousePosition.x * 20}px, ${mousePosition.y * 20}px)`,
          transition: 'transform 0.3s ease-out'
        }}
      >
        {/* Layer 1 - Deep background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#8B0000] rounded-full blur-[120px] opacity-20" />
        <div className="absolute bottom-1/4 right-1/4 w-[32rem] h-[32rem] bg-[#FFD700] rounded-full blur-[150px] opacity-15" />
      </div>

      <div 
        className="absolute inset-0 opacity-40"
        style={{
          transform: `translate(${mousePosition.x * 35}px, ${mousePosition.y * 35}px)`,
          transition: 'transform 0.25s ease-out'
        }}
      >
        {/* Layer 2 - Mid-layer floating elements */}
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-[#FFD700] rounded-full blur-[100px] opacity-25" />
        <div className="absolute bottom-1/3 left-1/3 w-80 h-80 bg-[#8B0000] rounded-full blur-[110px] opacity-20" />
        <div className="absolute top-2/3 left-1/2 w-48 h-48 bg-[#FF6B6B] rounded-full blur-[90px] opacity-15" />
      </div>

      <div 
        className="absolute inset-0 opacity-50"
        style={{
          transform: `translate(${mousePosition.x * 50}px, ${mousePosition.y * 50}px)`,
          transition: 'transform 0.2s ease-out'
        }}
      >
        {/* Layer 3 - Front layer details */}
        <div className="absolute top-1/2 right-1/4 w-56 h-56 bg-[#FFD700] rounded-full blur-[80px] opacity-30" />
        <div className="absolute bottom-1/2 left-1/4 w-72 h-72 bg-[#8B0000] rounded-full blur-[90px] opacity-25" />
      </div>

      {/* Animated floating particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-[#FFD700] to-[#8B0000] opacity-20"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 10 + 10}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `translate(${mousePosition.x * (i * 2)}px, ${mousePosition.y * (i * 2)}px)`,
              transition: 'transform 0.3s ease-out',
              filter: 'blur(2px)'
            }}
          />
        ))}
      </div>

      {/* Grid overlay for depth */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 215, 0, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 215, 0, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px',
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px) perspective(500px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
          transition: 'transform 0.3s ease-out'
        }}
      />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(-25px) translateX(5px);
          }
        }
      `}</style>
    </div>
  );
};

export default Parallax3DBackground;
