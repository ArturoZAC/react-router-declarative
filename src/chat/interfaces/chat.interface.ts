export const Plan = {
  BASIC: 'basic',
  PRO: 'pro',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export type Plan = typeof Plan[keyof typeof Plan];

export interface Client {
  id: string; // C1-12345
  name: string;
  email: string;
  phone: string;
  address: string;
  memberSince: Date;
  currentPlan: Plan;
}

export interface Message {
  id: string;
  clientId: string;
  content: string;
  createdAt: Date;
  sender: 'agent' | 'client';
  like: 'liked' | 'disliked' | 'neutral';
}