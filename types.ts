export interface NavItem {
  label: string;
  href: string;
}

export interface FeatureItem {
  id: string;
  title: string;
  description: string;
  iconName: 'Brain' | 'MessageCircle' | 'Droplets' | 'Heart' | 'Scan' | 'User';
}

export interface TechItem {
  category: string;
  value: string;
}

export interface UseCaseItem {
  title: string;
  description: string;
}

export enum ButtonVariant {
  PRIMARY = 'primary',
  OUTLINE = 'outline',
  GHOST = 'ghost'
}
