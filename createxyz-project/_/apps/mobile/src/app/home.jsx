import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  Sprout, 
  Camera, 
  Cloud, 
  TrendingUp, 
  Cpu, 
  Youtube, 
  MessageCircle,
  User,
  Bell
} from 'lucide-react-native';

const FeatureCard = ({ icon: Icon, title, subtitle, onPress, color = '#4CAF50' }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 20,
      marginHorizontal: 8,
      marginVertical: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      borderLeftWidth: 4,
      borderLeftColor: color,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{
        backgroundColor: color + '20',
        borderRadius: 12,
        padding: 12,
        marginRight: 16,
      }}>
        <Icon size={28} color={color} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {title}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          lineHeight: 20,
        }}>
          {subtitle}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [greeting, setGreeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  const features = [
    {
      icon: Sprout,
      title: 'Crop Recommendation',
      subtitle: 'Get AI-powered crop suggestions based on your soil and climate',
      color: '#4CAF50',
      onPress: () => router.push('/crop-recommendation'),
    },
    {
      icon: Camera,
      title: 'Disease Detection',
      subtitle: 'Scan your crops to identify diseases and get treatment advice',
      color: '#FF9800',
      onPress: () => router.push('/disease-detection'),
    },
    {
      icon: Cloud,
      title: 'Weather Forecast',
      subtitle: 'Get 7-day weather predictions for your location',
      color: '#2196F3',
      onPress: () => router.push('/weather'),
    },
    {
      icon: TrendingUp,
      title: 'Market Prices',
      subtitle: 'Check latest crop prices and market trends',
      color: '#9C27B0',
      onPress: () => router.push('/market-prices'),
    },
    {
      icon: Cpu,
      title: 'IoT Sensor Rental',
      subtitle: 'Rent smart sensors to monitor your farm conditions',
      color: '#607D8B',
      onPress: () => router.push('/iot-rental'),
    },
    {
      icon: Youtube,
      title: 'Learning Videos',
      subtitle: 'Watch farming tutorials and expert advice',
      color: '#F44336',
      onPress: () => router.push('/learning'),
    },
  ];

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#F8F9FA',
      paddingTop: insets.top,
    }}>
      <StatusBar style="dark" />
      
      {/* Header */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <View>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#2E7D32',
            }}>
              {greeting}, Farmer! 🌾
            </Text>
            <Text style={{
              fontSize: 16,
              color: '#666',
              marginTop: 4,
            }}>
              How can we help you today?
            </Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              onPress={() => Alert.alert('Notifications', 'No new notifications')}
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <Bell size={24} color="#666" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push('/profile')}
              style={{
                backgroundColor: '#F5F5F5',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <User size={24} color="#666" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 12,
          paddingVertical: 16,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Quick Access Chatbot */}
        <TouchableOpacity
          onPress={() => router.push('/chatbot')}
          style={{
            backgroundColor: '#2E7D32',
            borderRadius: 16,
            padding: 20,
            marginHorizontal: 8,
            marginBottom: 20,
            flexDirection: 'row',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding: 12,
            marginRight: 16,
          }}>
            <MessageCircle size={28} color="white" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 4,
            }}>
              Ask KisanMitra Assistant
            </Text>
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
            }}>
              Get instant answers to your farming questions
            </Text>
          </View>
        </TouchableOpacity>

        {/* Feature Cards */}
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginHorizontal: 8,
          marginBottom: 12,
        }}>
          Farm Management Tools
        </Text>

        {features.map((feature, index) => (
          <FeatureCard
            key={index}
            icon={feature.icon}
            title={feature.title}
            subtitle={feature.subtitle}
            color={feature.color}
            onPress={feature.onPress}
          />
        ))}
      </ScrollView>
    </View>
  );
}