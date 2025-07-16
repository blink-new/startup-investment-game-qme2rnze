import { Startup, MarketEvent, LeaderboardEntry } from '../types/game'

export const mockStartups: Startup[] = [
  // Beginner deals (0-500 reputation) - Worse terms, higher risk, lower potential
  {
    id: 'startup_beginner_1',
    name: 'Local Coffee App',
    industry: 'Food & Beverage',
    description: 'Simple app for ordering coffee from local shops. Limited market, high competition.',
    currentValuation: 500000,
    fundingStage: 'seed',
    riskLevel: 'high',
    growthPotential: 1.8, // Low growth potential
    reputationRequired: 0,
    availableShares: 2000,
    logo: '☕'
  },
  {
    id: 'startup_beginner_2',
    name: 'Pet Walking Service',
    industry: 'Services',
    description: 'On-demand pet walking platform. Struggling with user acquisition and retention.',
    currentValuation: 800000,
    fundingStage: 'seed',
    riskLevel: 'high',
    growthPotential: 2.1,
    reputationRequired: 0,
    availableShares: 1500,
    logo: '🐕'
  },
  {
    id: 'startup_beginner_3',
    name: 'Budget Tracker Pro',
    industry: 'Fintech',
    description: 'Personal finance app with basic budgeting features. Crowded market space.',
    currentValuation: 1200000,
    fundingStage: 'seed',
    riskLevel: 'medium',
    growthPotential: 2.5,
    reputationRequired: 100,
    availableShares: 1200,
    logo: '💰'
  },
  {
    id: 'startup_beginner_4',
    name: 'Study Buddy',
    industry: 'Education',
    description: 'Student collaboration platform for homework help. Limited monetization strategy.',
    currentValuation: 2000000,
    fundingStage: 'seed',
    riskLevel: 'medium',
    growthPotential: 3.0,
    reputationRequired: 200,
    availableShares: 1000,
    logo: '📖'
  },
  
  // Intermediate deals (500-1500 reputation) - Better terms, moderate risk
  {
    id: 'startup_1',
    name: 'NeuralFlow AI',
    industry: 'Artificial Intelligence',
    description: 'Revolutionary AI platform for automated decision making in enterprise environments.',
    currentValuation: 50000000,
    fundingStage: 'series_a',
    riskLevel: 'high',
    growthPotential: 8.5,
    reputationRequired: 800,
    availableShares: 500,
    logo: '🤖'
  },
  {
    id: 'startup_2',
    name: 'GreenTech Solutions',
    industry: 'Clean Energy',
    description: 'Next-generation solar panel technology with 40% higher efficiency rates.',
    currentValuation: 25000000,
    fundingStage: 'seed',
    riskLevel: 'medium',
    growthPotential: 5.2,
    reputationRequired: 600,
    availableShares: 800,
    logo: '🌱'
  },
  {
    id: 'startup_3',
    name: 'HealthLink Pro',
    industry: 'Healthcare',
    description: 'Telemedicine platform connecting patients with specialists worldwide.',
    currentValuation: 75000000,
    fundingStage: 'series_b',
    riskLevel: 'low',
    growthPotential: 3.8,
    reputationRequired: 1000,
    availableShares: 300,
    logo: '🏥'
  },
  {
    id: 'startup_5',
    name: 'FoodieBot',
    industry: 'Food Tech',
    description: 'AI-powered restaurant automation and food delivery optimization.',
    currentValuation: 15000000,
    fundingStage: 'seed',
    riskLevel: 'medium',
    growthPotential: 4.5,
    reputationRequired: 500,
    availableShares: 1000,
    logo: '🍕'
  },
  {
    id: 'startup_7',
    name: 'EduTech Academy',
    industry: 'Education',
    description: 'Personalized learning platform using adaptive AI for K-12 education.',
    currentValuation: 35000000,
    fundingStage: 'series_a',
    riskLevel: 'low',
    growthPotential: 3.2,
    reputationRequired: 700,
    availableShares: 600,
    logo: '📚'
  },
  {
    id: 'startup_11',
    name: 'AgriTech Solutions',
    industry: 'Agriculture',
    description: 'Smart farming technology with IoT sensors and AI analytics.',
    currentValuation: 45000000,
    fundingStage: 'series_a',
    riskLevel: 'medium',
    growthPotential: 7.2,
    reputationRequired: 900,
    availableShares: 400,
    logo: '🌾'
  },

  // Advanced deals (1500-2500 reputation) - Good terms, balanced risk/reward
  {
    id: 'startup_4',
    name: 'CryptoVault',
    industry: 'Fintech',
    description: 'Secure cryptocurrency wallet with institutional-grade security features.',
    currentValuation: 120000000,
    fundingStage: 'series_c',
    riskLevel: 'high',
    growthPotential: 12.0,
    reputationRequired: 1500,
    availableShares: 200,
    logo: '🔐'
  },
  {
    id: 'startup_8',
    name: 'AutoDrive Systems',
    industry: 'Automotive',
    description: 'Advanced autonomous vehicle software for commercial fleets.',
    currentValuation: 180000000,
    fundingStage: 'series_c',
    riskLevel: 'medium',
    growthPotential: 6.8,
    reputationRequired: 1800,
    availableShares: 250,
    logo: '🚗'
  },
  {
    id: 'startup_12',
    name: 'VirtualReality Pro',
    industry: 'Virtual Reality',
    description: 'Next-generation VR headsets for enterprise training and education.',
    currentValuation: 85000000,
    fundingStage: 'series_b',
    riskLevel: 'medium',
    growthPotential: 9.1,
    reputationRequired: 2000,
    availableShares: 300,
    logo: '🥽'
  },
  {
    id: 'startup_10',
    name: 'BioMed Innovations',
    industry: 'Biotechnology',
    description: 'Gene therapy solutions for rare genetic diseases.',
    currentValuation: 150000000,
    fundingStage: 'series_b',
    riskLevel: 'high',
    growthPotential: 18.5,
    reputationRequired: 2200,
    availableShares: 150,
    logo: '🧬'
  },

  // Elite deals (2500+ reputation) - Exclusive access, highest potential
  {
    id: 'startup_6',
    name: 'SpaceLogistics',
    industry: 'Aerospace',
    description: 'Satellite deployment and space cargo transportation services.',
    currentValuation: 200000000,
    fundingStage: 'growth',
    riskLevel: 'high',
    growthPotential: 15.0,
    reputationRequired: 2500,
    availableShares: 100,
    logo: '🚀'
  },
  {
    id: 'startup_9',
    name: 'QuantumCompute',
    industry: 'Quantum Computing',
    description: 'Revolutionary quantum processors for enterprise computing solutions.',
    currentValuation: 300000000,
    fundingStage: 'growth',
    riskLevel: 'high',
    growthPotential: 20.0,
    reputationRequired: 3000,
    availableShares: 80,
    logo: '⚛️'
  },
  {
    id: 'startup_elite_1',
    name: 'Fusion Energy Corp',
    industry: 'Energy',
    description: 'Commercial fusion reactor technology. Breakthrough clean energy solution.',
    currentValuation: 500000000,
    fundingStage: 'growth',
    riskLevel: 'high',
    growthPotential: 25.0,
    reputationRequired: 3500,
    availableShares: 50,
    logo: '⚡'
  },
  {
    id: 'startup_elite_2',
    name: 'Neural Interface',
    industry: 'Neurotechnology',
    description: 'Brain-computer interface for medical and consumer applications.',
    currentValuation: 800000000,
    fundingStage: 'growth',
    riskLevel: 'high',
    growthPotential: 30.0,
    reputationRequired: 4000,
    availableShares: 30,
    logo: '🧠'
  }
]

