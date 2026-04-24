
// FIX: Implemented the StreamCard component.
import React, { useState, useRef, MouseEvent } from 'react';
import { StreamData } from '../types';

interface StreamCardProps {
  stream: StreamData;
}

const StreamCard: React.FC<StreamCardProps> = ({ stream }) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10; // Max rotation 10 deg
    const rotateY = ((x - centerX) / centerX) * 10;

    setRotate({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
  };

  // Determine gradient based on stream ID for visual distinction
  let gradientClass = "from-purple-500 via-indigo-500 to-indigo-600";
  let bgGradient = "bg-purple-50";
  let borderClass = "border-purple-200";
  let textGradient = "from-purple-600 to-indigo-600";
  
  if (stream.id === 'commerce') {
      gradientClass = "from-blue-500 via-cyan-500 to-teal-500";
      bgGradient = "bg-blue-50";
      borderClass = "border-blue-200";
      textGradient = "from-blue-600 to-teal-600";
  }
  if (stream.id === 'arts') {
      gradientClass = "from-pink-500 via-rose-500 to-orange-500";
      bgGradient = "bg-pink-50";
      borderClass = "border-pink-200";
      textGradient = "from-pink-600 to-orange-600";
  }

  return (
    <div 
        className="tilt-preserve-3d perspective-1000"
        style={{ perspective: '1000px' }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
    >
        <div 
            ref={cardRef}
            className={`group holo-card rounded-2xl p-6 sm:p-8 h-full flex flex-col relative overflow-hidden transition-all duration-200 ease-out`}
            style={{
                transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
                borderColor: 'rgba(255,255,255,0.4)',
            }}
        >
            {/* Top Gradient Line */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradientClass}`}></div>
            
            <div className="tilt-content">
                <h3 className={`text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${textGradient} mb-3 transition-all`}>{stream.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed flex-grow text-sm sm:text-base">{stream.description}</p>
                
                <div className="mb-6">
                <h4 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-3">Core Subjects</h4>
                <div className="flex flex-wrap gap-2">
                    {stream.subjects.map((subject, index) => (
                    <span key={index} className={`text-gray-700 bg-white/50 border border-gray-200 text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors group-hover:bg-white group-hover:shadow-sm`}>
                        {subject}
                    </span>
                    ))}
                </div>
                </div>
                
                <div>
                <h4 className="font-mono text-xs text-gray-400 uppercase tracking-widest mb-3">Potential Careers</h4>
                <ul className="grid grid-cols-2 gap-x-2 gap-y-2 text-sm text-gray-600">
                    {stream.careers.slice(0, 6).map((career, index) => (
                    <li key={index} className="flex items-center gap-2">
                        <div className={`w-1 h-1 rounded-full bg-gradient-to-r ${gradientClass} flex-shrink-0`}></div>
                        <span className="truncate font-medium">{career}</span>
                    </li>
                    ))}
                </ul>
                {stream.careers.length > 6 && (
                        <p className="text-xs text-gray-400 mt-3 font-medium text-right hover:text-gray-600 transition-colors cursor-default font-mono">+ {stream.careers.length - 6} more paths</p>
                )}
                </div>
            </div>
        </div>
    </div>
  );
};

export default StreamCard;