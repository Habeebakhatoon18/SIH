import { MedicalRecord, WelfareScheme } from '../contexts/MedicalContext';
import { User } from '../types';

// Mock blockchain service
export class BlockchainService {
  static async storeRecord(record: MedicalRecord): Promise<string> {
    // Simulate blockchain transaction
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `0x${Math.random().toString(16).substr(2, 40)}`;
  }
  
  static async verifyRecord(hash: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return Math.random() > 0.1; // 90% verification success
  }
}

// Mock AI service
export class AIService {
  static async generateHealthSummary(records: MedicalRecord[], language: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const summaries = {
      en: `Based on your recent medical records, your overall health status appears stable. Recent consultation shows normal vital signs. Continue prescribed medications and follow-up as scheduled.`,
      ml: `നിങ്ങളുടെ സമീപകാല മെഡിക്കൽ റെക്കോർഡുകളെ അടിസ്ഥാനമാക്കി, നിങ്ങളുടെ മൊത്തത്തിലുള്ള ആരോഗ്യനില സ്ഥിരമാണെന്ന് തോന്നുന്നു. സമീപകാല കൺസൾട്ടേഷൻ സാധാരണ വൈറ്റൽ സൈനുകൾ കാണിക്കുന്നു.`,
      hi: `आपके हाल के मेडिकल रिकॉर्ड के आधार पर, आपकी समग्र स्वास्थ्य स्थिति स्थिर दिखाई दे रही है। हाल की जांच में सामान्य वाइटल साइन्स दिखे हैं।`
    };
    
    return summaries[language as keyof typeof summaries] || summaries.en;
  }
  
  static async performOCR(imageData: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock OCR result
    return `Prescription Details:
Patient: John Doe
Date: ${new Date().toLocaleDateString()}

Medications:
1. Paracetamol 500mg - Take 1 tablet twice daily after meals
2. Amoxicillin 250mg - Take 1 capsule three times daily for 7 days
3. Vitamin D3 1000IU - Take 1 tablet once daily

Doctor: Dr. Sarah Wilson
License: MCI123456`;
  }
}

// Mock welfare schemes
export const mockWelfareSchemes: WelfareScheme[] = [
  {
    id: '1',
    name: 'Karunya Benevolent Fund',
    description: 'Financial assistance for medical treatment',
    eligible: true,
    benefits: ['Up to ₹2,00,000 for critical illness', 'Free dialysis', 'Cancer treatment support'],
    claimedAmount: 45000,
    totalBenefit: 200000,
    status: 'active'
  },
  {
    id: '2',
    name: 'Rashtriya Swasthya Bima Yojana',
    description: 'Health insurance for BPL families',
    eligible: true,
    benefits: ['₹30,000 annual coverage', 'Cashless treatment', 'Pre-existing disease coverage'],
    claimedAmount: 12000,
    totalBenefit: 30000,
    status: 'active'
  },
  {
    id: '3',
    name: ' State Health Scheme',
    description: 'Comprehensive health coverage',
    eligible: false,
    benefits: ['Outpatient coverage', 'Emergency care', 'Specialist consultations'],
    claimedAmount: 0,
    totalBenefit: 50000,
    status: 'pending'
  }
];

// Mock authentication service
export class AuthService {
  static async sendOTP(aadhaar: string, phone: string): Promise<boolean> {
    console.log(`Sending OTP to ${phone} for Aadhaar ${aadhaar}`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return true;
  }
  
  static async verifyOTP(otp: string): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (otp === '123456') {
      return {
        id: '1',
           name: 'Priya Nair',
             role: 'doctor',
     language: 'ml',
           aadhaar: '1234-5678-9012',
           phone: '+91-9876543210',
           email: 'priya.nair@email.com',
           //avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150&h=150&fit=crop&crop=face',
           walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
           createdAt: new Date().toISOString()
      };
    }
    
    return null;
  }
  
  static async biometricAuth(_fingerprintData: string): Promise<boolean> {
    console.log('Processing biometric authentication...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.random() > 0.2; // 80% success rate
  }
}

// Analytics data
export const mockAnalyticsData = {
  healthTrends: [
    { month: 'Jan', diabetes: 234, hypertension: 456, heart: 123 },
    { month: 'Feb', diabetes: 267, hypertension: 489, heart: 134 },
    { month: 'Mar', diabetes: 289, hypertension: 512, heart: 156 },
    { month: 'Apr', diabetes: 301, hypertension: 534, heart: 167 },
    { month: 'May', diabetes: 298, hypertension: 501, heart: 145 },
    { month: 'Jun', diabetes: 334, hypertension: 578, heart: 189 },
  ],
  diseaseOutbreaks: [
    { name: 'Dengue', cases: 156, trend: '+12%', severity: 'medium' },
    { name: 'Chikungunya', cases: 89, trend: '-5%', severity: 'low' },
    { name: 'Typhoid', cases: 34, trend: '+8%', severity: 'low' },
    { name: 'Hepatitis A', cases: 23, trend: '-15%', severity: 'low' },
  ]
};