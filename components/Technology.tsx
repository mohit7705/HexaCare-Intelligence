import React from 'react';
import { motion } from 'framer-motion';
import { TECH_STACK } from '../constants';
import { CheckCircle2, Server } from 'lucide-react';

const Technology: React.FC = () => {
  return (
    <section id="technology" className="py-24 bg-navy text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Subsection A: Tech Stack */}
        <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-center mb-24">
          
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 lg:mb-0"
          >
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8">
              Powering the <span className="text-skyGlow">Future of Care</span>
            </h2>
            
            <div className="grid grid-cols-1 gap-6">
              {TECH_STACK.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/10">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-techBlue" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-400 uppercase tracking-wider">{item.category}</h4>
                    <p className="font-medium text-lg text-white">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
             initial={{ opacity: 0, x: 50 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             className="relative"
          >
            {/* Abstract 3D Stack Representation */}
            <div className="relative rounded-xl overflow-hidden shadow-2xl border border-skyGlow/20 bg-navy/50">
                <div className="absolute inset-0 bg-gradient-to-br from-techBlue/20 to-transparent z-10 pointer-events-none"></div>
                <img 
                    src="https://picsum.photos/800/800?random=3" 
                    alt="Isometric Tech Stack" 
                    className="w-full h-auto opacity-80"
                />
            </div>
          </motion.div>
        </div>

        {/* Subsection B: Architecture */}
        <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border-t border-white/10 pt-20"
        >
            <div className="text-center mb-12">
                <h3 className="font-heading font-bold text-2xl md:text-3xl">System Architecture Flow</h3>
                <p className="text-gray-400 mt-2">Secure end-to-end data processing pipeline</p>
            </div>

            <div className="relative w-full bg-black/40 rounded-2xl p-4 border border-white/10 shadow-inner overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-skyGlow to-transparent opacity-50"></div>
                
                {/* Simplified Architecture Visual Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center justify-items-center py-10 text-center">
                    
                    <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center border border-white/20 mb-3">
                            <span className="text-2xl">👤</span>
                        </div>
                        <span className="font-mono text-sm text-skyGlow">User</span>
                    </div>

                    <div className="hidden md:block h-0.5 w-full bg-gradient-to-r from-white/10 to-white/30"></div>

                    <div className="flex flex-col items-center">
                         <div className="w-16 h-16 rounded-lg bg-techBlue/20 flex items-center justify-center border border-techBlue mb-3">
                            <span className="text-2xl">🖥️</span>
                        </div>
                        <span className="font-mono text-sm text-skyGlow">Frontend</span>
                    </div>

                    <div className="hidden md:block h-0.5 w-full bg-gradient-to-r from-white/10 to-white/30"></div>

                     <div className="flex flex-col items-center p-4 rounded-xl border border-skyGlow/50 bg-skyGlow/10 shadow-[0_0_30px_rgba(74,179,255,0.2)]">
                        <Server className="w-8 h-8 text-skyGlow mb-2 animate-pulse"/>
                        <span className="font-bold text-white">AI Engine</span>
                        <span className="text-xs text-gray-400">LLM + Vision</span>
                    </div>

                    <div className="hidden md:block h-0.5 w-full bg-gradient-to-r from-white/10 to-white/30"></div>

                    <div className="flex flex-col items-center">
                         <div className="w-16 h-16 rounded-lg bg-green-900/30 flex items-center justify-center border border-green-500/50 mb-3">
                            <span className="text-2xl">⛓️</span>
                        </div>
                        <span className="font-mono text-sm text-skyGlow">Stellar Ledger</span>
                    </div>

                </div>
            </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Technology;