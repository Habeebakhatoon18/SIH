import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getTranslation } from '../../utils/translations';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { 
  ChartBarIcon, 
  ExclamationTriangleIcon,
  MapPinIcon,
  UserGroupIcon,
  ShieldExclamationIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { blockchainService } from '../../services/blockchain';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

export const GovernmentDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [healthTrends, setHealthTrends] = useState<any>(null);
  const [populationData, setPopulationData] = useState<any>(null);
  const [emergencyRequests, setEmergencyRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);
  const [reportSuccess, setReportSuccess] = useState(false);

  const t = (key: any) => getTranslation(key, user?.language || 'en');

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    // Mock health trends data
    const mockHealthTrends = {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Hypertension Cases',
          data: [45, 52, 48, 61, 58, 65],
          borderColor: 'rgb(59, 130, 246)',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4
        },
        {
          label: 'Diabetes Cases',
          data: [28, 35, 32, 42, 38, 45],
          borderColor: 'rgb(16, 185, 129)',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4
        },
        {
          label: 'Respiratory Issues',
          data: [15, 18, 22, 19, 25, 28],
          borderColor: 'rgb(245, 101, 101)',
          backgroundColor: 'rgba(245, 101, 101, 0.1)',
          tension: 0.4
        }
      ]
    };

    // Mock population health distribution
    const mockPopulationData = {
      labels: ['Low Risk', 'Medium Risk', 'High Risk', 'Critical'],
      datasets: [{
        data: [65, 20, 12, 3],
        backgroundColor: [
          '#10B981', // green
          '#F59E0B', // yellow
          '#F97316', // orange
          '#EF4444'  // red
        ],
        borderWidth: 2
      }]
    };

    // Mock disease outbreak data
    const mockOutbreakData = {
      labels: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
      datasets: [{
        label: 'Active Cases',
        data: [23, 18, 15, 12, 8],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgb(239, 68, 68)',
        borderWidth: 1
      }]
    };

    setHealthTrends(mockHealthTrends);
    setPopulationData(mockPopulationData);
    
    // Mock emergency requests
    const mockEmergencyRequests = [
      {
        id: '1',
        patientName: 'Anonymous Patient #1',
        reason: 'Cardiac Emergency - Hospital Access Required',
        location: 'Kochi General Hospital',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
        urgency: 'critical'
      },
      {
        id: '2',
        patientName: 'Anonymous Patient #2',
        reason: 'Road Accident - Medical History Access',
        location: 'Thiruvananthapuram Medical College',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'approved',
        urgency: 'high'
      }
    ];
    
    setEmergencyRequests(mockEmergencyRequests);
  };

  const handleEmergencyApproval = async (requestId: string, approve: boolean) => {
    setLoading(true);
    
    try {
      const request = emergencyRequests.find(r => r.id === requestId);
      if (request && approve) {
        await blockchainService.emergencyOverride(
          user?.id || '',
          'patient-id',
          request.reason
        );
      }

      setEmergencyRequests(prev => 
        prev.map(r => 
          r.id === requestId 
            ? { ...r, status: approve ? 'approved' : 'rejected' }
            : r
        )
      );
    } catch (error) {
      console.error('Emergency approval failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReport = async () => {
    try {
      setReportSuccess(false);
      setGeneratingReport(true);

      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Prepare CSV sections from available mock data
      const lines: string[] = [];

      // Section: Summary Metrics
      lines.push('Section,Metric,Value');
      lines.push(`Summary,Registered Migrants,12847`);
      lines.push(`Summary,Health Records,45231`);
      const pendingEmergencies = emergencyRequests.filter(r => r.status === 'pending').length;
      lines.push(`Summary,Pending Emergency Requests,${pendingEmergencies}`);

      // Section: Health Trends (if available)
      if (healthTrends?.labels && Array.isArray(healthTrends.datasets)) {
        lines.push('');
        lines.push('Health Trends');
        lines.push(['Month', ...healthTrends.datasets.map((d: any) => d.label)].join(','));
        healthTrends.labels.forEach((label: string, idx: number) => {
          const row = [label, ...healthTrends.datasets.map((d: any) => d.data[idx])];
          lines.push(row.join(','));
        });
      }

      // Section: Population Risk Distribution (if available)
      if (populationData?.labels && populationData.datasets?.[0]?.data) {
        lines.push('');
        lines.push('Population Risk Distribution');
        lines.push('Risk Level,Percent');
        populationData.labels.forEach((label: string, idx: number) => {
          const value = populationData.datasets[0].data[idx];
          lines.push(`${label},${value}`);
        });
      }

      // Section: Emergency Requests
      if (emergencyRequests.length > 0) {
        lines.push('');
        lines.push('Emergency Requests');
        lines.push('ID,Reason,Location,Timestamp,Status,Urgency');
        emergencyRequests.forEach(req => {
          const ts = new Date(req.timestamp).toISOString();
          const clean = (s: string) => String(s).replaceAll(',', ';');
          lines.push([
            clean(req.id),
            clean(req.reason),
            clean(req.location),
            ts,
            clean(req.status),
            clean(req.urgency)
          ].join(','));
        });
      }

      const csvContent = lines.join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const dateStr = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
      a.href = url;
      a.download = `health-report-${dateStr}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setReportSuccess(true);
      setTimeout(() => setReportSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to generate report', e);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Registered Migrants</p>
              <p className="text-2xl font-bold text-gray-900">12,847</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChartBarIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Health Records</p>
              <p className="text-2xl font-bold text-gray-900">45,231</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Outbreaks</p>
              <p className="text-2xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldExclamationIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Emergency Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {emergencyRequests.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Alerts */}
      {emergencyRequests.filter(r => r.status === 'pending').length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <ShieldExclamationIcon className="h-6 w-6 text-red-600 mr-2" />
            <h3 className="text-lg font-semibold text-red-800">Emergency Access Requests</h3>
          </div>
          <div className="space-y-3">
            {emergencyRequests.filter(r => r.status === 'pending').map((request) => (
              <div key={request.id} className="bg-white p-4 rounded-lg border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{request.reason}</h4>
                    <p className="text-sm text-gray-600">{request.location}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(request.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEmergencyApproval(request.id, false)}
                      disabled={loading}
                      className="px-3 py-1 text-sm font-medium text-red-600 border border-red-200 rounded hover:bg-red-50 disabled:opacity-50"
                    >
                      Deny
                    </button>
                    <button
                      onClick={() => handleEmergencyApproval(request.id, true)}
                      disabled={loading}
                      className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {loading ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Health Trends Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Trends (6 Months)</h3>
          {healthTrends && (
            <Line 
              data={healthTrends} 
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }}
            />
          )}
        </div>

        {/* Population Risk Distribution */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Risk Distribution</h3>
          {populationData && (
            <div className="flex justify-center">
              <div className="w-64 h-64">
                <Doughnut 
                  data={populationData}
                  options={{
                    responsive: true,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      {/* Disease Outbreak Map */}
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Outbreaks by District</h3>
        <Bar
          data={{
            labels: ['Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kollam'],
            datasets: [{
              label: 'Active Cases',
              data: [23, 18, 15, 12, 8],
              backgroundColor: 'rgba(239, 68, 68, 0.8)',
              borderColor: 'rgb(239, 68, 68)',
              borderWidth: 1
            }]
          }}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              }
            },
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }}
        />
      </div>

      {/* Detailed Health Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Coverage Statistics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Registered Workers</span>
              <span className="font-medium">12,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">With Health Records</span>
              <span className="font-medium">9,234 (72%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Regular Check-ups</span>
              <span className="font-medium">5,891 (46%)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Vaccination Coverage</span>
              <span className="font-medium">11,256 (88%)</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">Common Conditions</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Hypertension</span>
              <span className="font-medium text-red-600">1,547</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Diabetes</span>
              <span className="font-medium text-orange-600">892</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Respiratory Issues</span>
              <span className="font-medium text-yellow-600">634</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Injuries</span>
              <span className="font-medium text-purple-600">423</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4">System Status</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Blockchain Nodes</span>
              <span className="font-medium text-green-600">Active (12)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">IPFS Storage</span>
              <span className="font-medium text-green-600">98.5% Uptime</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Integrity</span>
              <span className="font-medium text-green-600">100%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Backup</span>
              <span className="font-medium text-blue-600">2 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', name: t('dashboard'), icon: ChartBarIcon },
    { id: 'analytics', name: t('healthTrends'), icon: ChartBarIcon },
    { id: 'emergency', name: t('emergencyAccess'), icon: ShieldExclamationIcon },
    { id: 'reports', name: 'Reports', icon: ClockIcon }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('welcome')}, {user?.name}</h1>
        <p className="text-gray-600">Monitor population health trends and manage emergency access requests</p>
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
        {activeTab === 'analytics' && renderAnalytics()}
        {activeTab === 'emergency' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Emergency Access Requests</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {emergencyRequests.map((request) => (
                  <div key={request.id} className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{request.reason}</h4>
                        <p className="text-sm text-gray-600">{request.location}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(request.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          request.status === 'approved' ? 'bg-green-100 text-green-800' :
                          request.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          request.urgency === 'critical' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status === 'pending' ? request.urgency : request.status}
                        </span>
                        {request.status === 'pending' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEmergencyApproval(request.id, false)}
                              className="px-3 py-1 text-sm font-medium text-red-600 border border-red-200 rounded hover:bg-red-50"
                            >
                              Deny
                            </button>
                            <button
                              onClick={() => handleEmergencyApproval(request.id, true)}
                              className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded hover:bg-red-700"
                            >
                              Approve
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {activeTab === 'reports' && (
          <div className="space-y-4">
            {reportSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-800">Report generated and downloaded successfully.</div>
              </div>
            )}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 text-center">
              <ClockIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Detailed Reports</h3>
              <p className="text-gray-600 mb-6">
                Generate comprehensive health reports and data exports
              </p>
              <button
                onClick={generateReport}
                disabled={generatingReport}
                className={`px-6 py-3 rounded-lg transition-colors text-white ${
                  generatingReport ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {generatingReport ? 'Generating…' : 'Generate Report'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};