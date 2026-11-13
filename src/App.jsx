import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Database, BarChart3, TerminalSquare, FileSpreadsheet, GraduationCap, Lightbulb, Wrench, ShieldCheck, TrendingUp, Layers, MessageSquare, Download, Globe, ChevronUp, Github, Linkedin, Mail, Menu, X, CheckCircle2 } from 'lucide-react';
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
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono tracking-wider text-white/60 uppercase">{activeProject.chartData.title}</span>
          </div>
          <a 
            href={activeProject.github} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500 text-black text-xs font-semibold hover:bg-emerald-400 transition-all cursor-pointer shadow-md"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Open Repository</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
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
        <div className="mt-4 flex justify-between items-center" style={{ transform: "translateZ(20px)" }}>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-400 shadow-[0_0_8px_#34d399]" />
              <span className="text-[10px] font-mono tracking-wider text-white/50 uppercase">Primary Metric</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-white/20" />
              <span className="text-[10px] font-mono tracking-wider text-white/40 uppercase">Baseline</span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-white/30">{activeProject.tool}</span>
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
      className="fixed top-0 left-0 w-8 h-8 rounded-full pointer-events-none z-[9999] hidden md:flex items-center justify-center border border-emerald-400/50 bg-emerald-400/10 backdrop-blur-[1px]"
      style={{
        x: cursorX,
        y: cursorY,
        opacity: isVisible ? 1 : 0,
        scale: isHovering ? 1.6 : 1,
      }}
    >
      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34d399]" />
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
          className="fixed bottom-8 right-8 z-[90] p-4 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-400 transition-all duration-300 cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_30px_rgba(52,211,153,0.3)] group"
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

    // Smooth Topographic Data Particle Wave
    const cols = 45;
    const rows = 25;
    const sep = 1.1;
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
      size: 0.08,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    const wavePoints = new THREE.Points(waveGeo, waveMat);
    wavePoints.position.y = -2;
    group.add(wavePoints);

    // Subtle Floating Data Stream Lines
    const linesGroup = new THREE.Group();
    group.add(linesGroup);

    const streamLines = [];
    for (let l = 0; l < 5; l++) {
      const curvePoints = [];
      const zOffset = (l - 2) * 4;
      for (let p = 0; p <= 40; p++) {
        const px = (p - 20) * 1.2;
        curvePoints.push(new THREE.Vector3(px, 0, zOffset));
      }
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineBasicMaterial({
        color: l % 2 === 0 ? 0x10b981 : 0x06b6d4,
        transparent: true,
        opacity: 0.15
      });
      const line = new THREE.Line(lineGeo, lineMat);
      line.position.y = -1.5;
      linesGroup.add(line);
      streamLines.push({ line, zOffset, phase: l * 0.8 });
    }

    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime() * 0.6;

      // Gentle, calming wave motion for the particle grid
      const posArr = wavePoints.geometry.attributes.position.array;
      let idx = 0;
      for (let x = 0; x < cols; x++) {
        for (let z = 0; z < rows; z++) {
          const px = posArr[idx * 3];
          const pz = posArr[idx * 3 + 2];
          posArr[idx * 3 + 1] = Math.sin(px * 0.25 + time) * 1.2 + Math.cos(pz * 0.3 + time) * 0.8;
          idx++;
        }
      }
      wavePoints.geometry.attributes.position.needsUpdate = true;

      // Smooth flowing motion for the spline streams
      streamLines.forEach((s) => {
        const lPos = s.line.geometry.attributes.position.array;
        for (let p = 0; p <= 40; p++) {
          const px = lPos[p * 3];
          lPos[p * 3 + 1] = Math.sin(px * 0.2 + time + s.phase) * 1.5;
        }
        s.line.geometry.attributes.position.needsUpdate = true;
      });

      group.rotation.y = Math.sin(time * 0.2) * 0.12;

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
      if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-75 mix-blend-screen" />;
};

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">
      <Hero3DModel />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[750px] max-h-[750px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />
      
      <motion.div 
        style={{ y, opacity }}
        className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="show"
      >
        <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-emerald-500/30 bg-[#0c1421]/80 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono tracking-wider uppercase text-emerald-100">
            Inderjeet Sinha · Data & BI Analyst
          </span>
        </motion.div>
        
        <motion.h1 className="text-[11vw] md:text-[7.5vw] leading-[0.88] tracking-tighter font-bold text-white">
          <motion.span variants={fadeUp} className="block">MESSY DATA TO</motion.span>
          <motion.span variants={fadeUp} className="block italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500">
            CLEAR DECISIONS.
          </motion.span>
        </motion.h1>
        
        <motion.p variants={fadeUp} className="mt-8 text-base md:text-xl text-white/60 max-w-2xl font-light leading-relaxed">
          Consolidating ERP data, automating reporting pipelines, and analyzing 1M+ operational records using SQL, Power BI, Python, and Advanced Excel.
        </motion.p>
        
        <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a href="#projects" className="cursor-pointer">
            <MagneticButton className="px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-medium hover:text-black hover:border-white group flex items-center justify-center gap-2 cursor-pointer">
              <span>View Case Studies</span>
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform duration-300" />
            </MagneticButton>
          </a>
          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download
            className="px-8 py-4 rounded-full bg-emerald-500 text-black font-semibold hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-[0_0_25px_rgba(16,185,129,0.25)] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
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
           {/* Layer 1: Base Data Engine Grid */}
           <motion.div animate={{ z: [-160, -160, -2, -2, -2, -2, -160] }} transition={loopSequence} className="absolute inset-0 border border-emerald-500/30 bg-[#050a14] rounded-[2rem] overflow-hidden p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                <span>SQL_ENGINE</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <div className="space-y-2 font-mono text-[10px] text-white/40">
                <div className="bg-white/5 p-2 rounded">SELECT * FROM cleaned_data WHERE status = 'active';</div>
                <div className="bg-white/5 p-2 rounded">GROUP BY region HAVING count &gt; 1000;</div>
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">PostgreSQL · Pandas</div>
           </motion.div>
           
           {/* Layer 2: Analytics & Transformation Core */}
           <motion.div animate={{ z: [0, 0, -1, -1, -1, -1, 0] }} transition={loopSequence} className="absolute inset-0 border border-cyan-400/50 bg-cyan-950/30 backdrop-blur-md rounded-[2rem] p-6 flex flex-col justify-between">
              <div className="flex justify-between items-center text-xs font-mono text-cyan-300">
                <span>DAX_MODEL</span>
                <span className="text-[10px] bg-cyan-500/20 px-2 py-0.5 rounded">Active</span>
              </div>
              <div className="grid grid-cols-2 gap-2 my-auto">
                <div className="bg-black/40 border border-cyan-500/20 p-3 rounded-xl">
                  <div className="text-[10px] text-white/40 uppercase">Efficiency</div>
                  <div className="text-xl font-bold text-cyan-400">+34.8%</div>
                </div>
                <div className="bg-black/40 border border-cyan-500/20 p-3 rounded-xl">
                  <div className="text-[10px] text-white/40 uppercase">Accuracy</div>
                  <div className="text-xl font-bold text-emerald-400">99.9%</div>
                </div>
              </div>
              <div className="text-[10px] text-white/30 uppercase tracking-widest">Power BI · DAX</div>
           </motion.div>
           
           {/* Layer 3: Final Polished Executive Dashboard */}
           <motion.div animate={{ z: [160, 160, 0, 0, 0, 0, 160] }} transition={loopSequence} className="absolute inset-0 border border-white/30 bg-[#0a121e]/90 backdrop-blur-2xl rounded-[2rem] p-6 flex flex-col shadow-2xl">
              <motion.div animate={{ opacity: [0, 0, 0, 1, 1, 0, 0], y: [15, 15, 15, 0, 0, 15, 15] }} transition={loopSequence} className="w-full h-full flex flex-col justify-between">
                <div className="flex justify-between items-center">
                   <div>
                     <span className="text-xs font-bold text-white tracking-wider">EXECUTIVE KPI REPORT</span>
                     <p className="text-[10px] text-white/40">Real-time business insights</p>
                   </div>
                   <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]" />
                </div>
                
                <div className="grid grid-cols-3 gap-2 my-2">
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5">
                      <div className="text-[9px] text-white/40 uppercase">Records</div>
                      <div className="text-sm font-bold text-white">1.2M+</div>
                   </div>
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5">
                      <div className="text-[9px] text-white/40 uppercase">Depots</div>
                      <div className="text-sm font-bold text-cyan-400">62</div>
                   </div>
                   <div className="bg-white/[0.04] border border-white/5 rounded-xl p-2.5">
                      <div className="text-[9px] text-white/40 uppercase">Uptime</div>
                      <div className="text-sm font-bold text-emerald-400">100%</div>
                   </div>
                </div>

                {/* Simulated Mini Chart */}
                <div className="h-16 relative flex items-end gap-1.5 pt-2 border-t border-white/10">
                   {[40, 65, 50, 85, 70, 95, 80, 100].map((val, i) => (
                      <div key={i} className="flex-1 bg-gradient-to-t from-emerald-500/20 to-cyan-400 rounded-t" style={{ height: `${val}%` }} />
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
    <section id="about" className="relative w-full py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1 relative aspect-square md:aspect-[4/4.5] overflow-hidden rounded-[2rem] bg-[#060a11] border border-white/10">
            <DataStackVisual />
          </div>
          <div className="lg:col-span-7 order-1 lg:order-2">
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3 block">01 / Background</span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-8 leading-[1.05]">
              BUSINESS CONTEXT MEETS <br/>
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DATA ENGINEERING.</span>
            </h2>
            <p className="text-white/70 text-lg md:text-xl font-light leading-relaxed mb-5">
              Hi, I'm Inder — a Data Analyst with an MBA in Business Analytics & Marketing. I use SQL, Power BI, Python, and Excel to transform complex datasets into meaningful insights and clear business reports.
            </p>
            <p className="text-white/50 text-base md:text-lg font-light leading-relaxed mb-8">
              From analysing business performance to building interactive dashboards, I enjoy uncovering patterns, tracking key metrics, and turning data into insights that support better decisions.
            </p>

            {/* Education & Credentials Pill */}
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center gap-4 mb-10 max-w-xl">
              <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">MBA — Business Analytics & Marketing</div>
                <div className="text-xs text-white/40 font-light">Focused on quantitative decision-making, KPI design, and market analytics</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <span className="text-3xl md:text-5xl font-bold text-white mb-1 block">1.2M+</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">Records Validated</span>
              </div>
              <div>
                <span className="text-3xl md:text-5xl font-bold text-emerald-400 mb-1 block">7 ERP</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">Modules Unified</span>
              </div>
              <div>
                <span className="text-3xl md:text-5xl font-bold text-cyan-400 mb-1 block">5+</span>
                <span className="text-[11px] font-mono uppercase tracking-wider text-white/40">End-to-End Projects</span>
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
      highlights: ["7 ERP Modules", "112K+ Placements", "1.2M+ Claim Records"],
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
      highlights: ["10,000+ Farmer Records", "50,000+ Digital Interactions", "Python & Power BI"],
      points: [
        "Cleaned and validated 10,000+ farmer records using Python (Pandas), Excel, and Google Sheets, standardising data formats, removing duplicates, and handling missing values to improve data quality and reporting accuracy.",
        "Analysed 50,000+ customer interactions across digital channels using Excel and Power BI to identify engagement patterns, customer trends, and behavioural insights.",
        "Created interactive reports and visualisations in Power BI to present customer engagement trends, compare performance across digital channels, and support data-driven reporting."
      ]
    }
  ];

  return (
    <section id="experience" className="relative w-full py-28 bg-[#090e17] z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3 block">02 / Career</span>
        <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-16">WORK <span className="italic font-light text-white/60">EXPERIENCE</span></h2>
        <div className="relative border-l border-white/15 ml-3 md:ml-6 space-y-16">
          {experiences.map((exp, idx) => (
            <div key={idx} className="relative pl-8 md:pl-12">
              <div className="absolute -left-[5px] top-2.5 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" />
              <div className="p-6 md:p-8 rounded-3xl bg-white/[0.02] border border-white/10 hover:border-white/20 transition-all">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{exp.role}</h3>
                  <span className="text-lg text-cyan-400 font-medium">@ {exp.company}</span>
                  <span className="text-xs font-mono text-white/50 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit md:ml-auto">{exp.date}</span>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {exp.highlights.map((h, i) => (
                    <span key={i} className="text-[11px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-md">
                      {h}
                    </span>
                  ))}
                </div>
                <ul className="space-y-3 text-white/65 font-light leading-relaxed text-sm md:text-base">
                  {exp.points.map((p, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1.5 text-xs">▸</span>
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
    { 
      title: "Advanced Excel", 
      subtitle: "Spreadsheet Modeling & Automation",
      color: "text-purple-400", 
      icon: <FileSpreadsheet className="w-7 h-7 text-purple-400" />, 
      items: ["Power Pivot & Data Models", "XLOOKUP & INDEX-MATCH", "Dynamic Pivot Tables", "Conditional & Statistical Formulas"] 
    },
    { 
      title: "SQL & Databases", 
      subtitle: "Data Extraction & Architecture",
      color: "text-emerald-400", 
      icon: <Database className="w-7 h-7 text-emerald-400" />, 
      items: ["PostgreSQL & MySQL", "CTEs & Window Functions", "Multi-Table Joins & Subqueries", "Query Validation (32+ ERP Fields)"] 
    },
    { 
      title: "Power BI & DAX", 
      subtitle: "Executive BI & Visual Storytelling",
      color: "text-blue-400", 
      icon: <BarChart3 className="w-7 h-7 text-blue-400" />, 
      items: ["Live ERP KPI Dashboards", "Custom DAX Measures (Lead Time, SLA)", "Power Query ETL Pipelines", "Star Schema & Drill-Through Views"] 
    },
    { 
      title: "Python Analytics", 
      subtitle: "Programmatic Cleaning & EDA",
      color: "text-cyan-400", 
      icon: <TerminalSquare className="w-7 h-7 text-cyan-400" />, 
      items: ["Pandas & NumPy Manipulation", "Exploratory Data Analysis (EDA)", "Missing Value & Duplicate Handling", "Matplotlib & Statistical Plotting"] 
    },
    { 
      title: "Web Scraping", 
      subtitle: "Automated Data Collection",
      color: "text-teal-400", 
      icon: <Globe className="w-7 h-7 text-teal-400" />, 
      items: ["BeautifulSoup HTML Parsing", "Automated Web Data Extraction", "DOM Tree Navigation & Cleaning", "Structuring Raw Web Data to CSV/SQL"] 
    },
    { 
      title: "Analytical Workflow", 
      subtitle: "End-to-End Delivery Standard",
      color: "text-amber-400", 
      icon: <CheckCircle2 className="w-7 h-7 text-amber-400" />, 
      items: ["ERP & Raw Data Consolidation", "Data Quality Audits & Standardisation", "Root-Cause Bottleneck Diagnostics", "Self-Serve Stakeholder Reporting"] 
    }
  ];

  return (
    <section id="skills" className="relative w-full py-28 bg-[#090e17] z-10 border-t border-white/5 overflow-hidden">
      <Services3DModel />
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3 block">03 / Capabilities</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">TOOLS & <span className="italic font-light text-white/50">TECHNICAL STACK</span></h2>
          <p className="text-white/40 text-sm font-mono">ORDERED BY CORE WORKFLOW</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bentoSkills.map((stack, idx) => (
             <SpotlightCard key={idx} className="p-8 backdrop-blur-md hover:border-white/20 transition-colors">
                <div className="flex items-center justify-between mb-6">
                  <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
                    {stack.icon}
                  </div>
                  <span className="text-xs font-mono text-white/20">0{idx + 1}</span>
                </div>
                <h3 className={`text-xl font-bold mb-1 ${stack.color}`}>{stack.title}</h3>
                <p className="text-xs text-white/40 mb-5 font-light">{stack.subtitle}</p>
                <ul className="space-y-2.5 border-t border-white/10 pt-4">
                  {stack.items.map((item, i) => (
                    <li key={i} className="text-white/70 text-sm font-light flex items-center gap-2">
                      <span className="w-1 h-1 rounded-full bg-white/40" />
                      {item}
                    </li>
                  ))}
                </ul>
             </SpotlightCard>
          ))}
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
      icon: <Lightbulb className="w-6 h-6 text-emerald-400" />,
      tag: "Data Diagnostics"
    },
    {
      title: "Problem Solving",
      desc: "Broke the hiring process into stages to find that the delay sits before the offer (21 days), not after it (4 days).",
      icon: <Wrench className="w-6 h-6 text-cyan-400" />,
      tag: "Process Optimization"
    },
    {
      title: "Attention to Detail",
      desc: "Used median instead of mean for salaries across 111 countries, because skewed pay data makes averages misleading.",
      icon: <ShieldCheck className="w-6 h-6 text-blue-400" />,
      tag: "Data Integrity"
    },
    {
      title: "Business Thinking",
      desc: "Compared genre growth with catalogue share across 19K+ titles to recommend where to invest in new content.",
      icon: <TrendingUp className="w-6 h-6 text-purple-400" />,
      tag: "Strategic BI"
    },
    {
      title: "Structured Approach",
      desc: "Built SQL analysis in clear CTE steps with window functions, so every stage is readable and easy to verify.",
      icon: <Layers className="w-6 h-6 text-emerald-400" />,
      tag: "Clean Architecture"
    },
    {
      title: "Clear Communication",
      desc: "Design every dashboard with filters and drillthrough, so non-technical users can explore the answers on their own.",
      icon: <MessageSquare className="w-6 h-6 text-teal-400" />,
      tag: "Stakeholder Impact"
    }
  ];

  return (
    <section className="relative w-full py-28 bg-[#090e17] z-10 border-t border-white/5 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3 block">04 / Proof of Work</span>
            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter">ANALYTICAL <span className="italic font-light text-white/50">MINDSET</span></h2>
          </div>
          <p className="text-white/50 max-w-md text-sm font-light">Every soft skill below is backed by a real decision made in one of my datasets.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, idx) => (
            <div key={idx} className="group p-7 rounded-3xl bg-white/[0.015] border border-white/10 hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between relative overflow-hidden">
              <div>
                <div className="flex justify-between items-center mb-5">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    {skill.icon}
                  </div>
                  <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-md bg-white/5 text-white/50">{skill.tag}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">{skill.title}</h3>
                <p className="text-white/55 text-sm font-light leading-relaxed">{skill.desc}</p>
              </div>
            </div>
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
      title: "HR Recruitment Funnel Analytics", 
      tool: "Power BI · DAX · SQL", 
      metric: "21d Bottleneck Identified",
      summary: "Tracked 408 requisitions across hiring stages, isolating the primary 21-day delay between requisition approval and offer release.",
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
      title: "Patient Appointment No-Show Analysis", 
      tool: "Python · Pandas · Power BI", 
      metric: "111K+ Records Processed",
      summary: "Engineered lead-time features across 111K+ medical appointments, proving that wait times over 7 days sharply increase patient no-shows.",
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
      title: "Global Data Jobs Salary Benchmark", 
      tool: "Advanced Excel · Power Query", 
      metric: "111 Countries Modeled",
      summary: "Built a median-based compensation model across 111 countries to eliminate outlier skew and compare role premiums accurately.",
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
      title: "Netflix Catalogue Strategy Dashboard", 
      tool: "Python · Power BI", 
      metric: "19K+ Titles Analyzed",
      summary: "Evaluated 19K+ streaming titles by release trend, genre saturation, and international format shifts to guide content acquisition.",
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
    <section id="projects" className="relative w-full py-28 bg-[#0c121e] z-10 border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-3 block">05 / Portfolio</span>
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-4">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
            FEATURED <span className="italic font-light text-white/60">CASE STUDIES</span>
          </h2>
          <a 
            href="https://github.com/Inder616" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-sm font-mono text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 cursor-pointer"
          >
            <span>View All Repositories on GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          <div className="lg:col-span-6 flex flex-col w-full">
            {projects.map((proj, idx) => (
              <div 
                key={idx}
                onMouseEnter={() => setActiveIndex(idx)}
                onClick={() => setActiveIndex(idx)}
                className={`group relative flex flex-col py-8 border-b border-white/10 cursor-pointer transition-all duration-300 ${activeIndex === idx ? 'opacity-100 pl-6 bg-white/[0.02] rounded-r-2xl' : 'opacity-50 hover:opacity-80 pl-2'}`}
              >
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 transition-opacity duration-300 ${activeIndex === idx ? 'opacity-100' : 'opacity-0'}`} />
                <div className="flex items-start justify-between gap-4 pr-4">
                  <h3 className="text-2xl md:text-3xl font-bold text-white">{proj.title}</h3>
                  <a 
                    href={proj.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="shrink-0 px-3 py-1.5 rounded-full bg-white/5 hover:bg-emerald-500 hover:text-black border border-white/10 text-xs font-mono text-white/80 flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <span>GitHub</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
                <p className="text-white/55 text-sm font-light mt-2 pr-6 leading-relaxed">
                  {proj.summary}
                </p>
                <div className="flex items-center gap-3 text-xs font-mono uppercase mt-4">
                  <span className="text-emerald-400">{proj.tool}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/70">{proj.metric}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-6 h-[460px] lg:h-[540px] sticky top-28">
            <AnimatePresence mode="wait">
              <motion.div key={activeIndex} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="w-full h-full">
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
    <footer id="contact" className="relative w-full bg-[#05080f] text-white pt-28 pb-14 z-15 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 text-center mb-16">
        <span className="text-xs font-mono tracking-[0.25em] uppercase text-emerald-400 mb-4 block">Available for Data & BI Analyst Roles</span>
        <h2 className="text-5xl md:text-8xl font-bold tracking-tighter leading-none mb-6">
          LET'S <span className="italic font-light text-white/50">TALK DATA.</span>
        </h2>
        <p className="text-white/50 max-w-lg mx-auto mb-10 font-light text-base md:text-lg">
          Looking for an analyst who can query the database, clean the mess, and build the executive dashboard? Reach out directly.
        </p>

        {/* Action Buttons: Email and Socials */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <a 
            href="mailto:sinhainder616@gmail.com" 
            className="flex items-center gap-2 px-7 py-4 rounded-full bg-emerald-500 text-black font-semibold text-sm md:text-base hover:bg-emerald-400 transition-colors cursor-pointer shadow-lg"
          >
            <Mail className="w-4 h-4" />
            <span>sinhainder616@gmail.com</span>
          </a>
          <a 
            href="https://www.linkedin.com/in/inder-sinha/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm md:text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <Linkedin className="w-4 h-4 text-cyan-400" />
            <span>LinkedIn</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
          <a 
            href="https://github.com/Inder616" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-7 py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium text-sm md:text-base hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
          >
            <Github className="w-4 h-4 text-emerald-400" />
            <span>GitHub</span>
            <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between text-white/35 text-xs font-mono gap-4">
          <span>© {new Date().getFullYear()} Inderjeet Sinha</span>
          <span>Data Analytics & Business Intelligence Portfolio</span>
        </div>
      </div>
    </footer>
  );
};

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="bg-[#090e17] min-h-screen text-zinc-50 font-sans scroll-smooth">
      <CustomCursor />
      <ScrollToTop />
      <nav className="fixed top-0 left-0 w-full z-40 px-6 md:px-12 py-4 bg-[#090e17]/80 backdrop-blur-lg border-b border-white/5 flex justify-between items-center">
        <a href="#" className="text-lg font-bold tracking-tight text-white cursor-pointer flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>INDER SINHA</span>
        </a>
        <div className="hidden md:flex items-center gap-8 text-sm font-light text-white/70">
          <a href="#about" className="hover:text-emerald-400 transition-colors cursor-pointer">About</a>
          <a href="#experience" className="hover:text-emerald-400 transition-colors cursor-pointer">Experience</a>
          <a href="#skills" className="hover:text-emerald-400 transition-colors cursor-pointer">Stack</a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors cursor-pointer">Case Studies</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors cursor-pointer">Contact</a>
          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download 
            className="px-4 py-2 rounded-full bg-emerald-500 text-black font-semibold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Resume</span>
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="md:hidden p-2 text-white/80 hover:text-white cursor-pointer"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="fixed top-[61px] left-0 w-full bg-[#090e17]/95 backdrop-blur-xl border-b border-white/10 z-40 p-6 flex flex-col gap-4 md:hidden">
          <a href="#about" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2 border-b border-white/5">About</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2 border-b border-white/5">Experience</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2 border-b border-white/5">Technical Stack</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2 border-b border-white/5">Case Studies</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="text-white/80 py-2 border-b border-white/5">Contact</a>
          <a 
            href="/Inder_Data_Analyst_CV.pdf" 
            download 
            className="mt-2 py-3 rounded-xl bg-emerald-500 text-black font-semibold text-center flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Download Resume</span>
          </a>
        </div>
      )}

      <main>
        <Hero />
        <About />
        <Experience />
        <SkillsDetail />
        <ProfessionalSkills />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}