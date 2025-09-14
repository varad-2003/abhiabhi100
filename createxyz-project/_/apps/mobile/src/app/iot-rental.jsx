import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  Modal,
  TextInput 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Cpu, 
  Droplets,
  Thermometer,
  Zap,
  Wifi,
  Battery,
  Calendar,
  MapPin,
  Phone,
  ShoppingCart,
  Clock,
  CheckCircle
} from 'lucide-react-native';

const SensorCard = ({ sensor, onRent }) => (
  <View style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderLeftWidth: 4,
    borderLeftColor: sensor.available ? '#4CAF50' : '#F44336',
  }}>
    {/* Header */}
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {sensor.name}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginBottom: 8,
        }}>
          {sensor.description}
        </Text>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: sensor.available ? '#4CAF50' : '#F44336',
            marginRight: 8,
          }} />
          <Text style={{
            fontSize: 12,
            color: sensor.available ? '#4CAF50' : '#F44336',
            fontWeight: '600',
          }}>
            {sensor.available ? 'Available' : 'Out of Stock'}
          </Text>
        </View>
      </View>
      <View style={{
        backgroundColor: sensor.color + '20',
        borderRadius: 12,
        padding: 12,
      }}>
        <sensor.icon size={24} color={sensor.color} />
      </View>
    </View>

    {/* Specifications */}
    <View style={{
      backgroundColor: '#F8F9FA',
      borderRadius: 8,
      padding: 12,
      marginBottom: 16,
    }}>
      <Text style={{
        fontSize: 14,
        fontWeight: '600',
        color: '#2E7D32',
        marginBottom: 8,
      }}>
        Specifications:
      </Text>
      {sensor.specs.map((spec, index) => (
        <Text key={index} style={{
          fontSize: 12,
          color: '#666',
          lineHeight: 18,
        }}>
          • {spec}
        </Text>
      ))}
    </View>

    {/* Pricing and Action */}
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
          ₹{sensor.price}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
        }}>
          per {sensor.period}
        </Text>
      </View>
      <TouchableOpacity
        onPress={() => onRent(sensor)}
        disabled={!sensor.available}
        style={{
          backgroundColor: sensor.available ? '#2E7D32' : '#E0E0E0',
          borderRadius: 12,
          paddingHorizontal: 20,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <ShoppingCart size={16} color={sensor.available ? 'white' : '#999'} />
        <Text style={{
          color: sensor.available ? 'white' : '#999',
          fontSize: 14,
          fontWeight: '600',
          marginLeft: 8,
        }}>
          Rent Now
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const OrderHistoryCard = ({ order }) => (
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
      alignItems: 'flex-start',
      marginBottom: 12,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {order.sensorName}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
        }}>
          Order #{order.id}
        </Text>
      </View>
      <View style={{
        backgroundColor: order.status === 'Active' ? '#E8F5E8' : 
                      order.status === 'Delivered' ? '#E3F2FD' : '#FFF3E0',
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}>
        <Text style={{
          fontSize: 12,
          fontWeight: '600',
          color: order.status === 'Active' ? '#4CAF50' : 
                 order.status === 'Delivered' ? '#2196F3' : '#FF9800',
        }}>
          {order.status}
        </Text>
      </View>
    </View>

    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 8,
    }}>
      <Text style={{ fontSize: 12, color: '#666' }}>Rental Period:</Text>
      <Text style={{ fontSize: 12, color: '#333', fontWeight: '600' }}>
        {order.startDate} - {order.endDate}
      </Text>
    </View>

    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <Text style={{ fontSize: 12, color: '#666' }}>Total Amount:</Text>
      <Text style={{ fontSize: 12, color: '#333', fontWeight: '600' }}>
        ₹{order.amount}
      </Text>
    </View>
  </View>
);

