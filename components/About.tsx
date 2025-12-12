import React from 'react';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-5 lg:gap-16 items-center">
          
          {/* Image Side (40%) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="lg:col-span-2 mb-10 lg:mb-0"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-gray-100">
               <img 
                src="https://picsum.photos/600/800?random=2" 
                alt="AI Doctor Interface" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy/80 to-transparent p-6">
                <p className="text-white font-heading font-semibold">Trustworthy AI Analysis</p>
                <p className="text-gray-200 text-sm">Validating over 1M+ data points</p>
              </div>
            </div>
          </motion.div>

          {/* Text Side (60%) */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="lg:col-span-3"
          >
            <h2 className="font-heading font-bold text-3xl lg:text-4xl text-navy mb-6">
              About HexaCare
            </h2>
            <div className="space-y-6 text-bodyText text-lg leading-relaxed">
              <p>
                HexaCare Intelligence is an AI-powered preventive health platform designed to detect risks early across multiple domains—physical, mental, metabolic, cardiac, dermatological, and women’s wellness.
              </p>
              <p>
                Our mission is to make early screening accessible, accurate, and actionable for everyone. We believe that technology should bridge the gap between symptoms and diagnosis.
              </p>
              <p>
                Using a combination of LLMs, machine learning, vision models, and secure Stellar blockchain, HexaCare delivers medical-grade insights within seconds, ensuring your health data remains private and immutable.
              </p>
            </div>
            
            <div className="mt-8 flex items-center space-x-4">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <img key={i} className="w-10 h-10 rounded-full border-2 border-white" src={`https://picsum.photos/50/50?random=${i + 10}`} alt="User" />
                ))}
              </div>
              <p className="text-sm text-navy font-medium">Trusted by 10,000+ early adopters</p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default About;