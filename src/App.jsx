import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Play, Database, BarChart3, TerminalSquare, FileSpreadsheet, Award, GraduationCap, Activity, Lightbulb, Wrench, ShieldCheck, TrendingUp, Layers, MessageSquare, Zap, Download, Filter, Network, LayoutGrid, Box, PieChart, Search, Calculator, Globe, ChevronUp, Mail, Menu, X, CheckCircle2, Copy, Check, FileText } from 'lucide-react';
import * as THREE from 'three';

// --- CUSTOM SVG BRAND ICONS (Prevents Vercel Build Errors) ---
const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
    <path d="M9 18c-4.51 2-5-2-7-2"></path>
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

// --- UTILS & ANIMATION VARIANTS ---

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const fadeUp = {
  hidden: { y: 24, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', bounce: 0.15, duration: 0.8 },
  },
};

// --- COMPONENTS ---

// 1. Interactive 3D Dashboard Card (Responsive for both Mobile Inline & Desktop Sticky)
const Dashboard3DUI = ({ activeProject, isCompact = false }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);

  const handleMouseMove = (e) => {
    if (isCompact) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div 
      className={`w-full h-full flex items-center justify-center ${isCompact ? 'p-0 my-4' : 'perspective-[1500px] p-4 xl:p-6'}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div 
        style={isCompact ? {} : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full rounded-2xl bg-[#0b111d] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] p-5 sm:p-6 md:p-7 flex flex-col justify-between"
      >
        {/* Dynamic Glow Behind Card */}
        <div 
          className="absolute inset-0 -z-10 blur-3xl opacity-15 transition-colors duration-700 pointer-events-none" 
          style={{ backgroundColor: activeProject.glowColor }} 
        />
        
        {/* Header with GitHub Link Button */}
        <div className="flex flex-wrap justify-between items-center gap-2 border-b border-white/10 pb-4 mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject.strokeColor }} />
            <span className="text-[11px] font-mono tracking-wider text-white/70 uppercase">{activeProject.chartData.title}</span>
          </div>
          <a 
            href={activeProject.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-500 text-slate-950 text-xs font-semibold hover:bg-emerald-400 transition-all cursor-pointer shadow-sm"
          >
            <GithubIcon className="w-3.5 h-3.5" />
            <span>View Code & Report</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4 mb-6">
          {activeProject.chartData.kpis.map((kpi, i) => (
            <div key={i} className="bg-white/[0.03] border border-white/5 rounded-xl p-3 sm:p-4 flex flex-col justify-center">
              <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-wider text-white/45 mb-1 truncate">{kpi.label}</span>
              <span className="text-lg sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{kpi.value}</span>
            </div>
          ))}
        </div>

        {/* Key Finding Callout Box */}
        <div className="mb-5 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3">
          <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0 mt-0.5">
            Insight
          </span>
          <p className="text-xs text-white/70 font-light leading-relaxed">
            {activeProject.finding}
          </p>
        </div>

        {/* SVG Glowing Line Chart */}
        <div className="h-36 sm:h-44 relative border-b border-white/10">
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[1,2,3,4].map((i) => <div key={i} className="w-full h-[1px] bg-white/[0.03]" />)}
          </div>
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
            <defs>
              <linearGradient id={`gradient-${activeProject.id}-${isCompact ? 'm' : 'd'}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={activeProject.strokeColor} stopOpacity="0.35" />
                <stop offset="100%" stopColor={activeProject.strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>
            
            <motion.path 
              key={`fill-${activeProject.id}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              d={`${activeProject.chartData.path} L 100 100 L 0 100 Z`}
              fill={`url(#gradient-${activeProject.id}-${isCompact ? 'm' : 'd'})`}
            />
            
            <motion.path 
              key={`line-${activeProject.id}`}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              d={activeProject.chartData.path}
              fill="none"
              stroke={activeProject.strokeColor}
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>

        {/* Footer */}
        <div className="mt-4 flex flex-wrap justify-between items-center gap-2">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: activeProject.strokeColor }} />
              <span className="text-[10px] font-mono tracking-wider text-white/50 uppercase">{activeProject.chartData.xAxis}</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/40">{activeProject.tool}</span>
        </div>
      </motion.div>
    </div>
  );
};

// Scroll To Top Button
const ScrollToTop = () => {
  const { scrollY } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    return scrollY.on("change", (latest) => {
      setIsVisible(latest > 500);
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
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 z-[90] p-3.5 rounded-full bg-[#0d1526]/90 backdrop-blur-md border border-white/15 text-white hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-xl group"
        >
          <ChevronUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform duration-200" />
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

    const coreGeo = new THREE.IcosahedronGeometry(3.1, 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.12 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const innerGeo = new THREE.IcosahedronGeometry(2.9, 2);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x090e17, transparent: true, opacity: 0.85 });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 1200;
    const posArray = new Float32Array(particlesCount * 3);
    for(let i = 0; i < particlesCount * 3; i++) { posArray[i] = (Math.random() - 0.5) * 24; }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMat = new THREE.PointsMaterial({ size: 0.035, color: 0x34d399, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    let mouseX = 0;
    let mouseY = 0;

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - window.innerWidth / 2) * 0.0006;
      mouseY = (event.clientY - window.innerHeight / 2) * 0.0006;
    };
    window.addEventListener('mousemove', onDocumentMouseMove, { passive: true });

    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      core.rotation.y += 0.0015;
      core.rotation.x += 0.0008;
      inner.rotation.y -= 0.001;
      particlesMesh.rotation.y = -elapsedTime * 0.015;
      
      scene.rotation.x += 0.04 * (mouseY - scene.rotation.x);
      scene.rotation.y += 0.04 * (mouseX - scene.rotation.y);

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
      window.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      coreGeo.dispose(); coreMat.dispose(); innerGeo.dispose(); innerMat.dispose(); particlesGeo.dispose(); particlesMat.dispose(); renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80" />;
};

// Sleek, Eye-Friendly 3D Data Topographic Wave & Constellation Field
const Services3DModel = () => {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 8, 22);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const cols = 40;
    const rows = 20;
    const sep = 1.15;
    const numParticles = cols * rows;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);

    const colorEmerald = new THREE.Color(0x10b981);
    const colorCyan = new THREE.Color(0x06b6d4);

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let z = 0; z < rows; z++) {
        positions[i * 3] = (x - cols / 2) * sep;
        positions[i * 3 + 1] = 0;
        positions[i * 3 + 2] = (z - rows / 2) * sep;

        const mixedColor = colorEmerald.clone().lerp(colorCyan, x / cols);
        colors[i * 3] = mixedColor.r;
        colors[i * 3 + 1] = mixedColor.g;
        colors[i * 3 + 2] = mixedColor.b;
        i++;
      }
    }

    const waveGeo = new THREE.BufferGeometry();
    waveGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    waveGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const waveMat = new THREE.PointsMaterial({
      size: 0.075,
      vertexColors: true,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending
    });

    const wavePoints = new THREE.Points(waveGeo, waveMat);
    wavePoints.position.y = -2;
    group.add(wavePoints);

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * 0.5;

      const posArr = wavePoints.geometry.attributes.position.array;
      let idx = 0;
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          const px = posArr[idx * 3];
          const pz = posArr[idx * 3 + 2];
          posArr[idx * 3 + 1] = Math.sin(px * 0.25 + time) * 1.1 + Math.cos(pz * 0.3 + time) * 0.7;
          idx++;
        }
      }
      wavePoints.geometry.attributes.position.needsUpdate = true;
      group.rotation.y = Math.sin(time * 0.15) * 0.1;

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
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-65 mix-blend-screen" />;
};

