import React, { useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import {
  Zap,
  Navigation,
  MapPin,
  Route,
  Clock,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle,
  Atom,
  Cpu,
  Globe,
  Users,
  Award,
  FileText,
  Download,
  Image as ImageIcon,
  BrainCircuit,
  Lightbulb,
  Palette,
  Code2,
  Terminal,
  MessageSquare
} from "lucide-react"
import { redirect } from "react-router-dom"

const GlowingButton = ({ children, variant = "primary", className = "", ...props }) => {
  const baseStyles = "relative inline-flex items-center justify-center font-bold rounded-xl transition-all duration-300 overflow-hidden group"
  
  const variants = {
    primary: "bg-white text-black hover:scale-105",
    outline: "border border-indigo-500/50 text-white hover:bg-indigo-500/10 hover:border-indigo-400",
    glow: "bg-indigo-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.5)] hover:shadow-[0_0_40px_rgba(79,70,229,0.7)] hover:scale-105"
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} px-8 py-4 ${className}`} {...props}>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      {variant === 'primary' && (
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      )}
    </button>
  )
}

const HolographicCard = ({ children, className = "" }) => (
  <div className={`relative group backdrop-blur-xl bg-gray-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(79,70,229,0.3)] ${className}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <div className="relative z-10 p-6">{children}</div>
  </div>
)

