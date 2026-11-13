import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import { ArrowUpRight, Play, Database, BarChart3, TerminalSquare, FileSpreadsheet, Award, GraduationCap, Activity, Lightbulb, Wrench, ShieldCheck, TrendingUp, Layers, MessageSquare, Zap, Download, Filter, Network, LayoutGrid, Box, PieChart, Search, Calculator, Globe, ChevronUp } from 'lucide-react';
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

// 1. Interactive 3D Dashboard Card (Inspired by reference image)
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
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6" style={{ transform: "translateZ(30px)" }}>
          <span className="text-xs font-medium tracking-[0.2em] text-white/50 uppercase">{activeProject.chartData.title}</span>
          <span className="text-xs font-mono text-white/40 tracking-wider">FY 2026 · LIVE VIEW</span>
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
          {/* Grid lines */}
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
            
            {/* Area Fill */}
            <motion.path 
              key={`fill-${activeProject.title}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              d={`${activeProject.chartData.path} L 100 100 L 0 100 Z`}
              fill={`url(#gradient-${activeProject.title.replace(/\s+/g, '')})`}
            />
            
            {/* Animated Line */}
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

// 1. Custom Smooth Cursor
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

// 2. Magnetic Button Component
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

// 3. Cinematic Vanilla Three.js Background Model (Crash-safe)
const Hero3DModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // Use WebGLRenderer directly to avoid React Reconciler conflicts
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Data Core (Outer Wireframe)
    const coreGeo = new THREE.IcosahedronGeometry(3, 2);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan
      wireframe: true,
      transparent: true,
      opacity: 0.15
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Inner Solid Core
    const innerGeo = new THREE.IcosahedronGeometry(2.8, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x090e17,
      transparent: true,
      opacity: 0.8
    });
    const inner = new THREE.Mesh(innerGeo, innerMat);
    scene.add(inner);

    // Orbiting Data Particles
    const particlesGeo = new THREE.BufferGeometry();
    const particlesCount = 2000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 25;
    }
    
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({
        size: 0.04,
        color: 0x34d399, // Emerald
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending
    });
    
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // Interactive Mouse Tracking
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

      // Rotation animations
      core.rotation.y += 0.002;
      core.rotation.x += 0.001;
      
      inner.rotation.y -= 0.001;
      inner.rotation.x -= 0.002;

      particlesMesh.rotation.y = -elapsedTime * 0.02;
      
      // Smooth parallax interaction
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

    // Cleanup to prevent memory leaks
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', onDocumentMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      coreGeo.dispose();
      coreMat.dispose();
      innerGeo.dispose();
      innerMat.dispose();
      particlesGeo.dispose();
      particlesMat.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-90" />;
};

// 4. Cinematic Vanilla Three.js Skills Model (Data Node Network)
const Skills3DModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 30);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- ABSTRACT DATA NODE NETWORK ---
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Create random positions within a wide sphere
    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * 2 * Math.PI;
        const phi = Math.acos((Math.random() * 2) - 1);
        const radius = 10 + (Math.random() * 15); 

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        velocities.push({
            x: (Math.random() - 0.5) * 0.015,
            y: (Math.random() - 0.5) * 0.015,
            z: (Math.random() - 0.5) * 0.015
        });
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Data points (Nodes)
    const pMat = new THREE.PointsMaterial({
        color: 0x34d399, // Emerald
        size: 0.15,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
    });
    const points = new THREE.Points(pGeo, pMat);
    group.add(points);

    // Connections (Edges)
    const lineMat = new THREE.LineBasicMaterial({
        color: 0x22d3ee, // Cyan
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    
    const lineGeo = new THREE.BufferGeometry();
    const linesMesh = new THREE.LineSegments(lineGeo, lineMat);
    group.add(linesMesh);

    // Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const positions = points.geometry.attributes.position.array;
        
        // Slightly move points for an organic "breathing" data feel
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += velocities[i].x;
            positions[i * 3 + 1] += velocities[i].y;
            positions[i * 3 + 2] += velocities[i].z;

            // Simple boundary bounce
            if (Math.abs(positions[i * 3]) > 25) velocities[i].x *= -1;
            if (Math.abs(positions[i * 3 + 1]) > 25) velocities[i].y *= -1;
            if (Math.abs(positions[i * 3 + 2]) > 25) velocities[i].z *= -1;
        }
        points.geometry.attributes.position.needsUpdate = true;

        // Recalculate connections based on distance
        const linePositions = [];
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < 30) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        group.rotation.y += 0.0005;
        group.rotation.x += 0.0002;
        
        // Smooth Parallax Interaction
        scene.rotation.x += (mouseY * 0.05 - scene.rotation.x) * 0.05;
        scene.rotation.y += (mouseX * 0.05 - scene.rotation.y) * 0.05;

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
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        pGeo.dispose();
        pMat.dispose();
        lineGeo.dispose();
        lineMat.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-30 mix-blend-screen" />
  );
};

