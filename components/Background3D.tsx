import React from 'react';

const Background3D: React.FC = () => {
  return (
    /* fixed ensures it stays visible during scroll, -z-10 puts it behind content */
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none bg-white">
      
      {/* 1. REFINED BACKGROUND DEPTH: Added a soft radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(255,255,255,0.8)_100%)] z-10"></div>

      {/* Dynamic Mesh Gradient - Increased size for better coverage */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[80%] h-[80%] rounded-full bg-gradient-to-br from-[#0070f3]/30 to-transparent blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] rounded-full bg-gradient-to-tl from-[#001e3c]/15 to-transparent blur-[100px]"></div>
      </div>

      {/* 3D Floating Grid Perspective - PERSISTS ON SCROLL */}
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `linear-gradient(to right, #e2e8f0 1px, transparent 1px), 
                            linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
          maskImage: 'radial-gradient(ellipse at center, black, transparent 90%)',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          opacity: 0.15
        }}
      ></div>

      {/* 2. ENHANCED PARTICLES: Increased visibility and count (35 particles) */}
      <div className="absolute inset-0">
        {[...Array(35)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-[#0070f3]/30 blur-[1px] animate-float"
            style={{
              width: Math.random() * 15 + 4 + 'px',
              height: Math.random() * 15 + 4 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: Math.random() * 15 + 10 + 's',
              animationDelay: Math.random() * 5 + 's',
            }}
          ></div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px) translateX(0px); opacity: 0; }
          50% { opacity: 0.6; }
          100% { transform: translateY(-150px) translateX(30px); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default Background3D;