const Hero = () => {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-16">
      <Hero3DModel />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-emerald-500/[0.07] blur-[130px] rounded-full pointer-events-none" />
      
      <motion.div 
        className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 md:px-12 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        {/* Recruiter Status Pill */}
        <motion.div variants={fadeUp} className="mb-6 inline-flex flex-wrap items-center justify-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-[#0c1421]/90 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-emerald-100">
            Inderjeet Sinha · Data & BI Analyst
          </span>
          <span className="hidden sm:inline text-white/20">|</span>
          <span className="hidden sm:inline text-xs font-mono text-cyan-300"> MBA (Business Analytics)</span>
        </motion.div>
        
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.04] tracking-tight font-bold text-white max-w-5xl">
          Turning operational data into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400">decision-ready BI.</span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="mt-6 text-base sm:text-lg md:text-xl text-white/65 max-w-2xl font-light leading-relaxed">
          I consolidate multi-module ERP data, write production SQL & Python cleaning pipelines, and build interactive Power BI & Excel dashboards that cut manual reporting.
        </motion.p>
        
        {/* Primary Action Bar */}
        <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center justify-center gap-3.5 w-full sm:w-auto">
          <a 
            href="#projects" 
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm sm:text-base hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <span>Explore Case Studies (5)</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl border border-white/15 bg-white/[0.04] text-white font-medium text-sm sm:text-base hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Download Resume (PDF)</span>
          </a>
        </motion.div>

        {/* Recruiter At-a-Glance Proof Strip */}
        <motion.div variants={fadeUp} className="mt-14 pt-8 border-t border-white/10 w-full max-w-4xl grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Core Stack</div>
            <div className="text-sm sm:text-base font-semibold text-white mt-1">SQL · Power BI · Python · Excel</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">ERP Integration</div>
            <div className="text-sm sm:text-base font-semibold text-emerald-400 mt-1">7 Modules Unified</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Scale Handled</div>
            <div className="text-sm sm:text-base font-semibold text-cyan-400 mt-1">1.2M+ Claim & Ops Rows</div>
          </div>
          <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
            <div className="text-[10px] font-mono uppercase tracking-wider text-white/40">Education</div>
            <div className="text-sm sm:text-base font-semibold text-white mt-1">MBA · Analytics & Mktg</div>
          </div>
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
  
  const mouseRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]); 
  const mouseRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]); 

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
        animate={{ rotateX: [52, 52, 52, 0, 0, 52, 52], rotateZ: [-36, -36, -36, 0, 0, -36, -36], scale: [0.75, 0.75, 0.75, 0.96, 0.96, 0.75, 0.75] }}
        transition={loopSequence}
        className="w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <motion.div style={{ rotateX: mouseRotateX, rotateY: mouseRotateY, transformStyle: "preserve-3d" }} className="relative w-64 h-64 sm:w-76 sm:h-76 md:w-80 md:h-80">
           {/* Layer 1: Real SQL Extraction Layer */}
           <motion.div animate={{ z: [-140, -140, -2, -2, -2, -2, -140] }} transition={loopSequence} className="absolute inset-0 border border-emerald-500/30 bg-[#050a14] rounded-3xl overflow-hidden p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[11px] font-mono text-emerald-400">
                <span>01_SQL_EXTRACTION.sql</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="space-y-1.5 font-mono text-[10px] text-white/50">
                <div className="bg-white/5 p-2 rounded">SELECT depot_id, AVG(lead_time_days) FROM erp_lr_pod_fact</div>
                <div className="bg-white/5 p-2 rounded">WHERE pod_status = 'Verified' GROUP BY depot_id;</div>
              </div>
              <div className="text-[10px] font-mono text-white/35 uppercase tracking-wider">32 Validated ERP Fields</div>
           </motion.div>
           
           {/* Layer 2: DAX & Power Query Transformation */}
           <motion.div animate={{ z: [0, 0, -1, -1, -1, -1, 0] }} transition={loopSequence} className="absolute inset-0 border border-cyan-400/50 bg-cyan-950/30 backdrop-blur-md rounded-3xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-center text-[11px] font-mono text-cyan-300">
                <span>02_DAX_MEASURES</span>
                <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">Star Schema</span>
              </div>
              <div className="grid grid-cols-2 gap-2 my-auto">
                <div className="bg-black/40 border border-cyan-500/20 p-2.5 rounded-xl">
                  <div className="text-[9px] text-white/45 uppercase">Placements</div>
                  <div className="text-lg font-bold text-cyan-400">112K+</div>
                </div>
                <div className="bg-black/40 border border-cyan-500/20 p-2.5 rounded-xl">
                  <div className="text-[9px] text-white/45 uppercase">ERP Modules</div>
                  <div className="text-lg font-bold text-emerald-400">7 Unified</div>
                </div>
              </div>
              <div className="text-[10px] font-mono text-white/35 uppercase tracking-wider">Power Query · Pandas</div>
           </motion.div>
           
           {/* Layer 3: Final Polished Executive Dashboard */}
           <motion.div animate={{ z: [140, 140, 0, 0, 0, 0, 140] }} transition={loopSequence} className="absolute inset-0 border border-white/25 bg-[#0a121e]/95 backdrop-blur-2xl rounded-3xl p-5 flex flex-col shadow-2xl">
              <motion.div animate={{ opacity: [0, 0, 0, 1, 1, 0, 0], y: [10, 10, 10, 0, 0, 10, 10] }} transition={loopSequence} className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold text-white tracking-wide">OPERATIONAL BI REPORT</span>
                     <p className="text-[10px] text-white/45">Automated Drill-Through View</p>
                   </div>
                   <div className="w-2.5 h-2.5 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 my-2">
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2">
                      <div className="text-[9px] text-white/40 uppercase">Claims</div>
                      <div className="text-xs sm:text-sm font-bold text-white">1.2M+</div>
                   </div>
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2">
                      <div className="text-[9px] text-white/40 uppercase">Fields</div>
                      <div className="text-xs sm:text-sm font-bold text-cyan-400">32</div>
                   </div>
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2">
                      <div className="text-[9px] text-white/40 uppercase">Manual</div>
                      <div className="text-xs sm:text-sm font-bold text-emerald-400">Replaced</div>
                   </div>
                </div>

                {/* Simulated Mini Chart */}
                <div className="h-14 relative flex items-end gap-1.5 pt-2 border-t border-white/10">
                   {[45, 65, 55, 85, 72, 95, 82, 100].map((val, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/30 to-cyan-400 rounded-t" style={{ height: `${val}%` }} />
                   ))}
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
    <section id="about" className="relative w-full py-20 md:py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative h-[340px] sm:h-[400px] lg:h-[440px] overflow-hidden rounded-3xl bg-[#060a11] border border-white/10">
            <DataStackVisual />
            <div className="absolute bottom-3 left-0 right-0 text-center pointer-events-none">
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/30">
                Pipeline: SQL → DAX Model → Executive BI
              </span>
            </div>
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400 mb-3 block">01 / Profile</span>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6 leading-[1.1] text-white">
              Analytical rigour backed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">business context.</span>
            </h2>
            <p className="text-white/80 text-base sm:text-lg font-light leading-relaxed mb-4">
              Hi, I'm Inder — a Data Analyst with an MBA in Business Analytics & Marketing. I use SQL, Power BI, Python, and Excel to transform complex datasets into meaningful insights and clear business reports.
            </p>
            <p className="text-white/55 text-sm sm:text-base font-light leading-relaxed mb-7">
              From analysing business performance to building interactive dashboards, I enjoy uncovering patterns, tracking key metrics, and turning data into insights that support better decisions.
            </p>

            {/* Education & Credentials Pill */}
            <div className="p-4 rounded-2xl bg-white/[0.025] border border-white/10 flex items-center gap-4 mb-8">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm sm:text-base font-semibold text-white">MBA in Business Analytics & Marketing</div>
                <div className="text-xs text-white/45 font-light">Bridging raw data engineering with commercial KPIs, operational SLAs, and executive reporting</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-white/10">
              <div>
                <span className="text-2xl sm:text-4xl font-bold text-white mb-1 block">1.2M+</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/45">Records Processed</span>
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-bold text-emerald-400 mb-1 block">32 Fields</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/45">SQL/ETL Validated</span>
              </div>
              <div>
                <span className="text-2xl sm:text-4xl font-bold text-cyan-400 mb-1 block">5 Repos</span>
                <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-white/45">Public Case Studies</span>
              </div>
            </div>
          </div>
        </motion.div>
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
      highlights: ["7 ERP Modules Consolidated", "32 Validated Fields", "112K+ Vehicle Placements", "1.2M+ Claim Records"],
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
      highlights: ["10,000+ Farmer Records Cleaned", "50,000+ Digital Interactions", "Python (Pandas) · Power BI · Excel"],
      points: [
        "Cleaned and validated 10,000+ farmer records using Python (Pandas), Excel, and Google Sheets, standardising data formats, removing duplicates, and handling missing values to improve data quality and reporting accuracy.",
        "Analysed 50,000+ customer interactions across digital channels using Excel and Power BI to identify engagement patterns, customer trends, and behavioural insights.",
        "Created interactive reports and visualisations in Power BI to present customer engagement trends, compare performance across digital channels, and support data-driven reporting."
      ]
    }
  ];

  return (
    <section id="experience" className="relative w-full py-20 md:py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400 mb-3 block">02 / Work History</span>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-12 text-white">Professional <span className="text-white/50 font-light">Experience</span></h2>
        <div className="relative border-l border-white/15 ml-2 sm:ml-4 space-y-10">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative pl-6 sm:pl-10">
              <div className="absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <div className="p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-4">
                  <h3 className="text-xl sm:text-2xl font-bold text-white">{exp.role}</h3>
                  <span className="text-base sm:text-lg text-cyan-400 font-medium">@ {exp.company}</span>
                  <span className="text-xs font-mono text-white/60 px-3 py-1 rounded-md bg-white/5 border border-white/10 w-fit sm:ml-auto mt-1 sm:mt-0">{exp.date}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-5">
                  {exp.highlights.map((h, i) => (
                    <span key={i} className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                      {h}
                    </span>
                  ))}
                </div>
                <ul className="space-y-3 text-white/70 font-light leading-relaxed text-sm sm:text-base">
                  {exp.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1 text-xs">▸</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
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
      className={`relative overflow-hidden rounded-2xl bg-[#0c1322]/90 border border-white/10 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, rgba(16,185,129,0.08), transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};

const SkillsDetail = () => {
  const bentoSkills = [
    { 
      title: "Advanced Excel", 
      subtitle: "Spreadsheet Modeling & Reporting",
      color: "text-purple-400", 
      Icon: FileSpreadsheet, 
      items: ["Power Pivot & Data Modeling", "XLOOKUP & INDEX-MATCH", "Dynamic Pivot Tables & Slicers", "Conditional & Statistical Formulas"] 
    },
    { 
      title: "SQL & Databases", 
      subtitle: "Querying & Data Architecture",
      color: "text-emerald-400", 
      Icon: Database, 
      items: ["PostgreSQL & Relational Schemas", "CTEs & Window Functions", "Multi-Table Joins & Aggregations", "Validation Across 32+ ERP Fields"] 
    },
    { 
      title: "Power BI & DAX", 
      subtitle: "BI Dashboards & Data Storytelling",
      color: "text-blue-400", 
      Icon: BarChart3, 
      items: ["Multi-Module ERP Consolidation", "DAX Measures (Lead Time, SLA, YoY)", "Power Query ETL Transformations", "Interactive Drill-Through Views"] 
    },
    { 
      title: "Python Analytics", 
      subtitle: "Data Cleaning & Exploration",
      color: "text-cyan-400", 
      Icon: TerminalSquare, 
      items: ["Pandas & NumPy Data Wrangling", "Exploratory Data Analysis (EDA)", "Duplicate & Missing Value Handling", "Matplotlib Visual Diagnostics"] 
    },
    { 
      title: "Web Scraping", 
      subtitle: "Automated Data Extraction",
      color: "text-teal-400", 
      Icon: Globe, 
      items: ["BeautifulSoup HTML Parsing", "Automated Web Data Collection", "DOM Tree Filtering & Cleaning", "Exporting Structured Datasets to CSV/SQL"] 
    },
    { 
      title: "Data Quality & BI Workflow", 
      subtitle: "End-to-End Execution",
      color: "text-amber-400", 
      Icon: CheckCircle2, 
      items: ["Standardising Messy Formats", "Root-Cause Bottleneck Analysis", "Budget vs. Actual Variance Tracking", "Self-Service Stakeholder Filters"] 
    }
  ];

  return (
    <section id="skills" className="relative w-full py-20 md:py-28 bg-[#090e17] z-10 border-t border-white/5 overflow-hidden">
      <Services3DModel />
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400 mb-3 block">03 / Capabilities</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Technical <span className="text-white/50 font-light">Stack</span></h2>
          <p className="text-white/45 text-xs font-mono uppercase">Excel → SQL → Power BI → Python → Web Scraping</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {bentoSkills.map((stack, idx) => {
             const IconComponent = stack.Icon;
             return (
               <SpotlightCard key={idx} className="p-6 sm:p-7 hover:border-white/20 transition-colors">
                  <div className="flex items-center justify-between mb-5">
                    <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                      <IconComponent className={`w-6 h-6 ${stack.color}`} />
                    </div>
                    <span className="text-xs font-mono text-white/25">0{idx + 1}</span>
                  </div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-1 ${stack.color}`}>{stack.title}</h3>
                  <p className="text-xs text-white/45 mb-4 font-light">{stack.subtitle}</p>
                  <ul className="space-y-2.5 border-t border-white/10 pt-4">
                    {stack.items.map((item, i) => (
                      <li key={i} className="text-white/75 text-sm font-light flex items-center gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
               </SpotlightCard>
             );
          })}
        </div>
      </div>
    </section>
  );
};