// 5. Cinematic Vanilla Three.js Services Model (Data Warehouse Matrix)
const Services3DModel = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;
    
    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x090e17, 0.025); // Fades out the edges for a deep, cinematic look

    // Isometric-style camera positioning
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(18, 12, 18);
    camera.lookAt(0, 2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    // --- POLAR DATA GRID FLOOR ---
    const gridHelper = new THREE.PolarGridHelper(30, 32, 8, 64, 0x22d3ee, 0x22d3ee);
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.08;
    gridHelper.position.y = -0.5;
    group.add(gridHelper);

    // --- CENTRAL DATABASE STACK ---
    const dbMat = new THREE.MeshBasicMaterial({ color: 0x050a14, transparent: true, opacity: 0.95 });
    const dbEdgeMat = new THREE.LineBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.4 });
    const cylGeo = new THREE.CylinderGeometry(3.5, 3.5, 1.2, 32);
    const cylEdges = new THREE.EdgesGeometry(cylGeo);

    // 3 Stacked Tiers
    for(let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(cylGeo, dbMat);
        const edges = new THREE.LineSegments(cylEdges, dbEdgeMat);
        const yPos = i * 1.6;
        mesh.position.y = yPos;
        edges.position.y = yPos;
        group.add(mesh);
        group.add(edges);
    }

    // --- ANALYTICS PILLARS (3D BAR CHARTS) ---
    const pillarMat = new THREE.MeshBasicMaterial({ color: 0x03241b, transparent: true, opacity: 0.85 });
    const pillarEdgeMat = new THREE.LineBasicMaterial({ color: 0x34d399, transparent: true, opacity: 0.6 });
    
    const pillars = [];
    const pillarData = [
        { x: 7, z: 2, baseH: 5 },
        { x: -6, z: -5, baseH: 7 },
        { x: -3, z: 8, baseH: 4 },
        { x: 5, z: -7, baseH: 6 },
        { x: -8, z: 3, baseH: 5.5 }
    ];

    pillarData.forEach(p => {
        const pGeo = new THREE.BoxGeometry(1.5, 1, 1.5); 
        pGeo.translate(0, 0.5, 0); // Move pivot to the bottom so it scales upwards

        const pMesh = new THREE.Mesh(pGeo, pillarMat);
        const pEdges = new THREE.LineSegments(new THREE.EdgesGeometry(pGeo), pillarEdgeMat);
        
        pMesh.position.set(p.x, -0.5, p.z);
        pEdges.position.set(p.x, -0.5, p.z);
        
        group.add(pMesh);
        group.add(pEdges);
        pillars.push({ mesh: pMesh, edges: pEdges, baseH: p.baseH, offset: Math.random() * Math.PI * 2 });
    });

    // Interactive Mouse Tracking
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    const clock = new THREE.Clock();
    let animationFrameId;

    const animate = () => {
        animationFrameId = requestAnimationFrame(animate);
        const time = clock.getElapsedTime();

        // Slow, majestic rotation of the entire architecture
        group.rotation.y = time * 0.05;

        // Smoothly oscillate the analytics pillars to represent live data processing
        pillars.forEach(p => {
            const h = p.baseH + Math.sin(time * 0.5 + p.offset) * 1.5;
            p.mesh.scale.y = h;
            p.edges.scale.y = h;
        });
        
        // Smooth Parallax Interaction for the camera
        camera.position.x += ((18 + mouseX * 3) - camera.position.x) * 0.05;
        camera.position.y += ((12 + mouseY * 2) - camera.position.y) * 0.05;
        camera.lookAt(0, 2, 0);

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
        window.removeEventListener('mousemove', onMouseMove);
        cancelAnimationFrame(animationFrameId);
        if (mountRef.current) mountRef.current.removeChild(renderer.domElement);
        
        // Cleanup memory
        cylGeo.dispose();
        cylEdges.dispose();
        dbMat.dispose();
        dbEdgeMat.dispose();
        pillarMat.dispose();
        pillarEdgeMat.dispose();
        renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-80 mix-blend-screen" />
  );
};

