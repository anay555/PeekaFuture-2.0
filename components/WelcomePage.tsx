
import React, { useState, useEffect, useRef } from 'react';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';
import { 
    StreamIcon, NavigatorIcon, CollegeIcon, EntrepreneurshipIcon, TrendingUpIcon, 
    PaintBrushIcon, QuoteIcon, WrenchScrewdriverIcon, BriefcaseIcon, RocketLaunchIcon, 
    HeartIcon, ChartPieIcon, TargetIcon, CheckIcon, SparklesIcon, MenuIcon, 
    XIcon, EnvelopeIcon 
} from './Icons';

interface WelcomePageProps {
    onGetStarted: () => void;
}

const Typewriter = ({ text, delay = 50, showCursor = false }: { text: string, delay?: number, showCursor?: boolean }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, delay, text, isVisible]);

  return (
    <span ref={elementRef}>
      {currentText}
      {showCursor && <span className="animate-pulse inline-block w-[3px] h-[1em] bg-current align-middle ml-1"></span>}
    </span>
  );
};

// Animated Counter Component
const CountUp = ({ end, suffix = '', duration = 2000 }: { end: number, suffix?: string, duration?: number }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);
  
  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Ease out quart
      const ease = 1 - Math.pow(1 - percentage, 4);
      
      setCount(Math.floor(ease * end));
      
      if (progress < duration) {
        requestAnimationFrame(animate);
      } else {
          setCount(end);
      }
    };
    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={elementRef}>{count.toLocaleString()}{suffix}</span>;
};

const BentoItem: React.FC<{ icon: React.ReactNode; title: string; description: React.ReactNode; className?: string; }> = ({ icon, title, description, className = '' }) => {
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const itemRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!itemRef.current) return;
        const rect = itemRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;
        
        setTilt({ x: rotateX, y: rotateY });
        setMousePos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    return (
        <div 
            ref={itemRef}
            className={`bento-item ${className} group relative overflow-hidden transition-all duration-200 ease-out hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] dark:hover:shadow-[0_0_30px_rgba(168,85,247,0.1)]`}
            style={{ 
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1})`,
                transformStyle: 'preserve-3d'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Hover Glow Effect */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.15) 0%, transparent 60%)`
                }}
            />
            
            {/* Hover Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
            
            <div className="relative z-10" style={{ transform: 'translateZ(20px)' }}>
                <div className="mx-auto bg-purple-100 dark:bg-purple-900/30 ring-4 ring-purple-50 dark:ring-purple-900/20 rounded-xl h-12 w-12 flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:bg-purple-200 dark:group-hover:bg-purple-800/50 shadow-sm">
                    {icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-700 dark:group-hover:text-purple-400 transition-colors duration-300">{title}</h3>
                <div className="mt-2 text-gray-600 dark:text-gray-300 leading-relaxed text-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">{description}</div>
            </div>
        </div>
    );
};

const StatCard = ({ value, suffix, label, icon }: { value: number, suffix: string, label: string, icon: React.ReactNode }) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const cardRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            className="relative flex flex-col items-center p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl transform transition-all duration-300 hover:scale-110 hover:bg-white/15 hover:border-purple-300/30 hover:shadow-purple-500/20 hover:-translate-y-2 group cursor-default overflow-hidden"
        >
            {/* Hover Glow Effect */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                style={{
                    background: `radial-gradient(circle at ${mousePos.x}px ${mousePos.y}px, rgba(168, 85, 247, 0.4) 0%, transparent 60%)`
                }}
            />
            
            <div className="relative z-10 flex flex-col items-center">
                <div className="mb-3 text-indigo-300 group-hover:text-white transition-colors transform group-hover:-translate-y-2 duration-300 group-hover:scale-110">
                    {icon}
                </div>
                <span className="text-3xl lg:text-4xl font-extrabold text-white mb-1 tracking-tight group-hover:text-purple-200 transition-colors duration-300">
                    <CountUp end={value} suffix={suffix} />
                </span>
                <span className="text-indigo-100 text-xs font-bold uppercase tracking-widest opacity-80 group-hover:opacity-100 transition-opacity">{label}</span>
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="border-b border-gray-200 dark:border-gray-700 last:border-0 transition-colors duration-300 hover:bg-gray-50/50 dark:hover:bg-slate-800/30 rounded-xl px-2">
        <button 
          className="w-full py-6 px-4 text-left flex justify-between items-start focus:outline-none group rounded-lg transition-all duration-300 hover:translate-x-1"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className={`text-lg font-semibold transition-colors duration-200 ${isOpen ? 'text-purple-700 dark:text-purple-400' : 'text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400'}`}>{question}</span>
          <span className={`ml-6 flex-shrink-0 text-purple-500 transform transition-transform duration-300 ${isOpen ? 'rotate-180' : 'group-hover:scale-110'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          </span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out px-4 ${isOpen ? 'max-h-96 opacity-100 pb-6' : 'max-h-0 opacity-0'}`}>
          <p className="text-gray-600 dark:text-gray-400 leading-relaxed pr-8">{answer}</p>
        </div>
      </div>
    );
};

