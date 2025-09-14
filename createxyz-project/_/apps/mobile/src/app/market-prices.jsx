import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  RefreshControl 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  TrendingUp, 
  TrendingDown,
  Minus,
  MapPin,
  Calendar,
  RefreshCw,
  Search
} from 'lucide-react-native';

const PriceCard = ({ crop, onPress }) => {
  const getTrendIcon = (trend) => {
    if (trend > 0) return <TrendingUp size={16} color="#4CAF50" />;
    if (trend < 0) return <TrendingDown size={16} color="#F44336" />;
    return <Minus size={16} color="#666" />;
  };

  const getTrendColor = (trend) => {
    if (trend > 0) return '#4CAF50';
    if (trend < 0) return '#F44336';
    return '#666';
  };

  return (
    <TouchableOpacity
      onPress={() => onPress(crop)}
      style={{
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
      }}
    >
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
            {crop.name}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            {crop.variety}
          </Text>
        </View>
        <View style={{
          backgroundColor: '#F8F9FA',
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            fontWeight: '600',
          }}>
            {crop.unit}
          </Text>
        </View>
      </View>

      {/* Price Info */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
      }}>
        <View>
          <Text style={{
            fontSize: 28,
            fontWeight: 'bold',
            color: '#2E7D32',
          }}>
            ₹{crop.currentPrice}
          </Text>
          <Text style={{
            fontSize: 12,
            color: '#666',
          }}>
            Current Price
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: getTrendColor(crop.trend) + '20',
          borderRadius: 8,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
          {getTrendIcon(crop.trend)}
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: getTrendColor(crop.trend),
            marginLeft: 4,
          }}>
            {crop.trend > 0 ? '+' : ''}{crop.trend}%
          </Text>
        </View>
      </View>

      {/* Market Info */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F8F9FA',
        borderRadius: 8,
        padding: 12,
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            marginBottom: 2,
          }}>
            Min Price
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
          }}>
            ₹{crop.minPrice}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            marginBottom: 2,
          }}>
            Max Price
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
          }}>
            ₹{crop.maxPrice}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={{
            fontSize: 12,
            color: '#666',
            marginBottom: 2,
          }}>
            Market
          </Text>
          <Text style={{
            fontSize: 14,
            fontWeight: '600',
            color: '#333',
          }}>
            {crop.market}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PriceDetailModal = ({ visible, crop, onClose }) => {
  if (!visible || !crop) return null;

  const mockPriceHistory = [
    { date: '14 Sep', price: crop.currentPrice },
    { date: '13 Sep', price: crop.currentPrice - 5 },
    { date: '12 Sep', price: crop.currentPrice - 8 },
    { date: '11 Sep', price: crop.currentPrice - 3 },
    { date: '10 Sep', price: crop.currentPrice - 12 },
    { date: '09 Sep', price: crop.currentPrice - 15 },
    { date: '08 Sep', price: crop.currentPrice - 10 },
  ];

  return (
    <View style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
    }}>
      <View style={{
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        maxHeight: '80%',
      }}>
        {/* Header */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2E7D32',
          }}>
            {crop.name} - {crop.variety}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={{
              fontSize: 16,
              color: '#666',
            }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Current Price */}
          <View style={{
            backgroundColor: '#E8F5E8',
            borderRadius: 12,
            padding: 16,
            marginBottom: 20,
          }}>
            <Text style={{
              fontSize: 32,
              fontWeight: 'bold',
              color: '#2E7D32',
              textAlign: 'center',
              marginBottom: 8,
            }}>
              ₹{crop.currentPrice}
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
            }}>
              per {crop.unit} • {crop.market} Market
            </Text>
          </View>

          {/* Price History */}
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2E7D32',
            marginBottom: 16,
          }}>
            7-Day Price Trend
          </Text>

          {mockPriceHistory.map((item, index) => (
            <View key={index} style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingVertical: 12,
              borderBottomWidth: index < mockPriceHistory.length - 1 ? 1 : 0,
              borderBottomColor: '#F0F0F0',
            }}>
              <Text style={{
                fontSize: 14,
                color: '#666',
              }}>
                {item.date}
              </Text>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#333',
              }}>
                ₹{item.price}
              </Text>
            </View>
          ))}

          {/* Market Analysis */}
          <View style={{
            backgroundColor: '#FFF3E0',
            borderRadius: 12,
            padding: 16,
            marginTop: 20,
          }}>
            <Text style={{
              fontSize: 16,
              fontWeight: 'bold',
              color: '#E65100',
              marginBottom: 8,
            }}>
              Market Analysis
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#E65100',
              lineHeight: 20,
            }}>
              Prices are trending upward due to increased demand and reduced supply from recent weather conditions. Consider selling if you have stock ready.
            </Text>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default function MarketPricesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Mock market data
  const marketPrices = [
    {
      id: 1,
      name: 'Rice',
      variety: 'Basmati',
      currentPrice: 2850,
      minPrice: 2800,
      maxPrice: 2900,
      trend: 2.5,
      unit: 'quintal',
      market: 'Pune'
    },
    {
      id: 2,
      name: 'Wheat',
      variety: 'Durum',
      currentPrice: 2200,
      minPrice: 2150,
      maxPrice: 2250,
      trend: -1.2,
      unit: 'quintal',
      market: 'Mumbai'
    },
    {
      id: 3,
      name: 'Sugarcane',
      variety: 'Co-86032',
      currentPrice: 350,
      minPrice: 340,
      maxPrice: 360,
      trend: 0,
      unit: 'quintal',
      market: 'Kolhapur'
    },
    {
      id: 4,
      name: 'Cotton',
      variety: 'Bt Cotton',
      currentPrice: 6200,
      minPrice: 6100,
      maxPrice: 6300,
      trend: 3.8,
      unit: 'quintal',
      market: 'Nagpur'
    },
    {
      id: 5,
      name: 'Onion',
      variety: 'Red Onion',
      currentPrice: 1800,
      minPrice: 1750,
      maxPrice: 1850,
      trend: -2.1,
      unit: 'quintal',
      market: 'Nashik'
    },
    {
      id: 6,
      name: 'Tomato',
      variety: 'Hybrid',
      currentPrice: 2500,
      minPrice: 2400,
      maxPrice: 2600,
      trend: 5.2,
      unit: 'quintal',
      market: 'Pune'
    }
  ];

  const fetchMarketData = async () => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setRefreshing(false);
    }, 1000);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMarketData();
  };

  const handleCropPress = (crop) => {
    setSelectedCrop(crop);
    setShowDetailModal(true);
  };

  useEffect(() => {
    fetchMarketData();
  }, []);

  if (isLoading) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F9FA',
      }}>
        <ActivityIndicator size="large" color="#2E7D32" />
        <Text style={{
          fontSize: 16,
          color: '#666',
          marginTop: 16,
        }}>
          Loading market prices...
        </Text>
      </View>
    );
  }

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
            Market Prices
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Live crop prices and trends
          </Text>
        </View>
        <TouchableOpacity
          onPress={onRefresh}
          style={{
            backgroundColor: '#F5F5F5',
            borderRadius: 12,
            padding: 8,
          }}
        >
          <RefreshCw size={20} color="#666" />
        </TouchableOpacity>
      </View>

      {/* Market Summary */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 12,
        }}>
          <MapPin size={16} color="#666" />
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginLeft: 8,
          }}>
            Maharashtra Markets
          </Text>
          <Calendar size={16} color="#666" style={{ marginLeft: 16 }} />
          <Text style={{
            fontSize: 14,
            color: '#666',
            marginLeft: 8,
          }}>
            {new Date().toLocaleDateString()}
          </Text>
        </View>
        
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#4CAF50',
            }}>
              3
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Rising
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#F44336',
            }}>
              2
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Falling
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#666',
            }}>
              1
            </Text>
            <Text style={{
              fontSize: 12,
              color: '#666',
            }}>
              Stable
            </Text>
          </View>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#2E7D32']}
            tintColor="#2E7D32"
          />
        }
      >
        {/* Market Alert */}
        <View style={{
          backgroundColor: '#E3F2FD',
          borderRadius: 16,
          padding: 20,
          marginBottom: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#2196F3',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#1976D2',
            marginBottom: 12,
          }}>
            📈 Market Alert
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#1976D2',
            lineHeight: 20,
          }}>
            Cotton and Tomato prices are showing strong upward trends. Consider selling if you have ready stock. Rice prices remain stable with good demand.
          </Text>
        </View>

        {/* Price Cards */}
        {marketPrices.map((crop) => (
          <PriceCard
            key={crop.id}
            crop={crop}
            onPress={handleCropPress}
          />
        ))}

        {/* Footer Info */}
        <View style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 20,
          marginTop: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#2E7D32',
            marginBottom: 12,
          }}>
            📊 About Market Prices
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 8,
          }}>
            • Prices are updated every hour from major agricultural markets
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 8,
          }}>
            • Trends show percentage change from previous day
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
          }}>
            • Tap on any crop to see detailed price history and analysis
          </Text>
        </View>
      </ScrollView>

      {/* Price Detail Modal */}
      {showDetailModal && (
        <PriceDetailModal
          visible={showDetailModal}
          crop={selectedCrop}
          onClose={() => setShowDetailModal(false)}
        />
      )}
    </View>
  );
}