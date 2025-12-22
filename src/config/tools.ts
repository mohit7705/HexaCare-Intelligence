// src/config/tools.ts

import {
  ClipboardList,
  Activity,
  Heart,
  Droplets,
  BrainCircuit,
  Scan,
  ShieldCheck
} from 'lucide-react';

// Existing tools
import SymptomChecker from '../../components/SymptomChecker';
import DiabetesPredictor from '../../components/DiabetesPredictor';
import HeartRiskPredictor from '../../components/HeartRiskPredictor';
import MentalHealthScreening from '../../components/mentalHealth/MentalHealthScreening';
import { ImageUpload } from '../../components/vision/ImageUpload';

// 🔗 TrustChain (Project-6)
import VerifyReport from '../../components/trustchain/VerifyReport';

export const MEDICAL_TOOLS = [
  {
    id: 'symptom',
    title: 'Symptom Checker',
    description: 'Analyze symptoms and get potential health insights using AI.',
    icon: ClipboardList,
    component: SymptomChecker,
    route: '/module/symptom-checker', // ✅ ADDED
    color: 'from-[#10b981] to-[#047857]'
  },
  {
    id: 'diabetes',
    title: 'Diabetes Prediction',
    description: 'AI-based screening for diabetes risk factors and glucose levels.',
    icon: Droplets,
    component: DiabetesPredictor,
    route: '/module/diabetes', // ✅ ADDED
    color: 'from-[#3b82f6] to-[#1d4ed8]'
  },
  {
    id: 'heart',
    title: 'Heart Risk Analysis',
    description: 'AI-based cardiovascular screening using health metrics.',
    icon: Heart,
    component: HeartRiskPredictor,
    route: '/module/heart', // ✅ ADDED
    color: 'from-[#ef4444] to-[#b91c1c]'
  },
  {
    id: 'mental-health',
    title: 'Mental Health Screening',
    description: 'Confidential AI-based assessment of mental wellbeing.',
    icon: BrainCircuit,
    component: MentalHealthScreening,
    route: '/module/mental-health', // ✅ ADDED
    color: 'from-[#8b5cf6] to-[#6d28d9]'
  },
  {
    id: 'vision',
    title: 'Skin Disease Detection',
    description: 'AI-powered skin condition analysis using Vision AI.',
    icon: Scan,
    component: ImageUpload,
    route: '/module/skin-ai', // ✅ ADDED
    color: 'from-[#f59e0b] to-[#d97706]'
  },

  // 🔐 HexaCare TrustChain (Project-6)
  {
    id: 'trustchain',
    title: 'Health Report Verification',
    description: 'Blockchain-based verification of medical reports using Stellar.',
    icon: ShieldCheck,
    component: VerifyReport,
    route: '/module/trustchain', // ✅ ADDED
    color: 'from-[#0f172a] to-[#334155]'
  }
];
