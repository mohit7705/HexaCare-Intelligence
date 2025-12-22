// components/Features.tsx
import React, { useState } from 'react';
import Modal from './Modal';

const featuresData = [
  {
    id: 1,
    title: "AI Symptom Checker",
    shortDesc: "Natural-language medical screening using LLMs.",
    fullDetail:
      "Our advanced LLM understands free-text symptom descriptions and maps them against clinical knowledge graphs to provide early-stage risk indicators and triage guidance with high reliability."
  },
  {
    id: 2,
    title: "Mental Health Analyzer",
    shortDesc: "Stress, anxiety & emotional well-being insights.",
    fullDetail:
      "This module analyzes language sentiment and behavioral signals to detect stress patterns, anxiety markers, and mental fatigue, offering evidence-based recommendations for early intervention."
  },
  {
    id: 3,
    title: "Diabetes Risk Predictor",
    shortDesc: "ML-based Type-2 diabetes risk assessment.",
    fullDetail:
      "A supervised ML model evaluates lifestyle and biometric inputs such as BMI, glucose levels, and activity patterns to estimate future diabetes risk, supporting preventive care decisions."
  },
  {
    id: 4,
    title: "Heart Disease Risk Analysis",
    shortDesc: "Cardiovascular risk screening with ML models.",
    fullDetail:
      "This system uses clinical indicators like blood pressure, cholesterol, and age-related patterns to identify potential cardiovascular risks before critical symptoms appear."
  },
  {
    id: 5,
    title: "Skin Disease Detection",
    shortDesc: "Vision-AI powered dermatological screening.",
    fullDetail:
      "A CNN-based vision model analyzes uploaded skin images to detect common dermatological conditions, assisting users in deciding whether professional consultation is required."
  },
  {
    id: 6,
    title: "Blockchain-Secured Health Reports",
    shortDesc: "Tamper-proof digital health report verification.",
    fullDetail:
      "All generated health reports are hashed and recorded on the Stellar blockchain, ensuring data integrity, transparency, and verifiable authenticity without exposing personal health data."
  }
];

const Features: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  return (
    <section className="py-24 bg-aliceBlue" id="features">
      <div className="container mx-auto px-6">

        {/* SECTION HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-navy mb-4">
            Why Choose HexaCare?
          </h2>
          <p className="text-slateBlue max-w-2xl mx-auto">
            A unified AI-powered platform delivering early health insights,
            secure reporting, and real-world clinical value.
          </p>
        </div>

        {/* FEATURES GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {featuresData.map((feature) => (
            <div
              key={feature.id}
              onClick={() => setSelectedFeature(feature)}
              className="group p-8 bg-white/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer"
            >
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <span className="text-2xl">🧠</span>
              </div>

              <h3 className="text-xl font-bold text-navy mb-3">
                {feature.title}
              </h3>

              <p className="text-slateBlue">
                {feature.shortDesc}
              </p>

              <span className="inline-block mt-4 text-sm text-techBlue font-semibold group-hover:underline">
                Learn more →
              </span>
            </div>
          ))}
        </div>

        {/* MODAL */}
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
