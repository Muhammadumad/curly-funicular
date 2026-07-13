
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Search, Apple, Code, LayoutList, BookText, PenTool, Home, Wand2, CreditCard, Calendar, Download, User, Gift } from 'lucide-react';

const SPRING_CONFIG = { stiffness: 300, damping: 20, mass: 0.5 };

function TiltCard({ children, className = "" }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const rotateX = useSpring(useTransform(y, [0, 1], [10, -10]), SPRING_CONFIG);
  const rotateY = useSpring(useTransform(x, [0, 1], [-10, 10]), SPRING_CONFIG);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left) / rect.width);
    y.set((event.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div style={{ perspective: '1000px' }} className="w-full">
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className={`relative w-full ${className}`}
      >
        {children}
      </motion.div>
    </div>
  );
}

const TUTORIAL_BUNDLES = [
  {
    id: 1,
    title: "SwiftUI Fundamentals Handbook",
    description: "A comprehensive guide to mastering Swift programming...",
    icon: <Apple size={20} className="text-white" />,
    stats: "20 free tutorials",
    badge: "PRO",
    color: "from-[#393457] to-[#1E1C38]", // Dark muted purple
    tutorials: [
      { id: 1, title: "Building Your iOS Development...", time: "18:04", desc: "Master the fundamentals of Swift programming with..." },
      { id: 2, title: "SwiftUI Print Debugging", time: "18:04", desc: "Print debugging: Unlock the invisible processes with..." },
      { id: 3, title: "Comments Documentation...", time: "22:02", desc: "Transform your code from mysterious instructions to a..." },
      { id: 4, title: "Variables and Constants", time: "11:37", desc: "Learn when and how to use variables and constants to..." },
      { id: 5, title: "Strings and Interpolation", time: "13:22", desc: "Learn essential string operations in Swift: Build..." },
      { id: 6, title: "Swift Operators: The Foundation...", time: "5:34", desc: "Building powerful iOS apps through the language of..." },
      { id: 7, title: "Swift Unary Operators", time: "15:00", desc: "Mastering the elegant simplicity of unary operators..." },
      { id: 8, title: "Swift Binary Operators", time: "3:36", desc: "Master the two operand symbols that transform..." },
      { id: 9, title: "Arithmetic Operators", time: "6:11", desc: "Learn how to implement and optimize arithmetic operatio..." },
    ]
  },
  {
    id: 2,
    title: "SwiftUI Handbook",
    description: "A comprehensive series of tutorials covering Xcode, SwiftUI...",
    icon: <Apple size={20} className="text-white" />,
    stats: "121 free tutorials",
    badge: "PRO",
    color: "from-[#1F2552] to-[#111330]", // Deep navy blue
    tutorials: [
      { id: 1, title: "Visual Editor in Xcode", time: "5:42", desc: "Design your layout using the inspector, insert menu and..." },
      { id: 2, title: "Stacks and Spacer", time: "6:26", desc: "Learn how to use HStack, VStack, ZStack with spacing..." },
      { id: 3, title: "Import Images to Assets Catalog", time: "5:16", desc: "How to import images from Figma to Xcode using PDF,..." },
      { id: 4, title: "Shapes and Stroke", time: "6:26", desc: "How to use shapes like circle, ellipse, capsule, rectangle an..." },
      { id: 5, title: "SF Symbols", time: "4:23", desc: "How to use system icons for Apple platforms with differen..." },
      { id: 6, title: "Color and Image Literals", time: "4:28", desc: "Use the color picker and images list to set your colors..." },
      { id: 7, title: "Sidebar", time: "6:19", desc: "Learn how to create a Sidebar navigation for iOS, iPadOS an..." },
      { id: 8, title: "Toolbar", time: "4:04", desc: "Use the Toolbar modifier to place multiple items in the..." },
      { id: 9, title: "Image View", time: "3:16", desc: "How to work with the Image View and its resizable,..." },
    ]
  },
  {
    id: 3,
    title: "SwiftUI Advanced Handbook",
    description: "An extensive series of tutorials covering advanced topics related...",
    icon: <Apple size={20} className="text-white" />,
    stats: "39 free tutorials",
    badge: "PRO",
    color: "from-[#4A205A] to-[#251030]", // Deep violet/magenta
    tutorials: [
      { id: 1, title: "Firebase Auth", time: "8:18", desc: "How to install Firebase authentification to your Xcod..." },
      { id: 2, title: "Read from Firestore", time: "8:01", desc: "Install Cloud Firestore in your application to fetch and read..." },
      { id: 3, title: "Write to Firestore", time: "5:35", desc: "Save the data users input in your application in a Firestor..." },
      { id: 4, title: "Join an Array of Strings", time: "3:33", desc: "Turn your array into a serialized String" },
      { id: 5, title: "Data from JSON", time: "5:08", desc: "Load data from a JSON file into your SwiftUI application" },
      { id: 6, title: "HTTP Request", time: "6:31", desc: "Create an HTTP Get Request to fetch data from an API" },
      { id: 7, title: "WKWebView", time: "5:25", desc: "Integrate an HTML page into your SwiftUI application usin..." },
      { id: 8, title: "Code Highlighting in...", time: "5:11", desc: "Use Highlight.js to convert your code blocks into beautif..." },
      { id: 9, title: "Test for Production in t...", time: "1:43", desc: "Build your app on Release scheme to test for production" },
    ]
  }
];

