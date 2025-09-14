'use client';

import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({
    totalUsers: 1247,
    activeUsers: 892,
    cropRecommendations: 3456,
    diseaseDetections: 1234,
    chatSessions: 5678,
    iotRentals: 234
  });

  const [recentActivity, setRecentActivity] = useState([
    {
      id: 1,
      type: 'crop_recommendation',
      user: 'Rajesh Kumar',
      location: 'Pune, Maharashtra',
      timestamp: '2024-09-14 14:30:00',
      details: 'Requested recommendations for 5 acres'
    },
    {
      id: 2,
      type: 'disease_detection',
      user: 'Priya Sharma',
      location: 'Nashik, Maharashtra',
      timestamp: '2024-09-14 14:25:00',
      details: 'Detected Leaf Blight in tomato crop'
    },
    {
      id: 3,
      type: 'iot_rental',
      user: 'Amit Patel',
      location: 'Kolhapur, Maharashtra',
      timestamp: '2024-09-14 14:20:00',
      details: 'Rented soil moisture sensor for 30 days'
    },
    {
      id: 4,
      type: 'chat',
      user: 'Sunita Devi',
      location: 'Aurangabad, Maharashtra',
      timestamp: '2024-09-14 14:15:00',
      details: 'Asked about organic pest control methods'
    }
  ]);

  const [chatLogs, setChatLogs] = useState([
    {
      id: 1,
      user: 'Rajesh Kumar',
      messages: [
        { sender: 'user', text: 'What crops should I grow this season?', timestamp: '14:30' },
        { sender: 'bot', text: 'I can help you with crop recommendations! To give you the best suggestions, I need to know about your soil conditions and location.', timestamp: '14:30' },
        { sender: 'user', text: 'I have 5 acres in Pune', timestamp: '14:31' },
        { sender: 'bot', text: 'Great! For the Pune region, I recommend checking our Crop Recommendation tool for detailed analysis based on your soil parameters.', timestamp: '14:31' }
      ],
      timestamp: '2024-09-14 14:30:00'
    },
    {
      id: 2,
      user: 'Priya Sharma',
      messages: [
        { sender: 'user', text: 'My tomato plants have brown spots', timestamp: '14:25' },
        { sender: 'bot', text: 'Brown spots on tomato leaves could indicate a disease. I recommend using our Disease Detection feature to take a photo for accurate diagnosis.', timestamp: '14:25' },
        { sender: 'user', text: 'How do I take a good photo?', timestamp: '14:26' },
        { sender: 'bot', text: 'Take a clear photo of the affected leaf with good lighting. Include both healthy and diseased parts for comparison.', timestamp: '14:26' }
      ],
      timestamp: '2024-09-14 14:25:00'
    }
  ]);

  const StatCard = ({ title, value, icon, color }) => (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${color}-500`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value.toLocaleString()}</p>
        </div>
        <div className={`text-${color}-500 text-3xl`}>
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getTypeColor = (type) => {
      switch (type) {
        case 'crop_recommendation': return 'bg-green-100 text-green-800';
        case 'disease_detection': return 'bg-orange-100 text-orange-800';
        case 'iot_rental': return 'bg-blue-100 text-blue-800';
        case 'chat': return 'bg-purple-100 text-purple-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getTypeLabel = (type) => {
      switch (type) {
        case 'crop_recommendation': return 'Crop Rec.';
        case 'disease_detection': return 'Disease Det.';
        case 'iot_rental': return 'IoT Rental';
        case 'chat': return 'Chat';
        default: return type;
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(activity.type)}`}>
                {getTypeLabel(activity.type)}
              </span>
              <span className="text-sm text-gray-500">{activity.timestamp}</span>
            </div>
            <h4 className="font-medium text-gray-900">{activity.user}</h4>
            <p className="text-sm text-gray-600">{activity.location}</p>
            <p className="text-sm text-gray-700 mt-1">{activity.details}</p>
          </div>
        </div>
      </div>
    );
  };

  const ChatLogItem = ({ chatLog }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-medium text-gray-900">{chatLog.user}</h4>
        <span className="text-sm text-gray-500">{chatLog.timestamp}</span>
      </div>
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {chatLog.messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
              message.sender === 'user' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              <p>{message.text}</p>
              <span className={`text-xs ${message.sender === 'user' ? 'text-green-100' : 'text-gray-500'}`}>
                {message.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">KisanMitra Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Monitor app usage and user interactions</p>
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date().toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'activity', label: 'Recent Activity' },
              { id: 'chats', label: 'Chat Logs' },
              { id: 'analytics', label: 'Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <div>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
              <StatCard title="Active Users" value={stats.activeUsers} icon="🟢" color="green" />
              <StatCard title="Crop Recommendations" value={stats.cropRecommendations} icon="🌾" color="yellow" />
              <StatCard title="Disease Detections" value={stats.diseaseDetections} icon="🔍" color="orange" />
              <StatCard title="Chat Sessions" value={stats.chatSessions} icon="💬" color="purple" />
              <StatCard title="IoT Rentals" value={stats.iotRentals} icon="📡" color="indigo" />
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">All services operational</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Database connected</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">ML APIs responding</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                  <span className="text-sm text-gray-700">Weather API: 2s delay</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recent User Activity</h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Recent Chat Conversations</h3>
            <div className="space-y-4">
              {chatLogs.map((chatLog) => (
                <ChatLogItem key={chatLog.id} chatLog={chatLog} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Usage Analytics</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Feature Usage</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Crop Recommendations</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Chatbot</span>
                    <span className="text-sm font-medium">30%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: '30%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Disease Detection</span>
                    <span className="text-sm font-medium">15%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">IoT Rentals</span>
                    <span className="text-sm font-medium">10%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h4 className="text-md font-medium text-gray-900 mb-4">Regional Distribution</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Maharashtra</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Karnataka</span>
                    <span className="text-sm font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Gujarat</span>
                    <span className="text-sm font-medium">12%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Other States</span>
                    <span className="text-sm font-medium">8%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;