const ProfessionalSkills = () => {
  const skills = [
    {
      title: "Analytical Thinking",
      desc: "Tested waiting time against age and gender across 111K+ appointments to prove which factor really drives no-shows.",
      icon: Lightbulb,
      color: "text-emerald-400",
      tag: "Hypothesis Testing"
    },
    {
      title: "Problem Solving",
      desc: "Broke the hiring process into stages to find that the delay sits before the offer (21 days), not after it (4 days).",
      icon: Wrench,
      color: "text-cyan-400",
      tag: "Bottleneck Isolation"
    },
    {
      title: "Attention to Detail",
      desc: "Used median instead of mean for salaries across 111 countries, because skewed pay data makes averages misleading.",
      icon: ShieldCheck,
      color: "text-blue-400",
      tag: "Statistical Accuracy"
    },
    {
      title: "Business Thinking",
      desc: "Compared genre growth with catalogue share across 19K+ titles to recommend where to invest in new content.",
      icon: TrendingUp,
      color: "text-purple-400",
      tag: "Commercial Impact"
    },
    {
      title: "Structured Approach",
      desc: "Built SQL analysis in clear CTE steps with window functions, so every stage is readable and easy to verify.",
      icon: Layers,
      color: "text-emerald-400",
      tag: "Maintainable SQL"
    },
    {
      title: "Clear Communication",
      desc: "Design every dashboard with filters and drillthrough, so non-technical users can explore the answers on their own.",
      icon: MessageSquare,
      color: "text-teal-400",
      tag: "Self-Serve BI"
    }
  ];

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400 mb-3 block">04 / Methodology</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">Professional <span className="text-white/50 font-light">Skills in Action</span></h2>
          </div>
          <p className="text-white/50 max-w-md text-sm font-light">How my analytical habits translate into concrete decisions across my projects.</p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {skills.map((skill, idx) => {
            const IconComponent = skill.icon;
            return (
              <div key={idx} className="group p-6 sm:p-7 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <IconComponent className={`w-5 h-5 ${skill.color}`} />
                    </div>
                    <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-white/5 text-white/55">{skill.tag}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{skill.title}</h3>
                  <p className="text-white/60 text-sm font-light leading-relaxed">{skill.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const EducationAndCertifications = () => {
  const certifications = [
    {
      title: "IBM Data Analyst Professional Certificate",
      issuer: "Coursera",
      year: "2026",
      link: "https://www.coursera.org",
      color: "from-blue-500/20 to-cyan-500/20"
    },
    {
      title: "Microsoft Power BI Data Analyst Professional Certificate",
      issuer: "Coursera",
      year: "2026",
      link: "https://www.coursera.org",
      color: "from-emerald-500/20 to-teal-500/20"
    },
    {
      title: "Google Business Intelligence Professional Certificate",
      issuer: "Coursera",
      year: "2026",
      link: "https://www.coursera.org",
      color: "from-purple-500/20 to-indigo-500/20"
    }
  ];

  const education = [
    {
      degree: "MBA, Business Analytics and Marketing",
      institution: "ICFAI University",
      period: "2024 – 2026"
    },
    {
      degree: "PG Diploma in Computer Applications",
      institution: "Kalinga University",
      period: "2023 – 2024"
    },
    {
      degree: "Bachelor of Commerce",
      institution: "MAIC",
      period: "2020 – 2023"
    }
  ];

  return (
    <section className="relative w-full py-20 md:py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Certifications Subsection */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-1.5 bg-emerald-400 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Certifications</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {certifications.map((cert, idx) => (
              <a 
                key={idx}
                href={cert.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-emerald-500/50 hover:bg-white/[0.04] transition-all duration-300 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Award className="w-5 h-5" />
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-white/40 group-hover:text-emerald-400 transition-colors" />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors mb-2">
                    {cert.title}
                  </h3>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-white/50 pt-4 border-t border-white/5">
                  <span>{cert.issuer}, {cert.year}</span>
                  <span className="text-emerald-400 font-medium group-hover:underline">View credential</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Education Subsection */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <span className="w-3 h-1.5 bg-cyan-400 rounded-full" />
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Education</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {education.map((edu, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-mono text-cyan-400 mb-2 block">{edu.period}</span>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{edu.degree}</h3>
                </div>
                <div className="text-xs font-mono text-white/50 pt-4 border-t border-white/5 mt-4">
                  {edu.institution}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const projects = [
    { 
      id: "hr-funnel",
      title: "HR Recruitment Funnel Analytics", 
      tool: "Power BI · SQL · DAX", 
      metric: "408 Requisitions",
      summary: "End-to-end hiring funnel tracking manpower requisitions from approval through offer acceptance and candidate joining.",
      finding: "Isolated the primary 21-day hiring bottleneck between requisition approval and offer release (vs. only 4 days post-offer).",
      github: "https://github.com/Inder616/Recruitment-Funnel-Hiring-Analytics-Dashboard",
      glowColor: "#10b981",
      strokeColor: "#34d399",
      chartData: {
        title: "RECRUITMENT FUNNEL SLA",
        xAxis: "Stage Conversion & Lead Time Trend",
        kpis: [
          { label: "REQUISITIONS", value: "408" },
          { label: "OFFER ACCEPT", value: "74.8%" },
          { label: "PRE-OFFER LAG", value: "21d" }
        ],
        path: "M 0 80 Q 15 80 25 65 T 50 50 T 75 35 T 100 20"
      }
    },
    { 
      id: "patient-noshow",
      title: "Patient Appointment No-Show Analysis", 
      tool: "Python · Pandas · Power BI", 
      metric: "111K+ Appointments",
      summary: "Cleaned and engineered waiting-time features across 111,000+ medical scheduling records to diagnose missed appointments.",
      finding: "Proved that scheduling lead time (>7 days wait) is the strongest driver of patient no-shows compared to age or gender.",
      github: "https://github.com/Inder616/Patient-Appointment-Delay-No-Show-Analysis",
      glowColor: "#06b6d4",
      strokeColor: "#22d3ee",
      chartData: {
        title: "NO-SHOW DIAGNOSTICS",
        xAxis: "No-Show Rate by Lead-Time Bracket",
        kpis: [
          { label: "RECORDS", value: "111K+" },
          { label: "AVG NO-SHOW", value: "20.2%" },
          { label: "CRITICAL WAIT", value: ">7 Days" }
        ],
        path: "M 0 88 L 20 82 L 40 58 L 60 45 L 80 25 L 100 12"
      }
    },
    { 
      id: "sql-job-market",
      title: "Data Analyst Job Market SQL Analysis", 
      tool: "SQL · CTEs · Window Functions", 
      metric: "Multi-Table Joins",
      summary: "Relational SQL analysis of Data Analyst job postings examining salary distributions, role tiers, and high-paying skill combinations.",
      finding: "Ranked top-paying technical skills using CTEs and DENSE_RANK() window functions to guide upskilling ROI.",
      github: "https://github.com/Inder616/sql-data-analyst-job-market-project",
      glowColor: "#14b8a6",
      strokeColor: "#2dd4bf",
      chartData: {
        title: "SQL SKILL DEMAND & PAY",
        xAxis: "Salary Premium by Technical Stack",
        kpis: [
          { label: "QUERY ARCH", value: "CTEs" },
          { label: "RANKING", value: "Window Fn" },
          { label: "TOP SKILL", value: "SQL+BI" }
        ],
        path: "M 0 85 C 25 80 35 60 55 45 S 80 25 100 15"
      }
    },
    { 
      id: "global-salary",
      title: "Global Data Jobs Salary Dashboard", 
      tool: "Advanced Excel · Power Query", 
      metric: "111 Countries",
      summary: "Interactive Excel compensation benchmark modeling role levels, work-setting premiums, and geographic pay across 111 countries.",
      finding: "Used median instead of mean salary metrics to prevent extreme US/senior outliers from distorting regional benchmarks.",
      github: "https://github.com/Inder616/Global-Data-Jobs-Salary-Dashboard",
      glowColor: "#3b82f6",
      strokeColor: "#60a5fa",
      chartData: {
        title: "GLOBAL COMPENSATION BENCHMARK",
        xAxis: "Median Pay Progression by Experience Tier",
        kpis: [
          { label: "COUNTRIES", value: "111" },
          { label: "METRIC USED", value: "Median" },
          { label: "SR. PREMIUM", value: "+72%" }
        ],
        path: "M 0 92 Q 40 85 70 48 T 100 10"
      }
    },
    { 
      id: "netflix-strategy",
      title: "Netflix Content Strategy Dashboard", 
      tool: "Python · Pandas · Power BI", 
      metric: "19K+ Titles",
      summary: "Evaluated 19,000+ catalogue titles across release years, genres, and country production trends to inform content investment.",
      finding: "Identified high-growth international series genres where viewer demand outpaced existing catalogue share.",
      github: "https://github.com/Inder616/Netflix-content-strategy-dashboard",
      glowColor: "#a855f7",
      strokeColor: "#c084fc",
      chartData: {
        title: "CATALOGUE EXPANSION MIX",
        xAxis: "Catalogue Share & Format Shift Over Time",
        kpis: [
          { label: "TITLES", value: "19K+" },
          { label: "TOP SHARE", value: "34%" },
          { label: "GROWTH FOCUS", value: "Series" }
        ],
        path: "M 0 70 C 20 50 40 75 60 38 S 80 50 100 18"
      }
    },
  ];

  return (
    <section id="projects" className="relative w-full py-20 md:py-28 bg-[#0c121e] z-10 border-t border-white/5">
      <div className="max-w-[1360px] mx-auto px-5 sm:px-8 md:px-12">
        <span className="text-xs font-mono tracking-[0.2em] uppercase text-emerald-400 mb-3 block">05 / Case Studies</span>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-white">
              Featured <span className="text-white/50 font-light">Projects</span>
            </h2>
            <p className="text-white/50 text-sm font-light mt-2">Select any project to inspect its KPI breakdown, key finding, and GitHub repository.</p>
          </div>
          <a 
            href="https://github.com/Inder616" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-xs sm:text-sm font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>All GitHub Repositories</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Project Selector List */}
          <div className="lg:col-span-6 flex flex-col w-full space-y-3">
            {projects.map((proj, idx) => {
              const isActive = activeIndex === idx;
              return (
                <div 
                  key={proj.id}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative flex flex-col p-5 sm:p-6 rounded-2xl border cursor-pointer transition-all duration-200 ${
                    isActive 
                      ? 'bg-white/[0.04] border-emerald-500/40 shadow-lg' 
                      : 'bg-white/[0.01] border-white/10 opacity-70 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-mono ${isActive ? 'text-emerald-400 font-bold' : 'text-white/35'}`}>
                        0{idx + 1}
                      </span>
                      <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                        {proj.title}
                      </h3>
                    </div>
                    <a 
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="shrink-0 px-3 py-1 rounded-lg bg-white/5 hover:bg-emerald-500 hover:text-slate-950 border border-white/10 text-xs font-mono text-white/85 flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <span>GitHub</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <p className="text-white/60 text-xs sm:text-sm font-light mt-2.5 leading-relaxed">
                    {proj.summary}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono uppercase mt-4 pt-3 border-t border-white/5">
                    <span className="text-emerald-400">{proj.tool}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="text-white/70">{proj.metric}</span>
                  </div>

                  {/* Mobile & Tablet Inline Preview (So touch users don't have to scroll down!) */}
                  {isActive && (
                    <div className="block lg:hidden mt-4 pt-2 border-t border-white/10" onClick={(e) => e.stopPropagation()}>
                      <Dashboard3DUI activeProject={proj} isCompact={true} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column: Sticky Desktop 3D Preview */}
          <div className="hidden lg:block lg:col-span-6 sticky top-24">
            <AnimatePresence mode="wait">
              <motion.div 
                key={activeIndex} 
                initial={{ opacity: 0, y: 8 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -8 }} 
                transition={{ duration: 0.2 }} 
                className="w-full"
              >
                <Dashboard3DUI activeProject={projects[activeIndex]} isCompact={false} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  const [copied, setCopied] = useState(false);
  const email = "sinhainder616@gmail.com";

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer id="contact" className="relative w-full bg-[#05080f] text-white pt-20 md:pt-28 pb-14 z-15 border-t border-white/10">
      <div className="max-w-5xl mx-auto px-5 sm:px-8 md:px-12 text-center mb-14">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono uppercase tracking-wider mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Open to Data Analyst & BI Analyst Opportunities</span>
        </div>

        <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-none mb-6">
          Ready to contribute to <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">your data team.</span>
        </h2>
        <p className="text-white/55 max-w-xl mx-auto mb-10 font-light text-sm sm:text-base md:text-lg leading-relaxed">
          Need an analyst who can write clean SQL, automate reporting in Power BI, and communicate findings clearly? Reach out directly or grab my resume below.
        </p>

        {/* Recruiter-Friendly Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <a 
            href={`mailto:${email}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-sm sm:text-base hover:bg-emerald-400 transition-colors cursor-pointer shadow-lg"
          >
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </a>

          <button 
            onClick={handleCopyEmail}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-sm sm:text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-white/60" />}
            <span>{copied ? "Email Copied!" : "Copy Email"}</span>
          </button>

          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-sm sm:text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <FileText className="w-4 h-4 text-emerald-400" />
            <span>Download CV</span>
          </a>

          <a 
            href="https://www.linkedin.com/in/inder-sinha/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-sm sm:text-base hover:bg-white/10 hover:border-cyan-400 transition-all cursor-pointer"
          >
            <LinkedinIcon className="w-4 h-4 text-cyan-400" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>

          <a 
            href="https://github.com/Inder616" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/15 text-white font-medium text-sm sm:text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <GithubIcon className="w-4 h-4 text-emerald-400" />
            <span>GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-white/40 text-xs font-mono gap-4">
          <span>© {new Date().getFullYear()} Inderjeet Sinha</span>
          <span>SQL · Power BI · Python · Excel</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#090e17] min-h-screen text-zinc-50 font-sans scroll-smooth selection:bg-emerald-500 selection:text-slate-950">
      <ScrollToTop />
      <nav className="fixed top-0 left-0 w-full z-40 px-5 sm:px-8 md:px-12 py-3.5 bg-[#090e17]/85 backdrop-blur-xl border-b border-white/10 flex justify-between items-center">
        <a href="#" className="text-base sm:text-lg font-bold tracking-tight text-white cursor-pointer flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          <span>INDER SINHA</span>
        </a>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-white/75">
          <a href="#about" className="hover:text-emerald-400 transition-colors cursor-pointer">Profile</a>
          <a href="#experience" className="hover:text-emerald-400 transition-colors cursor-pointer">Experience</a>
          <a href="#skills" className="hover:text-emerald-400 transition-colors cursor-pointer">Technical Stack</a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors cursor-pointer">Case Studies</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</a>
          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download 
            className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-semibold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 rounded-lg bg-white/5 border border-white/10 text-white/90 hover:text-white cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed top-[57px] left-0 w-full bg-[#0b111d]/98 backdrop-blur-2xl border-b border-white/15 z-40 p-5 flex flex-col gap-3 md:hidden shadow-2xl"
          >
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-white/85 py-2.5 px-3 rounded-lg hover:bg-white/5 border-b border-white/5">01 / Profile & MBA</a>
            <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-white/85 py-2.5 px-3 rounded-lg hover:bg-white/5 border-b border-white/5">02 / Work Experience</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-white/85 py-2.5 px-3 rounded-lg hover:bg-white/5 border-b border-white/5">03 / Technical Stack</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-white/85 py-2.5 px-3 rounded-lg hover:bg-white/5 border-b border-white/5">04 / Case Studies (5)</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-white/85 py-2.5 px-3 rounded-lg hover:bg-white/5">05 / Contact</a>
            <a 
              href="/Inder_Data_Analyst_CV.pdf" 
              download 
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 py-3 rounded-xl bg-emerald-500 text-slate-950 font-semibold text-center flex items-center justify-center gap-2 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>Download Resume (PDF)</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <Hero />
        <About />
        <Experience />
        <SkillsDetail />
        <ProfessionalSkills />
        <EducationAndCertifications />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}