const TeamMember = ({ name, role, description, icon: Icon, image, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className="group h-full"
  >
    <div className="relative overflow-hidden rounded-2xl bg-gray-800/40 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 h-full flex flex-col hover:-translate-y-2">

      <div className="h-28 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 relative">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-30"></div>
      </div>
      
      <div className="px-6 -mt-12 mb-3">
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-2xl bg-gray-900 border-4 border-gray-900 overflow-hidden shadow-xl group-hover:scale-105 transition-transform duration-300">
            {image ? (
               <img src={image} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-3xl font-bold text-white">
                {name.charAt(0)}
              </div>
            )}
          </div>
          <div className="absolute -bottom-2 -right-2 bg-gray-900 p-2 rounded-full border border-gray-700">
            <Icon size={16} className="text-indigo-400" />
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1 flex flex-col">
        <h4 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{name}</h4>
        <div className="text-xs font-mono text-indigo-400 mb-3 tracking-wide uppercase">{role}</div>
        <p className="text-gray-400 text-sm leading-relaxed flex-1 border-t border-gray-700/50 pt-3">
          {description}
        </p>
      </div>
    </div>
  </motion.div>
)

export default function LandingPage() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] })
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])

  const teamMembers = [
    { 
      name: "Saish Mungase", 
      role: "Full Stack Architect", 
      image: "", 
      icon: Code2,
      description: "The Builder. Engineered the complete ecosystem—Frontend, Backend, and the core Quantum Hybrid Model." 
    },
    { 
      name: "Meet Bhavsar", 
      role: "Research & Operations", 
      image: "", 
      icon: MessageSquare,
      description: "The Bridge. Manages communications with faculties and leads the deep-tech research behind our quantum approach." 
    },
    { 
      name: "Rambabu Singh", 
      role: "Quantum Model Engineer", 
      image: "", 
      icon: Atom,
      description: "The Core. Collaborated closely on the quantum modeling, helping translate theoretical physics into Python logic." 
    }
  ];

  useEffect(() => {
    if (sessionStorage.getItem("backend-warmed")) return
    sessionStorage.setItem("backend-warmed", "true")

    async function preStart() {
      const services = [
        {
          name: "Backend-1 (Railway)",
          url: "https://quantum-vrp-production.up.railway.app",
        },
        {
          name: "Backend-2 (Render)",
          url: "https://quantum-optimizer.onrender.com",
        },
      ]

      const requests = services.map(service =>
        fetch(service.url)
          .then(res => ({ name: service.name, ok: res.ok }))
          .catch(() => ({ name: service.name, ok: false }))
      )

      const results = await Promise.allSettled(requests)

      results.forEach((result, i) => {
        const name = services[i].name

        if (result.status === "fulfilled" && result.value.ok) {
          console.log(`${name} is ACTIVE ✅`)
        } else {
          console.log(`${name} is UNAVAILABLE ⚠️`)
        }
      })
    }

    preStart()
  }, [])

  return (
    <div ref={ref} className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      
      <style>{`
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { bg: #000; }
        ::-webkit-scrollbar-thumb { background: #4f46e5; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #6366f1; }
        
        .quantum-grid {
          background-size: 50px 50px;
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          mask-image: radial-gradient(circle at center, black 40%, transparent 100%);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 quantum-grid opacity-30"></div>
        <motion.div style={{ y: backgroundY }} className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px]" />
        <motion.div style={{ y: backgroundY }} className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[120px]" />
      </div>

      <section className="relative min-h-screen flex items-center justify-center px-6 z-10 pt-20">
        <div className="max-w-7xl mx-auto text-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-sm font-mono mb-8 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            AQVH Grand Finale Finalists 🏆
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-gray-500"
          >
            Q-
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent animate-gradient">Fleet</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Bridging the gap between <span className="text-white font-semibold">Classical Logistics</span> and <span className="text-indigo-400 font-semibold">Quantum Supremacy</span>. 
            Solving the Vehicle Routing Problem (VRP) with unprecedented efficiency.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <GlowingButton variant="glow" onClick={() => window.location.href='/routing'}>
              <Zap size={20} fill="currentColor" /> Launch Quantum Router
            </GlowingButton>
          </motion.div>

          <div className="grid grid-cols-3 gap-8 mt-24 border-t border-white/10 pt-12">
            {[
              { label: "Qubits Simulated", value: "32+" },
              { label: "Optimization Speed", value: "35% Faster" },
              { label: "Route Accuracy", value: "99.8%" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-white mb-1 font-mono">{stat.value}</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 relative z-10 bg-gray-900/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-indigo-500/20 rounded-xl"><Lightbulb className="text-indigo-400" /></div>
                 <h2 className="text-3xl font-bold">Our Motive</h2>
              </div>
              <p className="text-lg text-gray-300 leading-relaxed mb-6">
                Current logistics algorithms hit a wall when complexity scales. The "Q-Fleet" initiative was born from the desire to break this wall.
              </p>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                By leveraging <strong>Quantum Annealing</strong> and <strong>Hybrid Solvers</strong>, we aim to reduce carbon footprints, optimize delivery times, and prove that quantum computing isn't just theory—it's the future of logistics.
              </p>
              
              <ul className="space-y-4">
                {[
                  "Solve NP-Hard VRP problems in near real-time",
                  "Reduce fleet fuel consumption by up to 20%",
                  "Showcase practical application of Qiskit & D-Wave"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="text-indigo-500 flex-shrink-0" size={18} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[100px] rounded-full" />
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <HolographicCard className="animate-float" style={{ animationDelay: '0s' }}>
                   <BrainCircuit size={32} className="text-indigo-400 mb-4" />
                   <div className="text-2xl font-bold">Hybrid</div>
                   <div className="text-sm text-gray-400">Architecture</div>
                </HolographicCard>
                <HolographicCard className="animate-float" style={{ animationDelay: '2s' }}>
                   <Atom size={32} className="text-purple-400 mb-4" />
                   <div className="text-2xl font-bold">Quantum</div>
                   <div className="text-sm text-gray-400">Annealing</div>
                </HolographicCard>
                <HolographicCard className="col-span-2 animate-float" style={{ animationDelay: '1s' }}>
                   <Globe size={32} className="text-blue-400 mb-4" />
                   <div className="text-2xl font-bold">Global Scale</div>
                   <div className="text-sm text-gray-400">Route Optimization</div>
                </HolographicCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-center mb-20"
          >
            <span className="text-indigo-500 font-mono tracking-wider text-sm">THE INNOVATORS</span>
            <h2 className="text-5xl font-bold mt-2 mb-6">Q-Fleet Team</h2>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500/10 border border-yellow-500/30 rounded-full text-yellow-300">
              <Award size={18} />
              <span>Selected for AQVH Grand Finale - Amravati Quantum Valley Hackathon</span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
            {teamMembers.map((member, i) => (
              <TeamMember key={i} {...member} delay={i * 0.1} />
            ))}
          </div>
        </div>
      </section>

      <section id="research" className="py-24 px-6 relative z-10 bg-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Project Documentation</h2>
          <p className="text-gray-400 mb-12">Access our technical research, case studies, and visual documentation.</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                <FileText size={32} className="text-red-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Research Paper</h3>
                <p className="text-sm text-gray-500 mt-1">Technical Implementation of Hybrid Quantum VRP</p>
              </div>
              <a href="../report.pdf" download="report.pdf" className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                <Download size={16} /> Download PDF
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-gray-900 border border-gray-800 flex flex-col items-center gap-4 group cursor-pointer"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <ImageIcon size={32} className="text-blue-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Project Poster</h3>
                <p className="text-sm text-gray-500 mt-1">Visual Overview & Hackathon Presentation</p>
              </div>
              <a href="../poster.png" download="poster.png"  className="mt-4 flex items-center gap-2 text-sm font-bold text-gray-300 group-hover:text-white transition-colors">
                <Download size={16} /> Download Image
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-800 bg-gray-950 relative z-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
              <Atom className="text-white" size={24} />
            </div>
            <div>
              <div className="text-xl font-bold text-white">Q-Fleet</div>
              <div className="text-xs text-gray-400">Department of Computer Engineering</div>
            </div>
          </div>
          <div className="text-gray-500 text-sm text-center md:text-right">
            <p>© 2025 Q-Fleet. All rights reserved.</p>
            <p className="mt-1">Built with ❤️ by Team Q-Fleet</p>
          </div>
        </div>
      </footer>

    </div>
  )
}