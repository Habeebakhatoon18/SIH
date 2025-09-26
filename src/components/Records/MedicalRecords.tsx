import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Share2, 
  Eye,
  Calendar,
  User,
  Stethoscope,
  Pill,
  TestTube,
  Activity
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useMedicalContext } from '../../contexts/MedicalContext';
import { useTranslation } from '../../utils/translations';

export function MedicalRecords() {
  const { state } = useAppContext();
  const t = useTranslation(state.language);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showAddRecord, setShowAddRecord] = useState(false);
  
  const mockRecords = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'consultation',
      title: 'General Checkup',
      doctor: 'Dr. Sarah Wilson',
      hospital: 'Kerala Medical College',
      description: 'Regular health examination with vital signs check.',
      medications: ['Paracetamol 500mg', 'Vitamin D3'],
      status: 'completed',
      blockchainHash: '0x1a2b3c...',
      documents: ['prescription.pdf', 'lab_results.pdf']
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'test',
      title: 'Blood Test Report',
      doctor: 'Dr. Rajesh Kumar',
      hospital: 'City Lab',
      description: 'Complete blood count and lipid profile analysis.',
      status: 'completed',
      blockchainHash: '0x4d5e6f...',
      documents: ['blood_test.pdf']
    },
    {
      id: '3',
      date: '2024-01-05',
      type: 'prescription',
      title: 'Hypertension Management',
      doctor: 'Dr. Priya Nair',
      hospital: 'Community Health Center',
      description: 'Prescription for blood pressure management.',
      medications: ['Amlodipine 5mg', 'Telmisartan 40mg'],
      status: 'active',
      blockchainHash: '0x7g8h9i...',
      documents: ['prescription.pdf']
    }
  ];
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return Stethoscope;
      case 'prescription': return Pill;
      case 'test': return TestTube;
      case 'diagnosis': return Activity;
      default: return FileText;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'blue';
      case 'prescription': return 'green';
      case 'test': return 'purple';
      case 'diagnosis': return 'red';
      default: return 'gray';
    }
  };
  
  const filteredRecords = mockRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || record.type === selectedFilter;
    return matchesSearch && matchesFilter;
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('records')}</h1>
          <p className="text-gray-600">Manage your medical records securely</p>
        </div>
        <motion.button
          onClick={() => setShowAddRecord(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus size={20} />
          <span>{t('addRecord')}</span>
        </motion.button>
      </motion.div>
      
      {/* Search and Filter */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search records, doctors, or hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Records</option>
              <option value="consultation">Consultations</option>
              <option value="prescription">Prescriptions</option>
              <option value="test">Test Results</option>
              <option value="diagnosis">Diagnosis</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Records Grid */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredRecords.map((record, index) => {
            const TypeIcon = getTypeIcon(record.type);
            const typeColor = getTypeColor(record.type);
            
            return (
              <motion.div
                key={record.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.05 }}
                layout
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 bg-${typeColor}-100 rounded-lg flex items-center justify-center`}>
                      <TypeIcon size={24} className={`text-${typeColor}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{record.title}</h3>
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                          record.status === 'completed' 
                            ? 'bg-green-100 text-green-600'
                            : record.status === 'active'
                            ? 'bg-blue-100 text-blue-600'
                            : 'bg-yellow-100 text-yellow-600'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 mb-3">{record.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Calendar size={16} />
                          <span>{record.date}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <User size={16} />
                          <span>{record.doctor}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Stethoscope size={16} />
                          <span>{record.hospital}</span>
                        </div>
                      </div>
                      
                      {record.medications && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Medications:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.medications.map((med, i) => (
                              <span key={i} className="bg-green-50 text-green-700 px-2 py-1 rounded text-sm">
                                {med}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {record.documents && record.documents.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">Documents:</h4>
                          <div className="flex flex-wrap gap-2">
                            {record.documents.map((doc, i) => (
                              <span key={i} className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-sm flex items-center space-x-1">
                                <FileText size={12} />
                                <span>{doc}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          Blockchain: {record.blockchainHash}
                        </span>
                        <span className="bg-green-100 text-green-600 px-2 py-1 rounded">
                          ✓ Verified
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Eye size={18} />
                    </motion.button>
                    <motion.button
                      className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Download size={18} />
                    </motion.button>
                    <motion.button
                      className="p-2 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Share2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      {filteredRecords.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <FileText size={48} className="text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No records found</h3>
          <p className="text-gray-600">Try adjusting your search terms or filters</p>
        </motion.div>
      )}
    </div>
  );
}