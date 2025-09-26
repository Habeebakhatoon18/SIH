import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  MapPin,
  Filter,
  Calendar,
  Download,
  AlertTriangle
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../../contexts/AppContext';
import { mockAnalyticsData } from '../../services/mockApi';

export function AnalyticsDashboard() {
  const { state } = useAppContext();
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6months');
  const [selectedMetric, setSelectedMetric] = useState('all');
  
  const diseaseColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
  
  const regionalData = [
    { region: 'Thiruvananthapuram', population: 1687406, cases: 2341, trend: '+5%' },
    { region: 'Ernakulam', population: 3282388, cases: 4123, trend: '-2%' },
    { region: 'Thrissur', population: 3121200, cases: 2876, trend: '+8%' },
    { region: 'Kozhikode', population: 3086293, cases: 3456, trend: '+3%' },
    { region: 'Kannur', population: 2615266, cases: 1987, trend: '-1%' },
    { region: 'Kollam', population: 2635375, cases: 2234, trend: '+6%' }
  ];
  
  const ageGroupData = [
    { name: '0-18', value: 15 },
    { name: '19-35', value: 35 },
    { name: '36-50', value: 25 },
    { name: '51-65', value: 20 },
    { name: '65+', value: 5 }
  ];
  
  const schemeUtilization = [
    { scheme: 'Karunya', enrolled: 45000, utilized: 23000, utilization: 51 },
    { scheme: 'RSBY', enrolled: 78000, utilized: 45000, utilization: 58 },
    { scheme: 'PMJAY', enrolled: 125000, utilized: 87000, utilization: 70 },
    { scheme: 'State Health', enrolled: 56000, utilized: 34000, utilization: 61 }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Health Analytics Dashboard</h1>
          <p className="text-gray-600">Real-time health trends and disease surveillance</p>
        </div>
        <div className="flex items-center space-x-3">
          <motion.button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download size={18} />
            <span>Export Report</span>
          </motion.button>
        </div>
      </motion.div>
      
      {/* Filters */}
      <motion.div
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex items-center space-x-2">
            <MapPin size={18} className="text-gray-400" />
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Regions</option>
              <option value="trivandrum">Thiruvananthapuram</option>
              <option value="ernakulam">Ernakulam</option>
              <option value="thrissur">Thrissur</option>
              <option value="kozhikode">Kozhikode</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar size={18} className="text-gray-400" />
            <select
              value={selectedTimeframe}
              onChange={(e) => setSelectedTimeframe(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="1month">Last Month</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <Filter size={18} className="text-gray-400" />
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Diseases</option>
              <option value="diabetes">Diabetes</option>
              <option value="hypertension">Hypertension</option>
              <option value="heart">Heart Disease</option>
              <option value="infectious">Infectious Diseases</option>
            </select>
          </div>
        </div>
      </motion.div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: 'Total Patients', value: '1.2M', change: '+5.2%', color: 'blue' },
          { title: 'Active Cases', value: '15.6K', change: '+2.1%', color: 'red' },
          { title: 'Recoveries', value: '234K', change: '+12.5%', color: 'green' },
          { title: 'Schemes Active', value: '8', change: '0%', color: 'purple' }
        ].map((metric, index) => (
          <motion.div
            key={metric.title}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center justify-between mb-2">
              <span className={`w-12 h-12 bg-${metric.color}-100 rounded-lg flex items-center justify-center`}>
                {metric.title === 'Total Patients' && <Users size={24} className={`text-${metric.color}-600`} />}
                {metric.title === 'Active Cases' && <AlertTriangle size={24} className={`text-${metric.color}-600`} />}
                {metric.title === 'Recoveries' && <TrendingUp size={24} className={`text-${metric.color}-600`} />}
                {metric.title === 'Schemes Active' && <BarChart3 size={24} className={`text-${metric.color}-600`} />}
              </span>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                metric.change.startsWith('+') 
                  ? 'bg-green-100 text-green-600' 
                  : metric.change.startsWith('-')
                  ? 'bg-red-100 text-red-600'
                  : 'bg-gray-100 text-gray-600'
              }`}>
                {metric.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</h3>
            <p className="text-gray-600 text-sm">{metric.title}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Disease Trends */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Trends Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockAnalyticsData.healthTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }} 
              />
              <Line type="monotone" dataKey="diabetes" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="hypertension" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2 }} />
              <Line type="monotone" dataKey="heart" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Regional Distribution */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cases by Region</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="region" stroke="#6b7280" angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb', 
                  borderRadius: '8px' 
                }} 
              />
              <Bar dataKey="cases" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Age Distribution */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Group Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={ageGroupData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {ageGroupData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={diseaseColors[index % diseaseColors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
        
        {/* Scheme Utilization */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Welfare Scheme Utilization</h3>
          <div className="space-y-4">
            {schemeUtilization.map((scheme, index) => (
              <div key={scheme.scheme} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-900">{scheme.scheme}</span>
                  <span className="text-gray-600">{scheme.utilization}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${scheme.utilization}%` }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 1 }}
                  />
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Enrolled: {scheme.enrolled.toLocaleString()}</span>
                  <span>Utilized: {scheme.utilized.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      
      {/* Disease Outbreak Alerts */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Disease Outbreak Monitoring</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {mockAnalyticsData.diseaseOutbreaks.map((outbreak, index) => (
            <motion.div
              key={outbreak.name}
              className={`p-4 rounded-lg border-l-4 ${
                outbreak.severity === 'high' ? 'border-red-500 bg-red-50' :
                outbreak.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                'border-green-500 bg-green-50'
              }`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{outbreak.name}</h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  outbreak.severity === 'high' ? 'bg-red-100 text-red-600' :
                  outbreak.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-green-100 text-green-600'
                }`}>
                  {outbreak.severity}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 mb-1">{outbreak.cases}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Cases</span>
                <span className={`font-medium ${
                  outbreak.trend.startsWith('+') ? 'text-red-600' : 'text-green-600'
                }`}>
                  {outbreak.trend}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}