const RentalModal = ({ visible, sensor, onClose, onConfirm }) => {
  const [formData, setFormData] = useState({
    duration: '7',
    address: '',
    phone: '',
    deliveryDate: '',
  });

  const handleConfirm = () => {
    if (!formData.address || !formData.phone || !formData.deliveryDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }
    onConfirm(formData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={{ flex: 1, backgroundColor: '#F8F9FA' }}>
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderBottomWidth: 1,
          borderBottomColor: '#E0E0E0',
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2E7D32',
          }}>
            Rent {sensor?.name}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{
              fontSize: 16,
              color: '#666',
            }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
          {/* Rental Duration */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#2E7D32',
              marginBottom: 12,
            }}>
              Rental Duration
            </Text>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {['7', '15', '30', '60'].map((days) => (
                <TouchableOpacity
                  key={days}
                  onPress={() => setFormData({ ...formData, duration: days })}
                  style={{
                    backgroundColor: formData.duration === days ? '#2E7D32' : 'white',
                    borderRadius: 8,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: formData.duration === days ? '#2E7D32' : '#E0E0E0',
                  }}
                >
                  <Text style={{
                    color: formData.duration === days ? 'white' : '#666',
                    fontSize: 14,
                    fontWeight: '600',
                  }}>
                    {days} days
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Delivery Address */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#2E7D32',
              marginBottom: 8,
            }}>
              Delivery Address *
            </Text>
            <TextInput
              value={formData.address}
              onChangeText={(text) => setFormData({ ...formData, address: text })}
              placeholder="Enter your farm address"
              multiline
              numberOfLines={3}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                padding: 16,
                fontSize: 16,
                textAlignVertical: 'top',
              }}
            />
          </View>

          {/* Phone Number */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#2E7D32',
              marginBottom: 8,
            }}>
              Phone Number *
            </Text>
            <TextInput
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                padding: 16,
                fontSize: 16,
              }}
            />
          </View>

          {/* Preferred Delivery Date */}
          <View style={{ marginBottom: 20 }}>
            <Text style={{
              fontSize: 16,
              fontWeight: '600',
              color: '#2E7D32',
              marginBottom: 8,
            }}>
              Preferred Delivery Date *
            </Text>
            <TextInput
              value={formData.deliveryDate}
              onChangeText={(text) => setFormData({ ...formData, deliveryDate: text })}
              placeholder="DD/MM/YYYY"
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: '#E0E0E0',
                padding: 16,
                fontSize: 16,
              }}
            />
          </View>

          {/* Cost Summary */}
          <View style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#2E7D32',
              marginBottom: 12,
            }}>
              Cost Summary
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 14, color: '#666' }}>
                {sensor?.name} × {formData.duration} days
              </Text>
              <Text style={{ fontSize: 14, color: '#333' }}>
                ₹{sensor ? (sensor.price * parseInt(formData.duration) / 7).toFixed(0) : 0}
              </Text>
            </View>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <Text style={{ fontSize: 14, color: '#666' }}>Delivery Charges</Text>
              <Text style={{ fontSize: 14, color: '#333' }}>₹50</Text>
            </View>
            <View style={{
              borderTopWidth: 1,
              borderTopColor: '#E0E0E0',
              paddingTop: 8,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E7D32' }}>
                Total Amount
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#2E7D32' }}>
                ₹{sensor ? (sensor.price * parseInt(formData.duration) / 7 + 50).toFixed(0) : 0}
              </Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleConfirm}
            style={{
              backgroundColor: '#2E7D32',
              borderRadius: 12,
              padding: 16,
              alignItems: 'center',
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 18,
              fontWeight: 'bold',
            }}>
              Confirm Rental
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
};

