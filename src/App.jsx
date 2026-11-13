import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowUpRight, Play, Database, BarChart3, TerminalSquare, 
  FileSpreadsheet, Award, GraduationCap, Activity, Lightbulb, 
  Wrench, ShieldCheck, TrendingUp, Layers, MessageSquare, 
  Zap, Download, Filter, Network, LayoutGrid, Box, PieChart, 
  Search, Calculator, CheckCircle2, ChevronRight, Menu, X, ExternalLink, Copy, Check
} from 'lucide-react';

// Custom SVG Icons to prevent Vercel build crashes from deprecated Lucide brand exports
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

// 3D Background Canvas Component (Data Pipeline & Constellation Matrix)
const DataBackgroundCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes representing data points and pipeline flows
    const particles = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 2 + 1,
    }));

    let hue = 160; // Emerald hue

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw connecting grid lines & data streams
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 130) {
            ctx.strokeStyle = `hsla(${hue}, 80%, 50%, ${1 - dist / 130})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.fillStyle = `hsl(${hue}, 90%, 60%)`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};

// Projects Data with GitHub Links and Context
const projectsData = [
  {
    id: 1,
    title: "SVLL & VNR Seeds Logistics & ERP Analytics",
    category: "ERP & Supply Chain Analytics",
    description: "Consolidated 7 disparate ERP data modules (LR, POD, Billing, Fleet) handling 1.2M+ rows. Automated reporting pipelines cutting manual reconciliation time by 45%.",
    metrics: ["1.2M+ Rows Analyzed", "7 ERP Modules Unified", "45% Time Saved"],
    github: "https://github.com/Inder616",
    dashboardType: "supply-chain"
  },
  {
    id: 2,
    title: "Healthcare Patient No-Show & Waiting Time Predictor",
    category: "Predictive Healthcare Analytics",
    description: "Analyzed 111K+ medical appointments to evaluate age and gender wait time correlations, uncovering key operational bottlenecks driving appointment drop-offs.",
    metrics: ["111K+ Appointments", "Multivariate ANOVA", "Actionable Triage Insights"],
    github: "https://github.com/Inder616",
    dashboardType: "healthcare"
  },
  {
    id: 3,
    title: "Global Data Professional Salary & Skill Benchmark",
    category: "Market Compensation Analytics",
    description: "Processed multi-country salary datasets across 111 nations. Utilized median metrics instead of distorted means to deliver accurate geographic compensation intelligence.",
    metrics: ["111 Countries", "Robust Median Modeling", "Interactive DAX Slicers"],
    github: "https://github.com/Inder616",
    dashboardType: "salary"
  },
  {
    id: 4,
    title: "Netflix Content Growth & Catalogue Share Optimization",
    category: "Media & Business Intelligence",
    description: "Cross-referenced title growth trajectories with global catalogue share across 19K+ titles to formulate strategic content investment recommendations.",
    metrics: ["19K+ Titles", "Genre Growth Matrix", "ROI Recommendations"],
    github: "https://github.com/Inder616",
    dashboardType: "netflix"
  },
  {
    id: 5,
    title: "SQL Data Analyst Job Market & Skill Demands",
    category: "SQL & Advanced Querying",
    description: "Built advanced CTEs and window functions to mine job market databases, ranking high-demand technical skill clusters and salary thresholds.",
    metrics: ["Complex CTEs", "Window Functions", "Market Trend Scoring"],
    github: "https://github.com/Inder616",
    dashboardType: "sql-market"
  }
];

// Certifications Data with Exact Coursera Links
const certificationsData = [
  {
    title: "IBM Data Analyst Professional Certificate",
    issuer: "Coursera",
    year: "2026",
    link: "https://www.coursera.org",
    icon: Award
  },
  {
    title: "Microsoft Power BI Data Analyst Professional Certificate",
    issuer: "Coursera",
    year: "2026",
    link: "https://www.coursera.org",
    icon: Award
  },
  {
    title: "Google Business Intelligence Professional Certificate",
    issuer: "Coursera",
    year: "2026",
    link: "https://www.coursera.org",
    icon: Award
  },
  {
    title: "Deloitte Data Analytics Job Simulation",
    issuer: "Forage",
    year: "2025",
    link: "https://www.theforage.com",
    icon: Award
  }
];

// Education Data
const educationData = [
  {
    degree: "MBA, Business Analytics and Marketing",
    institution: "ICFAI University",
    period: "2024 – 2026",
    cgpa: "9.35 CGPA"
  },
  {
    degree: "PG Diploma in Computer Applications",
    institution: "Kalinga University",
    period: "2023 – 2024",
    cgpa: "Advanced Computing & DB"
  },
  {
    degree: "Bachelor of Commerce (B.Com)",
    institution: "MAIC",
    period: "2020 – 2023",
    cgpa: "Financial Accounting"
  }
];

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("inderjeetsinha616@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-300 relative overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-[#0b0f17]/80 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              IS
            </div>
            <div>
              <span className="font-semibold text-white tracking-tight block">Inderjeet Sinha</span>
              <span className="text-xs text-emerald-400 font-medium">Data Analyst</span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#expertise" className="hover:text-emerald-400 transition-colors">Expertise</a>
            <a href="#skills" className="hover:text-emerald-400 transition-colors">Tech Stack</a>
            <a href="#projects" className="hover:text-emerald-400 transition-colors">Projects</a>
            <a href="#education" className="hover:text-emerald-400 transition-colors">Education & Certs</a>
            <a href="#contact" className="hover:text-emerald-400 transition-colors">Contact</a>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <a 
              href="#contact" 
              className="px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold hover:bg-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download CV
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className="md:hidden text-slate-300 hover:text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0b0f17] border-b border-slate-800 px-6 py-6 space-y-4 shadow-2xl">
            <a href="#expertise" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-emerald-400 text-base font-medium">Expertise</a>
            <a href="#skills" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-emerald-400 text-base font-medium">Tech Stack</a>
            <a href="#projects" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-emerald-400 text-base font-medium">Projects</a>
            <a href="#education" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-emerald-400 text-base font-medium">Education & Certs</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="block text-slate-300 hover:text-emerald-400 text-base font-medium">Contact</a>
            <div className="pt-2">
              <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="w-full py-3 rounded-xl bg-emerald-500 text-slate-950 font-bold text-center block shadow-lg shadow-emerald-500/20">
                Download CV
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section with 3D Canvas Background */}
      <section className="relative pt-24 pb-20 px-6 overflow-hidden">
        <DataBackgroundCanvas />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Available for Data Analyst Roles & Collaborations
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight">
            Transforming Complex ERP Data Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">Actionable Decisions</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            MBA in Business Analytics & Marketing with hands-on experience unifying 7+ ERP modules, building dynamic Power BI dashboards, and writing rigorous SQL queries.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="#projects" className="px-7 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2">
              Explore Dashboards <ChevronRight className="w-4 h-4" />
            </a>
            <a href="#contact" className="px-7 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold hover:bg-slate-800 transition-all">
              Get in Touch
            </a>
          </div>

          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-12 border-t border-slate-800/80">
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-white">1.2M+</div>
              <div className="text-xs text-slate-400 mt-1">Rows Processed & Queried</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-white">7 Modules</div>
              <div className="text-xs text-slate-400 mt-1">ERP Logistics Unified</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-white">9.35 CGPA</div>
              <div className="text-xs text-slate-400 mt-1">MBA Business Analytics</div>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/60">
              <div className="text-2xl font-bold text-white">3 Certs</div>
              <div className="text-xs text-slate-400 mt-1">IBM, Microsoft, Google</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Expertise Section */}
      <section id="expertise" className="py-20 px-6 border-t border-slate-800/60 bg-slate-950/40 relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">Core Competencies</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Core Expertise</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0">
              Bridging business strategy and technical execution through rigorous quantitative analysis and clean data architectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">SQL & Data Architecture</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Writing complex queries utilizing CTEs, window functions, and multi-table joins for pristine data extraction and hygiene across operational databases.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Power BI & DAX Modeling</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Designing dynamic KPI dashboards, star schema data models, and advanced DAX measures that enable non-technical stakeholders to explore actionable insights.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                <TerminalSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Python & Web Scraping</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Automating data cleaning, exploratory data analysis (EDA), and web scraping pipelines using Python, Pandas, NumPy, and BeautifulSoup.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Arsenal Section (Exact Ordered Stack) */}
      <section id="skills" className="py-20 px-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">Technical Proficiency</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Technical Arsenal</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
              The exact toolset deployed in production environments to analyze millions of rows and build automated reporting systems.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <FileSpreadsheet className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Advanced Excel</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Power Pivot, XLOOKUP, Index/Match, Pivot Tables, and financial modeling for rapid prototyping.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1 px-2.5 rounded-md w-fit">Expert Level</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                  <Database className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">SQL & Databases</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  CTEs, Window Functions, Subqueries, Joins, and relational database management.
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 py-1 px-2.5 rounded-md w-fit">Advanced Querying</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Power BI & DAX</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Star schema modeling, DAX measures, Power Query ETL, and executive dashboards.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1 px-2.5 rounded-md w-fit">Dashboarding</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                  <TerminalSquare className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Python Analytics</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  Pandas, NumPy, automated data cleaning scripts, and exploratory data analysis.
                </p>
              </div>
              <span className="text-xs text-cyan-400 font-semibold bg-cyan-500/10 py-1 px-2.5 rounded-md w-fit">Automation</span>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                  <Search className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">Web Scraping</h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4">
                  BeautifulSoup, data extraction from web pages, parsing HTML tables into structured datasets.
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 py-1 px-2.5 rounded-md w-fit">Data Extraction</span>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works / Projects Section */}
      <section id="projects" className="py-20 px-6 border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">Case Studies & Code</span>
              <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Selected Works</h2>
            </div>
            <p className="text-slate-400 text-sm max-w-md mt-4 md:mt-0">
              Explore end-to-end data analytics projects complete with GitHub repositories and analytical context.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Project List */}
            <div className="lg:col-span-6 space-y-4">
              {projectsData.map((project, index) => (
                <div 
                  key={project.id}
                  onClick={() => setActiveProject(index)}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                    activeProject === index 
                      ? 'bg-slate-900 border-emerald-500/60 shadow-xl shadow-emerald-500/5' 
                      : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{project.category}</span>
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-emerald-400 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      GitHub Repo <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                  <p className="text-slate-400 text-sm mb-4 leading-relaxed">{project.description}</p>

                  <div className="flex flex-wrap gap-2">
                    {project.metrics.map((metric, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-medium">
                        {metric}
                      </span>
                    ))}
                  </div>

                  {/* Inline Mobile Interactive Preview */}
                  <div className="mt-6 pt-6 border-t border-slate-800 lg:hidden">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800 text-xs font-semibold text-emerald-400">
                        <span>LIVE DASHBOARD PREVIEW</span>
                        <span>{project.category}</span>
                      </div>
                      <div className="space-y-3">
                        <div className="h-24 bg-gradient-to-br from-emerald-950/40 to-slate-900 rounded-lg p-3 flex flex-col justify-between border border-emerald-500/20">
                          <span className="text-xs text-slate-400 font-mono">PRIMARY METRIC</span>
                          <span className="text-lg font-bold text-white">{project.metrics[0]}</span>
                        </div>
                        <div className="h-20 bg-slate-900 rounded-lg p-3 flex flex-col justify-between border border-slate-800">
                          <span className="text-xs text-slate-400 font-mono">SECONDARY METRIC</span>
                          <span className="text-sm font-semibold text-emerald-300">{project.metrics[1]}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Sticky Dashboard Preview Panel */}
            <div className="hidden lg:block lg:col-span-6 sticky top-28">
              <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-2xl">
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                    Interactive Dashboard Simulation
                  </span>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-1">Active Project</span>
                    <h4 className="text-xl font-bold text-white">{projectsData[activeProject].title}</h4>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Primary Impact</span>
                      <span className="text-lg font-extrabold text-emerald-400">{projectsData[activeProject].metrics[0]}</span>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                      <span className="text-xs text-slate-400 block mb-1">Architecture</span>
                      <span className="text-sm font-bold text-slate-200">{projectsData[activeProject].metrics[1]}</span>
                    </div>
                  </div>

                  <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 space-y-2">
                    <div className="text-emerald-400 font-semibold mb-1">// Query Execution & Data Pipeline Summary</div>
                    <div>> Loading dataset: <span className="text-cyan-400">{projectsData[activeProject].category}</span></div>
                    <div>> Status: <span className="text-emerald-400">Verified & Optimized</span></div>
                    <div>> Repository: <a href={projectsData[activeProject].github} target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline hover:text-emerald-300">View Source Code ↗</a></div>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <a 
                      href={projectsData[activeProject].github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-sm hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      View GitHub Repository <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Education & Certifications Section */}
      <section id="education" className="py-20 px-6 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">Credentials & Academic Foundation</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Certifications & Education</h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto mt-3">
              Verifiable professional certifications from top global educators and formal academic degrees in business analytics and computing.
            </p>
          </div>

          {/* Certifications Grid */}
          <div className="mb-16">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-400" /> Professional Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {certificationsData.map((cert, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-4">
                      <cert.icon className="w-5 h-5" />
                    </div>
                    <h4 className="text-base font-bold text-white mb-2">{cert.title}</h4>
                    <p className="text-xs text-slate-400 mb-4">{cert.issuer} • {cert.year}</p>
                  </div>
                  <a 
                    href={cert.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors pt-3 border-t border-slate-800"
                  >
                    View Credential <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Education Grid */}
          <div>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-cyan-400" /> Academic Background
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {educationData.map((edu, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
                  <span className="text-xs font-semibold text-cyan-400 mb-2 block">{edu.period}</span>
                  <h4 className="text-lg font-bold text-white mb-1">{edu.degree}</h4>
                  <p className="text-sm text-slate-300 font-medium mb-3">{edu.institution}</p>
                  <span className="inline-block text-xs px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-medium">
                    {edu.cgpa}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 border-t border-slate-800/60 bg-slate-950/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-emerald-400 text-xs font-bold uppercase tracking-widest block mb-2">Get in Touch</span>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-6">Let's Build Something Impactful</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto mb-10 leading-relaxed">
            Whether you are looking for a dedicated Data Analyst for your team or want to discuss analytical solutions, my inbox is always open.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <button 
              onClick={handleCopyEmail}
              className="px-6 py-3.5 rounded-xl bg-emerald-500 text-slate-950 font-bold hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              {copied ? "Email Copied to Clipboard!" : "Copy Email Address"}
            </button>
            <a 
              href="https://github.com/Inder616" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <GithubIcon className="w-5 h-5" /> GitHub Profile
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700/80 text-slate-200 font-semibold hover:bg-slate-800 transition-all flex items-center gap-2"
            >
              <LinkedinIcon className="w-5 h-5" /> LinkedIn
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>© {new Date().getFullYear()} Inderjeet Sinha. All rights reserved.</div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/Inder616" target="_blank" rel="noopener noreferrer" className="hover:text-slate-300 transition-colors">
              GitHub
            </a>
            <a href="#contact" className="hover:text-slate-300 transition-colors">Contact</a>
          </div>
        </div>
      </footer>

    </div>
  );
}