import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  MapPin, 
  Droplets,
  Thermometer,
  Zap,
  Leaf,
  TrendingUp,
  Youtube
} from 'lucide-react-native';

const InputField = ({ label, value, onChangeText, placeholder, keyboardType = 'default', unit }) => (
  <View style={{ marginBottom: 20 }}>
    <Text style={{
      fontSize: 16,
      fontWeight: '600',
      color: '#2E7D32',
      marginBottom: 8,
    }}>
      {label}
    </Text>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'white',
      borderRadius: 12,
      borderWidth: 1,
      borderColor: '#E0E0E0',
      paddingHorizontal: 16,
    }}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        keyboardType={keyboardType}
        style={{
          flex: 1,
          fontSize: 16,
          paddingVertical: 16,
          color: '#333',
        }}
      />
      {unit && (
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginLeft: 8,
        }}>
          {unit}
        </Text>
      )}
    </View>
  </View>
);

const RecommendationCard = ({ crop, yield: cropYield, profit, sustainability, confidence, onLearnMore }) => (
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
    borderLeftColor: '#4CAF50',
  }}>
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {crop}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
        }}>
          Confidence: {confidence}%
        </Text>
      </View>
      <TouchableOpacity
        onPress={onLearnMore}
        style={{
          backgroundColor: '#F44336',
          borderRadius: 8,
          paddingHorizontal: 12,
          paddingVertical: 6,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Youtube size={16} color="white" />
        <Text style={{
          color: 'white',
          fontSize: 12,
          fontWeight: '600',
          marginLeft: 4,
        }}>
          Learn
        </Text>
      </TouchableOpacity>
    </View>

    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    }}>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#4CAF50',
        }}>
          {cropYield}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          textAlign: 'center',
        }}>
          Expected Yield{'\n'}(tons/hectare)
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#FF9800',
        }}>
          ₹{profit}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          textAlign: 'center',
        }}>
          Profit Margin{'\n'}(per hectare)
        </Text>
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: '#2196F3',
        }}>
          {sustainability}
        </Text>
        <Text style={{
          fontSize: 12,
          color: '#666',
          textAlign: 'center',
        }}>
          Sustainability{'\n'}Score
        </Text>
      </View>
    </View>

    <View style={{
      backgroundColor: '#F8F9FA',
      borderRadius: 8,
      padding: 12,
    }}>
      <Text style={{
        fontSize: 14,
        color: '#2E7D32',
        fontWeight: '600',
        marginBottom: 4,
      }}>
        Recommended Actions:
      </Text>
      <Text style={{
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
      }}>
        • Prepare soil with organic compost{'\n'}
        • Plant during optimal season{'\n'}
        • Monitor moisture levels regularly{'\n'}
        • Apply recommended fertilizers
      </Text>
    </View>
  </View>
);

export default function CropRecommendationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  // Form inputs
  const [location, setLocation] = useState('');
  const [soilPH, setSoilPH] = useState('');
  const [nitrogen, setNitrogen] = useState('');
  const [phosphorus, setPhosphorus] = useState('');
  const [potassium, setPotassium] = useState('');
  const [moisture, setMoisture] = useState('');
  const [area, setArea] = useState('');

  // Mock recommendations data
  const recommendations = [
    {
      crop: 'Rice (Basmati)',
      yield: '4.2',
      profit: '45,000',
      sustainability: '8.5',
      confidence: 92
    },
    {
      crop: 'Wheat',
      yield: '3.8',
      profit: '38,000',
      sustainability: '7.8',
      confidence: 87
    },
    {
      crop: 'Sugarcane',
      yield: '65',
      profit: '85,000',
      sustainability: '6.5',
      confidence: 78
    }
  ];

  const handleGetRecommendations = async () => {
    if (!location || !soilPH || !nitrogen || !phosphorus || !potassium || !moisture || !area) {
      Alert.alert('Missing Information', 'Please fill in all fields to get accurate recommendations.');
      return;
    }

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setShowResults(true);
    }, 2000);
  };

  const handleLearnMore = (crop) => {
    Alert.alert(
      'Learning Resources',
      `Opening YouTube tutorials for ${crop} farming...`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open YouTube', onPress: () => console.log('Open YouTube for', crop) }
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
            Crop Recommendation
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            AI-powered crop suggestions
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
        {!showResults ? (
          <>
            {/* Input Form */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 4,
            }}>
              <Text style={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#2E7D32',
                marginBottom: 16,
                textAlign: 'center',
              }}>
                Enter Your Farm Details
              </Text>

              <InputField
                label="Location (Village/City)"
                value={location}
                onChangeText={setLocation}
                placeholder="e.g., Pune, Maharashtra"
              />

              <InputField
                label="Soil pH Level"
                value={soilPH}
                onChangeText={setSoilPH}
                placeholder="6.5"
                keyboardType="numeric"
                unit="pH"
              />

              <InputField
                label="Nitrogen Content"
                value={nitrogen}
                onChangeText={setNitrogen}
                placeholder="40"
                keyboardType="numeric"
                unit="kg/ha"
              />

              <InputField
                label="Phosphorus Content"
                value={phosphorus}
                onChangeText={setPhosphorus}
                placeholder="60"
                keyboardType="numeric"
                unit="kg/ha"
              />

              <InputField
                label="Potassium Content"
                value={potassium}
                onChangeText={setPotassium}
                placeholder="20"
                keyboardType="numeric"
                unit="kg/ha"
              />

              <InputField
                label="Soil Moisture"
                value={moisture}
                onChangeText={setMoisture}
                placeholder="25"
                keyboardType="numeric"
                unit="%"
              />

              <InputField
                label="Farm Area"
                value={area}
                onChangeText={setArea}
                placeholder="2.5"
                keyboardType="numeric"
                unit="hectares"
              />
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={handleGetRecommendations}
              disabled={isLoading}
              style={{
                backgroundColor: isLoading ? '#E0E0E0' : '#2E7D32',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                  Get AI Recommendations
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => Alert.alert('Auto-Fill', 'This would fetch soil data from Soil Grids API based on your location.')}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#2E7D32',
              }}
            >
              <Text style={{
                color: '#2E7D32',
                fontSize: 16,
                fontWeight: '600',
              }}>
                Auto-Fill from Location Data
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Results */}
            <View style={{
              backgroundColor: '#2E7D32',
              borderRadius: 16,
              padding: 20,
              marginBottom: 20,
              alignItems: 'center',
            }}>
              <Text style={{
                color: 'white',
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 8,
              }}>
                🎯 Recommendations Ready!
              </Text>
              <Text style={{
                color: 'rgba(255,255,255,0.9)',
                fontSize: 14,
                textAlign: 'center',
              }}>
                Based on your soil conditions and climate data
              </Text>
            </View>

            {recommendations.map((rec, index) => (
              <RecommendationCard
                key={index}
                crop={rec.crop}
                yield={rec.yield}
                profit={rec.profit}
                sustainability={rec.sustainability}
                confidence={rec.confidence}
                onLearnMore={() => handleLearnMore(rec.crop)}
              />
            ))}

            <TouchableOpacity
              onPress={() => setShowResults(false)}
              style={{
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#2E7D32',
                marginTop: 20,
              }}
            >
              <Text style={{
                color: '#2E7D32',
                fontSize: 16,
                fontWeight: '600',
              }}>
                Try Different Parameters
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
}