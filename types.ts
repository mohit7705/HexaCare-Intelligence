// types.ts

// --- UI & Navigation Types ---
export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  // Updated to include string to allow for more icon variety if needed
  iconName: 'Brain' | 'MessageCircle' | 'Droplets' | 'Heart' | 'Scan' | 'User' | string;
}

export interface TechItem {
  category: string;
  value: string;
}

export interface UseCaseItem {
  title: string;
  description: string;
}

/**
 * Updated to include SECONDARY to support different 
 * brand colors in the Hero and Navbar.
 */
export enum ButtonVariant {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  OUTLINE = 'outline',
  GHOST = 'ghost'
}

// --- Medical Tool Types ---

/**
 * Generic / Lightweight risk input
 */
export interface RiskInput {
  age: number;
  systolic_bp: number;
  cholesterol: number;
  is_smoker: boolean;
  is_diabetic: boolean;
  userEmail?: string;
}

/**
 * ✅ FULL Heart Risk Input
 * Matches heart.py exactly
 */
export interface HeartRiskInput {
  userEmail?: string;
  age: number;
  systolic_bp: number;
  diastolic_bp: number;
  cholesterol: number;
  heart_rate: number;
  is_smoker: boolean;
  is_diabetic: boolean;
  family_history: boolean;
}

/**
 * Common result type for all risk tools
 */
export interface RiskResult {
  risk: 'Low' | 'Moderate' | 'High';
  probability: number;
  message: string;
  recommendations?: string[];
}

// =======================================
// Vision AI (Skin / Image Analysis) Types
// =======================================

/**
 * Single prediction returned by Vision AI
 */
export interface VisionPrediction {
  label: string;
  confidence: number; // value between 0 and 1
}

/**
 * Complete Vision analysis response
 */
export interface VisionAnalysisResult {
  predictions: VisionPrediction[];
  summary: string;
  disclaimer?: string;
}

/**
 * Vision API request metadata
 */
export interface VisionAnalysisRequest {
  imageName?: string;
  userEmail?: string;
}

// ======================================================
// 🔐 HexaCare Unified Health Report (STEP 1.4 ADDITION)
// ======================================================

import { Timestamp } from "firebase/firestore";

/**
 * This is the SINGLE, CANONICAL report format
 * used across all HexaCare modules.
 */
export interface HealthReport {
  // Ownership
  userId: string;

  // Tool metadata
  toolId: string;     // e.g. "symptom", "diabetes"
  toolName: string;   // e.g. "Symptom Checker"

  // Raw input provided by user
  input: Record<string, any>;

  // Tool / AI output
  result: {
    risk: 'Low' | 'Medium' | 'High';
    score?: number;
    message: string;
  };

  // System metadata
  createdAt: Timestamp;

  // 🔗 TrustChain (future use)
  verified: boolean;
  txHash?: string;
}
