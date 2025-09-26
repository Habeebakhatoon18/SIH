import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: Date;
  type: 'consultation' | 'prescription' | 'test' | 'diagnosis';
  title: string;
  description: string;
  documents: string[];
  medications?: Medication[];
  consent: ConsentSettings;
  blockchainHash?: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface ConsentSettings {
  shareWithDoctors: boolean;
  shareWithHospitals: boolean;
  shareWithInsurance: boolean;
  shareWithResearch: boolean;
  expiryDate?: Date;
  auditLog: ConsentAudit[];
}

export interface ConsentAudit {
  id: string;
  action: 'granted' | 'revoked' | 'accessed' | 'modified';
  actor: string;
  timestamp: Date;
  details: string;
}

export interface WelfareScheme {
  id: string;
  name: string;
  description: string;
  eligible: boolean;
  benefits: string[];
  claimedAmount: number;
  totalBenefit: number;
  status: 'active' | 'pending' | 'expired';
}

export interface MedicalState {
  records: MedicalRecord[];
  welfareSchemes: WelfareScheme[];
  currentRecord: MedicalRecord | null;
  aiSummary: string | null;
  prescriptionOCR: string | null;
  loading: boolean;
  error: string | null;
}

type MedicalAction = 
  | { type: 'SET_RECORDS'; payload: MedicalRecord[] }
  | { type: 'ADD_RECORD'; payload: MedicalRecord }
  | { type: 'UPDATE_RECORD'; payload: MedicalRecord }
  | { type: 'SET_CURRENT_RECORD'; payload: MedicalRecord | null }
  | { type: 'SET_WELFARE_SCHEMES'; payload: WelfareScheme[] }
  | { type: 'SET_AI_SUMMARY'; payload: string | null }
  | { type: 'SET_PRESCRIPTION_OCR'; payload: string | null }
  | { type: 'UPDATE_CONSENT'; payload: { recordId: string; consent: ConsentSettings } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

const initialState: MedicalState = {
  records: [],
  welfareSchemes: [],
  currentRecord: null,
  aiSummary: null,
  prescriptionOCR: null,
  loading: false,
  error: null,
};

function medicalReducer(state: MedicalState, action: MedicalAction): MedicalState {
  switch (action.type) {
    case 'SET_RECORDS':
      return { ...state, records: action.payload };
    case 'ADD_RECORD':
      return { ...state, records: [...state.records, action.payload] };
    case 'UPDATE_RECORD':
      return {
        ...state,
        records: state.records.map(record =>
          record.id === action.payload.id ? action.payload : record
        )
      };
    case 'SET_CURRENT_RECORD':
      return { ...state, currentRecord: action.payload };
    case 'SET_WELFARE_SCHEMES':
      return { ...state, welfareSchemes: action.payload };
    case 'SET_AI_SUMMARY':
      return { ...state, aiSummary: action.payload };
    case 'SET_PRESCRIPTION_OCR':
      return { ...state, prescriptionOCR: action.payload };
    case 'UPDATE_CONSENT':
      return {
        ...state,
        records: state.records.map(record =>
          record.id === action.payload.recordId 
            ? { ...record, consent: action.payload.consent }
            : record
        )
      };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const MedicalContext = createContext<{
  state: MedicalState;
  dispatch: React.Dispatch<MedicalAction>;
} | null>(null);

export function MedicalProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(medicalReducer, initialState);

  return (
    <MedicalContext.Provider value={{ state, dispatch }}>
      {children}
    </MedicalContext.Provider>
  );
}

export function useMedicalContext() {
  const context = useContext(MedicalContext);
  if (!context) {
    throw new Error('useMedicalContext must be used within MedicalProvider');
  }
  return context;
}