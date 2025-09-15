import React, { useEffect, useState } from 'react';
import { View, Text, Image, Animated } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function SplashScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate to signup after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/signup');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={{
      flex: 1,
      backgroundColor: '#2D5016',
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: insets.top,
    }}>
      <StatusBar style="light" />
      
      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
        alignItems: 'center',
      }}>
        {/* Logo placeholder - will be replaced with actual logo */}
        <View style={{
          width: 120,
          height: 120,
          backgroundColor: '#4CAF50',
          borderRadius: 60,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Text style={{
            fontSize: 48,
            color: 'white',
            fontWeight: 'bold',
          }}>🌾</Text>
        </View>

        <Text style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 8,
          textAlign: 'center',
        }}>
          KisanMitra
        </Text>
        
        <Text style={{
          fontSize: 16,
          color: '#A5D6A7',
          textAlign: 'center',
          paddingHorizontal: 40,
        }}>
          Your Smart Farming Companion
        </Text>
      </Animated.View>

      <Animated.View style={{
        position: 'absolute',
        bottom: insets.bottom + 40,
        opacity: fadeAnim,
      }}>
        <Text style={{
          color: '#A5D6A7',
          fontSize: 14,
          textAlign: 'center',
        }}>
          Empowering Indian Farmers
        </Text>
      </Animated.View>
    </View>
  );
}