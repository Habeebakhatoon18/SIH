import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranslation } from '../../utils/translations';
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ShieldCheckIcon,
  ClockIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';
import { HealthRecord, ConsentRequest, AIAnalysis } from '../../types';
import { aiService } from '../../services/ai';
import { blockchainService } from '../../services/blockchain';
import { ipfsService } from '../../services/ipfs';

export const DoctorDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [patientRecords, setPatientRecords] = useState<HealthRecord[]>([]);
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [requestingConsent, setRequestingConsent] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const t = (key: any) => getTranslation(key, user?.language || 'en');

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    const mockPatients = [
      {
        id: '1',
        name: 'Ravi Kumar',
        age: 35,
        phone: '+91-9876543210',
        lastVisit: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'medium',
        conditions: ['Hypertension', 'Diabetes Type 2'],
        location: 'Kochi, Kerala'
      },
      {
        id: '2',
        name: 'Maria Santos',
        age: 28,
        phone: '+91-9876543211',
        lastVisit: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'low',
        conditions: ['Regular Checkup'],
        location: 'Thiruvananthapuram, Kerala'
      },
      {
        id: '3',
        name: 'Ahmed Hassan',
        age: 42,
        phone: '+91-9876543212',
        lastVisit: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        riskLevel: 'high',
        conditions: ['Chronic Kidney Disease', 'Hypertension'],
        location: 'Kozhikode, Kerala'
      }
    ];

    const mockRecords: HealthRecord[] = [
      {
        id: '1',
        patientId: '1',
        doctorId: user?.id || '2',
        title: 'Blood Pressure Monitoring',
        description: 'BP: 140/90 mmHg, requires medication adjustment',
        type: 'consultation',
        ipfsHash: 'QmRecord1',
        encryptionKey: 'key1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        consentRequired: true,
        consentGiven: true,
        tags: ['hypertension', 'follow-up']
      }
    ];

    const mockConsents: ConsentRequest[] = [
      {
        id: '1',
        patientId: '2',
        doctorId: user?.id || '2',
        recordIds: ['2', '3'],
        purpose: 'Emergency consultation for chest pain evaluation',
        status: 'pending',
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setPatients(mockPatients);
    setPatientRecords(mockRecords);
    setConsentRequests(mockConsents);
  };

  const requestPatientConsent = async (patientId: string, recordIds: string[], purpose: string) => {
    setRequestingConsent(patientId);
    setLoading(true);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create consent contract on blockchain
      const contractAddress = await blockchainService.createConsentContract(
        patientId, 
        user?.id || '', 
        recordIds
      );

      const newRequest: ConsentRequest = {
        id: Date.now().toString(),
        patientId,
        doctorId: user?.id || '',
        recordIds,
        purpose,
        status: 'pending',
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        smartContractAddress: contractAddress
      };

      setConsentRequests(prev => [newRequest, ...prev]);
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
      
    } catch (error) {
      console.error('Failed to request consent:', error);
      alert('Failed to send consent request. Please try again.');
    } finally {
      setLoading(false);
      setRequestingConsent(null);
    }
  };

  const addNewRecord = async (patientId: string, recordData: any) => {
    setLoading(true);
    
    try {
      // Encrypt and upload to IPFS
      const encryptionKey = Math.random().toString(36);
      const ipfsHash = await ipfsService.uploadJSON(recordData, encryptionKey);
      
      // Store hash on blockchain
      await blockchainService.storeRecordHash(
        Date.now().toString(),
        ipfsHash,
        user?.walletAddress || ''
      );

      const newRecord: HealthRecord = {
        id: Date.now().toString(),
        patientId,
        doctorId: user?.id || '',
        title: recordData.title,
        description: recordData.description,
        type: recordData.type,
        ipfsHash,
        encryptionKey,
        timestamp: new Date().toISOString(),
        consentRequired: false,
        consentGiven: true,
        tags: recordData.tags || []
      };

      setPatientRecords(prev => [newRecord, ...prev]);

      // Run AI analysis
      const analysis = await aiService.analyzeHealthDocument(recordData.description);
      // Store AI analysis...

    } catch (error) {
      console.error('Failed to add record:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => {
    const todayPatients = patients.filter(p => {
      const lastVisit = new Date(p.lastVisit);
      const today = new Date();
      return lastVisit.toDateString() === today.toDateString();
    });

    const highRiskPatients = patients.filter(p => p.riskLevel === 'high');

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <UserGroupIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Patients</p>
                <p className="text-2xl font-bold text-gray-900">{patients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Visits</p>
                <p className="text-2xl font-bold text-gray-900">{todayPatients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">High Risk</p>
                <p className="text-2xl font-bold text-gray-900">{highRiskPatients.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <ShieldCheckIcon className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Consents</p>
                <p className="text-2xl font-bold text-gray-900">
                  {consentRequests.filter(r => r.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* High Risk Patients Alert */}
        {highRiskPatients.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <h3 className="font-medium text-red-800">High Risk Patients Require Attention</h3>
            </div>
            <div className="mt-2 space-y-1">
              {highRiskPatients.map(patient => (
                <p key={patient.id} className="text-sm text-red-700">
                  {patient.name} - {patient.conditions.join(', ')}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Recent Patients */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {patients.slice(0, 5).map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
                   onClick={() => setSelectedPatient(patient)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-full ${
                      patient.riskLevel === 'high' ? 'bg-red-100' :
                      patient.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <UserGroupIcon className={`h-6 w-6 ${
                        patient.riskLevel === 'high' ? 'text-red-600' :
                        patient.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Age: {patient.age} | {patient.location}</p>
                      <p className="text-xs text-gray-500">
                        Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">{patient.conditions.join(', ')}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                        patient.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {patient.riskLevel} risk
                      </span>
                      {consentRequests.some(r => r.patientId === patient.id && r.status === 'pending') && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          <ClockIcon className="h-3 w-3 mr-1" />
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPatients = () => {
    const filteredPatients = patients.filter(patient =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.conditions.some((condition: string) => 
        condition.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return (
      <div className="space-y-6">
        {/* Success Message */}
        {showSuccessMessage && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">
                  Consent request sent successfully!
                </h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>The patient will receive a notification to approve your access request. You'll be notified once they respond.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Search */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Patients List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">All Patients ({filteredPatients.length})</h3>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                <PlusIcon className="h-4 w-4" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      patient.riskLevel === 'high' ? 'bg-red-100' :
                      patient.riskLevel === 'medium' ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <span className={`text-lg font-semibold ${
                        patient.riskLevel === 'high' ? 'text-red-600' :
                        patient.riskLevel === 'medium' ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {patient.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{patient.name}</h4>
                      <p className="text-sm text-gray-600">Age: {patient.age} | Phone: {patient.phone}</p>
                      <p className="text-sm text-gray-600">{patient.location}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        {patient.conditions.map((condition: string, index: number) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Last visit</p>
                      <p className="text-sm font-medium text-gray-900">
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </p>
                    </div>
                    <button
                      onClick={() => requestPatientConsent(patient.id, ['all'], 'Regular consultation')}
                      disabled={requestingConsent === patient.id || loading}
                      className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                        requestingConsent === patient.id || loading
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      {requestingConsent === patient.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span>Sending Request...</span>
                        </>
                      ) : consentRequests.some(r => r.patientId === patient.id && r.status === 'pending') ? (
                        <>
                          <ClockIcon className="h-4 w-4" />
                          <span>Request Sent</span>
                        </>
                      ) : (
                        'Request Access'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const tabs = [
    { id: 'overview', name: t('dashboard'), icon: UserGroupIcon },
    { id: 'patients', name: 'Patients', icon: UserGroupIcon },
    { id: 'records', name: t('healthRecords'), icon: DocumentTextIcon },
    { id: 'consent', name: t('consentManagement'), icon: ShieldCheckIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('welcome')}, {user?.name}</h1>
        <p className="text-gray-600">Manage patient care with secure, blockchain-based health records</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'patients' && renderPatients()}
        {activeTab === 'records' && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
            <DocumentTextIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Patient Records</h3>
            <p className="text-gray-600 mb-6">
              Select a patient to view and manage their health records
            </p>
          </div>
        )}
        {activeTab === 'consent' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Pending Consent Requests</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {consentRequests.filter(r => r.status === 'pending').map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {patients.find(p => p.id === request.patientId)?.name || 'Unknown Patient'}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
                        <p className="text-xs text-gray-500 mt-2">
                          Requested: {new Date(request.requestedAt).toLocaleString()}
                        </p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </div>
                  </div>
                ))}
                
                {consentRequests.filter(r => r.status === 'pending').length === 0 && (
                  <div className="p-6 text-center text-gray-500">
                    No pending consent requests
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};