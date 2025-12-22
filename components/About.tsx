import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="relative z-20 py-40 bg-white/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-24 items-center">
          
          {/* IMAGE — UPDATED TO LOCAL FILE */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true, margin: "-100px" }}
            className="mb-16 lg:mb-0"
          >
            <div className="relative rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
              <img 
                src="/images/about-hexacare-ai-health.jpg"
                alt="AI-powered human health screening visualization"
                className="w-full h-[600px] object-cover grayscale hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-transparent opacity-60"></div>
            </div>
          </motion.div>

          {/* TEXT — UNCHANGED */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="font-heading font-black text-5xl lg:text-7xl text-navy mb-10 tracking-tighter">
              About <span className="text-techBlue">HexaCare</span>
            </h2>

            <div className="space-y-8 text-navy/80 text-xl leading-relaxed font-medium">
              <p>
                HexaCare Intelligence is an AI-powered preventive health screening
                platform built to identify potential health risks early — before
                they escalate into serious conditions.
              </p>

              <p className="border-l-4 border-techBlue pl-6 italic text-navy/60">
                Our mission is to make early health screening accessible,
                responsible, and actionable by combining advanced AI with
                human-centric system design.
              </p>

              <p>
                By integrating large language models, machine learning, computer
                vision, and blockchain-based verification, HexaCare delivers fast,
                transparent, and tamper-resistant health insights across multiple
                screening domains.
              </p>
            </div>
            
            {/* TRUST SECTION — UNCHANGED */}
            <div className="mt-12 flex items-center space-x-6">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <img
                    key={i}
                    className="w-12 h-12 rounded-full border-4 border-white shadow-lg"
                    src={`https://picsum.photos/100/100?random=${i + 10}`}
                    alt="Community"
                  />
                ))}
              </div>

              <p className="text-sm text-navy font-black uppercase tracking-widest">
                Built with research-driven design principles
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
