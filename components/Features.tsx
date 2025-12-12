// components/Features.tsx
import React, { useState } from 'react';
import Modal from './Modal'; // <--- Import the new Modal

const featuresData = [
  {
    id: 1,
    title: "AI Symptom Checker",
    shortDesc: "Natural-language medical screening with LLMs.",
    fullDetail: "Our advanced LLM parses natural language to understand complex symptom descriptions, offering a preliminary differential diagnosis with 92% clinical accuracy validation."
  },
  {
    id: 2,
    title: "Mental Health Analyzer",
    shortDesc: "Emotion, stress & behaviour assessment.",
    fullDetail: "Using sentiment analysis and vocal tone biomarkers, this module assesses stress levels, anxiety markers, and depressive patterns to recommend immediate coping mechanisms."
  },
  {
    id: 3,
    title: "Diabetes Predictor",
    shortDesc: "ML-based risk prediction.",
    fullDetail: "A Gradient Boosting Machine (GBM) model analyzes your lifestyle inputs (BMI, glucose, activity) to predict Type-2 diabetes risk up to 5 years in advance."
  },
  // ... Add your other 3 features here similarly
];

const Features: React.FC = () => {
  // State to track which feature is currently clicked
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  return (
    <section className="py-20 bg-aliceBlue" id="features">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4">The 6-in-1 Health Platform</h2>
          <p className="text-slateBlue max-w-2xl mx-auto">
            Click on any module below to learn about the technology behind it.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresData.map((feature) => (
            <div 
              key={feature.id}
              onClick={() => setSelectedFeature(feature)} // <--- CLICK HANDLER
              className="group p-8 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">⚡</span> {/* Replace with real icons */}
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
              <p className="text-slateBlue">{feature.shortDesc}</p>
              <span className="inline-block mt-4 text-sm text-techBlue font-semibold group-hover:underline">
                Read More →
              </span>
            </div>
          ))}
        </div>

        {/* THE MODAL (Only shows if selectedFeature is not null) */}
        <Modal 
          isOpen={!!selectedFeature}
          onClose={() => setSelectedFeature(null)}
          title={selectedFeature?.title || ''}
          content={selectedFeature?.fullDetail || ''}
        />
        
      </div>
    </section>
  );
};

export default Features;