export const mockMarketEvents: MarketEvent[] = [
  {
    id: 'event_1',
    startupId: 'startup_1',
    eventType: 'funding_round',
    impactMultiplier: 1.5,
    description: 'NeuralFlow AI closes $30M Series B led by Andreessen Horowitz',
    occurredAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
  },
  {
    id: 'event_2',
    startupId: 'startup_3',
    eventType: 'acquisition',
    impactMultiplier: 2.8,
    description: 'HealthLink Pro acquired by Microsoft for $210M',
    occurredAt: new Date(Date.now() - 1000 * 60 * 15).toISOString()
  },
  {
    id: 'event_3',
    startupId: 'startup_2',
    eventType: 'growth',
    impactMultiplier: 1.3,
    description: 'GreenTech Solutions signs major contract with Tesla for solar panels',
    occurredAt: new Date(Date.now() - 1000 * 60 * 8).toISOString()
  },
  {
    id: 'event_4',
    startupId: 'startup_4',
    eventType: 'funding_round',
    impactMultiplier: 0.7,
    description: 'CryptoVault faces regulatory challenges, funding round delayed',
    occurredAt: new Date(Date.now() - 1000 * 60 * 12).toISOString()
  },
  {
    id: 'event_5',
    startupId: 'startup_5',
    eventType: 'ipo',
    impactMultiplier: 3.2,
    description: 'FoodieBot announces IPO plans, valued at $500M',
    occurredAt: new Date(Date.now() - 1000 * 60 * 20).toISOString()
  },
  {
    id: 'event_6',
    startupId: 'startup_7',
    eventType: 'growth',
    impactMultiplier: 1.4,
    description: 'EduTech Academy partners with 500+ schools nationwide',
    occurredAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
  }
]

export const mockLeaderboard: LeaderboardEntry[] = [
  {
    id: 'leader_1',
    userId: 'user_1',
    username: 'InvestorPro',
    reputationScore: 3500,
    totalReturns: 2.8,
    successfulExits: 12,
    winRate: 0.85,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'leader_2',
    userId: 'user_2',
    username: 'VentureKing',
    reputationScore: 3200,
    totalReturns: 2.4,
    successfulExits: 10,
    winRate: 0.78,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'leader_3',
    userId: 'user_3',
    username: 'StartupHunter',
    reputationScore: 2900,
    totalReturns: 2.1,
    successfulExits: 8,
    winRate: 0.72,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'leader_4',
    userId: 'user_4',
    username: 'TechInvestor',
    reputationScore: 2600,
    totalReturns: 1.9,
    successfulExits: 7,
    winRate: 0.68,
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'leader_5',
    userId: 'user_5',
    username: 'AngelFund',
    reputationScore: 2300,
    totalReturns: 1.7,
    successfulExits: 6,
    winRate: 0.64,
    lastUpdated: new Date().toISOString()
  }
]