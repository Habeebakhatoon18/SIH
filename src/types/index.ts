export interface User {
  id: string;
  role: 'worker' | 'doctor' | 'government';
  name: string;
  email: string;
  phone: string;
  language: 'en' | 'ml' | 'hi' | 'ta';
  aadhaar?: string;
  medicalLicense?: string;
  organizationId?: string;
  walletAddress: string;
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  patientId: string;
  doctorId: string;
  title: string;
  description: string;
  type: 'consultation' | 'prescription' | 'test-result' | 'scan' | 'emergency';
  ipfsHash: string;
  encryptionKey: string;
  timestamp: string;
  consentRequired: boolean;
  consentGiven: boolean;
  tags: string[];
}

export interface ConsentRequest {
  id: string;
  patientId: string;
  doctorId: string;
  recordIds: string[];
  purpose: string;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  requestedAt: string;
  expiresAt: string;
  smartContractAddress?: string;
}

export interface AIAnalysis {
  id: string;
  recordId: string;
  summary: string;
  keyFindings: string[];
  recommendations: string[];
  riskLevel: 'low' | 'medium' | 'high';
  confidence: number;
  processedAt: string;
}

export interface EmergencyAccess {
  id: string;
  patientId: string;
  officerId: string;
  reason: string;
  accessedRecords: string[];
  timestamp: string;
  approved: boolean;
}