// --- MAIN SECTIONS ---

const Hero = () => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, 200]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* 3D Data Core Model */}
      <Hero3DModel />
      
      {/* Atmospheric Background Orbs */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none translate-x-[20%]" />
      
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
        
        <motion.h1 
          className="text-[12vw] md:text-[8vw] leading-[0.85] tracking-tighter font-bold text-white mix-blend-difference"
        >
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

      {/* Scroll indicator */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-white/40">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
};

// Interactive 3D Stack Visualization for the About Section
const DataStackVisual = () => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 15 });
  
  // Transform for standard frontal mouse interaction
  const mouseRotateX = useTransform(mouseYSpring, [-0.5, 0.5], [15, -15]); 
  const mouseRotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-15, 15]); 

  const handleMouseMove = (e) => {
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

  // The master timeline sequence for the continuous looping animation
  const loopSequence = {
    duration: 12,
    repeat: Infinity,
    // Times map: [0=Start Iso, 0.15=Hold Iso, 0.3=Merged Iso, 0.45=Straight Up, 0.7=Hold Straight, 0.85=Back to Iso, 1=Back to Start]
    times: [0, 0.15, 0.3, 0.45, 0.7, 0.85, 1],
    ease: "easeInOut"
  };

  return (
    <div 
      className="absolute inset-0 flex items-center justify-center overflow-hidden perspective-[2000px] group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Ambient background glow that pulses with the animation */}
      <motion.div 
        animate={{ opacity: [0.3, 0.3, 0.8, 0.8, 0.8, 0.3, 0.3], scale: [0.8, 0.8, 1.2, 1.2, 1.2, 0.8, 0.8] }}
        transition={loopSequence}
        className="absolute w-[80%] h-[80%] bg-cyan-500/10 blur-[80px] rounded-full pointer-events-none" 
      />

      {/* Container Animation: Tilts from Isometric to Straight and back */}
      <motion.div
        animate={{ 
          rotateX: [55, 55, 55, 0, 0, 55, 55], 
          rotateZ: [-40, -40, -40, 0, 0, -40, -40], 
          scale: [0.75, 0.75, 0.75, 1, 1, 0.75, 0.75] 
        }}
        transition={loopSequence}
        className="w-full h-full flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Mouse Interaction Wrapper */}
        <motion.div 
          style={{ rotateX: mouseRotateX, rotateY: mouseRotateY, transformStyle: "preserve-3d" }}
          className="relative w-72 h-72 md:w-80 md:h-80"
        >
           {/* Bottom Layer - Hardware / Raw Data */}
           <motion.div 
              animate={{ z: [-160, -160, -2, -2, -2, -2, -160] }}
              transition={loopSequence}
              className="absolute inset-0 border border-white/10 bg-[#050a14] rounded-[2rem] shadow-[0_50px_100px_-20px_rgba(6,182,212,0.25)] overflow-hidden" 
           >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px] opacity-30" />
              
              <motion.div 
                animate={{ opacity: [1, 1, 0, 0, 0, 0, 1] }}
                transition={loopSequence}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Database className="w-12 h-12 text-white/20" style={{ transform: "rotateZ(45deg) rotateX(-60deg)" }} />
              </motion.div>
           </motion.div>
           
           {/* Middle Layer - Glass Substrate / Processing */}
           <motion.div 
              animate={{ z: [0, 0, -1, -1, -1, -1, 0] }}
              transition={loopSequence}
              className="absolute inset-0 border border-cyan-400/40 bg-cyan-900/20 backdrop-blur-md rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_0_30px_rgba(6,182,212,0.15)] overflow-hidden" 
           >
              <motion.div 
                animate={{ opacity: [1, 1, 0, 0, 0, 0, 1] }}
                transition={loopSequence}
                className="absolute inset-0 flex items-center justify-center"
              >
                 <TerminalSquare className="w-12 h-12 text-cyan-400/40" style={{ transform: "rotateZ(45deg) rotateX(-60deg)" }} />
              </motion.div>
           </motion.div>
           
           {/* Top Layer - Dashboard UI Glass */}
           <motion.div 
              animate={{ z: [160, 160, 0, 0, 0, 0, 160] }}
              transition={loopSequence}
              className="absolute inset-0 border-t border-l border-white/40 border-b border-r border-white/10 bg-[#0a121e]/80 backdrop-blur-2xl rounded-[2rem] shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden p-6 flex flex-col" 
           >
              {/* Dashboard Content - Fades in only when standing straight */}
              <motion.div
                animate={{ 
                  opacity: [0, 0, 0, 1, 1, 0, 0],
                  y: [15, 15, 15, 0, 0, 15, 15]
                }}
                transition={loopSequence}
                className="w-full h-full flex flex-col"
                style={{ transform: "translateZ(10px)" }}
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                   <div className="w-1/2 h-2 bg-white/20 rounded-full" />
                   <div className="w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_15px_#34d399] animate-pulse" />
                </div>

                {/* KPI Boxes */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                   <div className="bg-white/5 rounded-xl p-3 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <div className="w-8 h-1 bg-white/10 rounded-full mb-3" />
                      <div className="text-2xl font-bold text-white tracking-tight">84.2%</div>
                   </div>
                   <div className="bg-white/5 rounded-xl p-3 border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]">
                      <div className="w-8 h-1 bg-white/10 rounded-full mb-3" />
                      <div className="text-2xl font-bold text-cyan-400 tracking-tight">1.2M</div>
                   </div>
                </div>

                {/* Animated Bar Chart - Grows as it fades in */}
                <div className="flex-1 flex items-end justify-between gap-1.5 pt-4 border-t border-white/10">
                   {[40, 70, 45, 90, 65, 100, 80].map((h, i) => (
                     <motion.div
                       key={i}
                       animate={{ height: ["0%", "0%", "0%", `${h}%`, `${h}%`, "0%", "0%"] }}
                       transition={loopSequence}
                       className="w-full bg-gradient-to-t from-cyan-500/20 to-cyan-400 rounded-t-sm relative shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                     >
                        <div className="absolute -top-1 left-0 right-0 h-1 bg-white opacity-80 rounded-t-sm" />
                     </motion.div>
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
    <section id="about" className="relative w-full py-32 bg-[#090e17] z-10">
      {/* Background glow for the text side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div 
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          {/* Left Side: 3D Visualization */}
          <div className="order-2 lg:order-1 relative aspect-[4/5] overflow-hidden rounded-[2.5rem] group bg-[#060a11] border border-white/5 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
            <DataStackVisual />
          </div>
          
          {/* Right Side: Text & Content */}
          <div className="order-1 lg:order-2 flex flex-col justify-center relative z-10">
            <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
              STRATEGIC <br/>
              <span className="italic font-light text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">DATA ANALYST</span>
            </motion.h2>
            
            <motion.div variants={fadeUp} className="space-y-6 text-white/50 text-lg md:text-xl font-light leading-relaxed mb-12">
              <p>
                Operating at the intersection of business strategy and data science. I don't just build dashboards; I architect clear analytical narratives that drive executive decisions.
              </p>
              <p>
                With an MBA in Business Analytics, my philosophy is rooted in finding the signal through the noise. Every SQL query, DAX measure, and Python script is intentionally crafted to uncover hidden opportunities and optimize performance.
              </p>
            </motion.div>
            
            <motion.div variants={fadeUp} className="flex items-center gap-8 md:gap-16 pt-8 border-t border-white/10">
              <div className="flex flex-col">
                <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-emerald-600 mb-2">1M+</span>
                <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-white/40">Records Analysed</span>
              </div>
              <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
              <div className="flex flex-col">
                <span className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-cyan-300 to-cyan-600 mb-2">5+</span>
                <span className="text-xs md:text-sm tracking-[0.2em] uppercase text-white/40">Enterprise Projects</span>
              </div>
            </motion.div>
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
      {/* 3D Topographical Data Landscape */}
      <Services3DModel />
      
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8"
        >
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter">
            CORE <span className="italic font-light text-white/60">EXPERTISE</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/50 max-w-sm font-light">
            A specialized analytics stack designed to handle end-to-end data pipelines, from raw extraction to management reporting.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              whileHover={{ y: -10, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
              className="group relative p-8 md:p-10 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/30 transition-colors duration-500 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-white/20 mb-12 group-hover:text-emerald-400 transition-colors duration-500">
                <span className="text-5xl font-light">0{i + 1}</span>
              </div>
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors duration-300">{service.title}</h3>
              <p className="text-white/50 font-light leading-relaxed group-hover:text-white/70 transition-colors duration-300">
                {service.desc}
              </p>
              
              <div className="mt-12 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </motion.div>
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
        "Replaced a 2–4 hour daily manual reporting process with live Power BI dashboards, consolidating data from 7 ERP modules across 62 depots and saving an estimated 10–15 man-hours per week.",
        "Built SQL and Power Query transformation logic across 32 validated fields and developed 20+ DAX measures and KPI views for LR/POD status, lead time, delays and on-time performance.",
        "Delivered Power BI reports covering freight budget vs actuals, 112K+ vehicle placements, daily dispatch planning, 1.2M+ claim records and HR analytics."
      ]
    },
    {
      role: "Data Analytics & Reporting Intern",
      company: "VNR Seeds",
      date: "Jun 2025 – Aug 2025",
      points: [
        "Cleaned and validated 10,000+ farmer records in Python (pandas), Excel and Google Sheets by standardising formats, removing duplicates and resolving missing values, improving reporting accuracy by ~20%.",
        "Analysed 50,000+ customer interactions across digital channels in Excel and Power BI, building segmentation logic that identified 3 high-engagement segments to shape targeting strategy."
      ]
    }
  ];

  return (
    <section id="experience" className="relative w-full py-32 bg-[#090e17] z-10 overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16 md:mb-24"
        >
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter">
            PROFESSIONAL <span className="italic font-light text-white/60">EXPERIENCE</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/50 max-w-xl font-light mt-6">
            Business intelligence and reporting work, delivered for operations and management teams.
          </motion.p>
        </motion.div>

        <div className="relative border-l border-white/10 ml-4 md:ml-6 space-y-20">
          {experiences.map((exp, idx) => (
            <motion.div 
              key={idx}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              variants={staggerContainer}
              className="relative pl-8 md:pl-16"
            >
              <motion.div variants={fadeUp} className="absolute -left-[5px] top-2 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
              
              <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-6 mb-6">
                <motion.h3 variants={fadeUp} className="text-3xl font-bold text-white tracking-tight">
                  {exp.role}
                </motion.h3>
                <motion.span variants={fadeUp} className="text-xl text-cyan-400 font-light">
                  @ {exp.company}
                </motion.span>
                <motion.span variants={fadeUp} className="text-sm text-white/40 tracking-widest uppercase md:ml-auto">
                  {exp.date}
                </motion.span>
              </div>

              <motion.div variants={fadeUp} className="space-y-4 text-white/60 font-light leading-relaxed">
                {exp.points.map((point, i) => (
                  <p key={i} className="relative pl-6">
                    <span className="absolute left-0 top-2.5 w-1.5 h-1.5 bg-white/20 rounded-full" />
                    {point}
                  </p>
                ))}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Reusable Premium Spotlight Card Component
const SpotlightCard = ({ children, className = "" }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-3xl bg-white/[0.02] border border-white/10 transition-colors duration-500 hover:border-white/20 ${className}`}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 z-0"
        style={{
          opacity: isFocused ? 1 : 0,
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(255,255,255,0.06), transparent 40%)`,
        }}
      />
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

const SkillsDetail = () => {
  const bentoSkills = [
    {
      title: "SQL & Databases",
      color: "text-emerald-400",
      bgGlow: "group-hover:bg-emerald-500/10",
      icon: <Database className="w-8 h-8 mb-6 text-emerald-400" />,
      items: ["PostgreSQL", "Query Optimisation", "CTEs & Window Functions", "Data Extraction"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "Python Analytics",
      color: "text-cyan-400",
      bgGlow: "group-hover:bg-cyan-500/10",
      icon: <TerminalSquare className="w-8 h-8 mb-6 text-cyan-400" />,
      items: ["Pandas & NumPy", "Exploratory Data Analysis", "Matplotlib", "Data Cleaning"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "Power BI & DAX",
      color: "text-blue-400",
      bgGlow: "group-hover:bg-blue-500/10",
      icon: <BarChart3 className="w-8 h-8 mb-6 text-blue-400" />,
      items: ["KPI Dashboards", "20+ Measures in Production", "Power Query (ETL)", "Star Schema Design"],
      spanClass: "md:col-span-1 lg:col-span-2"
    },
    {
      title: "Web Scraping & Mining",
      color: "text-purple-400",
      bgGlow: "group-hover:bg-purple-500/10",
      icon: <Globe className="w-8 h-8 mb-6 text-purple-400" />,
      items: ["BeautifulSoup", "Selenium & Requests", "DOM Parsing", "Automated Extraction"],
      spanClass: "md:col-span-1 lg:col-span-3"
    },
    {
      title: "Advanced Excel",
      color: "text-emerald-500",
      bgGlow: "group-hover:bg-emerald-600/10",
      icon: <FileSpreadsheet className="w-8 h-8 mb-6 text-emerald-500" />,
      items: ["Dynamic Dashboards", "XLOOKUP & INDEX-MATCH", "Pivot Tables", "Power Pivot"],
      spanClass: "md:col-span-2 lg:col-span-3"
    }
  ];

  const acumenItems = [
    { title: "Analytical thinking", desc: "Tested waiting time against demographics to prove the real driver of no-shows." },
    { title: "Problem solving", desc: "Mapped hiring stages to find the true bottleneck sits before the offer." },
    { title: "Attention to detail", desc: "Used median instead of mean for skewed global salary distributions." },
    { title: "Business thinking", desc: "Compared genre growth with catalogue share to recommend strategic investments." },
    { title: "Structured approach", desc: "Built SQL analysis in clear CTE steps for readability and verification." },
    { title: "Clear communication", desc: "Design highly interactive dashboards for non-technical exploration." }
  ];

  return (
    <section id="skills" className="relative w-full py-32 bg-[#090e17] z-10 overflow-hidden border-t border-white/5">
      {/* 3D Data Node Network Background */}
      <Skills3DModel />

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
            TECHNICAL <span className="italic font-light text-white/50">ARSENAL</span>
          </h2>
          <p className="text-white/40 max-w-2xl text-lg font-light">
            A purpose-built stack for transforming messy databases into executive-ready narratives.
          </p>
        </motion.div>

        {/* Bento Grid for Tech Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-24">
          {bentoSkills.map((stack, idx) => (
             <SpotlightCard key={idx} className={`p-8 group h-full flex flex-col ${stack.spanClass}`}>
                <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-0 transition-opacity duration-500 ${stack.bgGlow}`} />
                {stack.icon}
                <h3 className={`text-xl font-bold mb-6 ${stack.color}`}>{stack.title}</h3>
                <ul className="space-y-3 mt-auto">
                  {stack.items.map((item, i) => (
                    <li key={i} className="text-white/60 text-sm font-light flex items-center gap-3">
                      <div className="w-1 h-1 rounded-full bg-white/20" />
                      {item}
                    </li>
                  ))}
                </ul>
             </SpotlightCard>
          ))}
        </div>

        {/* Professional Acumen Grid */}
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tighter mb-4">
            PROFESSIONAL <span className="italic font-light text-white/50">ACUMEN</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {acumenItems.map((item, idx) => (
            <SpotlightCard key={idx} className="p-8">
              <h3 className="text-lg font-bold text-white mb-3 tracking-tight">{item.title}</h3>
              <p className="text-white/40 text-sm font-light leading-relaxed">
                {item.desc}
              </p>
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
      title: "HR Analytics Engine", 
      tool: "Power BI / DAX / SQL", 
      metric: "21d Turnaround Identified",
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
        // Smooth sine-wave like curve
        path: "M 0 80 Q 15 80 25 65 T 50 50 T 75 35 T 100 20"
      }
    },
    { 
      title: "Patient No-Show Prediction", 
      tool: "Python / Pandas", 
      metric: "111K+ Records Processed",
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
        // Sharp spikes representing wait times
        path: "M 0 90 L 20 85 L 40 40 L 60 70 L 80 20 L 100 10"
      }
    },
    { 
      title: "Global Salary Insights", 
      tool: "Advanced Excel", 
      metric: "111 Countries Modeled",
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
        // Exponential growth curve
        path: "M 0 95 Q 40 90 70 50 T 100 5"
      }
    },
    { 
      title: "Content Strategy Model", 
      tool: "Python / Power BI", 
      metric: "19K+ Titles Analyzed",
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
        // Fluctuating steady growth
        path: "M 0 60 C 20 30 40 80 60 40 S 80 70 100 20"
      }
    },
  ];

  return (
    <section id="projects" className="relative w-full py-32 bg-[#0c121e] z-10 overflow-hidden border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-bold tracking-tighter flex items-center gap-6">
            SELECTED <span className="italic font-light text-white/60">WORKS</span>
            <Activity className="w-10 h-10 md:w-16 md:h-16 text-white/20" />
          </motion.h2>
        </motion.div>

        {/* Interactive Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Side: Interactive List */}
          <div className="lg:col-span-6 flex flex-col w-full">
            {projects.map((proj, idx) => (
              <motion.div 
                key={idx}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                variants={fadeUp}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`group relative flex flex-col py-10 border-b border-white/10 cursor-pointer transition-all duration-500 ${activeIndex === idx ? 'opacity-100 pl-4 md:pl-8' : 'opacity-40 hover:opacity-70'}`}
              >
                {/* Active Indicator Line */}
                <div className={`absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b ${proj.color} to-transparent transition-opacity duration-500 ${activeIndex === idx ? 'opacity-100' : 'opacity-0'}`} />
                
                <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">{proj.title}</h3>
                <div className="flex items-center gap-4 text-white/50 text-sm tracking-widest uppercase mt-4">
                  <span>{proj.tool}</span>
                  <span className="w-1 h-1 rounded-full bg-white/20" />
                  <span className="text-white/80">{proj.metric}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Side: 3D Holographic Dashboard */}
          <div className="lg:col-span-6 h-[500px] lg:h-[600px] sticky top-32">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="w-full h-full"
              >
                <Dashboard3DUI activeProject={projects[activeIndex]} />
              </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  );
};

const Credentials = () => {
  const certifications = [
    { title: "IBM Data Analyst Professional Certificate", org: "Coursera", year: "2026", link: true, icon: <Award className="w-6 h-6 text-emerald-400" /> },
    { title: "Microsoft Power BI Data Analyst", org: "Coursera", year: "2026", link: false, icon: <BarChart3 className="w-6 h-6 text-cyan-400" /> },
    { title: "Deloitte Data Analytics Job Simulation", org: "Forage", year: "2025", link: true, icon: <Activity className="w-6 h-6 text-blue-400" /> }
  ];

  const education = [
    { deg: "MBA, Business Analytics & Marketing", uni: "ICFAI University", year: "2024 – 2026", icon: <GraduationCap className="w-6 h-6 text-emerald-400" /> },
    { deg: "PG Diploma in Computer Applications", uni: "Kalinga University", year: "2023 – 2024", icon: <TerminalSquare className="w-6 h-6 text-cyan-400" /> },
    { deg: "Bachelor of Commerce", uni: "MAIC", year: "2020 – 2023", icon: <FileSpreadsheet className="w-6 h-6 text-blue-400" /> }
  ];

  return (
    <section id="credentials" className="relative w-full py-32 bg-[#090e17] z-10 overflow-hidden border-t border-white/5">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 relative z-10">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="mb-16">
          <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tighter mb-4">
            CREDENTIALS <span className="italic font-light text-white/50">& EDUCATION</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          
          {/* Certifications */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4 mb-6">
                <Award className="w-6 h-6 text-emerald-400" />
                <h3 className="text-2xl font-bold text-white">Certifications</h3>
             </div>
             {certifications.map((cert, idx) => (
                <SpotlightCard key={idx} className="p-6 md:p-8 flex items-center justify-between group">
                   <div className="flex flex-col">
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">{cert.title}</h4>
                      <div className="flex items-center gap-3 text-sm text-white/40 font-light uppercase tracking-widest">
                         <span className="text-white/70">{cert.org}</span>
                         <span className="w-1 h-1 rounded-full bg-white/20" />
                         <span>{cert.year}</span>
                      </div>
                   </div>
                   {cert.link && (
                     <div className="hidden md:flex w-10 h-10 shrink-0 rounded-full border border-white/10 items-center justify-center group-hover:bg-white group-hover:text-black transition-all ml-4">
                       <ArrowUpRight className="w-4 h-4" />
                     </div>
                   )}
                </SpotlightCard>
             ))}
          </div>

          {/* Education */}
          <div className="flex flex-col gap-6">
             <div className="flex items-center gap-4 mb-6">
                <GraduationCap className="w-6 h-6 text-cyan-400" />
                <h3 className="text-2xl font-bold text-white">Education</h3>
             </div>
             {education.map((edu, idx) => (
                <SpotlightCard key={idx} className="p-6 md:p-8 flex items-center justify-between group">
                   <div className="flex flex-col">
                      <h4 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{edu.deg}</h4>
                      <div className="flex items-center gap-3 text-sm text-white/40 font-light uppercase tracking-widest">
                         <span className="text-white/70">{edu.uni}</span>
                         <span className="w-1 h-1 rounded-full bg-white/20" />
                         <span>{edu.year}</span>
                      </div>
                   </div>
                </SpotlightCard>
             ))}
          </div>
          
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer id="contact" className="relative w-full bg-[#05080f] text-white overflow-hidden pt-32 pb-8 z-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center mb-32"
        >
          <motion.span variants={fadeUp} className="text-sm tracking-[0.3em] uppercase text-emerald-400/80 mb-6 block">
            Open to new opportunities
          </motion.span>
          <motion.h2 variants={fadeUp} className="text-[12vw] md:text-[9vw] font-bold tracking-tighter leading-none mb-6">
            LET'S <span className="italic font-light text-white/50">CONNECT</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/40 max-w-lg mb-12 font-light text-lg">
            Whether you need a dedicated Data Analyst to drive your BI initiatives, or just want to discuss a complex dataset, my inbox is open.
          </motion.p>
          
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-6">
            <MagneticButton className="px-10 py-5 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform group flex items-center justify-center gap-3">
              <span>Send an Email</span>
              <div className="w-2 h-2 rounded-full bg-black group-hover:bg-emerald-500 transition-colors" />
            </MagneticButton>
            <MagneticButton className="px-10 py-5 rounded-full border border-white/20 bg-transparent text-white font-bold text-lg hover:bg-white/[0.05] transition-colors flex items-center justify-center gap-3">
              <span>View LinkedIn</span>
              <ArrowUpRight className="w-5 h-5 text-cyan-400" />
            </MagneticButton>
          </motion.div>
        </motion.div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-sm font-light text-white/40 gap-4">
          <p>© 2026 Inder Sinha. Located in Chhattisgarh, India.</p>
          <div className="flex items-center gap-8">
            {['LinkedIn', 'GitHub', 'Email', 'Download CV'].map((link) => (
              <a key={link} href="#" className="hover:text-emerald-400 transition-colors duration-300">
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- APP ASSEMBLY ---

export default function App() {
  return (
    <div className="bg-[#090e17] min-h-screen text-zinc-50 selection:bg-emerald-500/30 selection:text-emerald-50 font-sans cursor-none scroll-smooth">
      {/* Noise Texture Overlay for Cinematic feel */}
      <div 
        className="fixed inset-0 z-50 pointer-events-none opacity-20 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
        }}
      />
      
      <CustomCursor />
      <ScrollToTop />
      
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 w-full z-40 px-6 py-4 bg-[#090e17]/70 backdrop-blur-lg border-b border-white/5 flex justify-between items-center pointer-events-auto transition-all duration-300">
        <a href="#" className="text-xl font-bold tracking-tighter text-white cursor-none">INDER®</a>
        
        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-light tracking-wide text-white/70">
          <a href="#experience" className="hover:text-emerald-400 transition-colors cursor-none">Experience</a>
          <a href="#projects" className="hover:text-emerald-400 transition-colors cursor-none">Projects</a>
          <a href="#skills" className="hover:text-emerald-400 transition-colors cursor-none">Skills</a>
          <a href="#about" className="hover:text-emerald-400 transition-colors cursor-none">About</a>
          <a href="#contact" className="hover:text-emerald-400 transition-colors cursor-none">Contact</a>
          
          <MagneticButton className="px-5 py-2.5 rounded-lg bg-white text-[#090e17] font-semibold hover:bg-gray-200 transition-colors flex items-center gap-2">
             <a href="Inder_Data_Analyst_CV.pdf" download className="flex items-center gap-2 cursor-none">
               <Download className="w-4 h-4" />
               <span>Download CV</span>
             </a>
          </MagneticButton>
        </div>

        {/* Mobile Menu Button */}
        <MagneticButton className="md:hidden text-sm uppercase tracking-widest text-white hover:text-gray-300 px-4 py-2">
          Menu
        </MagneticButton>
      </nav>

      <main>
        <Hero />
        <About />
        <Experience />
        <Services />
        <SkillsDetail />
        <Projects />
        <Credentials />
      </main>
      
      <Footer />
    </div>
  );
}