import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  updateLanguage: (language: 'en' | 'ml' | 'hi' | 'ta') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    role: 'worker',
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    phone: '+91-9876543210',
    language: 'hi',
    aadhaar: '1234-5678-9012',
    walletAddress: '0x742d35Cc6e4C4C6e6f0F70D5B3b3D3b3d3b3d3b3',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    role: 'doctor',
    name: 'Dr. Priya Nair',
    email: 'priya@hospital.com',
    phone: '+91-9876543211',
    language: 'ml',
    medicalLicense: 'MED123456',
    walletAddress: '0x852d35Cc6e4C4C6e6f0F70D5B3b3D3b3d3b3d3b4',
    createdAt: new Date().toISOString()
  },
  {
    id: '3',
    role: 'government',
    name: 'Officer Rajesh',
    email: 'rajesh@gov.in',
    phone: '+91-9876543212',
    language: 'en',
    organizationId: 'GOV001',
    walletAddress: '0x962d35Cc6e4C4C6e6f0F70D5B3b3D3b3d3b3d3b5',
    createdAt: new Date().toISOString()
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string, role: string) => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    if (foundUser) {
      setUser(foundUser);
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const register = async (userData: Partial<User>) => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      role: userData.role!,
      name: userData.name!,
      email: userData.email!,
      phone: userData.phone!,
      language: userData.language || 'en',
      aadhaar: userData.aadhaar,
      medicalLicense: userData.medicalLicense,
      organizationId: userData.organizationId,
      walletAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      createdAt: new Date().toISOString()
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const updateLanguage = (language: 'en' | 'ml' | 'hi' | 'ta') => {
    if (user) {
      setUser({ ...user, language });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateLanguage }}>
      {children}
    </AuthContext.Provider>
  );
};