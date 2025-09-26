import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Eye, 
  EyeOff, 
  Clock, 
  User, 
  Building2, 
  Heart, 
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Edit
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';

interface ConsentItem {
  id: string;
  recordId: string;
  recordTitle: string;
  recordType: string;
  permissions: {
    doctors: boolean;
    hospitals: boolean;
    insurance: boolean;
    research: boolean;
  };
  expiryDate?: Date;
  auditLog: Array<{
    id: string;
    action: 'granted' | 'revoked' | 'accessed' | 'modified';
    actor: string;
    timestamp: Date;
    details: string;
  }>;
}

export function ConsentManagement() {
  const { state } = useAppContext();
  const t = useTranslation(state.language);
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);
  const [showAuditLog, setShowAuditLog] = useState(false);
  
  const mockConsents: ConsentItem[] = [
    {
      id: '1',
      recordId: '1',
      recordTitle: 'General Checkup - Dr. Sarah Wilson',
      recordType: 'consultation',
      permissions: {
        doctors: true,
        hospitals: true,
        insurance: false,
        research: false
      },
      expiryDate: new Date('2024-12-31'),
      auditLog: [
        {
          id: '1',
          action: 'granted',
          actor: 'Priya Nair (Patient)',
          timestamp: new Date('2024-01-15'),
          details: 'Initial consent granted for medical consultation'
        },
        {
          id: '2',
          action: 'accessed',
          actor: 'Dr. Sarah Wilson',
          timestamp: new Date('2024-01-15'),
          details: 'Medical record accessed for consultation'
        },
        {
          id: '3',
          action: 'accessed',
          actor: 'Kerala Medical College',
          timestamp: new Date('2024-01-15'),
          details: 'Hospital system accessed record for treatment'
        }
      ]
    },
    {
      id: '2',
      recordId: '2',
      recordTitle: 'Blood Test Report - Dr. Rajesh Kumar',
      recordType: 'test',
      permissions: {
        doctors: true,
        hospitals: true,
        insurance: true,
        research: true
      },
      auditLog: [
        {
          id: '4',
          action: 'granted',
          actor: 'Priya Nair (Patient)',
          timestamp: new Date('2024-01-10'),
          details: 'Full consent granted for blood test results'
        },
        {
          id: '5',
          action: 'accessed',
          actor: 'Research Team',
          timestamp: new Date('2024-01-12'),
          details: 'Anonymous data accessed for diabetes research'
        }
      ]
    },
    {
      id: '3',
      recordId: '3',
      recordTitle: 'Hypertension Management - Dr. Priya Nair',
      recordType: 'prescription',
      permissions: {
        doctors: true,
        hospitals: false,
        insurance: true,
        research: false
      },
      expiryDate: new Date('2024-06-30'),
      auditLog: [
        {
          id: '6',
          action: 'granted',
          actor: 'Priya Nair (Patient)',
          timestamp: new Date('2024-01-05'),
          details: 'Selective consent granted for prescription'
        },
        {
          id: '7',
          action: 'modified',
          actor: 'Priya Nair (Patient)',
          timestamp: new Date('2024-01-08'),
          details: 'Revoked hospital access due to privacy concerns'
        }
      ]
    }
  ];
  
  const togglePermission = (consentId: string, permission: keyof ConsentItem['permissions']) => {
    // This would typically dispatch an action to update the consent
    console.log(`Toggling ${permission} for consent ${consentId}`);
  };
  
  const getPermissionIcon = (type: string) => {
    switch (type) {
      case 'doctors': return User;
      case 'hospitals': return Building2;
      case 'insurance': return Shield;
      case 'research': return Users;
      default: return Eye;
    }
  };
  
  const getPermissionLabel = (type: string) => {
    switch (type) {
      case 'doctors': return 'Medical Professionals';
      case 'hospitals': return 'Healthcare Institutions';
      case 'insurance': return 'Insurance Companies';
      case 'research': return 'Research Organizations';
      default: return type;
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('consentManagement')}</h1>
          <p className="text-gray-600">Control who can access your medical information</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg">
          <Shield size={16} />
          <span>Blockchain Secured</span>
        </div>
      </motion.div>
      
      {/* Consent Overview */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Data, Your Control</h2>
            <p className="text-gray-700 mb-4">
              You have complete control over who can access your medical records. All consent decisions are 
              recorded on the blockchain for transparency and cannot be tampered with.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">3</p>
                <p className="text-sm text-gray-600">Active Consents</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">7</p>
                <p className="text-sm text-gray-600">Total Accesses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">2</p>
                <p className="text-sm text-gray-600">Expiring Soon</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">1</p>
                <p className="text-sm text-gray-600">Recent Changes</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Consent Records */}
      <div className="space-y-4">
        {mockConsents.map((consent, index) => (
          <motion.div
            key={consent.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            layout
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {consent.recordTitle}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                  <span className="capitalize bg-gray-100 px-2 py-1 rounded">
                    {consent.recordType}
                  </span>
                  {consent.expiryDate && (
                    <div className="flex items-center space-x-1">
                      <Calendar size={14} />
                      <span>Expires: {consent.expiryDate.toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
                
                {/* Permission Toggles */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  {Object.entries(consent.permissions).map(([type, enabled]) => {
                    const Icon = getPermissionIcon(type);
                    return (
                      <motion.div
                        key={type}
                        className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                          enabled 
                            ? 'border-green-200 bg-green-50' 
                            : 'border-gray-200 bg-gray-50'
                        }`}
                        onClick={() => togglePermission(consent.id, type as keyof ConsentItem['permissions'])}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon size={20} className={enabled ? 'text-green-600' : 'text-gray-400'} />
                          {enabled ? (
                            <CheckCircle size={16} className="text-green-600" />
                          ) : (
                            <XCircle size={16} className="text-gray-400" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-gray-900 mb-1">
                          {getPermissionLabel(type)}
                        </p>
                        <p className={`text-xs ${enabled ? 'text-green-600' : 'text-gray-500'}`}>
                          {enabled ? 'Access Granted' : 'Access Denied'}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
                
                {/* Quick Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => setShowAuditLog(!showAuditLog)}
                      className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Eye size={16} />
                      <span>View Audit Log ({consent.auditLog.length})</span>
                    </motion.button>
                    <motion.button
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium flex items-center space-x-1"
                      whileHover={{ scale: 1.05 }}
                    >
                      <Edit size={16} />
                      <span>Edit Permissions</span>
                    </motion.button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {consent.expiryDate && new Date(consent.expiryDate).getTime() < Date.now() + 30 * 24 * 60 * 60 * 1000 && (
                      <span className="flex items-center space-x-1 text-orange-600 bg-orange-50 px-2 py-1 rounded text-sm">
                        <AlertTriangle size={14} />
                        <span>Expiring Soon</span>
                      </span>
                    )}
                    <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-sm">
                      ✓ Blockchain Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Audit Log */}
            <AnimatePresence>
              {showAuditLog && selectedRecord === consent.id && (
                <motion.div
                  className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center space-x-2">
                    <Clock size={16} />
                    <span>Audit Log</span>
                  </h4>
                  <div className="space-y-3">
                    {consent.auditLog.map((entry) => (
                      <div key={entry.id} className="flex items-start space-x-3 text-sm">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          entry.action === 'granted' ? 'bg-green-500' :
                          entry.action === 'revoked' ? 'bg-red-500' :
                          entry.action === 'accessed' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`} />
                        <div className="flex-1">
                          <p className="text-gray-900">
                            <span className="font-medium">{entry.actor}</span> {entry.action} access
                          </p>
                          <p className="text-gray-600">{entry.details}</p>
                          <p className="text-gray-400 text-xs">{entry.timestamp.toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
      
      {/* Global Consent Settings */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Global Consent Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Emergency Access</h3>
              <p className="text-sm text-gray-600">Allow emergency personnel to access critical medical information</p>
            </div>
            <motion.button
              className="w-12 h-6 bg-green-500 rounded-full flex items-center p-1"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: 24 }}
              />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Anonymous Research</h3>
              <p className="text-sm text-gray-600">Contribute anonymized data to medical research</p>
            </div>
            <motion.button
              className="w-12 h-6 bg-gray-300 rounded-full flex items-center p-1"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-4 h-4 bg-white rounded-full shadow"
                animate={{ x: 0 }}
              />
            </motion.button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Data Retention</h3>
              <p className="text-sm text-gray-600">Automatically expire consents after specified period</p>
            </div>
            <select className="border border-gray-300 rounded px-3 py-1 text-sm">
              <option>1 year</option>
              <option>2 years</option>
              <option>5 years</option>
              <option>Never</option>
            </select>
          </div>
        </div>
      </motion.div>
    </div>
  );
}