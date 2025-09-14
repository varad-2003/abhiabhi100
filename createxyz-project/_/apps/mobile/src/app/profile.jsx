import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput,
  Switch 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  User, 
  Phone,
  MapPin,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  LogOut,
  Edit,
  Save,
  X
} from 'lucide-react-native';

const ProfileField = ({ label, value, onEdit, editable = true }) => (
  <View style={{
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 12,
          color: '#666',
          marginBottom: 4,
          fontWeight: '600',
        }}>
          {label}
        </Text>
        <Text style={{
          fontSize: 16,
          color: '#333',
          fontWeight: '500',
        }}>
          {value || 'Not set'}
        </Text>
      </View>
      {editable && (
        <TouchableOpacity
          onPress={onEdit}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 8,
            padding: 8,
          }}
        >
          <Edit size={16} color="#666" />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const SettingItem = ({ icon: Icon, title, subtitle, onPress, rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: 'white',
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    <View style={{
      backgroundColor: '#F5F5F5',
      borderRadius: 8,
      padding: 8,
      marginRight: 12,
    }}>
      <Icon size={20} color="#666" />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 2,
      }}>
        {title}
      </Text>
      {subtitle && (
        <Text style={{
          fontSize: 12,
          color: '#666',
        }}>
          {subtitle}
        </Text>
      )}
    </View>
    {rightElement}
  </TouchableOpacity>
);

const EditModal = ({ visible, field, value, onSave, onCancel }) => {
  const [editValue, setEditValue] = useState(value);

  if (!visible) return null;

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    }}>
      <View style={{
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 20,
        width: '100%',
        maxWidth: 400,
      }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 16,
        }}>
          Edit {field}
        </Text>
        
        <TextInput
          value={editValue}
          onChangeText={setEditValue}
          placeholder={`Enter ${field.toLowerCase()}`}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 12,
            padding: 16,
            fontSize: 16,
            marginBottom: 20,
          }}
          multiline={field === 'Address'}
          numberOfLines={field === 'Address' ? 3 : 1}
        />

        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              backgroundColor: '#F5F5F5',
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              flex: 1,
              marginRight: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#666',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => onSave(editValue)}
            style={{
              backgroundColor: '#2E7D32',
              borderRadius: 12,
              paddingHorizontal: 24,
              paddingVertical: 12,
              flex: 1,
              marginLeft: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: 'white',
            }}>
              Save
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [editModal, setEditModal] = useState({ visible: false, field: '', value: '' });
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [locationEnabled, setLocationEnabled] = useState(true);

  // Mock user data
  const [userProfile, setUserProfile] = useState({
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    village: 'Shirur, Pune',
    farmSize: '5 acres',
    language: 'English',
    joinDate: 'September 2024'
  });

  const handleEdit = (field, currentValue) => {
    setEditModal({
      visible: true,
      field,
      value: currentValue
    });
  };

  const handleSave = (newValue) => {
    const field = editModal.field.toLowerCase().replace(' ', '');
    setUserProfile(prev => ({
      ...prev,
      [field]: newValue
    }));
    setEditModal({ visible: false, field: '', value: '' });
    Alert.alert('Success', `${editModal.field} updated successfully!`);
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // In a real app, clear auth tokens and navigate to login
            Alert.alert('Logged Out', 'You have been logged out successfully.');
            router.replace('/');
          }
        }
      ]
    );
  };

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
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 12,
            padding: 8,
            marginRight: 16,
          }}
        >
          <ArrowLeft size={24} color="#666" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2E7D32',
          }}>
            Profile
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Manage your account settings
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingVertical: 20,
          paddingBottom: insets.bottom + 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={{
          backgroundColor: '#2E7D32',
          borderRadius: 16,
          padding: 24,
          alignItems: 'center',
          marginBottom: 24,
        }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: 'rgba(255,255,255,0.2)',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <User size={40} color="white" />
          </View>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: 'white',
            marginBottom: 4,
          }}>
            {userProfile.name}
          </Text>
          <Text style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            marginBottom: 8,
          }}>
            Farmer since {userProfile.joinDate}
          </Text>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 6,
          }}>
            <Text style={{
              fontSize: 12,
              color: 'white',
              fontWeight: '600',
            }}>
              {userProfile.farmSize} Farm
            </Text>
          </View>
        </View>

        {/* Personal Information */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 16,
        }}>
          Personal Information
        </Text>

        <ProfileField
          label="Full Name"
          value={userProfile.name}
          onEdit={() => handleEdit('Name', userProfile.name)}
        />

        <ProfileField
          label="Phone Number"
          value={userProfile.phone}
          onEdit={() => handleEdit('Phone', userProfile.phone)}
        />

        <ProfileField
          label="Village/City"
          value={userProfile.village}
          onEdit={() => handleEdit('Village', userProfile.village)}
        />

        <ProfileField
          label="Farm Size"
          value={userProfile.farmSize}
          onEdit={() => handleEdit('Farm Size', userProfile.farmSize)}
        />

        <ProfileField
          label="Preferred Language"
          value={userProfile.language}
          onEdit={() => handleEdit('Language', userProfile.language)}
        />

        {/* App Settings */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginTop: 24,
          marginBottom: 16,
        }}>
          App Settings
        </Text>

        <SettingItem
          icon={Bell}
          title="Notifications"
          subtitle="Weather alerts, price updates, and farming tips"
          rightElement={
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={notificationsEnabled ? 'white' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon={MapPin}
          title="Location Services"
          subtitle="For weather and local market information"
          rightElement={
            <Switch
              value={locationEnabled}
              onValueChange={setLocationEnabled}
              trackColor={{ false: '#E0E0E0', true: '#4CAF50' }}
              thumbColor={locationEnabled ? 'white' : '#f4f3f4'}
            />
          }
        />

        <SettingItem
          icon={Globe}
          title="Language"
          subtitle="Change app language"
          onPress={() => Alert.alert('Language', 'Language settings coming soon!')}
        />

        {/* Support & Help */}
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginTop: 24,
          marginBottom: 16,
        }}>
          Support & Help
        </Text>

        <SettingItem
          icon={HelpCircle}
          title="Help & FAQ"
          subtitle="Get answers to common questions"
          onPress={() => Alert.alert('Help', 'Help section coming soon!')}
        />

        <SettingItem
          icon={Shield}
          title="Privacy Policy"
          subtitle="Learn how we protect your data"
          onPress={() => Alert.alert('Privacy', 'Privacy policy coming soon!')}
        />

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: '#FFEBEE',
            borderRadius: 12,
            padding: 16,
            marginTop: 24,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogOut size={20} color="#F44336" />
          <Text style={{
            fontSize: 16,
            fontWeight: '600',
            color: '#F44336',
            marginLeft: 8,
          }}>
            Logout
          </Text>
        </TouchableOpacity>

        {/* App Info */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 12,
          padding: 16,
          marginTop: 20,
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginBottom: 4,
          }}>
            KisanMitra v1.0.0
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#999',
          }}>
            Your Smart Farming Companion
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <EditModal
        visible={editModal.visible}
        field={editModal.field}
        value={editModal.value}
        onSave={handleSave}
        onCancel={() => setEditModal({ visible: false, field: '', value: '' })}
      />
    </View>
  );
}