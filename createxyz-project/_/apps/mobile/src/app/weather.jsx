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
import * as Location from 'expo-location';
import { 
  ArrowLeft, 
  MapPin, 
  Thermometer,
  Droplets,
  Wind,
  Eye,
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  Zap,
  RefreshCw
} from 'lucide-react-native';

const WeatherIcon = ({ condition, size = 24 }) => {
  const iconProps = { size, color: '#2E7D32' };
  
  switch (condition.toLowerCase()) {
    case 'sunny':
    case 'clear':
      return <Sun {...iconProps} color="#FF9800" />;
    case 'cloudy':
    case 'overcast':
      return <Cloud {...iconProps} color="#607D8B" />;
    case 'rainy':
    case 'rain':
      return <CloudRain {...iconProps} color="#2196F3" />;
    case 'thunderstorm':
      return <Zap {...iconProps} color="#9C27B0" />;
    case 'snow':
      return <CloudSnow {...iconProps} color="#607D8B" />;
    default:
      return <Sun {...iconProps} />;
  }
};

const CurrentWeatherCard = ({ weather, location }) => (
  <View style={{
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  }}>
    {/* Location */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    }}>
      <MapPin size={20} color="#666" />
      <Text style={{
        fontSize: 16,
        color: '#666',
        marginLeft: 8,
      }}>
        {location}
      </Text>
    </View>

    {/* Main Weather */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 24,
    }}>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 48,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {weather.temperature}°C
        </Text>
        <Text style={{
          fontSize: 18,
          color: '#666',
          marginBottom: 4,
        }}>
          {weather.condition}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#999',
        }}>
          Feels like {weather.feelsLike}°C
        </Text>
      </View>
      <WeatherIcon condition={weather.condition} size={64} />
    </View>

    {/* Weather Details */}
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
    }}>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Droplets size={20} color="#2196F3" />
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginTop: 4,
        }}>
          Humidity
        </Text>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
        }}>
          {weather.humidity}%
        </Text>
      </View>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Wind size={20} color="#607D8B" />
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginTop: 4,
        }}>
          Wind Speed
        </Text>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
        }}>
          {weather.windSpeed} km/h
        </Text>
      </View>
      <View style={{ alignItems: 'center', flex: 1 }}>
        <Eye size={20} color="#9C27B0" />
        <Text style={{
          fontSize: 14,
          color: '#666',
          marginTop: 4,
        }}>
          Visibility
        </Text>
        <Text style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: '#333',
        }}>
          {weather.visibility} km
        </Text>
      </View>
    </View>
  </View>
);

const ForecastCard = ({ day, weather }) => (
  <View style={{
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 120,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  }}>
    <Text style={{
      fontSize: 14,
      fontWeight: '600',
      color: '#2E7D32',
      marginBottom: 8,
    }}>
      {day}
    </Text>
    <WeatherIcon condition={weather.condition} size={32} />
    <Text style={{
      fontSize: 12,
      color: '#666',
      marginTop: 8,
      marginBottom: 4,
    }}>
      {weather.condition}
    </Text>
    <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      color: '#333',
    }}>
      {weather.high}°/{weather.low}°
    </Text>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    }}>
      <Droplets size={12} color="#2196F3" />
      <Text style={{
        fontSize: 12,
        color: '#666',
        marginLeft: 4,
      }}>
        {weather.rainChance}%
      </Text>
    </View>
  </View>
);

const FarmingAdviceCard = ({ advice }) => (
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
      🌾 Farming Advice
    </Text>
    {advice.map((item, index) => (
      <Text key={index} style={{
        fontSize: 14,
        color: '#2E7D32',
        lineHeight: 20,
        marginBottom: 8,
      }}>
        • {item}
      </Text>
    ))}
  </View>
);