export default function IoTRentalScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showRentalModal, setShowRentalModal] = useState(false);

  const sensors = [
    {
      id: 1,
      name: 'Soil Moisture Sensor',
      description: 'Monitor soil moisture levels in real-time',
      price: 200,
      period: 'week',
      available: true,
      color: '#2196F3',
      icon: Droplets,
      specs: [
        'Wireless connectivity (LoRaWAN)',
        'Battery life: 6 months',
        'Measurement range: 0-100%',
        'Accuracy: ±3%',
        'Waterproof IP67 rating'
      ]
    },
    {
      id: 2,
      name: 'Temperature & Humidity Sensor',
      description: 'Track ambient temperature and humidity',
      price: 150,
      period: 'week',
      available: true,
      color: '#FF9800',
      icon: Thermometer,
      specs: [
        'Temperature range: -40°C to 80°C',
        'Humidity range: 0-100% RH',
        'Accuracy: ±0.5°C, ±2% RH',
        'Solar powered with backup battery',
        'Data logging every 15 minutes'
      ]
    },
    {
      id: 3,
      name: 'NPK Soil Sensor',
      description: 'Measure nitrogen, phosphorus, and potassium levels',
      price: 350,
      period: 'week',
      available: false,
      color: '#4CAF50',
      icon: Zap,
      specs: [
        'Measures N, P, K levels',
        'pH measurement included',
        'Professional grade accuracy',
        'Bluetooth connectivity',
        'Rechargeable battery'
      ]
    },
    {
      id: 4,
      name: 'Weather Station',
      description: 'Complete weather monitoring solution',
      price: 500,
      period: 'week',
      available: true,
      color: '#9C27B0',
      icon: Cpu,
      specs: [
        'Wind speed and direction',
        'Rainfall measurement',
        'UV index monitoring',
        'Barometric pressure',
        '4G connectivity'
      ]
    }
  ];

  const orderHistory = [
    {
      id: 'ORD001',
      sensorName: 'Soil Moisture Sensor',
      status: 'Active',
      startDate: '15 Sep 2024',
      endDate: '22 Sep 2024',
      amount: '250'
    },
    {
      id: 'ORD002',
      sensorName: 'Temperature Sensor',
      status: 'Delivered',
      startDate: '01 Sep 2024',
      endDate: '08 Sep 2024',
      amount: '200'
    },
    {
      id: 'ORD003',
      sensorName: 'Weather Station',
      status: 'Pending',
      startDate: '20 Sep 2024',
      endDate: '27 Sep 2024',
      amount: '550'
    }
  ];

  const handleRentSensor = (sensor) => {
    setSelectedSensor(sensor);
    setShowRentalModal(true);
  };

  const handleConfirmRental = (formData) => {
    setShowRentalModal(false);
    Alert.alert(
      'Rental Confirmed!',
      `Your ${selectedSensor.name} rental has been confirmed. You will receive a confirmation SMS shortly.`,
      [{ text: 'OK', onPress: () => setSelectedSensor(null) }]
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
            IoT Sensor Rental
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Smart farming sensors for rent
          </Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}>
        <View style={{
          flexDirection: 'row',
          backgroundColor: '#F5F5F5',
          borderRadius: 8,
          padding: 4,
        }}>
          <TouchableOpacity
            onPress={() => setActiveTab('catalog')}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'catalog' ? 'white' : 'transparent',
              borderRadius: 6,
              paddingVertical: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: activeTab === 'catalog' ? '#2E7D32' : '#666',
            }}>
              Sensor Catalog
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('orders')}
            style={{
              flex: 1,
              backgroundColor: activeTab === 'orders' ? 'white' : 'transparent',
              borderRadius: 6,
              paddingVertical: 8,
              alignItems: 'center',
            }}
          >
            <Text style={{
              fontSize: 14,
              fontWeight: '600',
              color: activeTab === 'orders' ? '#2E7D32' : '#666',
            }}>
              My Orders
            </Text>
          </TouchableOpacity>
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
        {activeTab === 'catalog' ? (
          <>
            {/* Info Card */}
            <View style={{
              backgroundColor: '#E8F5E8',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              borderLeftWidth: 4,
              borderLeftColor: '#4CAF50',
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: 12,
              }}>
                📡 Why Rent IoT Sensors?
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#2E7D32',
                lineHeight: 20,
                marginBottom: 8,
              }}>
                • Get real-time data about your farm conditions
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#2E7D32',
                lineHeight: 20,
                marginBottom: 8,
              }}>
                • Make data-driven decisions for better yields
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#2E7D32',
                lineHeight: 20,
              }}>
                • No upfront investment - pay only for usage
              </Text>
            </View>

            {/* Sensor Cards */}
            {sensors.map((sensor) => (
              <SensorCard
                key={sensor.id}
                sensor={sensor}
                onRent={handleRentSensor}
              />
            ))}
          </>
        ) : (
          <>
            {/* Order History */}
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#2E7D32',
              marginBottom: 16,
            }}>
              Order History
            </Text>

            {orderHistory.map((order) => (
              <OrderHistoryCard key={order.id} order={order} />
            ))}

            {orderHistory.length === 0 && (
              <View style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 40,
                alignItems: 'center',
              }}>
                <Clock size={48} color="#E0E0E0" />
                <Text style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: '#666',
                  marginTop: 16,
                  marginBottom: 8,
                }}>
                  No Orders Yet
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#999',
                  textAlign: 'center',
                }}>
                  Start renting sensors to monitor your farm conditions
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Rental Modal */}
      <RentalModal
        visible={showRentalModal}
        sensor={selectedSensor}
        onClose={() => setShowRentalModal(false)}
        onConfirm={handleConfirmRental}
      />
    </View>
  );
}