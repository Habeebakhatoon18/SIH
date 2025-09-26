import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Shield, 
  CheckCircle, 
  Clock, 
  XCircle,
  IndianRupee,
  FileText,
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Phone,
  MapPin
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useTranslation } from '../../utils/translations';
import { mockWelfareSchemes } from '../../services/mockApi';

export function WelfareSchemes() {
  const { state } = useAppContext();
  const t = useTranslation(state.language);
  const [selectedScheme, setSelectedScheme] = useState<string | null>(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'pending': return Clock;
      case 'expired': return XCircle;
      default: return AlertCircle;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'expired': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };
  
  const eligibilityChecks = [
    { criteria: 'BPL Family', status: true, description: 'Below Poverty Line certification required' },
    { criteria: 'Kerala Resident', status: true, description: 'Domicile certificate for 3+ years' },
    { criteria: 'Aadhaar Linked', status: true, description: 'Valid Aadhaar card linked to bank account' },
    { criteria: 'Income Criteria', status: true, description: 'Annual family income below ₹1,20,000' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('welfare')}</h1>
          <p className="text-gray-600">Kerala government welfare schemes and benefits</p>
        </div>
        <motion.button
          onClick={() => setShowApplicationForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FileText size={20} />
          <span>Apply for Scheme</span>
        </motion.button>
      </motion.div>
      
      {/* Eligibility Overview */}
      <motion.div
        className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <Shield size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Eligibility Status</h2>
            <p className="text-gray-700 mb-4">
              You are eligible for {mockWelfareSchemes.filter(s => s.eligible).length} out of {mockWelfareSchemes.length} schemes.
              Complete your profile to unlock more benefits.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {eligibilityChecks.map((check, index) => (
                <motion.div
                  key={check.criteria}
                  className="flex items-center space-x-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                >
                  {check.status ? (
                    <CheckCircle size={16} className="text-green-600" />
                  ) : (
                    <XCircle size={16} className="text-red-600" />
                  )}
                  <span className={`text-sm font-medium ${check.status ? 'text-green-700' : 'text-red-700'}`}>
                    {check.criteria}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Scheme Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockWelfareSchemes.map((scheme, index) => {
          const StatusIcon = getStatusIcon(scheme.status);
          const statusColor = getStatusColor(scheme.status);
          const utilizationPercent = (scheme.claimedAmount / scheme.totalBenefit) * 100;
          
          return (
            <motion.div
              key={scheme.id}
              className={`bg-white rounded-xl p-6 shadow-sm border-2 transition-all cursor-pointer ${
                scheme.eligible 
                  ? 'border-green-200 hover:border-green-300 hover:shadow-md' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedScheme(selectedScheme === scheme.id ? null : scheme.id)}
            >
              {/* Scheme Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    scheme.eligible ? 'bg-green-100' : 'bg-gray-100'
                  }`}>
                    <Heart size={24} className={scheme.eligible ? 'text-green-600' : 'text-gray-400'} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {scheme.name}
                    </h3>
                    <p className="text-sm text-gray-600">{scheme.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${statusColor}`}>
                    <StatusIcon size={12} />
                    <span className="capitalize">{scheme.status}</span>
                  </span>
                  {!scheme.eligible && (
                    <AlertCircle size={16} className="text-yellow-500" />
                  )}
                </div>
              </div>
              
              {/* Benefits */}
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Key Benefits:</h4>
                <div className="space-y-1">
                  {scheme.benefits.slice(0, 2).map((benefit, i) => (
                    <div key={i} className="flex items-center space-x-2 text-sm text-gray-600">
                      <CheckCircle size={12} className="text-green-500" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                  {scheme.benefits.length > 2 && (
                    <span className="text-xs text-gray-500">
                      +{scheme.benefits.length - 2} more benefits
                    </span>
                  )}
                </div>
              </div>
              
              {/* Financial Summary */}
              {scheme.eligible && (
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600">Benefit Utilization</span>
                    <span className="text-sm font-medium text-gray-900">
                      {utilizationPercent.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div
                      className="bg-blue-600 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${utilizationPercent}%` }}
                      transition={{ delay: 0.5 + index * 0.1, duration: 1 }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Claimed</span>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <IndianRupee size={12} />
                        {scheme.claimedAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-600">Remaining</span>
                      <p className="font-semibold text-green-600 flex items-center">
                        <IndianRupee size={12} />
                        {(scheme.totalBenefit - scheme.claimedAmount).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Expanded Details */}
              <AnimatePresence>
                {selectedScheme === scheme.id && (
                  <motion.div
                    className="mt-4 pt-4 border-t border-gray-200"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <div className="space-y-4">
                      {/* All Benefits */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Complete Benefits List:</h4>
                        <div className="space-y-1">
                          {scheme.benefits.map((benefit, i) => (
                            <div key={i} className="flex items-start space-x-2 text-sm text-gray-600">
                              <CheckCircle size={12} className="text-green-500 mt-0.5" />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Eligibility Criteria */}
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Eligibility Criteria:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {eligibilityChecks.map((check, i) => (
                            <div key={i} className="flex items-center space-x-2 text-sm">
                              {check.status ? (
                                <CheckCircle size={12} className="text-green-500" />
                              ) : (
                                <XCircle size={12} className="text-red-500" />
                              )}
                              <span className={check.status ? 'text-green-700' : 'text-red-700'}>
                                {check.criteria}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Contact Information */}
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Need Help?</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center space-x-2 text-blue-700">
                            <Phone size={12} />
                            <span>1800-425-1919 (Toll Free)</span>
                          </div>
                          <div className="flex items-center space-x-2 text-blue-700">
                            <MapPin size={12} />
                            <span>District Collector Office</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
      
      {/* Application Timeline */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Application Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 1, title: 'Submit Application', desc: 'Complete online form with documents', icon: FileText },
            { step: 2, title: 'Verification', desc: 'Document verification by officials', icon: Shield },
            { step: 3, title: 'Approval', desc: 'Review and approval process', icon: CheckCircle },
            { step: 4, title: 'Benefit Activation', desc: 'Start receiving benefits', icon: TrendingUp }
          ].map((phase, index) => (
            <motion.div
              key={phase.step}
              className="text-center relative"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                index === 0 ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
              }`}>
                <phase.icon size={24} />
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{phase.title}</h3>
              <p className="text-sm text-gray-600">{phase.desc}</p>
              {index < 3 && (
                <div className="hidden md:block absolute top-8 left-full w-full">
                  <div className="h-px bg-gray-300 w-3/4"></div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}