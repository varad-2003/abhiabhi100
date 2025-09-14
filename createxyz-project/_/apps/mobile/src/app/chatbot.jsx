import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Send, 
  Mic, 
  MicOff,
  Sprout,
  Camera,
  Cloud,
  TrendingUp
} from 'lucide-react-native';

const QuickReplyButton = ({ text, onPress, icon: Icon }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: '#E8F5E8',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
      flexDirection: 'row',
      alignItems: 'center',
    }}
  >
    {Icon && <Icon size={16} color="#2E7D32" style={{ marginRight: 6 }} />}
    <Text style={{
      color: '#2E7D32',
      fontSize: 14,
      fontWeight: '500',
    }}>
      {text}
    </Text>
  </TouchableOpacity>
);

const MessageBubble = ({ message, isUser, timestamp }) => (
  <View style={{
    alignSelf: isUser ? 'flex-end' : 'flex-start',
    backgroundColor: isUser ? '#2E7D32' : 'white',
    borderRadius: 16,
    padding: 12,
    marginVertical: 4,
    marginHorizontal: 16,
    maxWidth: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  }}>
    <Text style={{
      color: isUser ? 'white' : '#333',
      fontSize: 16,
      lineHeight: 22,
    }}>
      {message}
    </Text>
    <Text style={{
      color: isUser ? 'rgba(255,255,255,0.7)' : '#999',
      fontSize: 12,
      marginTop: 4,
      alignSelf: 'flex-end',
    }}>
      {timestamp}
    </Text>
  </View>
);

export default function ChatbotScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const scrollViewRef = useRef();
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm KisanMitra, your farming assistant. How can I help you today?",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickReplies = [
    { text: 'Recommend crops', icon: Sprout, action: 'crop_recommendation' },
    { text: 'Detect disease', icon: Camera, action: 'disease_detection' },
    { text: 'Weather forecast', icon: Cloud, action: 'weather' },
    { text: 'Market prices', icon: TrendingUp, action: 'market_prices' },
  ];

  const sendMessage = async (text = message, action = null) => {
    if (!text.trim() && !action) return;

    const userMessage = {
      id: Date.now(),
      text: text || `Action: ${action}`,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      let botResponse = '';
      
      if (action) {
        switch (action) {
          case 'crop_recommendation':
            botResponse = "I'll help you with crop recommendations! Please tell me about your soil type, location, and current season. Or you can use our Crop Recommendation tool for detailed analysis.";
            break;
          case 'disease_detection':
            botResponse = "To detect crop diseases, you can take a photo of the affected plant using our Disease Detection feature. I can guide you through the process!";
            break;
          case 'weather':
            botResponse = "I can provide weather forecasts for your area. What's your location? You can also check our Weather section for detailed 7-day forecasts.";
            break;
          case 'market_prices':
            botResponse = "I can help you check current market prices for various crops. Which crops are you interested in? You can also visit our Market Prices section for live updates.";
            break;
          default:
            botResponse = "I understand you need help. Could you please be more specific about what you'd like to know?";
        }
      } else {
        // Simple keyword-based responses for demo
        const lowerText = text.toLowerCase();
        if (lowerText.includes('crop') || lowerText.includes('recommend')) {
          botResponse = "For crop recommendations, I need to know your soil type, climate, and farming area. Would you like me to guide you through our Crop Recommendation tool?";
        } else if (lowerText.includes('disease') || lowerText.includes('pest')) {
          botResponse = "For disease detection, you can take a clear photo of the affected plant. Our AI can identify common diseases and suggest treatments. Would you like to try it?";
        } else if (lowerText.includes('weather')) {
          botResponse = "I can provide weather information for your location. Please share your city or village name, and I'll get the latest forecast for you.";
        } else if (lowerText.includes('price') || lowerText.includes('market')) {
          botResponse = "I can help you check current market prices. Which crops are you planning to sell? I can also show you price trends.";
        } else {
          botResponse = "I'm here to help with farming questions! You can ask me about crop recommendations, disease detection, weather, market prices, or IoT sensors. What would you like to know?";
        }
      }

      const botMessage = {
        id: Date.now() + 1,
        text: botResponse,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleVoiceInput = () => {
    if (isRecording) {
      setIsRecording(false);
      // In a real app, this would stop recording and process speech-to-text
      Alert.alert('Voice Input', 'Voice recording stopped. Speech-to-text would be processed here.');
    } else {
      setIsRecording(true);
      // In a real app, this would start recording
      Alert.alert('Voice Input', 'Voice recording started. Speak your question now.');
      // Auto-stop after 5 seconds for demo
      setTimeout(() => {
        setIsRecording(false);
      }, 5000);
    }
  };

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  return (
    <KeyboardAvoidingView 
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
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
              KisanMitra Assistant
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
            }}>
              Online • Ready to help
            </Text>
          </View>
        </View>

        {/* Messages */}
        <ScrollView
          ref={scrollViewRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingVertical: 16,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg.text}
              isUser={msg.isUser}
              timestamp={msg.timestamp}
            />
          ))}
          
          {isLoading && (
            <View style={{
              alignSelf: 'flex-start',
              backgroundColor: 'white',
              borderRadius: 16,
              padding: 12,
              marginVertical: 4,
              marginHorizontal: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.1,
              shadowRadius: 2,
              elevation: 2,
            }}>
              <Text style={{ color: '#999', fontStyle: 'italic' }}>
                KisanMitra is typing...
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Quick Replies */}
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
        }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {quickReplies.map((reply, index) => (
              <QuickReplyButton
                key={index}
                text={reply.text}
                icon={reply.icon}
                onPress={() => sendMessage('', reply.action)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: insets.bottom + 12,
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}>
          <View style={{
            flex: 1,
            backgroundColor: '#F5F5F5',
            borderRadius: 24,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginRight: 12,
            maxHeight: 100,
          }}>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Ask me anything about farming..."
              placeholderTextColor="#999"
              multiline
              style={{
                fontSize: 16,
                color: '#333',
                minHeight: 24,
              }}
            />
          </View>
          
          <TouchableOpacity
            onPress={handleVoiceInput}
            style={{
              backgroundColor: isRecording ? '#F44336' : '#E0E0E0',
              borderRadius: 24,
              padding: 12,
              marginRight: 8,
            }}
          >
            {isRecording ? (
              <MicOff size={24} color="white" />
            ) : (
              <Mic size={24} color="#666" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => sendMessage()}
            disabled={!message.trim()}
            style={{
              backgroundColor: message.trim() ? '#2E7D32' : '#E0E0E0',
              borderRadius: 24,
              padding: 12,
            }}
          >
            <Send size={24} color={message.trim() ? 'white' : '#999'} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}