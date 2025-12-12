import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { WHY_US_POINTS, USE_CASES } from '../constants';

const UseCases: React.FC = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Block 1: Why Choose HexaCare */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-navy">
              Why Choose HexaCare?
            </h2>
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {WHY_US_POINTS.map((point, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col items-center text-center space-y-3 p-4 w-40"
              >
                <div className="w-12 h-12 rounded-full bg-pale flex items-center justify-center text-techBlue shadow-sm">
                  <Check className="w-6 h-6" />
                </div>
                <span className="font-bold text-navy text-sm md:text-base leading-tight">
                  {point}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Block 2: Real World Applications */}
        <div className="relative">
           <div className="absolute inset-0 bg-pale/50 transform -skew-y-3 rounded-3xl -z-10"></div>
           
           <div className="py-12 px-6">
             <h3 className="font-heading font-bold text-2xl md:text-3xl text-navy text-center mb-12">
               Real-World Applications
             </h3>

             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {USE_CASES.map((uc, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all"
                  >
                    <h4 className="font-heading font-semibold text-lg text-techBlue mb-2">
                      {uc.title}
                    </h4>
                    <p className="font-sans text-bodyText text-sm mb-4">
                      {uc.description}
                    </p>
                    <div className="flex items-center text-navy font-medium text-sm group cursor-pointer">
                      <span>Learn more</span>
                      <ArrowRight className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                ))}
             </div>
           </div>
        </div>

      </div>
    </section>
  );
};

export default UseCases;