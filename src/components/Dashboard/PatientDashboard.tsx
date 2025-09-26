import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Calendar, 
  FileText, 
  TrendingUp, 
  Shield,
  Pill,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { useMedicalContext } from '../../contexts/MedicalContext';
import { useTranslation } from '../../utils/translations';

export function PatientDashboard() {
  const { state } = useAppContext();
  const { state: medicalState } = useMedicalContext();
  const t = useTranslation(state.language);
  
  const stats = [
    {
      title: 'Total Records',
      value: '12',
      change: '+2',
      icon: FileText,
      color: 'blue'
    },
    {
      title: 'Active Medications',
      value: '3',
      change: '-1',
      icon: Pill,
      color: 'green'
    },
    {
      title: 'Upcoming Appointments',
      value: '2',
      change: '+1',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Health Score',
      value: '85%',
      change: '+5%',
      icon: Heart,
      color: 'red'
    }
  ];
  
  const recentRecords = [
    {
      id: '1',
      date: '2024-01-15',
      type: 'Consultation',
      doctor: 'Dr. Sarah Wilson',
      hospital: 'Kerala Medical College',
      status: 'completed'
    },
    {
      id: '2',
      date: '2024-01-10',
      type: 'Blood Test',
      doctor: 'Dr. Rajesh Kumar',
      hospital: 'City Lab',
      status: 'completed'
    },
    {
      id: '3',
      date: '2024-01-05',
      type: 'Prescription',
      doctor: 'Dr. Priya Nair',
      hospital: 'Community Health Center',
      status: 'active'
    }
  ];
  
  const upcomingAppointments = [
    {
      id: '1',
      date: '2024-01-20',
      time: '10:00 AM',
      doctor: 'Dr. Anil Kumar',
      specialty: 'Cardiology',
      type: 'Follow-up'
    },
    {
      id: '2',
      date: '2024-01-25',
      time: '2:30 PM',
      doctor: 'Dr. Meera Pillai',
      specialty: 'General Medicine',
      type: 'Routine Checkup'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-teal-600 rounded-2xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {state.user?.name}!
            </h1>
            <p className="text-blue-100">
              {t('healthSummary')}: Your health metrics are looking good
            </p>
          </div>
          <div className="hidden md:block">
            <motion.div
              className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Heart size={32} className="text-white" />
            </motion.div>
          </div>
        </div>
      </motion.div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon size={24} className={`text-${stat.color}-600`} />
              </div>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                stat.change.startsWith('+') 
                  ? 'bg-green-100 text-green-600' 
                  : 'bg-red-100 text-red-600'
              }`}>
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
            <p className="text-gray-600 text-sm">{stat.title}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Records */}
        <motion.div
          className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('recentRecords')}
            </h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {recentRecords.map((record, index) => (
              <motion.div
                key={record.id}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FileText size={16} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{record.type}</h3>
                    <p className="text-sm text-gray-600">{record.doctor}</p>
                    <p className="text-xs text-gray-500">{record.hospital}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{record.date}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    record.status === 'completed' 
                      ? 'bg-green-100 text-green-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {record.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Upcoming Appointments */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('upcomingAppointments')}
            </h2>
          </div>
          
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <motion.div
                key={appointment.id}
                className="p-4 border border-gray-200 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Calendar size={16} className="text-blue-600" />
                    <span className="font-medium text-gray-900">{appointment.date}</span>
                  </div>
                  <span className="text-blue-600 bg-blue-50 px-2 py-1 text-xs rounded">
                    {appointment.type}
                  </span>
                </div>
                <div className="flex items-center space-x-2 mb-2">
                  <Clock size={14} className="text-gray-400" />
                  <span className="text-sm text-gray-600">{appointment.time}</span>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{appointment.doctor}</p>
                  <p className="text-sm text-gray-600">{appointment.specialty}</p>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.button
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Schedule New Appointment
          </motion.button>
        </motion.div>
      </div>
      
      {/* Health Insights */}
      <motion.div
        className="bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <TrendingUp size={24} className="text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Health Insights
            </h3>
            <p className="text-gray-700 mb-3">
              Your blood pressure has improved by 12% over the last month. Keep up the good work with your medication and exercise routine.
            </p>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center space-x-1 text-sm text-green-600">
                <TrendingUp size={16} />
                <span>Blood Pressure: Improving</span>
              </span>
              <span className="inline-flex items-center space-x-1 text-sm text-blue-600">
                <Heart size={16} />
                <span>Heart Rate: Normal</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Welfare Status */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            {t('welfareStatus')}
          </h2>
          <Shield size={20} className="text-green-600" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="font-medium text-green-900 mb-1">Active Schemes</h3>
            <p className="text-2xl font-bold text-green-600">2</p>
            <p className="text-sm text-green-700">Karunya, RSBY</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-medium text-blue-900 mb-1">Benefits Used</h3>
            <p className="text-2xl font-bold text-blue-600">₹57,000</p>
            <p className="text-sm text-blue-700">This year</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-medium text-purple-900 mb-1">Remaining</h3>
            <p className="text-2xl font-bold text-purple-600">₹1,73,000</p>
            <p className="text-sm text-purple-700">Available</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}