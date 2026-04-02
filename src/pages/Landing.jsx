import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Activity, Shield, Zap, TrendingUp, ChevronRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary overflow-x-hidden relative">
      
      {/* Premium Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-accent/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between p-6 lg:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent text-bg-base flex items-center justify-center">
            <Activity className="h-6 w-6" strokeWidth={3} />
          </div>
          <span className="text-2xl font-heading font-extrabold tracking-tighter text-white">Pulse.</span>
        </div>
        
        <div className="flex items-center gap-4">
          <Link to="/login">
            <Button variant="ghost" className="font-bold tracking-wide">Sign In</Button>
          </Link>
          <Link to="/signup">
            <Button className="font-bold tracking-wide px-8 border-none ring-1 ring-white/10 group">
              Get Started <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-16 lg:pt-32 pb-20 px-6 max-w-7xl mx-auto text-center lg:text-left grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="h-4 w-4 fill-accent" /> Now in Early Access
          </div>
          <h1 className="text-6xl lg:text-8xl font-heading font-black tracking-tighter leading-[0.9] text-white mb-8">
            Pulse <br />
            <span className="text-accent italic">Intelligence.</span>
          </h1>
          <p className="text-xl text-text-secondary max-w-xl mb-12 font-medium leading-relaxed">
            The next generation of fitness tracking. Beautifully designed to help you track every rep, macro, and milestone with scientific precision.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button className="w-full sm:w-auto text-lg py-7 px-10">Start Your Journey</Button>
            </Link>
            <div className="flex -space-x-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-bg-base bg-bg-surface overflow-hidden">
                  <img src={`https://i.pravatar.cc/150?u=${i + 12}`} alt="User" />
                </div>
              ))}
              <div className="flex flex-col justify-center ml-4 text-left">
                <span className="text-sm font-bold text-white">Join 12,000+</span>
                <span className="text-xs text-text-muted">Athletes worldwide</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          {/* Dashboard Preview Graphic */}
          <div className="glass-card rounded-[48px] p-6 border border-white/10 shadow-2xl relative overflow-hidden aspect-square flex items-center justify-center group">
             <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 via-transparent to-transparent opacity-50" />
             <div className="relative z-10 w-full h-full bg-[#0B0614]/80 rounded-[32px] border border-white/5 flex flex-col p-8 overflow-hidden">
                <div className="h-4 w-1/3 bg-white/5 rounded-full mb-8" />
                <div className="grid grid-cols-2 gap-6 h-full">
                   <div className="aspect-square rounded-[24px] border border-accent/30 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full border-[10px] border-accent/20 border-t-accent animate-[spin_3s_linear_infinite]" />
                   </div>
                   <div className="space-y-4">
                      <div className="h-20 w-full bg-white/5 rounded-[20px] p-4 flex flex-col justify-end">
                         <div className="h-2 w-1/2 bg-accent/50 rounded-full mb-2" />
                         <div className="h-4 w-3/4 bg-white/10 rounded-full" />
                      </div>
                      <div className="h-20 w-full bg-white/5 rounded-[20px]" />
                   </div>
                   <div className="col-span-2 h-full bg-white/5 rounded-[24px] mt-2 relative p-6">
                      <div className="flex gap-2 items-end h-full">
                         {[60, 40, 80, 50, 90, 70, 85].map((h, i) => (
                           <div key={i} className="flex-1 bg-accent/20 rounded-full" style={{ height: `${h}%` }} />
                         ))}
                      </div>
                   </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Preview */}
      <section className="py-24 px-6 relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-10 rounded-[32px] bg-bg-surface border border-white/5 hover:border-accent/20 transition-all group">
              <Zap className="h-10 w-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-heading font-bold text-white mb-4 italic">Instant Sync</h3>
              <p className="text-text-secondary leading-relaxed">Log your workout in seconds and see your stats updated across all devices instantly.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-bg-surface border border-white/5 hover:border-accent/20 transition-all group">
              <Shield className="h-10 w-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-heading font-bold text-white mb-4 italic">Data Privacy</h3>
              <p className="text-text-secondary leading-relaxed">Your health data is encrypted and stored securely. You own your metrics, always.</p>
           </div>
           <div className="p-10 rounded-[32px] bg-bg-surface border border-white/5 hover:border-accent/20 transition-all group">
              <TrendingUp className="h-10 w-10 text-accent mb-6 group-hover:scale-110 transition-transform" />
              <h3 className="text-2xl font-heading font-bold text-white mb-4 italic">Smart Insights</h3>
              <p className="text-text-secondary leading-relaxed">AI-driven analysis of your calories and progress to help you break through plateaus.</p>
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/5 text-center">
        <p className="text-sm text-text-muted">© 2026 Pulse Fitness Technologies. All rights reserved.</p>
      </footer>
    </div>
  );
}