const TrustedBy = () => {
    const brands = [
        "IIT Bombay", "St. Stephen's", "SRCC", "BITS Pilani", "Delhi University", "IIM Ahmedabad", "NIFT", "AIIMS", "NIT Trichy", "Ashoka University"
    ];
    
    return (
        <div className="bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800 py-10 overflow-hidden relative group">
            <div className="absolute inset-0 bg-gray-50/50 dark:bg-slate-950/50 pointer-events-none"></div>
            <div className="container mx-auto px-6 relative z-10">
                <p className="text-center text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-8">Trusted by students aiming for top institutions</p>
                
                <div className="relative flex overflow-hidden">
                    {/* Inner container for the infinite scroll */}
                    <div className="animate-marquee whitespace-nowrap flex gap-16 items-center">
                        {/* Duplicate the list 4 times to ensure smooth looping on wide screens */}
                        {[...brands, ...brands, ...brands, ...brands].map((brand, i) => (
                            <span key={i} className="px-6 py-3 rounded-full bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700/50 text-lg font-bold text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-200 dark:hover:border-purple-800/50 transition-all duration-300 cursor-default font-sans hover:shadow-md hover:-translate-y-1 inline-flex items-center justify-center whitespace-nowrap">
                                {brand}
                            </span>
                        ))}
                    </div>
                    {/* Gradient Masks */}
                    <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
                    <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-10 pointer-events-none"></div>
                </div>
            </div>
            <style>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 60s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
            `}</style>
        </div>
    );
};

const DashboardPreview = () => {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const handleScroll = () => {
            // Base tilt on scroll
            const scrollY = window.scrollY;
            const baseTilt = Math.max(0, 15 - (scrollY / 40));
            setRotation(prev => ({ ...prev, x: baseTilt }));
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        // Subtle additional tilt based on mouse position
        const rotateY = ((x - centerX) / centerX) * 5; // Max 5 deg
        const rotateX = ((y - centerY) / centerY) * -5; // Max 5 deg

        // Combine scroll tilt (x-axis dominant) with mouse tilt
        setRotation(prev => ({
            x: Math.max(0, 15 - (window.scrollY / 40)) + rotateX, 
            y: rotateY 
        }));
    };

    const handleMouseLeave = () => {
         const baseTilt = Math.max(0, 15 - (window.scrollY / 40));
         setRotation({ x: baseTilt, y: 0 });
    };

    return (
      <div className="relative py-24 perspective-2000 overflow-hidden" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} ref={containerRef}>
          <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">Peek Inside</span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Your Future Command Center</h2>
                  <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">A powerful, intuitive dashboard designed to organize your academic life and career planning.</p>
              </div>
              
              <div className="animate-float">
                  <div 
                      className="relative mx-auto max-w-6xl bg-gray-900 rounded-xl shadow-2xl border border-gray-800 transition-all duration-300 ease-out group"
                      style={{ 
                          transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                          transformStyle: 'preserve-3d'
                      }}
                  >
                      {/* Hover Glow */}
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition duration-1000 group-hover:duration-200"></div>
                      
                      {/* Browser Header */}
                      <div className="relative bg-gray-800 rounded-t-xl px-4 py-3 flex items-center gap-2 border-b border-gray-700">
                          <div className="flex gap-2">
                              <div className="w-3 h-3 rounded-full bg-red-500"></div>
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <div className="ml-4 bg-gray-700/50 rounded-md px-4 py-1 text-xs text-gray-400 font-mono flex-1 text-center border border-gray-600/30">peekafuture.online/dashboard</div>
                      </div>
                      
                       {/* Dashboard Mockup Content */}
                      <div className="bg-slate-50 dark:bg-slate-900 p-4 md:p-6 grid grid-cols-12 gap-6 h-[400px] md:h-[600px] overflow-hidden rounded-b-xl relative">
                       {/* Floating AI Badges */}
                       <div className="absolute top-10 right-10 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-purple-200 dark:border-purple-800 animate-float flex items-center gap-3 transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">
                           <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                               <SparklesIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                           </div>
                           <div>
                               <div className="text-xs font-bold text-gray-900 dark:text-white">AI Suggestion</div>
                               <div className="text-[10px] text-gray-500 dark:text-gray-400">Consider B.Tech in AI & Data Science</div>
                           </div>
                       </div>
                       
                       <div className="absolute bottom-20 left-1/4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-3 rounded-xl shadow-xl border border-blue-200 dark:border-blue-800 animate-float animation-delay-1000 flex items-center gap-3 transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300 cursor-default">
                           <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center">
                               <TrendingUpIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                           </div>
                           <div>
                               <div className="text-xs font-bold text-gray-900 dark:text-white">Market Trend</div>
                               <div className="text-[10px] text-gray-500 dark:text-gray-400">+24% growth in UX Design roles</div>
                           </div>
                       </div>

                       {/* Sidebar Mockup */}
                       <div className="hidden md:block col-span-3 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-5 space-y-4">
                          <div className="flex items-center gap-3 mb-8 group cursor-default">
                              <div className="h-8 w-8 bg-purple-600 rounded-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3"></div>
                              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-24 transition-colors duration-300 group-hover:bg-gray-300 dark:group-hover:bg-slate-600"></div>
                          </div>
                          {[...Array(6)].map((_, i) => (
                              <div key={i} className="flex items-center gap-3 group cursor-pointer p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50">
                                  <div className="h-5 w-5 bg-gray-100 dark:bg-slate-700 rounded transition-colors duration-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50"></div>
                                  <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-full transition-colors duration-300 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"></div>
                              </div>
                          ))}
                          <div className="mt-auto pt-10">
                              <div className="h-16 bg-purple-50 dark:bg-purple-900/20 rounded-lg w-full border border-purple-100 dark:border-purple-800 transition-all duration-300 hover:bg-purple-100 dark:hover:bg-purple-900/40 hover:border-purple-200 dark:hover:border-purple-700 cursor-pointer"></div>
                          </div>
                       </div>
                       
                       {/* Main Content Mockup */}
                       <div className="col-span-12 md:col-span-9 space-y-6">
                          {/* Header stats */}
                          <div className="grid grid-cols-3 gap-6">
                              {[...Array(3)].map((_, i) => (
                                  <div key={i} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col justify-between h-28 transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-purple-300 dark:hover:border-purple-700 cursor-default">
                                      <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/30 mb-2 transition-colors duration-300 group-hover:bg-purple-100 dark:group-hover:bg-purple-900/50"></div>
                                      <div className="space-y-2">
                                          <div className="h-3 bg-gray-100 dark:bg-slate-700 rounded w-1/2 transition-colors duration-300 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"></div>
                                          <div className="h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 transition-colors duration-300 group-hover:bg-gray-300 dark:group-hover:bg-slate-500"></div>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          {/* Big Chart Area */}
                          <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 h-72 flex flex-col transition-all duration-300 hover:shadow-lg hover:border-indigo-300 dark:hover:border-indigo-700 cursor-default">
                               <div className="flex justify-between mb-6">
                                   <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/3 transition-colors duration-300 group-hover:bg-gray-300 dark:group-hover:bg-slate-600"></div>
                                   <div className="h-4 bg-gray-100 dark:bg-slate-700 rounded w-16 transition-colors duration-300 group-hover:bg-gray-200 dark:group-hover:bg-slate-600"></div>
                               </div>
                               <div className="flex items-end justify-between gap-4 flex-1 pb-2">
                                   {[45, 65, 40, 85, 55, 75, 50, 90, 60].map((h, i) => (
                                       <div key={i} className="w-full bg-indigo-50 dark:bg-indigo-900/20 rounded-t-md relative overflow-hidden h-full group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900/40 transition-colors cursor-pointer hover:!bg-indigo-200 dark:hover:!bg-indigo-800/60">
                                           <div 
                                              className={`absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-md transition-all duration-1000 ${i % 2 === 0 ? 'animate-pulse' : 'animate-pulse animation-delay-500'} hover:from-purple-500 hover:to-pink-500`} 
                                              style={{ height: `${h}%` }}
                                           ></div>
                                       </div>
                                   ))}
                               </div>
                          </div>
                          {/* Bottom Row */}
                          <div className="grid grid-cols-2 gap-6">
                               <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 h-40"></div>
                               <div className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 h-40"></div>
                          </div>
                       </div>
  
                       {/* Glass Overlay for depth */}
                       <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
                  </div>
              </div>
              </div>
          </div>
      </div>
    );
}

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollHeight) {
        setScrollProgress(Number((currentScrollY / scrollHeight).toFixed(4)) * 100);
      }
    };

    window.addEventListener('scroll', updateScroll);
    // Initial call to set progress if page is loaded scrolled down
    updateScroll();
    return () => window.removeEventListener('scroll', updateScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] bg-transparent pointer-events-none">
      <div 
        className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
};

const WelcomePage: React.FC<WelcomePageProps> = ({ onGetStarted }) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
            setShowScrollTop(window.scrollY > 500);
        };
        const handleMouseMove = (e: MouseEvent) => {
            // Normalized coordinates (-1 to 1)
            setMousePos({
                x: (e.clientX / window.innerWidth) * 2 - 1,
                y: (e.clientY / window.innerHeight) * 2 - 1
            });
        };

        window.addEventListener('scroll', handleScroll);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    const navLinks = [
        { name: 'Features', href: '#features' },
        { name: 'How it Works', href: '#how-it-works' },
        { name: 'Testimonials', href: '#testimonials' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
    ];
    
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-gray-800 dark:text-gray-200 font-sans selection:bg-purple-100 selection:text-purple-900 dark:selection:bg-purple-900 dark:selection:text-purple-100 overflow-x-hidden transition-colors duration-300">
             <ScrollProgress />
             {/* Header */}
             <header 
                className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                    isScrolled 
                    ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-sm py-3 border-b border-gray-200/50 dark:border-slate-800/50' 
                    : 'bg-transparent py-5'
                }`}
            >
                <nav className="container mx-auto px-6 flex justify-between items-center">
                    <Logo className="text-2xl sm:text-3xl relative z-50" variant={isScrolled ? 'default' : 'inverted'} />
                    
                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <a 
                                key={link.name} 
                                href={link.href} 
                                className={`text-sm font-medium transition-all duration-300 hover:text-purple-400 hover:-translate-y-0.5 ${
                                    isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-gray-200'
                                }`}
                            >
                                {link.name}
                            </a>
                        ))}
                        <ThemeToggle className="ml-2" />
                        <button
                            onClick={onGetStarted}
                            className={`font-bold py-2.5 px-6 rounded-full shadow-lg transition-all transform hover:-translate-y-0.5 hover:shadow-xl relative overflow-hidden group ${
                                isScrolled 
                                ? 'btn-gradient text-white hover:shadow-purple-500/30' 
                                : 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white hover:text-purple-900 hover:shadow-white/20'
                            }`}
                        >
                            <div className={`absolute inset-0 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite] ${isScrolled ? 'bg-white/20' : 'bg-white/40'}`}></div>
                            <span className="relative z-10">Get Started</span>
                        </button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-4 md:hidden z-50">
                        <ThemeToggle className={!isScrolled ? "bg-white/10 text-white border-white/20" : ""} />
                        <button 
                            className={`p-2 rounded-lg ${isScrolled ? 'text-gray-800 dark:text-white' : 'text-white'}`}
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <XIcon className="h-6 w-6 text-gray-800 dark:text-white" /> : <MenuIcon className="h-6 w-6" />}
                        </button>
                    </div>
                </nav>

                {/* Mobile Menu Overlay */}
                <div className={`fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl z-40 transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col justify-center items-center gap-8`}>
                    {navLinks.map((link) => (
                        <a 
                            key={link.name} 
                            href={link.href} 
                            onClick={() => setMobileMenuOpen(false)}
                            className="text-2xl font-bold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 hover:scale-110"
                        >
                            {link.name}
                        </a>
                    ))}
                     <button
                        onClick={() => { onGetStarted(); setMobileMenuOpen(false); }}
                        className="btn-gradient text-white font-bold text-xl py-3 px-10 rounded-full shadow-lg w-64 transition-all duration-300 hover:shadow-purple-500/30 hover:scale-105 hover:-translate-y-1 active:scale-95 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                        <span className="relative z-10">Get Started</span>
                    </button>
                    <a
                        href="#dashboard-preview"
                        onClick={() => setMobileMenuOpen(false)}
                        className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white font-bold text-xl py-3 px-10 rounded-full shadow-md border border-gray-200 dark:border-slate-700 w-64 text-center flex items-center justify-center gap-2 transition-all duration-300 hover:bg-gray-200 dark:hover:bg-slate-700 hover:scale-105 hover:-translate-y-1 active:scale-95"
                    >
                        <SparklesIcon className="w-5 h-5 text-purple-500" />
                        Live Demo
                    </a>
                </div>
            </header>

            {/* Hero Section */}
            <main className="relative hero-gradient overflow-hidden pt-20">
                {/* Parallax Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div 
                        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/30 rounded-full blur-[120px] transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
                    ></div>
                    <div 
                        className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/30 rounded-full blur-[120px] transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)` }}
                    ></div>
                    
                    {/* Grid Overlay */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                    
                    {/* Floating Icons with Parallax */}
                    <div 
                        className="absolute top-[20%] left-[10%] opacity-20 animate-float transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * -40}px, ${mousePos.y * -40}px)` }}
                    >
                        <SparklesIcon className="w-12 h-12 text-white" />
                    </div>
                    <div 
                        className="absolute bottom-[20%] right-[15%] opacity-20 animate-float animation-delay-500 transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px)` }}
                    >
                        <TrendingUpIcon className="w-16 h-16 text-white" />
                    </div>
                    <div 
                        className="absolute top-[40%] right-[10%] opacity-10 animate-float animation-delay-300 transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * 20}px)` }}
                    >
                        <TargetIcon className="w-10 h-10 text-white" />
                    </div>
                    <div 
                        className="absolute bottom-[30%] left-[20%] opacity-15 animate-float animation-delay-700 transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * -25}px)` }}
                    >
                        <ChartPieIcon className="w-14 h-14 text-white" />
                    </div>
                    <div 
                        className="absolute top-[40%] right-[25%] opacity-10 animate-float animation-delay-1000 transition-transform duration-100 ease-out"
                        style={{ transform: `translate(${mousePos.x * 50}px, ${mousePos.y * -20}px)` }}
                    >
                        <RocketLaunchIcon className="w-10 h-10 text-white" />
                    </div>
                </div>

                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col items-center text-center py-20 lg:py-32">
                        <div className="max-w-5xl mx-auto animate-float-3d">
                             <div className="flex flex-col sm:flex-row items-center gap-4 mb-8 animate-fade-in-up pop-out-3d-slight">
                                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-lg">
                                     <div className="flex -space-x-2">
                                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 border-2 border-slate-900 shadow-sm"></div>
                                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-slate-900 shadow-sm"></div>
                                         <div className="w-6 h-6 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 border-2 border-slate-900 shadow-sm"></div>
                                     </div>
                                     <span className="text-xs font-medium text-white ml-1">Join 10,000+ students</span>
                                 </div>
                                 <div className="hidden sm:block w-1 h-1 rounded-full bg-white/30"></div>
                                 <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-indigo-500/20 border border-purple-500/30 backdrop-blur-md hover:from-purple-500/30 hover:to-indigo-500/30 transition-colors cursor-default shadow-lg shadow-purple-500/10">
                                    <SparklesIcon className="w-4 h-4 text-yellow-300" />
                                    <span className="text-xs font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-indigo-200 tracking-wide uppercase">New: Live Market Insights</span>
                                 </div>
                             </div>
                             <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-white leading-tight tracking-tight mb-8 animate-fade-in-up animation-delay-100 drop-shadow-2xl pop-out-3d">
                                Decode Your Future <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200">
                                    <Typewriter text="with AI Precision." delay={80} showCursor={true} />
                                </span>
                            </h1>
                            <p className="mt-6 text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200 font-light pop-out-3d-slight">
                                From stream selection to college admissions, let our Gemini-powered AI guide every step of your academic journey.
                            </p>
                            <p className="mt-3 text-lg md:text-xl text-purple-200 font-semibold max-w-3xl mx-auto animate-fade-in-up animation-delay-200 pop-out-3d-slight">
                                We show students the economic reality before they choose their future.
                            </p>
                            
                            <div className="mt-12 flex flex-col sm:flex-row gap-5 justify-center animate-fade-in-up animation-delay-300 pop-out-3d-slight">
                                <button
                                    onClick={onGetStarted}
                                    className="btn-gradient text-white font-bold text-lg py-4 px-10 rounded-full shadow-xl shadow-purple-900/40 transition-all hover:scale-105 hover:-translate-y-1 hover:shadow-purple-700/50 flex items-center justify-center gap-3 ring-4 ring-white/10 relative overflow-hidden group"
                                >
                                   <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                                   <RocketLaunchIcon className="w-6 h-6 relative z-10 group-hover:animate-bounce" />
                                   <span className="relative z-10">Start Free Analysis</span>
                                </button>
                                <a
                                    href="#dashboard-preview"
                                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-lg py-4 px-10 rounded-full border border-white/30 transition-all hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 shadow-lg relative overflow-hidden group"
                                >
                                    <div className="absolute inset-0 bg-white/10 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                                    <SparklesIcon className="w-6 h-6 text-yellow-300 relative z-10" />
                                    <span className="relative z-10">Live Demo</span>
                                </a>
                                <a
                                    href="#how-it-works"
                                    className="bg-transparent hover:bg-white/5 text-indigo-100 font-semibold text-lg py-4 px-8 rounded-full transition-all flex items-center justify-center gap-2 hover:text-white underline underline-offset-4 decoration-white/30 hover:decoration-white group hover:-translate-y-1"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" /></svg>
                                    See How It Works
                                </a>
                            </div>
                        </div>

                        {/* Floating Stats Section with Counting Animation */}
                        <div className="w-full max-w-5xl mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 animate-fade-in-up animation-delay-400">
                            <StatCard value={500} suffix="+" label="Colleges Indexed" icon={<CollegeIcon className="w-6 h-6"/>} />
                            <StatCard value={50} suffix="+" label="Career Paths" icon={<BriefcaseIcon className="w-6 h-6"/>} />
                            <StatCard value={24} suffix="/7" label="AI Guidance" icon={<SparklesIcon className="w-6 h-6"/>} />
                            <StatCard value={10000} suffix="+" label="Possibilities" icon={<TrendingUpIcon className="w-6 h-6"/>} />
                        </div>
                    </div>
                </div>
            </main>
            
            {/* Trusted By Section */}
            <TrustedBy />

            {/* NEW 3D Dashboard Preview Section */}
            <section id="dashboard-preview" className="bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-950">
                <DashboardPreview />
            </section>

            {/* Bento Grid Features Section */}
            <section id="features" className="py-24 bg-gray-50 dark:bg-slate-950 relative border-t border-gray-200 dark:border-slate-800">
                {/* Background Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="text-center mb-20">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">Features</span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mt-2">Your Personal AI Toolkit</h2>
                        <p className="mt-4 text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Everything you need to navigate your academic journey, powered by advanced artificial intelligence.</p>
                    </div>
                    <div className="bento-grid">
                        <BentoItem 
                            className="bento-item-1 items-center justify-center flex flex-col text-center bg-gradient-to-b from-white to-purple-50/50 dark:from-slate-800 dark:to-slate-900/50 !border-purple-200 dark:!border-purple-900/50 shadow-lg"
                            icon={<StreamIcon className="h-10 w-10 text-purple-600" />} 
                            title="AI Stream Guidance"
                            description={
                                <>
                                    <p className="mb-4 font-medium text-gray-700 dark:text-gray-300">Unlock your true potential. Our AI decodes your personality and passions to find your perfect fit.</p>
                                    <ul className="space-y-2 text-sm text-left bg-white/80 dark:bg-slate-900/80 p-4 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900/30 w-full">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Personalized AI Survey:</strong> Tailored questions.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Instant Recommendations:</strong> Stream & Career.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>"Day in the Life" Sim:</strong> AI-generated stories.</span></li>
                                    </ul>
                                </>
                            } 
                        />
                        <BentoItem 
                            className="bento-item-2"
                            icon={<NavigatorIcon className="h-8 w-8 text-purple-600" />} 
                            title="Academic Navigator" 
                            description={
                                <>
                                    <p>Your step-by-step guide to academic excellence.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Custom Roadmap:</strong> Grades 11 & 12 planning.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Checklist:</strong> Track subjects & skills.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Skill Deep Dives:</strong> Curated learning guides.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-3"
                            icon={<CollegeIcon className="h-8 w-8 text-purple-600" />} 
                            title="College Insights" 
                             description={
                                <>
                                    <p>Navigate colleges with an AI expert.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Conversational Search:</strong> "Top colleges in..."</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Compare:</strong> Side-by-side AI analysis.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Competition Finder:</strong> Live opportunities.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-4"
                            icon={<EntrepreneurshipIcon className="h-8 w-8 text-purple-600" />} 
                            title="Entrepreneurship Hub"
                            description={
                                <>
                                    <p>Transform ideas into business.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>AI Idea Generator:</strong> Startup concepts.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Business Plan:</strong> Instant draft & SWOT.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-5"
                            icon={<TrendingUpIcon className="h-8 w-8 text-purple-600" />} 
                            title="Future Trends" 
                             description={
                                <>
                                    <p>See the future before it happens.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Trend Reports:</strong> 5-10 year outlook.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Google Search:</strong> Live industry data.</span></li>
                                    </ul>
                                </>
                            }
                        />
                        <BentoItem 
                             className="bento-item-6"
                            icon={<PaintBrushIcon className="h-8 w-8 text-purple-600" />} 
                            title="Artists' Corner" 
                            description={
                                <>
                                    <p>A dedicated space for creatives.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Artist Roadmap:</strong> Portfolio & Network.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Grant Finder:</strong> Find free funding.</span></li>
                                    </ul>
                                </>
                            }
                        />
                         <BentoItem 
                            className="bento-item-7"
                            icon={<ChartPieIcon className="h-8 w-8 text-purple-600" />} 
                            title="Live Market Insights" 
                            description={
                                <>
                                    <p>Real-time job market pulse.</p>
                                    <ul className="mt-4 space-y-2 text-sm">
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Salary Data:</strong> Current earnings.</span></li>
                                        <li className="flex items-start gap-2"><CheckIcon className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" /><span><strong>Demand:</strong> Hiring hotspots.</span></li>
                                    </ul>
                                </>
                            }
                        />
                    </div>
                </div>
            </section>
            
             {/* How It Works Section */}
            <section id="how-it-works" className="py-24 bg-white dark:bg-slate-900 overflow-hidden relative border-t border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                         <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">The Process</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Your 5-Step Journey</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">From confusion to clarity in minutes. Here's how our AI guides you.</p>
                    </div>
                    <div className="relative">
                        <div className="journey-path-container">
                             <div className="journey-path">
                                <svg width="100%" height="100%" viewBox="0 0 250 1500" preserveAspectRatio="none">
                                    <defs>
                                        <linearGradient id="journey-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop id="journey-gradient-stop-1" offset="0%" />
                                            <stop id="journey-gradient-stop-2" offset="100%" />
                                        </linearGradient>
                                    </defs>
                                    <path d="M 0,0 C 0,150 250,150 250,300 S 0,450 0,600 S 250,750 250,900 S 0,1050 0,1200 S 125,1350 125,1500" fill="none" className="journey-path-svg" />
                                </svg>
                            </div>
                            
                            <div className="relative flex justify-center items-center mb-24">
                                <div className="w-full lg:w-5/12 mr-auto animate-fade-in-up">
                                    <div className="journey-card hover:border-purple-300 dark:hover:border-purple-600 group cursor-default">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">1</div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Discover Your Persona</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">Start with our quick AI survey. Uncover your unique strengths, passions, and the professional persona that fits you best.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center mb-24">
                                <div className="w-full lg:w-5/12 ml-auto animate-fade-in-up animation-delay-200">
                                      <div className="journey-card hover:border-purple-300 dark:hover:border-purple-600 group cursor-default">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">2</div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Receive AI Blueprint</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">Instantly receive a personalized report detailing your ideal academic stream and a top career recommendation.</p>
                                    </div>
                                </div>
                            </div>
                            
                             <div className="relative flex justify-center items-center mb-24">
                                <div className="w-full lg:w-5/12 mr-auto animate-fade-in-up animation-delay-400">
                                      <div className="journey-card hover:border-purple-300 dark:hover:border-purple-600 group cursor-default">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">3</div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Visualize The Future</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">Immerse yourself in a 'Day in the Life' simulation to experience what your recommended career actually feels like.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center mb-24">
                                <div className="w-full lg:w-5/12 ml-auto animate-fade-in-up animation-delay-600">
                                      <div className="journey-card hover:border-purple-300 dark:hover:border-purple-600 group cursor-default">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12">4</div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Build Your Master Plan</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">Generate a custom 2-year Academic Roadmap. Get a checklist for subjects and skills to ensure you're always on track.</p>
                                    </div>
                                </div>
                            </div>

                             <div className="relative flex justify-center items-center">
                                <div className="w-full lg:w-5/12 mr-auto animate-fade-in-up animation-delay-800">
                                      <div className="journey-card hover:border-purple-300 dark:hover:border-purple-600 group cursor-default">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full btn-gradient text-white font-bold text-xl shadow-md ring-4 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">5</div>
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Launch & Lead</h3>
                                        </div>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400 leading-relaxed group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-300">Use our full toolkit to succeed. Find top colleges, explore trends, and even generate a business plan for your startup.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            {/* Testimonials Section */}
            <section id="testimonials" className="py-24 bg-gray-50 dark:bg-slate-950">
                <div className="container mx-auto px-6">
                     <div className="text-center mb-16">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">Testimonials</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Success Stories</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">See how students are finding their way with Peekafuture.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6 relative border-t-4 border-purple-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-default hover:shadow-purple-500/20 flex flex-col">
                            <QuoteIcon className="absolute top-6 left-8 h-16 w-16 text-purple-100 dark:text-purple-900/30 group-hover:scale-110 transition-transform duration-300 group-hover:text-purple-200 dark:group-hover:text-purple-800/50" />
                            <p className="relative text-lg text-gray-700 dark:text-gray-300 italic z-10 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 flex-grow">"The Academic Navigator roadmap was a game-changer. I finally have a clear, step-by-step plan for the next two years. I feel so much more confident about my future!"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center font-bold text-purple-700 dark:text-purple-300 transition-colors duration-300 group-hover:bg-purple-200 dark:group-hover:bg-purple-800">RS</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">Ruhi Sharma</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Aspiring Engineer, Delhi</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6 relative border-t-4 border-blue-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-default hover:shadow-blue-500/20 flex flex-col">
                            <QuoteIcon className="absolute top-6 left-8 h-16 w-16 text-blue-100 dark:text-blue-900/30 group-hover:scale-110 transition-transform duration-300 group-hover:text-blue-200 dark:group-hover:text-blue-800/50" />
                            <p className="relative text-lg text-gray-700 dark:text-gray-300 italic z-10 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 flex-grow">"I was completely lost between Commerce and Arts. The AI survey not only recommended Commerce but also showed me exciting careers I never knew existed. Highly recommend!"</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                                <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center font-bold text-blue-700 dark:text-blue-300 transition-colors duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-800">RM</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">Rohan Mehta</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Future Entrepreneur, Mumbai</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6 relative border-t-4 border-pink-500 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group cursor-default hover:shadow-pink-500/20 flex flex-col">
                            <QuoteIcon className="absolute top-6 left-8 h-16 w-16 text-pink-100 dark:text-pink-900/30 group-hover:scale-110 transition-transform duration-300 group-hover:text-pink-200 dark:group-hover:text-pink-800/50" />
                            <p className="relative text-lg text-gray-700 dark:text-gray-300 italic z-10 font-medium group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300 flex-grow">"As a parent, I was worried about my son's career choices. The AI insights provided data-backed reassurance that he's on the right path. It's like having a top-tier counselor 24/7."</p>
                            <div className="flex items-center gap-4 pt-4 border-t border-gray-100 dark:border-slate-700 mt-auto">
                                <div className="h-12 w-12 rounded-full bg-pink-100 dark:bg-pink-900 flex items-center justify-center font-bold text-pink-700 dark:text-pink-300 transition-colors duration-300 group-hover:bg-pink-200 dark:group-hover:bg-pink-800">AK</div>
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors duration-300">Amit Kumar</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Parent, Bangalore</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Meet the AI Section */}
            <section id="ai-engine" className="py-24 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800 relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
                
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="lg:w-1/2 space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-sm font-semibold uppercase tracking-wide">
                                <SparklesIcon className="w-4 h-4" /> Powered by Gemini 2.5
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight">
                                Intelligence that understands <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-500">you.</span>
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                                Peekafuture isn't just a database. It's an intelligent engine that analyzes your unique strengths, market trends, and academic data to provide hyper-personalized guidance.
                            </p>
                            
                            <div className="space-y-6">
                                <div className="flex gap-4 group cursor-default">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/20 group-hover:border-indigo-500/30">
                                        <TargetIcon className="w-6 h-6 text-indigo-500 transition-transform duration-300 group-hover:rotate-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">Deep Personalization</h4>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400">Analyzes your survey responses to find careers that match your core personality, not just your grades.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group cursor-default">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/20 group-hover:border-purple-500/30">
                                        <ChartPieIcon className="w-6 h-6 text-purple-500 transition-transform duration-300 group-hover:rotate-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Real-Time Market Data</h4>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400">Cross-references career paths with live job market trends and salary data to ensure future viability.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4 group cursor-default">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white dark:bg-slate-800 shadow-md flex items-center justify-center border border-gray-100 dark:border-slate-700 transition-all duration-300 group-hover:scale-110 group-hover:shadow-pink-500/20 group-hover:border-pink-500/30">
                                        <SparklesIcon className="w-6 h-6 text-pink-500 transition-transform duration-300 group-hover:rotate-12" />
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">Generative Insights</h4>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400">Creates custom "Day in the Life" stories and business plans on the fly, tailored specifically to your goals.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="lg:w-1/2 w-full animate-float animation-delay-500">
                            <div className="relative rounded-2xl bg-slate-900 p-8 shadow-2xl border border-slate-800 overflow-hidden group transition-all duration-300 hover:shadow-[0_0_40px_rgba(168,85,247,0.3)] hover:-translate-y-2 cursor-default">
                                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                <div className="relative">
                                    {/* Mock Code/Terminal Window */}
                                    <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-4">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        <span className="ml-2 text-xs text-slate-500 font-mono">gemini-analysis.ts</span>
                                    </div>
                                    
                                    <div className="font-mono text-sm space-y-4">
                                        <div className="text-slate-400">
                                            <span className="text-pink-400">const</span> <span className="text-blue-400">studentProfile</span> = {'{'}
                                        </div>
                                        <div className="pl-4 text-slate-300">
                                            strengths: [<span className="text-green-400">'analytical'</span>, <span className="text-green-400">'creative'</span>],<br/>
                                            interests: [<span className="text-green-400">'technology'</span>, <span className="text-green-400">'design'</span>],<br/>
                                            marketTrend: <span className="text-orange-400">await</span> <span className="text-yellow-200">getLiveTrends</span>()
                                        </div>
                                        <div className="text-slate-400">{'}'};</div>
                                        
                                        <div className="text-slate-400 mt-6">
                                            <span className="text-pink-400">const</span> <span className="text-blue-400">recommendation</span> = <span className="text-orange-400">await</span> <span className="text-yellow-200">gemini</span>.<span className="text-blue-300">analyze</span>(studentProfile);
                                        </div>
                                        
                                        <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                            <div className="text-xs text-slate-500 mb-2">// Output</div>
                                            <div className="text-green-400 flex items-start gap-2">
                                                <span className="text-slate-500">{'>'}</span>
                                                <span>
                                                    <Typewriter text="Generating optimal career path: UX Engineer..." delay={40} />
                                                    <span className="animate-pulse inline-block w-2 h-4 bg-green-400 ml-1 align-middle"></span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-24 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-6 max-w-5xl">
                    <div className="text-center mb-16">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">Why Us</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Peekafuture vs. Traditional Counseling</h2>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Traditional */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 opacity-80 shadow-sm">
                            <h3 className="text-2xl font-bold text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-gray-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </span>
                                Traditional Counseling
                            </h3>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400"><svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Expensive hourly rates (₹2,000+)</li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400"><svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Static, outdated career data</li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400"><svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Generic advice based on marks</li>
                                <li className="flex items-start gap-3 text-gray-600 dark:text-gray-400"><svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> Limited availability & slow responses</li>
                            </ul>
                        </div>
                        {/* Peekafuture */}
                        <div className="bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-purple-500 shadow-xl relative overflow-hidden transform transition-transform hover:-translate-y-1">
                            <div className="absolute top-0 right-0 bg-purple-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-lg uppercase tracking-wider shadow-md">The Future</div>
                            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400 mb-6 flex items-center gap-3">
                                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400">
                                    <SparklesIcon className="w-5 h-5" />
                                </span>
                                Peekafuture AI
                            </h3>
                            <ul className="space-y-5">
                                <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> 100% Free to start & explore</li>
                                <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> Real-time job market & salary data</li>
                                <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> Hyper-personalized to your personality</li>
                                <li className="flex items-start gap-3 text-gray-800 dark:text-gray-200 font-medium"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> Available 24/7, anywhere, instantly</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-24 bg-gray-50 dark:bg-slate-950 border-t border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-16">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">Pricing</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Simple, Transparent Plans</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Start for free, upgrade when you need more power.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Plan */}
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-gray-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Explorer</h3>
                            <div className="text-4xl font-extrabold text-gray-900 dark:text-white mb-6">₹0<span className="text-lg font-medium text-gray-500 dark:text-gray-400">/forever</span></div>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Perfect for getting started and discovering your potential.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> Basic Career Persona Test</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> 3 AI Career Recommendations</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5"/> Standard College Search</li>
                                <li className="flex items-start gap-3 text-gray-400 dark:text-gray-600 line-through"><CheckIcon className="w-5 h-5 text-gray-300 dark:text-gray-700 flex-shrink-0 mt-0.5"/> Live Market Insights</li>
                                <li className="flex items-start gap-3 text-gray-400 dark:text-gray-600 line-through"><CheckIcon className="w-5 h-5 text-gray-300 dark:text-gray-700 flex-shrink-0 mt-0.5"/> Custom Business Plans</li>
                            </ul>
                            <button onClick={onGetStarted} className="w-full py-3 px-6 rounded-xl font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors duration-300">Start Free</button>
                        </div>
                        {/* Pro Plan */}
                        <div className="bg-gradient-to-b from-purple-50 to-white dark:from-slate-800 dark:to-slate-900 p-8 rounded-2xl border-2 border-purple-500 shadow-xl relative transform md:-translate-y-4 transition-all duration-300 hover:-translate-y-6 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-purple-500 text-white text-xs font-bold px-4 py-1 rounded-b-lg uppercase tracking-wider">Most Popular</div>
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-2">Visionary</h3>
                            <div className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 mb-6">₹499<span className="text-lg font-medium text-gray-500 dark:text-gray-400">/month</span></div>
                            <p className="text-gray-600 dark:text-gray-400 mb-8">Unlock the full power of AI for your career journey.</p>
                            <ul className="space-y-4 mb-8">
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"/> Advanced Personality Mapping</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"/> Unlimited AI Recommendations</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"/> Real-time Salary & Trend Data</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"/> Generative Business Plans</li>
                                <li className="flex items-start gap-3 text-gray-700 dark:text-gray-300"><CheckIcon className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5"/> Priority AI Processing</li>
                            </ul>
                            <button onClick={onGetStarted} className="w-full py-3 px-6 rounded-xl font-bold text-white btn-gradient shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all duration-300 transform hover:-translate-y-1 relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                                <span className="relative z-10">Upgrade to Pro</span>
                            </button>
                        </div>
                    </div>
                </div>
            </section>

             {/* FAQ Section */}
            <section id="faq" className="py-24 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
                <div className="container mx-auto px-6 max-w-3xl">
                    <div className="text-center mb-16">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 font-bold tracking-wider uppercase text-sm">FAQ</span>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mt-2">Frequently Asked Questions</h2>
                        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">Got questions? We've got answers.</p>
                    </div>
                    <div className="space-y-4">
                        <FAQItem 
                            question="Is Peekafuture really free?" 
                            answer="Yes! You can start with our free demo mode to explore all features. We believe every student deserves access to quality career guidance." 
                        />
                        <FAQItem 
                            question="How accurate are the AI recommendations?" 
                            answer="Our AI uses advanced models (Gemini 2.5) to analyze your personality and interests deeply. While highly accurate and personalized, we recommend using it as a powerful guide alongside discussions with parents and mentors." 
                        />
                        <FAQItem 
                            question="Can I save my roadmap?" 
                            answer="Absolutely. Create a free account to save your survey results, roadmaps, business plans, and college shortlists so you can access them anytime." 
                        />
                        <FAQItem 
                            question="Is the college data up to date?" 
                            answer="We use a combination of verified database entries for top colleges and real-time Google Search grounding to ensure you get the most current information available." 
                        />
                    </div>
                </div>
            </section>
            
            {/* Footer CTA */}
            <section className="relative py-24 overflow-hidden bg-gray-900 dark:bg-black">
                 {/* Decorative background blur */}
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl bg-purple-600/20 blur-[100px] pointer-events-none"></div>
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                 
                 <div className="container mx-auto px-6 text-center relative z-10">
                     <div className="inline-block p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm mb-8 transition-transform duration-300 hover:scale-110 hover:rotate-12 cursor-default">
                        <SparklesIcon className="w-8 h-8 text-yellow-300 mx-auto animate-pulse" />
                     </div>
                     <h2 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tight">Ready to Decode Your Future?</h2>
                     <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">Join thousands of students who are planning their academic journey with clarity, confidence, and AI.</p>
                      <button
                        onClick={onGetStarted}
                        className="bg-white text-gray-900 hover:bg-gray-100 font-bold text-xl py-4 px-12 rounded-full shadow-2xl shadow-purple-500/20 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-purple-500/40 relative overflow-hidden group"
                    >
                        <div className="absolute inset-0 bg-purple-500/10 -translate-x-full skew-x-12 group-hover:animate-[shine_1.5s_ease-in-out_infinite]"></div>
                        <span className="relative z-10">Get Started for Free</span>
                    </button>
                 </div>
            </section>
            
            {/* Site Footer */}
            <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
                <div className="container mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                        {/* Column 1: Brand & Socials */}
                        <div className="md:col-span-2">
                            <Logo className="text-2xl" variant="inverted" />
                            <p className="mt-6 text-sm leading-relaxed max-w-sm text-gray-500">
                                Peekafuture combines advanced AI with deep educational data to help students make smarter career decisions. Your future, simplified.
                            </p>
                            
                            {/* Newsletter Signup */}
                            <div className="mt-8">
                                <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Stay Updated</h3>
                                <form className="flex gap-2 max-w-sm">
                                    <div className="relative flex-grow">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <EnvelopeIcon className="h-5 w-5 text-gray-500" />
                                        </div>
                                        <input 
                                            type="email" 
                                            placeholder="Enter your email" 
                                            className="w-full pl-10 pr-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-sm text-white placeholder-gray-500 transition-colors duration-300 hover:border-gray-600"
                                        />
                                    </div>
                                    <button 
                                        type="button"
                                        className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-4 rounded-lg text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 active:scale-95"
                                    >
                                        Subscribe
                                    </button>
                                </form>
                            </div>

                            <div className="mt-8 flex space-x-6">
                                <a href="https://www.linkedin.com/in/anany-sharma-955603144/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-purple-400 transition-all duration-300 hover:scale-110 hover:-translate-y-1" aria-label="LinkedIn Profile">
                                    <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                        
                        {/* Quick Links */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-100 tracking-wider uppercase mb-4">Product</h3>
                            <ul className="space-y-3">
                                <li><a href="#features" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">Features</a></li>
                                <li><a href="#how-it-works" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">How It Works</a></li>
                                <li><a href="#testimonials" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">Success Stories</a></li>
                                <li><a href="#pricing" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">Pricing</a></li>
                                <li><a href="#faq" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">FAQ</a></li>
                            </ul>
                        </div>

                        {/* Legal */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-100 tracking-wider uppercase mb-4">Company</h3>
                            <ul className="space-y-3">
                                <li><a href="#" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">About Us</a></li>
                                <li><a href="#" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">Privacy Policy</a></li>
                                <li><a href="#" className="text-sm hover:text-purple-400 transition-colors inline-block hover:translate-x-1 duration-300">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Bottom Bar */}
                    <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4">
                        <p className="text-xs text-gray-600">
                            &copy; 2025 Peekafuture. All Rights Reserved.
                        </p>
                        <p className="text-xs text-gray-500">
                            Crafted with ❤️ by <a href="https://www.linkedin.com/in/anany-sharma-955603144/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Anany Sharma</a>
                        </p>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-8 right-8 p-3 rounded-full bg-purple-600 text-white shadow-lg shadow-purple-500/30 transition-all duration-300 z-50 hover:bg-purple-500 hover:scale-110 hover:-translate-y-1 ${showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0 pointer-events-none'}`}
                aria-label="Scroll to top"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
            </button>
        </div>
    );
};

export default WelcomePage;
