import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Language = 'en' | 'ml' | 'hi';
export type UserRole = 'patient' | 'doctor' | 'admin' | null;
export type AuthMethod = 'aadhaar' | 'qr' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  aadhaar?: string;
  phone?: string;
  email?: string;
  avatar?: string;
}

export interface OfflineAction {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  synced: boolean;
}

export interface AppState {
  language: Language;
  user: User | null;
  isAuthenticated: boolean;
  authMethod: AuthMethod;
  isOffline: boolean;
  pendingActions: OfflineAction[];
  syncProgress: number;
  showLanguageSelector: boolean;
  loading: boolean;
  error: string | null;
}

type AppAction = 
  | { type: 'SET_LANGUAGE'; payload: Language }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_AUTH_METHOD'; payload: AuthMethod }
  | { type: 'SET_OFFLINE'; payload: boolean }
  | { type: 'ADD_PENDING_ACTION'; payload: OfflineAction }
  | { type: 'SYNC_ACTIONS'; payload: string[] }
  | { type: 'SET_SYNC_PROGRESS'; payload: number }
  | { type: 'TOGGLE_LANGUAGE_SELECTOR' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_ERROR' };

const initialState: AppState = {
  language: 'en',
  user: null,
  isAuthenticated: false,
  authMethod: null,
  isOffline: false,
  pendingActions: [],
  syncProgress: 0,
  showLanguageSelector: false,
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'SET_AUTH_METHOD':
      return { ...state, authMethod: action.payload };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };
    case 'ADD_PENDING_ACTION':
      return { ...state, pendingActions: [...state.pendingActions, action.payload] };
    case 'SYNC_ACTIONS':
      return {
        ...state,
        pendingActions: state.pendingActions.filter(a => !action.payload.includes(a.id))
      };
    case 'SET_SYNC_PROGRESS':
      return { ...state, syncProgress: action.payload };
    case 'TOGGLE_LANGUAGE_SELECTOR':
      return { ...state, showLanguageSelector: !state.showLanguageSelector };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}