import { motion } from "framer-motion"
import {
  Zap,
  Navigation,
  MapPin,
  Route,
  Clock,
  Target,
  BarChart3,
  TrendingUp,
  ArrowRight,
  CheckCircle,
  Atom,
  Cpu,
  Globe,
} from "lucide-react"

const CustomButton = ({ children, variant = "primary", size = "md", className = "", ...props }) => {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-black"

  const variants = {
    primary: "bg-white text-black hover:bg-gray-100",
    outline: "border-2 border-gray-600 text-white hover:bg-gray-800 bg-transparent",
  }

  const sizes = {
    md: "px-6 py-3 text-base",
    lg: "px-8 py-6 text-lg",
  }

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}

const CustomCard = ({ children, className = "", ...props }) => {
  return (
    <div
      className={`bg-gray-800/50 border border-gray-700 hover:border-indigo-500/50 transition-all duration-300 rounded-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export default function LandingPage() {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 },
  }

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/10" />
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                <Zap className="text-black" size={32} />
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-white">Entangle Minds</h1>
                <p className="text-indigo-400 text-lg">Quantum Navigation</p>
              </div>
            </div>
          </motion.div>

          <motion.h2 {...fadeInUp} className="text-6xl md:text-7xl font-bold mb-6 text-balance">
            Navigate with
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              {" "}
              Quantum Precision
            </span>
          </motion.h2>

          <motion.p
            {...fadeInUp}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto text-balance"
          >
            Experience the future of navigation with quantum-optimized routing that finds the most efficient paths using
            advanced quantum computing principles and real-time optimization.
          </motion.p>

          <motion.a
            {...fadeInUp}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            href="/routing"
          >
            <CustomButton size="lg">
              Start Navigation
              <ArrowRight className="ml-2" size={20} />
            </CustomButton>
            <CustomButton variant="outline" size="lg">
              Watch Demo
            </CustomButton>
          </motion.a>

          <motion.div
            {...fadeInUp}
            transition={{ delay: 0.6 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {[
              { icon: <Atom size={24} />, label: "Quantum Optimization", value: "99.7% Accuracy" },
              { icon: <TrendingUp size={24} />, label: "Route Efficiency", value: "35% Faster" },
              { icon: <Globe size={24} />, label: "Global Coverage", value: "200+ Cities" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-500/20 rounded-xl mb-4 text-indigo-400">
                  {stat.icon}
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Quantum-Powered Features</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance">
              Revolutionary navigation technology that leverages quantum computing principles to deliver unprecedented
              route optimization and real-time adaptability.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: <Zap className="text-indigo-400" size={32} />,
                title: "Quantum Route Optimization",
                description:
                  "Advanced algorithms that consider multiple route possibilities simultaneously using quantum superposition principles.",
              },
              {
                icon: <BarChart3 className="text-indigo-400" size={32} />,
                title: "Real-Time Analysis",
                description:
                  "Instant route comparison between quantum-optimized and classical paths with detailed performance metrics.",
              },
              {
                icon: <Navigation className="text-indigo-400" size={32} />,
                title: "Multi-Modal Transport",
                description:
                  "Seamless integration across driving, walking, and cycling with mode-specific quantum optimizations.",
              },
              {
                icon: <Target className="text-indigo-400" size={32} />,
                title: "Precision Mapping",
                description:
                  "Quantum-enhanced location accuracy with advanced point selection and route visualization.",
              },
              {
                icon: <Clock className="text-indigo-400" size={32} />,
                title: "Predictive Timing",
                description:
                  "AI-powered time estimation that adapts to traffic patterns and quantum route calculations.",
              },
              {
                icon: <Cpu className="text-indigo-400" size={32} />,
                title: "Quantum Computing",
                description:
                  "Harness the power of quantum algorithms for complex route optimization and traffic analysis.",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <CustomCard className="h-full">
                  <div className="p-6">
                    <div className="mb-4">{feature.icon}</div>
                    <h4 className="text-xl font-semibold text-white mb-3">{feature.title}</h4>
                    <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  </div>
                </CustomCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-balance">How Quantum Navigation Works</h3>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto text-balance">
              Experience the seamless integration of quantum computing and navigation technology in three simple steps.
            </p>
          </motion.div>

          <motion.div
            variants={staggerChildren}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {[
              {
                step: "01",
                icon: <MapPin className="text-indigo-400" size={32} />,
                title: "Set Your Points",
                description:
                  "Simply click on the map to set your start and destination points. Our quantum system immediately begins analyzing possible routes.",
              },
              {
                step: "02",
                icon: <Atom className="text-indigo-400" size={32} />,
                title: "Quantum Processing",
                description:
                  "Our quantum algorithms process multiple route possibilities simultaneously, considering traffic, distance, and efficiency factors.",
              },
              {
                step: "03",
                icon: <Route className="text-indigo-400" size={32} />,
                title: "Optimized Results",
                description:
                  "Receive quantum-optimized routes with detailed comparisons, performance metrics, and real-time adaptability.",
              },
            ].map((step, index) => (
              <motion.div key={index} variants={fadeInUp} className="text-center">
                <div className="relative mb-8">
                  <div className="w-20 h-20 bg-gray-800 border-2 border-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center text-sm font-bold">
                    {step.step}
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-white mb-4">{step.title}</h4>
                <p className="text-gray-300 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-6 bg-gray-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h3 className="text-4xl md:text-5xl font-bold mb-8 text-balance">Why Choose Quantum Navigation?</h3>
              <div className="space-y-6">
                {[
                  "35% faster route optimization compared to classical algorithms",
                  "Real-time quantum analysis of traffic patterns and road conditions",
                  "Multi-modal transport integration with quantum efficiency scoring",
                  "Advanced route comparison with detailed performance metrics",
                  "Predictive routing that adapts to changing conditions",
                ].map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <CheckCircle className="text-indigo-400 mt-1 flex-shrink-0" size={20} />
                    <p className="text-gray-300 text-lg">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                    <BarChart3 className="text-indigo-400" size={24} />
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-white">Performance Metrics</h4>
                    <p className="text-gray-400">Quantum vs Classical Comparison</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Route Optimization</span>
                    <span className="text-indigo-400 font-semibold">+35% Faster</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Accuracy Score</span>
                    <span className="text-indigo-400 font-semibold">99.7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-black/30 rounded-lg">
                    <span className="text-gray-300">Processing Speed</span>
                    <span className="text-indigo-400 font-semibold">2.3x Faster</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h3 className="text-4xl md:text-5xl font-bold mb-6 text-balance">
              Ready to Experience Quantum Navigation?
            </h3>
            <p className="text-xl text-gray-300 mb-12 text-balance">
              Join thousands of users who have revolutionized their navigation experience with quantum-powered route
              optimization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CustomButton size="lg">
                Launch Navigation App
                <Navigation className="ml-2" size={20} />
              </CustomButton>
              <CustomButton variant="outline" size="lg">
                Learn More
              </CustomButton>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 px-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Zap className="text-black" size={20} />
              </div>
              <div>
                <div className="text-xl font-bold text-white">Entangle Minds</div>
                <div className="text-sm text-gray-400">Quantum Navigation</div>
              </div>
            </div>
            <div className="text-gray-400 text-sm">© 2024 Entangle Minds. Powered by quantum computing.</div>
          </div>
        </div>
      </footer>
    </div>
  )
}
