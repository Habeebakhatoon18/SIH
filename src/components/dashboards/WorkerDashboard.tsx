import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranslation } from '../../utils/translations';
import { 
  DocumentTextIcon, 
  ShieldCheckIcon, 
  CameraIcon,
  CloudArrowUpIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { HealthRecord, ConsentRequest, AIAnalysis } from '../../types';
import { aiService } from '../../services/ai';
import { ipfsService } from '../../services/ipfs';
import { blockchainService } from '../../services/blockchain';

export const WorkerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [consentRequests, setConsentRequests] = useState<ConsentRequest[]>([]);
  const [aiAnalyses, setAiAnalyses] = useState<AIAnalysis[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const [analyzingDocument, setAnalyzingDocument] = useState(false);
  const [showDetectedMedicines, setShowDetectedMedicines] = useState(false);

  const t = (key: any) => getTranslation(key, user?.language || 'en');

  useEffect(() => {
    loadMockData();
  }, []);

  const loadMockData = () => {
    // Mock health records
    const mockRecords: HealthRecord[] = [
      {
        id: '1',
        patientId: user?.id || '1',
        doctorId: '2',
        title: 'Blood Pressure Check',
        description: 'Routine blood pressure monitoring - 140/90 mmHg',
        type: 'consultation',
        ipfsHash: 'QmHealthRecord1',
        encryptionKey: 'encrypted-key-1',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        consentRequired: true,
        consentGiven: true,
        tags: ['hypertension', 'routine-check']
      },
      {
        id: '2',
        patientId: user?.id || '1',
        doctorId: '2',
        title: 'Prescription - Amlodipine',
        description: 'Amlodipine 5mg once daily for blood pressure management',
        type: 'prescription',
        ipfsHash: 'QmHealthRecord2',
        encryptionKey: 'encrypted-key-2',
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        consentRequired: false,
        consentGiven: true,
        tags: ['medication', 'hypertension']
      }
    ];
    
    const mockConsents: ConsentRequest[] = [
      {
        id: '1',
        patientId: user?.id || '1',
        doctorId: '2',
        recordIds: ['1', '2'],
        purpose: 'Follow-up consultation for hypertension management',
        status: 'pending',
        requestedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    setRecords(mockRecords);
    setConsentRequests(mockConsents);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Process each file
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`);
        continue;
      }

      setLoading(true);
      setUploadProgress(0);

      try {
        // Simulate upload progress
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => Math.min(prev + 10, 90));
        }, 200);

        // Upload to IPFS
        const encryptionKey = Math.random().toString(36);
        const ipfsHash = await ipfsService.uploadFile(file, encryptionKey);
        
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Store on blockchain
        await blockchainService.storeRecordHash('new-record', ipfsHash, user?.walletAddress || '');

        // Add to records
        const newRecord: HealthRecord = {
          id: Date.now().toString() + '-' + i,
          patientId: user?.id || '1',
          doctorId: '',
          title: file.name,
          description: `Uploaded document: ${file.name}`,
          type: file.type.includes('image') ? 'scan' : 'consultation',
          ipfsHash,
          encryptionKey,
          timestamp: new Date().toISOString(),
          consentRequired: false,
          consentGiven: true,
          tags: ['uploaded', 'document']
        };

        setRecords(prev => [newRecord, ...prev]);
        
        // Run AI analysis for images
        if (file.type.includes('image')) {
          setAnalyzingDocument(true);
          
          // Simulate OCR processing
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const ocrText = await aiService.ocrScan('mock-image-data');
          const analysis = await aiService.analyzeHealthDocument(ocrText);
          
          const aiAnalysis: AIAnalysis = {
            id: Date.now().toString() + '-analysis-' + i,
            recordId: newRecord.id,
            summary: analysis.summary,
            keyFindings: analysis.keyFindings,
            recommendations: analysis.recommendations,
            riskLevel: analysis.riskLevel,
            confidence: analysis.confidence,
            processedAt: new Date().toISOString()
          };
          
          setAiAnalyses(prev => [aiAnalysis, ...prev]);
          setAnalyzingDocument(false);
          
          // Show detected medicines after analysis
          setShowDetectedMedicines(true);
        }

        // Reset progress for next file
        setUploadProgress(0);

      } catch (error) {
        console.error('Upload failed for file:', file.name, error);
        alert(`Failed to upload ${file.name}. Please try again.`);
      } finally {
        if (i === files.length - 1) {
          setLoading(false);
          setUploadProgress(0);
        }
      }
    }

    // Reset the input
    event.target.value = '';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      // Create a synthetic event for the file input
      const syntheticEvent = {
        target: { files, value: '' }
      } as React.ChangeEvent<HTMLInputElement>;
      handleFileUpload(syntheticEvent);
    }
  };

  const handleConsentResponse = async (requestId: string, approve: boolean) => {
    const request = consentRequests.find(r => r.id === requestId);
    if (!request) return;

    setLoading(true);
    
    try {
      if (approve) {
        await blockchainService.grantConsent(
          request.smartContractAddress || 'mock-contract',
          user?.walletAddress || ''
        );
      } else {
        await blockchainService.revokeConsent(
          request.smartContractAddress || 'mock-contract',
          user?.walletAddress || ''
        );
      }

      setConsentRequests(prev => 
        prev.map(r => 
          r.id === requestId 
            ? { ...r, status: approve ? 'approved' : 'rejected' }
            : r
        )
      );
    } catch (error) {
      console.error('Consent response failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('healthRecords')}</p>
              <p className="text-2xl font-bold text-gray-900">{records.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{t('pendingRequests')}</p>
              <p className="text-2xl font-bold text-gray-900">
                {consentRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Consent Given</p>
              <p className="text-2xl font-bold text-gray-900">
                {records.filter(r => r.consentGiven).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent {t('healthRecords')}</h3>
        </div>
        <div className="p-6 space-y-4">
          {records.slice(0, 3).map((record) => (
            <div key={record.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  record.type === 'consultation' ? 'bg-blue-100 text-blue-600' :
                  record.type === 'prescription' ? 'bg-green-100 text-green-600' :
                  'bg-purple-100 text-purple-600'
                }`}>
                  <DocumentTextIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{record.title}</p>
                  <p className="text-sm text-gray-600">{record.description}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(record.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {record.consentGiven ? (
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                ) : (
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRecords = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('upload')} New Record</h3>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <CloudArrowUpIcon className={`mx-auto h-12 w-12 transition-colors ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer inline-block">
                <span className={`mt-2 block text-sm font-medium transition-colors ${
                  isDragOver 
                    ? 'text-blue-600' 
                    : 'text-gray-900 hover:text-blue-600'
                }`}>
                  {isDragOver ? 'Drop files here' : 'Drop files here or click to upload'}
                </span>
                <input
                  id="file-upload"
                  name="file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf,.doc,.docx"
                  multiple
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                PNG, JPG, PDF, DOC up to 10MB
              </p>
            </div>
          </div>
          
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}
          
          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Processing file...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Records List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">All {t('healthRecords')}</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {records.map((record) => (
            <div key={record.id} className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${
                    record.type === 'consultation' ? 'bg-blue-100 text-blue-600' :
                    record.type === 'prescription' ? 'bg-green-100 text-green-600' :
                    record.type === 'test-result' ? 'bg-purple-100 text-purple-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <DocumentTextIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{record.title}</h4>
                    <p className="text-sm text-gray-600">{record.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        record.consentGiven ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {record.consentGiven ? 'Accessible' : 'Restricted'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {t('view')}
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                    {t('download')}
                  </button>
                </div>
              </div>
              
              {/* AI Analysis */}
              {aiAnalyses.find(a => a.recordId === record.id) && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <ChartBarIcon className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-800">{t('aiSummary')}</span>
                  </div>
                  {(() => {
                    const analysis = aiAnalyses.find(a => a.recordId === record.id)!;
                    return (
                      <div className="space-y-2">
                        <p className="text-sm text-blue-700">{analysis.summary}</p>
                        {analysis.keyFindings.length > 0 && (
                          <div>
                            <p className="text-xs font-medium text-blue-800">Key Findings:</p>
                            <ul className="text-xs text-blue-700 list-disc list-inside">
                              {analysis.keyFindings.map((finding, index) => (
                                <li key={index}>{finding}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScanDocument = () => (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Scan Medical Document</h3>
        <div 
          className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
            isDragOver 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-blue-400'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center">
            <CameraIcon className={`mx-auto h-12 w-12 transition-colors ${
              isDragOver ? 'text-blue-500' : 'text-gray-400'
            }`} />
            <div className="mt-4">
              <label htmlFor="scan-file-upload" className="cursor-pointer inline-block">
                <span className={`mt-2 block text-sm font-medium transition-colors ${
                  isDragOver 
                    ? 'text-blue-600' 
                    : 'text-gray-900 hover:text-blue-600'
                }`}>
                  {isDragOver ? 'Drop document here' : 'Drop document here or click to scan'}
                </span>
                <input
                  id="scan-file-upload"
                  name="scan-file-upload"
                  type="file"
                  className="sr-only"
                  onChange={handleFileUpload}
                  accept="image/*,.pdf"
                  multiple
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">
                Scan prescriptions, test results, medical reports (PNG, JPG, PDF)
              </p>
            </div>
          </div>
          
          {uploadProgress > 0 && (
            <div className="mt-4">
              <div className="bg-blue-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-600 mt-2 text-center">
                Processing document... {uploadProgress}%
              </p>
            </div>
          )}
          
          {loading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center space-x-2 text-blue-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">Analyzing document...</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Loading State */}
      {analyzingDocument && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <span className="text-sm font-medium">Analyzing document...</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Extracting text and running AI analysis</p>
          </div>
        </div>
      )}


      {/* Medicine Detection Success */}
      {showDetectedMedicines && aiAnalyses.length > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Medicines detected successfully!
              </h3>
              <div className="mt-1 text-sm text-green-700">
                <p>Found medicines in the uploaded document. Review the details below.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detected Medicines List */}
      {showDetectedMedicines && aiAnalyses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">Medicines Detected</span>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                3 medicines found
              </span>
            </div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  name: "Paracetamol 500mg",
                  dosage: "1 tablet every 6 hours",
                  duration: "5 days",
                  purpose: "Fever and pain relief",
                  sideEffects: ["Nausea", "Stomach upset"],
                  interactions: ["Warfarin", "Alcohol"]
                },
                {
                  name: "Amoxicillin 250mg",
                  dosage: "1 capsule twice daily",
                  duration: "7 days",
                  purpose: "Bacterial infection treatment",
                  sideEffects: ["Diarrhea", "Nausea"],
                  interactions: ["Methotrexate", "Warfarin"]
                },
                {
                  name: "Omeprazole 20mg",
                  dosage: "1 capsule daily before breakfast",
                  duration: "4 weeks",
                  purpose: "Acid reflux treatment",
                  sideEffects: ["Headache", "Nausea"],
                  interactions: ["Clopidogrel", "Warfarin"]
                }
              ].map((medicine, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{medicine.name}</h4>
                    <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      Detected
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Dosage:</span>
                      <span className="ml-2 text-gray-700">{medicine.dosage}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-2 text-gray-700">{medicine.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Purpose:</span>
                      <span className="ml-2 text-gray-700">{medicine.purpose}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Side Effects:</p>
                      <div className="flex flex-wrap gap-1">
                        {medicine.sideEffects.map((effect, i) => (
                          <span key={i} className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                            {effect}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Interactions:</p>
                      <div className="flex flex-wrap gap-1">
                        {medicine.interactions.map((interaction, i) => (
                          <span key={i} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
                            {interaction}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Document Analysis Results */}
      {showDetectedMedicines && aiAnalyses.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <span className="text-lg font-semibold text-gray-900">Detailed Analysis</span>
              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                {aiAnalyses.length} analysis{aiAnalyses.length > 1 ? 'es' : ''} found
              </span>
            </div>
          </div>
        <div className="p-6">
          <div className="space-y-6">
            {aiAnalyses.map((analysis) => (
              <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-4">
                  <ChartBarIcon className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-gray-900">Document Analysis</span>
                  <span className="text-xs text-gray-500">
                    {new Date(analysis.processedAt).toLocaleString()}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                    <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                      {analysis.summary}
                    </p>
                  </div>
                  
                  {analysis.keyFindings.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Key Findings</h4>
                      <ul className="space-y-1">
                        {analysis.keyFindings.map((finding, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {analysis.recommendations.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Recommendations</h4>
                      <ul className="space-y-1">
                        {analysis.recommendations.map((recommendation, index) => (
                          <li key={index} className="text-sm text-gray-700 flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {recommendation}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 pt-2 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Risk Level:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        analysis.riskLevel === 'low' ? 'bg-green-100 text-green-800' :
                        analysis.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {analysis.riskLevel}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">Confidence:</span>
                      <span className="text-xs text-gray-700">{Math.round(analysis.confidence * 100)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      )}
    </div>
  );

  const renderConsent = () => (
    <div className="space-y-6">
      {/* Pending Requests */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{t('pendingRequests')}</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {consentRequests.filter(r => r.status === 'pending').map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Access Request</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    Requested {new Date(request.requestedAt).toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500">
                    Records requested: {request.recordIds.length}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleConsentResponse(request.id, false)}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-md hover:bg-red-50 disabled:opacity-50"
                  >
                    Deny
                  </button>
                  <button
                    onClick={() => handleConsentResponse(request.id, true)}
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Approve'}
                  </button>
                </div>
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

      {/* Consent History */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Consent History</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {consentRequests.filter(r => r.status !== 'pending').map((request) => (
            <div key={request.id} className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">Access Request</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(request.requestedAt).toLocaleString()}
                  </p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  request.status === 'approved' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {request.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: t('dashboard'), icon: ChartBarIcon },
    { id: 'records', name: t('healthRecords'), icon: DocumentTextIcon },
    { id: 'consent', name: t('consentManagement'), icon: ShieldCheckIcon },
    { id: 'scan', name: t('scanDocument'), icon: CameraIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('welcome')}, {user?.name}</h1>
        <p className="text-gray-600">Manage your health records securely on the blockchain</p>
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
        {activeTab === 'records' && renderRecords()}
        {activeTab === 'consent' && renderConsent()}
        {activeTab === 'scan' && renderScanDocument()}
      </div>
    </div>
  );
};