export default function WeatherScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState('Fetching location...');
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [farmingAdvice, setFarmingAdvice] = useState([]);

  // Mock weather data
  const mockCurrentWeather = {
    temperature: 28,
    condition: 'Partly Cloudy',
    feelsLike: 32,
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
  };

  const mockForecast = [
    { day: 'Today', condition: 'Sunny', high: 30, low: 22, rainChance: 10 },
    { day: 'Tomorrow', condition: 'Cloudy', high: 28, low: 20, rainChance: 30 },
    { day: 'Wed', condition: 'Rainy', high: 25, low: 18, rainChance: 80 },
    { day: 'Thu', condition: 'Thunderstorm', high: 24, low: 17, rainChance: 90 },
    { day: 'Fri', condition: 'Sunny', high: 29, low: 21, rainChance: 5 },
    { day: 'Sat', condition: 'Cloudy', high: 27, low: 19, rainChance: 40 },
    { day: 'Sun', condition: 'Sunny', high: 31, low: 23, rainChance: 15 },
  ];

  const mockFarmingAdvice = [
    'Good weather for irrigation today - soil moisture will be optimal',
    'Rain expected Wednesday - delay fertilizer application',
    'High humidity levels - monitor crops for fungal diseases',
    'Strong winds forecasted - secure young plants and seedlings',
  ];

  const fetchWeatherData = async () => {
    try {
      // Get location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocation('Location access denied');
        return;
      }

      // Get current location
      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;

      // Reverse geocode to get city name
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const { city, region } = reverseGeocode[0];
        setLocation(`${city}, ${region}`);
      }

      // In a real app, you would call OpenWeather API here
      // For demo, we'll use mock data
      setCurrentWeather(mockCurrentWeather);
      setForecast(mockForecast);
      setFarmingAdvice(mockFarmingAdvice);

    } catch (error) {
      console.error('Error fetching weather:', error);
      setLocation('Pune, Maharashtra'); // Fallback location
      setCurrentWeather(mockCurrentWeather);
      setForecast(mockForecast);
      setFarmingAdvice(mockFarmingAdvice);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeatherData();
  };

  useEffect(() => {
    fetchWeatherData();
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
          Loading weather data...
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
            Weather Forecast
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            7-day weather predictions
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
        {/* Current Weather */}
        {currentWeather && (
          <CurrentWeatherCard
            weather={currentWeather}
            location={location}
          />
        )}

        {/* Farming Advice */}
        <FarmingAdviceCard advice={farmingAdvice} />

        {/* 7-Day Forecast */}
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 16,
        }}>
          7-Day Forecast
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingRight: 20,
          }}
          style={{ marginBottom: 20 }}
        >
          {forecast.map((item, index) => (
            <ForecastCard
              key={index}
              day={item.day}
              weather={item}
            />
          ))}
        </ScrollView>

        {/* Weather Alerts */}
        <View style={{
          backgroundColor: '#FFF3E0',
          borderRadius: 16,
          padding: 20,
          borderLeftWidth: 4,
          borderLeftColor: '#FF9800',
        }}>
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#E65100',
            marginBottom: 12,
          }}>
            ⚠️ Weather Alerts
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#E65100',
            lineHeight: 20,
          }}>
            Heavy rainfall expected on Wednesday and Thursday. Consider postponing outdoor farming activities and ensure proper drainage in your fields.
          </Text>
        </View>

        {/* Additional Info */}
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
            fontSize: 18,
            fontWeight: 'bold',
            color: '#2E7D32',
            marginBottom: 16,
          }}>
            Weather Details
          </Text>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Sunrise</Text>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>6:24 AM</Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Sunset</Text>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>6:45 PM</Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <Text style={{ fontSize: 14, color: '#666' }}>UV Index</Text>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>7 (High)</Text>
          </View>

          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
            <Text style={{ fontSize: 14, color: '#666' }}>Air Pressure</Text>
            <Text style={{ fontSize: 14, color: '#333', fontWeight: '600' }}>1013 hPa</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}