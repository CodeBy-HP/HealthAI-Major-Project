import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, 
  Brain, 
  Activity, 
  Shield, 
  Zap, 
  Eye, 
  HeartPulse, 
  Microscope,
  TrendingUp,
  Award,
  Lock,
  ChevronRight,
  Star,
  Globe,
  Users,
  FileText,
  Bot
} from 'lucide-react'
import Login from '../components/Login'

const HeroPage = ({ onLogin }) => {
  const [showLogin, setShowLogin] = useState(false)

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced Gemini AI analyzes your medical reports with unprecedented accuracy, providing insights that rival expert diagnosticians.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Eye,
      title: "Computer Vision Intelligence",
      description: "Revolutionary OCR technology extracts data from any medical document - handwritten or printed - with 99.9% accuracy.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: HeartPulse,
      title: "Real-Time Vitals Monitoring",
      description: "Comprehensive vital signs analysis with instant risk assessment and predictive health scoring powered by machine learning.",
      color: "from-red-500 to-orange-500"
    },
    {
      icon: Microscope,
      title: "Multi-Report Integration",
      description: "Seamlessly correlate data across multiple lab reports, creating a complete health timeline with AI-driven pattern recognition.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: Zap,
      title: "Instant Prescriptions",
      description: "AI generates evidence-based medication recommendations with dosage, frequency, and potential interactions in milliseconds.",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description: "Military-grade encryption ensures your medical data remains completely private and HIPAA-compliant at all times.",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const stats = [
    { icon: Users, value: "10K+", label: "Healthcare Providers" },
    { icon: FileText, value: "1M+", label: "Reports Analyzed" },
    { icon: TrendingUp, value: "99.9%", label: "Accuracy Rate" },
    { icon: Award, value: "#1", label: "AI Healthcare Platform" }
  ]

  const innovations = [
    {
      title: "Gemini Pro Integration",
      description: "Leverages Google's most advanced AI model for medical analysis",
      icon: Bot
    },
    {
      title: "Progressive Dashboard",
      description: "Dynamic, session-based interface that adapts to your workflow",
      icon: TrendingUp
    },
    {
      title: "Multi-Modal Processing",
      description: "Handles PDFs, images, handwritten notes, and digital reports",
      icon: Globe
    },
    {
      title: "Intelligent Suggestions",
      description: "Context-aware recommendations for prescriptions, tests, and follow-ups",
      icon: Sparkles
    }
  ]

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Login onLogin={onLogin} />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -inset-[10px] opacity-50">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
              style={{
                width: Math.random() * 300 + 50,
                height: Math.random() * 300 + 50,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                scale: [1, 1.2, 1],
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative">
        <div className="container mx-auto px-4 py-20">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <motion.div
              className="inline-flex items-center bg-white/10 backdrop-blur-lg rounded-full px-6 py-3 mb-8 border border-white/20"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="h-5 w-5 text-yellow-400 mr-2" />
              <span className="text-sm font-semibold bg-gradient-to-r from-yellow-400 to-pink-500 bg-clip-text text-transparent">
                Powered by Google Gemini AI
              </span>
            </motion.div>

            <h1 className="text-7xl md:text-8xl font-black mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                MediLens
              </span>
            </h1>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-200">
              The Future of Healthcare Intelligence
            </h2>
            
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
              Revolutionary AI-powered platform that transforms medical diagnostics through 
              advanced computer vision, natural language processing, and predictive analytics. 
              Experience healthcare reimagined.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                onClick={() => setShowLogin(true)}
                className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full font-bold text-lg shadow-2xl shadow-purple-500/50 overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10 flex items-center">
                  Launch Platform
                  <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                  initial={{ x: "100%" }}
                  whileHover={{ x: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
              
              <motion.button
                className="px-8 py-4 bg-white/10 backdrop-blur-lg rounded-full font-semibold text-lg border border-white/20 hover:bg-white/20 transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-32"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 text-center"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.15)" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <stat.icon className="h-8 w-8 mx-auto mb-3 text-purple-400" />
                <div className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mb-32"
          >
            <h2 className="text-5xl font-black text-center mb-4">
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Breakthrough Technology
              </span>
            </h2>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">
              Six revolutionary features that make MediLens the most advanced healthcare AI platform
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className="group relative bg-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/10 hover:border-white/30 transition-all"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                  
                  <div className={`inline-flex p-3 bg-gradient-to-r ${feature.color} rounded-xl mb-6`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{feature.description}</p>
                  
                  <div className="absolute top-4 right-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Innovations Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-32"
          >
            <h2 className="text-5xl font-black text-center mb-4">
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Core Innovations
              </span>
            </h2>
            <p className="text-xl text-gray-300 text-center mb-16 max-w-2xl mx-auto">
              Cutting-edge technologies powering the next generation of medical diagnostics
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {innovations.map((innovation, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 backdrop-blur-lg rounded-2xl p-8 border border-purple-500/30"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex-shrink-0">
                    <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                      <innovation.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">{innovation.title}</h3>
                    <p className="text-gray-300">{innovation.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-16 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/20" />
            
            <motion.div
              className="relative z-10"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Lock className="h-16 w-16 mx-auto mb-6 text-white" />
            </motion.div>
            
            <h2 className="relative z-10 text-5xl font-black mb-6">
              Ready to Transform Healthcare?
            </h2>
            <p className="relative z-10 text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of healthcare professionals using MediLens to deliver faster, 
              more accurate diagnoses and better patient outcomes.
            </p>
            
            <motion.button
              onClick={() => setShowLogin(true)}
              className="relative z-10 px-12 py-5 bg-white text-purple-600 rounded-full font-black text-xl shadow-2xl hover:shadow-white/50 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started Now →
            </motion.button>

            {/* Floating elements */}
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/20"
                style={{
                  width: Math.random() * 50 + 10,
                  height: Math.random() * 50 + 10,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2
                }}
              />
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-20 text-gray-400"
          >
            <p className="mb-4">© 2025 MediLens. Revolutionizing Healthcare with AI.</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HeroPage
