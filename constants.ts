import { FeatureItem, NavItem, TechItem, UseCaseItem } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Features', href: '#features' },
  { label: 'Technology', href: '#technology' },
  { label: 'Contact', href: '#contact' },
];

export const FEATURES: FeatureItem[] = [
  {
    id: '1',
    title: 'AI Symptom Checker',
    description: 'Natural-language medical screening powered by advanced LLMs.',
    iconName: 'Brain',
  },
  {
    id: '2',
    title: 'Mental Health Analyzer',
    description: 'Emotion, stress & behaviour assessment using sentiment + NLP.',
    iconName: 'MessageCircle',
  },
  {
    id: '3',
    title: 'Diabetes Predictor',
    description: 'ML-based risk prediction using clinical parameters.',
    iconName: 'Droplets',
  },
  {
    id: '4',
    title: 'Heart Risk Evaluator',
    description: 'Probability scoring model using medical predictors.',
    iconName: 'Heart',
  },
  {
    id: '5',
    title: 'Skin Disease Detector',
    description: 'Vision AI classification powered by CNN models.',
    iconName: 'Scan',
  },
  {
    id: '6',
    title: 'Women’s Wellness',
    description: 'Cycle insights, PCOS risk, and comprehensive wellness tracking.',
    iconName: 'User',
  },
];

export const TECH_STACK: TechItem[] = [
  { category: 'LLMs', value: 'GPT-4o / Custom Fine-tuned Models' },
  { category: 'ML Models', value: 'Predictive Analytics for Diabetes & Heart' },
  { category: 'Vision AI', value: 'CNN-based Dermatological Analysis' },
  { category: 'Blockchain', value: 'Stellar (Tamper-proof Logs)' },
  { category: 'Frontend', value: 'React / TypeScript / Tailwind' },
  { category: 'Backend', value: 'Node.js / FastAPI' },
  { category: 'Database', value: 'PostgreSQL / MongoDB' },
  { category: 'Security', value: 'AES-256 Encryption / JWT' },
];

export const USE_CASES: UseCaseItem[] = [
  { title: 'Symptom Checking', description: 'Immediate triage for users feeling unwell.' },
  { title: 'Clinic Automation', description: 'Pre-screening patients before arrival.' },
  { title: 'Telehealth Integration', description: 'Real-time decision support for remote doctors.' },
  { title: 'Insurance Scoring', description: 'Health risk assessments for policy planning.' },
  { title: 'Corporate Wellness', description: 'Proactive employee health monitoring.' },
];

export const WHY_US_POINTS: string[] = [
  'Early detection saves lives',
  'AI accuracy + blockchain trust',
  '6 screenings in one platform',
  'Instant digital reports',
  'Secure, private, decentralized'
];