import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Play, Database, BarChart3, TerminalSquare, FileSpreadsheet, Award, GraduationCap, Activity, Lightbulb, Wrench, ShieldCheck, TrendingUp, Layers, MessageSquare, Zap, Download, Filter, Network, LayoutGrid, Box, PieChart, Search, Calculator, Globe, ChevronUp, Github, Linkedin, Mail } from 'lucide-react';
import * as THREE from 'three';

// --- UTILS & ANIMATION VARIANTS ---

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { y: 40, opacity: 0, filter: 'blur(10px)' },
  show: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: 'spring', bounce: 0.2, duration: 1.2 },
  },
};

// --- COMPONENTS ---

// 1. Interactive 3D Dashboard Card with Clickable GitHub Link
const Dashboard3DUI = ({ activeProject }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className="w-full h-full perspective-[1500px] flex items-center justify-center p-8"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full aspect-[4/3] rounded-2xl bg-[#0a0f18] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-6 md:p-8 flex flex-col"
      >
        {/* Dynamic Glow Behind Card */}
        <div 
          className="absolute inset-0 -z-10 blur-3xl opacity-20 transition-colors duration-700" 
          style={{ backgroundColor: activeProject.glowColor }} 
        />
        
        {/* Header with GitHub Link Button */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6" style={{ transform: "translateZ(30px)" }}>
          <span className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{activeProject.chartData.title}</span>
          <a 
            href={activeProject.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white text-xs hover:bg-emerald-500 hover:text-black hover:border-emerald-400 transition-all cursor-none"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View Repo</span>
            <ArrowUpRight className="w-3 h-3" />
          </a>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-4 mb-8" style={{ transform: "translateZ(40px)" }}>
          {activeProject.chartData.kpis.map((kpi, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-4 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-white/40 mb-2">{kpi.label}</span>
              <span className="text-2xl md:text-3xl font-bold text-white tracking-tight">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* SVG Glowing Line Chart */}
        <div className="flex-1 relative border-b border-white/5" style={{ transform: "translateZ(50px)" }}>
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1,2,3,4].map((i) => <div key={i} className="w-full h-[1px] bg-white/[0.02]" />)}
          </div>
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`gradient-${activeProject.title.replace(/\s+/g, '')}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeProject.strokeColor} stopOpacity="0.4" />
                <stop offset="100%" stopColor={activeProject.strokeColor} stopOpacity="0.0" />
              </linearGradient>
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            
            <motion.path 
              key={`fill-${activeProject.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              d={`${activeProject.chartData.path} L 100 100 L 0 100 Z`}
              fill={`url(#gradient-${activeProject.title.replace(/\s+/g, '')})`}
            />
            
            <motion.path 
              key={`line-${activeProject.title}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
              d={activeProject.chartData.path}
              fill="none"
              stroke={activeProject.strokeColor}
              strokeWidth="1.5"
              filter="url(#glow)"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Footer */}
        <div className="mt-4 flex gap-6" style={{ transform: "translateZ(20px)" }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span className="text-[10px] tracking-widest text-white/40 uppercase">Actual Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-white/20" />
            <span className="text-[10px] tracking-widest text-white/40 uppercase">Target</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Custom Smooth Cursor
const CustomCursor = () => {
  const [mousePosition, setMousePosition] = useState({ x: -100, y: -100 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e) => {
      setIsVisible(true);
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    const updateHoverState = (e) => {
      const target = e.target;
      if (target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', updateHoverState);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', updateHoverState);
    };
  }, []);

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mousePosition.x - 16, springConfig);
  const cursorY = useSpring(mousePosition.y - 16, springConfig);

  return (
    <motion.div
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] mix-blend-difference flex items-center justify-center"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        backgroundColor: isHovering ? 'transparent' : 'white',
        border: isHovering ? '1px solid white' : 'none',
        scale: isHovering ? 2 : 1,
      }}
    >
      {isHovering && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-1 h-1 bg-white rounded-full" />}
    </motion.div>
  );
};

// Magnetic Button Component
const MagneticButton = ({ children, className, ...props }) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.2, y: middleY * 0.2 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <div className="absolute inset-0 bg-white translate-y-[101%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-0 rounded-full" />
    </motion.button>
  );
};

// Scroll To Top Button
const ScrollToTop = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.onChange((latest) => {
      if (latest > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    });
  }, [scrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[90] p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 cursor-none shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] group"
        >
          <ChevronUp className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// Hero 3D Model
const Hero3DModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const coreGeo = new THREE.IcosahedronGeometry(3, 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.15 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const innerGeo = new THREE.IcosahedronGeometry(2.8, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x090e17, transparent: true, opacity: 0.8 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 25; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({ size: 0.04, color: 0x34d399, transparent: true, opacity: 0.4, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onDocumentMouseMove = (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
    };
    document.addEventListener('mousemove', onDocumentMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;

      core.rotation.y += 0.002;
      core.rotation.x += 0.001;
      inner.rotation.y -= 0.001;
      inner.rotation.x -= 0.002;
      particlesMesh.rotation.y = -elapsedTime * 0.02;
      
      scene.rotation.x += 0.05 * (targetY - scene.rotation.x);
      scene.rotation.y += 0.05 * (targetX - scene.rotation.y);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      width = mountRef.current.clientWidth;
      height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      coreGeo.dispose(); coreMat.dispose(); innerGeo.dispose(); innerMat.dispose(); particlesGeo.dispose(); particlesMat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-90" />;
};

const Services3DModel = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 12, 18);
    camera.lookAt(0, 2, 0);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const grid = new THREE.PolarGridHelper(30, 16, 8, 32, 0x22d3ee, 0x22d3ee);
    grid.material.transparent = true;
    grid.material.opacity = 0.05;
    scene.add(grid);

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      grid.rotation.y += 0.002;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);
  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen" />;
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      <Hero3DModel />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center mt-20"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-4">
          <span className="px-4 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md text-xs font-medium tracking-widest uppercase text-emerald-100">
            Data Analytics & Intelligence
          </span>
        </motion.div>
        
        <motion.h1 className="text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter font-bold text-white mix-blend-difference">
          <motion.span variants={fadeUp} className="block">RAW DATA</motion.span>
          <motion.span variants={fadeUp} className="block italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            CLEAR INSIGHTS
          </motion.span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="mt-8 text-lg md:text-xl text-white/50 max-w-xl font-light">
          I transform complex, fragmented datasets into strategic business intelligence using advanced SQL, Power BI, and Python.
        </motion.p>
        
        <motion.div variants={fadeUp} className="mt-12">
          <MagneticButton className="px-8 py-4 rounded-full border border-white/20 text-white font-medium hover:text-black hover:border-white group flex items-center justify-center gap-2">
            <span>Explore Dashboards</span>
            <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
          </MagneticButton>
        </motion.div>
      </motion.div>
    </section>
  );
};

const DataStackVisual = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const mouseRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]); 
  const mouseRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]); 

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX / rect.width - 0.5);
    y.set(e.clientY / rect.height - 0.5);
  };

  const handleMouseLeave = () => { x.set(0); y.set(0); };

  const loopSequence = {
    duration: 12,
    repeat: Infinity,
    times: [0, 0.15, 0.3, 0.45, 0.7, 0.85, 1],
    ease: "easeInOut"
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden perspective-[2000px]" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <motion.div
        animate={{ rotateX: [55, 55, 55, 0, 0, 55, 55], rotateZ: [-40, -40, -40, 0, 0, -40, -40], scale: [0.75, 0.75, 0.75, 1, 1, 0.75, 0.75] }}
        transition={loopSequence}
        className="w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div style={{ rotateX: mouseRotateX, rotateY: mouseRotateY, transformStyle: "preserve-3d" }} className="relative w-72 h-72 md:w-80 md:h-80">
           <motion.div animate={{ z: [-160, -160, -2, -2, -2, -2, -160] }} transition={loopSequence} className="absolute inset-0 border border-white/10 bg-[#050a14] rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
           </motion.div>
           
           <motion.div animate={{ z: [0, 0, -1, -1, -1, -1, 0] }} transition={loopSequence} className="absolute inset-0 border border-cyan-400/40 bg-cyan-900/20 backdrop-blur-md rounded-[2rem]" />
           
           <motion.div animate={{ z: [160, 160, 0, 0, 0, 0, 160] }} transition={loopSequence} className="absolute inset-0 border border-white/40 bg-[#0a121e]/80 backdrop-blur-2xl rounded-[2rem] p-6 flex flex-col">
              <motion.div animate={{ opacity: [0, 0, 0, 1, 1, 0, 0], y: [15, 15, 15, 0, 0, 15, 15] }} transition={loopSequence} className="w-full h-full flex flex-col">
                <div className="flex justify-between items-center mb-6">
                   <div className="w-1/2 h-2 bg-white/20 rounded-full" />
                   <div className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse" />
                </div>
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-white/5 rounded-xl p-3 border border-white/10"><div className="text-2xl font-bold text-white">84.2%</div></div>
                   <div className="bg-white/5 rounded-xl p-3 border border-white/10"><div className="text-2xl font-bold text-cyan-400">1.2M</div></div>
                </div>
              </motion.div>
           </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const About = () => {
  return (
    <section id="about" className="relative w-full py-32 bg-[#090e17] z-10">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 relative aspect-[4/5] overflow-hidden rounded-[2.5rem] bg-[#060a11] border border-white/5">
            <DataStackVisual />
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
              STRATEGIC <br/>
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DATA ANALYST</span>
            </h2>
            <p className="text-white/50 text-lg md:text-xl font-light leading-relaxed mb-12">
              Operating at the intersection of business strategy and data science. I don't just build dashboards; I architect clear analytical narratives that drive executive decisions.
            </p>
            <div className="flex items-center gap-8 md:gap-16 pt-8 border-t border-white/10">
              <div>
                <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600 mb-2 block">1M+</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Records Analysed</span>
              </div>
              <div className="w-[1px] h-16 bg-white/20" />
              <div>
                <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-600 mb-2 block">5+</span>
                <span className="text-xs uppercase tracking-widest text-white/40">Enterprise Projects</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Services = () => {
  const services = [
    { title: 'SQL & Architecture', desc: 'Complex querying, CTEs, window functions, and database management for pristine data extraction.' },
    { title: 'Power BI & DAX', desc: 'Dynamic KPI dashboards, star schema data modeling, and actionable visual storytelling.' },
    { title: 'Python Analytics', desc: 'Automated data cleaning, Exploratory Data Analysis (EDA), and manipulation using Pandas and NumPy.' },
  ];

  return (
    <section id="services" className="relative w-full py-32 bg-[#090e17] z-10 overflow-hidden">
      <Services3DModel />
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter">CORE <span className="italic font-light text-white/60">EXPERTISE</span></h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <div key={i} className="p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5">
              <span className="text-5xl font-light text-white/20 mb-12 block">0{i + 1}</span>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-white/50 font-light leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Experience = () => {
  const experiences = [
    {
      role: "Data Analyst",
      company: "SVLL",
      date: "Jul 2026 – Oct 2026",
      points: [
        "Developed live Power BI dashboards by consolidating data from 7 ERP modules, replacing manual reporting with a centralised reporting solution.",
        "Designed SQL queries and Power Query transformations across 32 validated fields, implementing business logic and DAX calculations to monitor LR/POD status, lead times, delays, and on-time performance through interactive dashboards and record-level drill-through.",
        "Developed analytical reports covering freight budget vs. actuals, 112K+ vehicle placements, daily dispatch planning, 1.2M+ claim records, and HR recruitment analytics, supporting operational monitoring, cost analysis, and business decision-making."
      ]
    },
    {
      role: "Data Analytics & Reporting Intern",
      company: "VNR Seeds",
      date: "Jun 2025 – Aug 2025",
      points: [
        "Cleaned and validated 10,000+ farmer records using Python (Pandas), Excel, and Google Sheets, standardising data formats, removing duplicates, and handling missing values to improve data quality and reporting accuracy.",
        "Analysed 50,000+ customer interactions across digital channels using Excel and Power BI to identify engagement patterns, customer trends, and behavioural insights.",
        "Created interactive reports and visualisations in Power BI to present customer engagement trends, compare performance across digital channels, and support data-driven reporting."
      ]
    }
  ];

  return (
    <section id="experience" className="relative w-full py-32 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16">PROFESSIONAL <span className="italic font-light text-white/60">EXPERIENCE</span></h2>
        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-20">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative pl-8 md:pl-16">
              <div className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-6">
                <h3 className="text-3xl font-bold text-white">{exp.role}</h3>
                <span className="text-xl text-cyan-400 font-light">@ {exp.company}</span>
                <span className="text-sm text-white/40 uppercase md:ml-auto">{exp.date}</span>
              </div>
              <div className="space-y-4 text-white/60 font-light leading-relaxed">
                {exp.points.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  return (
    <div
      ref={divRef}
      onMouseMove={(e) => {
        const rect = divRef.current.getBoundingClientRect();
        setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

const SkillsDetail = () => {
  const bentoSkills = [
    { title: "SQL & Databases", color: "text-emerald-400", icon: <Database className="w-8 h-8 mb-6 text-emerald-400" />, items: ["PostgreSQL", "Query Optimisation", "CTEs & Window Functions"] },
    { title: "Python Analytics", color: "text-cyan-400", icon: <TerminalSquare className="w-8 h-8 mb-6 text-cyan-400" />, items: ["Pandas & NumPy", "EDA", "Matplotlib"] },
    { title: "Power BI & DAX", color: "text-blue-400", icon: <BarChart3 className="w-8 h-8 mb-6 text-blue-400" />, items: ["KPI Dashboards", "DAX Measures", "Power Query"] }
  ];

  return (
    <section id="skills" className="relative w-full py-32 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-16">TECHNICAL <span className="italic font-light text-white/50">ARSENAL</span></h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bentoSkills.map((stack, idx) => (
             <SpotlightCard key={idx} className="p-8">
                {stack.icon}
                <h3 className={`text-xl font-bold mb-6 ${stack.color}`}>{stack.title}</h3>
                <ul className="space-y-3">
                  {stack.items.map((item, i) => <li key={i} className="text-white/60 text-sm font-light">• {item}</li>)}
                </ul>
             </SpotlightCard>
          ))}
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    { 
      title: "HR Analytics Dashboard", 
      tool: "Power BI / DAX / SQL", 
      metric: "21d Turnaround Identified",
      github: "https://github.com/Inder616/Recruitment-Funnel-Hiring-Analytics-Dashboard",
      color: "from-emerald-500/20",
      glowColor: "#10b981",
      strokeColor: "#34d399",
      chartData: {
        title: "RECRUITMENT OVERVIEW",
        kpis: [
          { label: "REQUISITIONS", value: "408" },
          { label: "OFFER ACCEPT", value: "74.8%" },
          { label: "AVG. OFFER TIME", value: "21d" }
        ],
        path: "M 0 80 Q 15 80 25 65 T 50 50 T 75 35 T 100 20"
      }
    },
    { 
      title: "Patient-Appointment-Delay-No-Show-Analysis", 
      tool: "Python / Pandas", 
      metric: "111K+ Records Processed",
      github: "https://github.com/Inder616/Patient-Appointment-Delay-No-Show-Analysis",
      color: "from-cyan-500/20",
      glowColor: "#06b6d4",
      strokeColor: "#22d3ee",
      chartData: {
        title: "APPOINTMENT METRICS",
        kpis: [
          { label: "RECORDS", value: "111K" },
          { label: "NO-SHOW RATE", value: "12.4%" },
          { label: "WAIT DELAY", value: "7d+" }
        ],
        path: "M 0 90 L 20 85 L 40 40 L 60 70 L 80 20 L 100 10"
      }
    },
    { 
      title: "Global Salary Insights", 
      tool: "Advanced Excel", 
      metric: "111 Countries Modeled",
      github: "https://github.com/Inder616/Global-Data-Jobs-Salary-Dashboard",
      color: "from-blue-500/20",
      glowColor: "#3b82f6",
      strokeColor: "#60a5fa",
      chartData: {
        title: "SALARY DISTRIBUTION",
        kpis: [
          { label: "COUNTRIES", value: "111" },
          { label: "SR. PREMIUM", value: "+72%" },
          { label: "MEDIAN PAY", value: "$98K" }
        ],
        path: "M 0 95 Q 40 90 70 50 T 100 5"
      }
    },
    { 
      title: "Netflix Content Strategy Analysis", 
      tool: "Python / Power BI", 
      metric: "19K+ Titles Analyzed",
      github: "https://github.com/Inder616/Netflix-content-strategy-dashboard",
      color: "from-purple-500/20",
      glowColor: "#a855f7",
      strokeColor: "#c084fc",
      chartData: {
        title: "CATALOGUE GROWTH",
        kpis: [
          { label: "TITLES", value: "19K+" },
          { label: "COMEDY SHARE", value: "34%" },
          { label: "FORMAT SHIFT", value: "Series" }
        ],
        path: "M 0 60 C 20 30 40 80 60 40 S 80 70 100 20"
      }
    },
  ];

  return (
    <section id="projects" className="relative w-full py-32 bg-[#0c121e] z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-16 flex items-center gap-6">
          SELECTED <span className="italic font-light text-white/60">WORKS</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col w-full">
            {projects.map((proj, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`group relative flex flex-col py-10 border-b border-white/10 cursor-pointer transition-all duration-500 ${activeIndex === idx ? 'opacity-100 pl-4 md:pl-8' : 'opacity-40 hover:opacity-70'}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${proj.color} to-transparent transition-opacity duration-500 ${activeIndex === idx ? 'opacity-100' : 'opacity-0'}`} />
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{proj.title}</h3>
                <div className="flex items-center gap-4 text-white/50 text-sm uppercase mt-4">
                  <span>{proj.tool}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/80">{proj.metric}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-6 h-[500px] lg:h-[600px] sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full h-full">
                <Dashboard3DUI activeProject={projects[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="relative w-full bg-[#05080f] text-white pt-32 pb-16 z-15 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-20">
        <span className="text-sm tracking-[0.3em] uppercase text-emerald-400 mb-6 block">Open to new opportunities</span>
        <h2 className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-none mb-6">
          LET'S <span className="italic font-light text-white/50">CONNECT</span>
        </h2>
        <p className="text-white/40 max-w-lg mx-auto mb-12 font-light text-lg">
          Whether you need a dedicated Data Analyst to drive your BI initiatives, or just want to discuss a complex dataset, my inbox is open.
        </p>

        {/* Action Buttons: Email and Socials */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a 
            href="mailto:sinhainder616@gmail.com" 
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white text-black font-bold text-base hover:bg-emerald-400 transition-colors cursor-none shadow-lg"
          >
            <Mail className="w-5 h-5" />
            <span>Send an Email </span>
          </a>
          <a 
            href="https://www.linkedin.com/in/inder-sinha/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-none"
          >
            <Linkedin className="w-5 h-5 text-cyan-400" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a 
            href="https://github.com/Inder616" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-none"
          >
            <Github className="w-5 h-5 text-emerald-400" />
            <span>GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 text-white/30 text-xs tracking-widest uppercase">
          © {new Date().getFullYear()} Inderjeet Sinha · Designed with React, Three.js & Tailwind
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  return (
    <div className="bg-[#090e17] min-h-screen text-zinc-50 font-sans cursor-none scroll-smooth">
      <CustomCursor />
      <ScrollToTop />
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 bg-[#090e17]/70 backdrop-blur-lg border-b border-white/5 flex justify-between items-center">
        <a href="#" className="text-xl font-bold tracking-tighter text-white">INDER®</a>
        <div className="hidden md:flex items-center gap-8 text-sm font-light text-white/70">
          <a href="#experience" className="hover:text-emerald-400">Experience</a>
          <a href="#projects" className="hover:text-emerald-400">Projects</a>
          <a href="#skills" className="hover:text-emerald-400">Skills</a>
          <a href="#about" className="hover:text-emerald-400">About</a>
          <a href="#contact" className="hover:text-emerald-400">Contact</a>
        </div>
      </nav>
      <main>
        <Hero />
        <About />
        <Experience />
        <Services />
        <SkillsDetail />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}