export default function Tutorials() {
  return (
    <div className="relative min-h-screen bg-[#1c1a3b] text-slate-100 overflow-hidden font-sans pt-32">
      
      {/* Background Geometric Mountain Shapes */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden bg-gradient-to-br from-[#3b55c5] via-[#482894] to-[#1a1738]">
        
        {/* Left huge triangle/polygon */}
        <div 
          className="absolute top-[-5%] left-[-15%] w-[120%] h-[90%] bg-gradient-to-br from-[#4b63e8] via-[#7540cc] to-[#36155c] opacity-80"
          style={{ clipPath: 'polygon(0 0, 100% 0, 40% 100%, 0 40%)', transform: 'rotate(-5deg)' }}
        />
        
        {/* Right huge triangle */}
        <div 
          className="absolute bottom-[-10%] right-[-5%] w-[90%] h-[90%] bg-gradient-to-tl from-[#190c3d] via-[#3547b3] to-transparent opacity-80 mix-blend-screen"
          style={{ clipPath: 'polygon(100% 100%, 100% 0, 0 100%)', transform: 'rotate(2deg)' }}
        />

        {/* Diagonal Light Beam */}
        <div className="absolute top-[15%] left-[5%] w-64 h-3 bg-white/30 rounded-full transform -rotate-45 blur-[2px] shadow-[0_0_20px_rgba(255,255,255,0.5)]" />
        
        {/* Small floating stars / particles */}
        <div className="absolute top-[20%] left-[40%] w-1.5 h-1.5 bg-white rounded-full opacity-60" />
        <div className="absolute top-[25%] left-[60%] w-1 h-1 bg-white rounded-full opacity-40" />
        <div className="absolute top-[10%] right-[30%] w-2 h-2 bg-white rounded-full opacity-50 blur-[1px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12">
        {/* Hero Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
          <div className="max-w-2xl">
            <span className="text-[11px] font-bold text-white/70 tracking-widest uppercase mb-4 block">320+ Tutorials</span>
            <h1 className="text-4xl sm:text-[3.5rem] font-black text-white leading-[1.1] mb-6 tracking-tight drop-shadow-lg">
              Complete guides <br />
              <span className="text-white">with source files</span>
            </h1>
            <p className="text-[17px] text-white/80 font-medium leading-relaxed max-w-md">
              Find the best tips and tricks in bite-size tutorials <br className="hidden sm:block" />
              about SwiftUI, React and Figma.
            </p>
          </div>
          
          <div className="flex flex-col items-start md:items-end gap-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-black/60 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg hover:scale-110 transition-transform cursor-pointer">
                {/* Figma-like icon */}
                <div className="flex flex-wrap w-[14px] h-[14px]">
                    <div className="w-1/2 h-1/2 bg-rose-500 rounded-tl-full rounded-bl-full" />
                    <div className="w-1/2 h-1/2 bg-orange-500 rounded-tr-full rounded-br-full rounded-bl-full" />
                    <div className="w-1/2 h-1/2 bg-purple-500 rounded-tl-full rounded-bl-full" />
                    <div className="w-1/2 h-1/2 bg-emerald-500 rounded-full" />
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#111111]/80 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Apple size={16} className="text-white" fill="white" />
              </div>
              <div className="w-9 h-9 rounded-full bg-[#111111]/80 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <Code size={16} className="text-cyan-400" />
              </div>
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer">
                <span className="text-slate-900 font-bold text-xs">17</span>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#111111]/80 flex items-center justify-center border border-white/10 backdrop-blur-md shadow-lg hover:scale-110 transition-transform cursor-pointer">
                 <PenTool size={16} className="text-amber-400" />
              </div>
            </div>

            <div className="relative group w-full md:w-auto mt-2">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search size={16} className="text-white/50 group-focus-within:text-white transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full md:w-[280px] bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 text-white placeholder-white/50 rounded-full py-2.5 pl-11 pr-4 outline-none backdrop-blur-xl transition-all shadow-[0_4px_20px_rgba(0,0,0,0.1)] focus:ring-2 focus:ring-white/30 text-sm font-medium"
              />
            </div>
          </div>
        </div>

        {/* Tutorial List */}
        <div className="space-y-16">
          {TUTORIAL_BUNDLES.map((bundle) => (
            <div key={bundle.id} className="flex flex-col lg:flex-row gap-6 items-start">
              
              {/* Left Main Card - 3D Tilt */}
              <div className="w-full lg:w-[260px] shrink-0 lg:sticky lg:top-32">
                <TiltCard>
                  <div className={`relative w-full aspect-[4/5] sm:aspect-auto sm:h-[340px] rounded-[32px] p-7 bg-gradient-to-b ${bundle.color} shadow-[0_30px_60px_rgba(0,0,0,0.4)] border border-white/10 flex flex-col justify-between overflow-hidden group cursor-pointer`}>
                    
                    {/* Inner glowing accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/30 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

                    <div className="relative z-10 flex justify-end">
                      <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center backdrop-blur-sm border border-white/10 group-hover:bg-black/60 transition-colors shadow-inner">
                        {bundle.icon}
                      </div>
                    </div>

                    <div className="relative z-10">
                      <h2 className="text-[22px] font-bold text-white leading-tight mb-3 tracking-tight drop-shadow-md">
                        {bundle.title}
                      </h2>
                      <p className="text-xs text-white/60 font-medium leading-relaxed mb-6 line-clamp-3">
                        {bundle.description}
                      </p>

                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2.5 text-[11px] text-white/70 font-semibold">
                          <BookText size={14} className="text-white/40" />
                          <span>{bundle.stats}</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-[11px] text-white/70 font-semibold">
                          <Code size={14} className="text-white/40" />
                          <span>Videos, PDF, files</span>
                          <span className="ml-auto text-[9px] font-black bg-white/10 border border-white/10 px-1.5 py-0.5 rounded text-white/90">
                            {bundle.badge}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              </div>

              {/* Right Tutorials List Container */}
              <div className="flex-1 w-full relative">
                <div className="absolute inset-0 bg-[#161730]/60 backdrop-blur-3xl rounded-[32px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] pointer-events-none" />
                
                <div className="relative z-10 p-7 sm:p-9">
                  <span className="text-[10px] font-bold text-white/40 tracking-widest uppercase mb-6 block">
                    {bundle.tutorials.length} Tutorials
                  </span>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-8">
                    {bundle.tutorials.map((tut) => (
                      <div key={tut.id} className="group cursor-pointer flex gap-4">
                        <div className="w-7 h-7 shrink-0 rounded-full bg-white/5 flex items-center justify-center text-[11px] font-bold text-white/50 group-hover:bg-white/20 group-hover:text-white transition-colors border border-white/5 mt-0.5">
                          {tut.id}
                        </div>
                        <div>
                          <div className="flex items-start justify-between gap-3 mb-1.5">
                            <h3 className="text-[13px] font-bold text-white/90 leading-snug group-hover:text-white transition-colors">
                              {tut.title}
                            </h3>
                            <span className="text-[9px] font-bold text-white/40 bg-white/5 px-1.5 py-0.5 rounded shrink-0">
                              {tut.time}
                            </span>
                          </div>
                          <p className="text-[11px] text-white/40 leading-relaxed group-hover:text-white/60 transition-colors line-clamp-2">
                            {tut.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-5 border-t border-white/5 flex justify-start">
                    <button className="flex items-center gap-2 text-[11px] font-bold text-white/50 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 px-3 py-1.5 rounded-lg transition-all">
                      <LayoutList size={14} />
                      More tutorials
                    </button>
                  </div>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative mt-32 w-full z-20">
        {/* Layered Waves Divider */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-none transform -translate-y-full">
          <svg className="relative block w-full h-[120px] sm:h-[180px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
            {/* Light blue wave */}
            <path d="M0,80 C300,-20 600,120 900,40 C1050,0 1150,20 1200,40 L1200,120 L0,120 Z" fill="#3b82f6" opacity="0.8" />
            {/* Deep purple wave */}
            <path d="M0,100 C300,140 600,-20 900,80 C1050,130 1150,110 1200,100 L1200,120 L0,120 Z" fill="#2e1065" opacity="0.9" />
            {/* Footer base wave */}
            <path d="M0,120 C300,40 600,200 900,60 C1050,0 1150,30 1200,70 L1200,120 L0,120 Z" fill="#121124" />
          </svg>
        </div>

        <div className="bg-[#121124] relative z-10 pt-4 pb-20 px-6 lg:px-12 flex justify-center">
          <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8 lg:gap-24">
            
            {/* Column 1: Links */}
            <div className="flex flex-col gap-6">
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Home size={16} /> Home
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <LayoutList size={16} /> Courses
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Wand2 size={16} /> Tutorials
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <CreditCard size={16} /> Pricing
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Calendar size={16} /> Updates
              </a>
            </div>

            {/* Column 2: Links */}
            <div className="flex flex-col gap-6">
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Download size={16} /> Downloads
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Search size={16} /> Search
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <User size={16} /> Account
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <Gift size={16} /> Licenses
              </a>
              <a href="#" className="flex items-center gap-3 text-[13px] font-bold text-white/60 hover:text-white transition-colors">
                <PenTool size={16} /> UI Kit
              </a>
            </div>

            {/* Column 3: Text */}
            <div className="flex flex-col gap-6 text-[12px] text-white/50 leading-relaxed font-medium">
              <p>
                Site made with React, Gatsby,<br />
                Netlify and Contentful. Learn <a href="#" className="text-white font-bold hover:underline">how</a>.
              </p>
              <p>Design+Code © 2025</p>
              <p>
                <a href="#" className="text-white font-bold hover:underline">Terms of Service</a> - <a href="#" className="text-white font-bold hover:underline">Privacy Policy</a>
              </p>
              <p>
                Need help? <a href="#" className="text-white font-bold hover:underline">Contact Us</a>
              </p>
            </div>

          </div>
        </div>
      </footer>

    </div>
  );
}
