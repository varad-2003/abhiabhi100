import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  TextInput 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  ArrowLeft, 
  Search, 
  Play,
  Clock,
  Eye,
  ThumbsUp,
  BookOpen,
  Filter
} from 'lucide-react-native';

const VideoCard = ({ video, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(video)}
    style={{
      backgroundColor: 'white',
      borderRadius: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
      overflow: 'hidden',
    }}
  >
    {/* Thumbnail */}
    <View style={{ position: 'relative' }}>
      <Image
        source={{ uri: video.thumbnail }}
        style={{
          width: '100%',
          height: 200,
          backgroundColor: '#E0E0E0',
        }}
        contentFit="cover"
      />
      <View style={{
        position: 'absolute',
        bottom: 8,
        right: 8,
        backgroundColor: 'rgba(0,0,0,0.8)',
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}>
        <Text style={{
          color: 'white',
          fontSize: 12,
          fontWeight: '600',
        }}>
          {video.duration}
        </Text>
      </View>
      <View style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -20 }, { translateY: -20 }],
        backgroundColor: 'rgba(0,0,0,0.7)',
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <Play size={20} color="white" />
      </View>
    </View>

    {/* Content */}
    <View style={{ padding: 16 }}>
      <Text style={{
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 8,
        lineHeight: 22,
      }}>
        {video.title}
      </Text>
      
      <Text style={{
        fontSize: 14,
        color: '#666',
        marginBottom: 12,
        lineHeight: 20,
      }}>
        {video.description}
      </Text>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
      }}>
        <Text style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#333',
        }}>
          {video.channel}
        </Text>
        <View style={{
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: '#666',
          marginHorizontal: 8,
        }} />
        <Text style={{
          fontSize: 12,
          color: '#666',
        }}>
          {video.publishedAt}
        </Text>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <Eye size={14} color="#666" />
          <Text style={{
            fontSize: 12,
            color: '#666',
            marginLeft: 4,
            marginRight: 16,
          }}>
            {video.views}
          </Text>
          <ThumbsUp size={14} color="#666" />
          <Text style={{
            fontSize: 12,
            color: '#666',
            marginLeft: 4,
          }}>
            {video.likes}
          </Text>
        </View>
        
        <View style={{
          backgroundColor: video.category === 'Beginner' ? '#E8F5E8' : 
                          video.category === 'Advanced' ? '#FFF3E0' : '#E3F2FD',
          borderRadius: 12,
          paddingHorizontal: 8,
          paddingVertical: 4,
        }}>
          <Text style={{
            fontSize: 10,
            fontWeight: '600',
            color: video.category === 'Beginner' ? '#4CAF50' : 
                   video.category === 'Advanced' ? '#FF9800' : '#2196F3',
          }}>
            {video.category}
          </Text>
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const CategoryChip = ({ category, isSelected, onPress }) => (
  <TouchableOpacity
    onPress={() => onPress(category)}
    style={{
      backgroundColor: isSelected ? '#2E7D32' : 'white',
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 8,
      marginRight: 8,
      borderWidth: 1,
      borderColor: isSelected ? '#2E7D32' : '#E0E0E0',
    }}
  >
    <Text style={{
      fontSize: 14,
      fontWeight: '600',
      color: isSelected ? 'white' : '#666',
    }}>
      {category}
    </Text>
  </TouchableOpacity>
);

export default function LearningScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Crop Management', 'Disease Control', 'Irrigation', 'Harvesting', 'Marketing'];

  // Mock video data
  const videos = [
    {
      id: 1,
      title: 'Modern Rice Farming Techniques for Higher Yield',
      description: 'Learn advanced rice cultivation methods that can increase your yield by 30%. Covers seed selection, planting, and water management.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '15:42',
      channel: 'AgriTech India',
      publishedAt: '2 days ago',
      views: '45K',
      likes: '2.1K',
      category: 'Crop Management'
    },
    {
      id: 2,
      title: 'Organic Pest Control Methods for Vegetables',
      description: 'Natural and eco-friendly ways to protect your vegetable crops from pests without using harmful chemicals.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '12:18',
      channel: 'Organic Farming Hub',
      publishedAt: '5 days ago',
      views: '32K',
      likes: '1.8K',
      category: 'Disease Control'
    },
    {
      id: 3,
      title: 'Drip Irrigation Setup Guide for Small Farms',
      description: 'Step-by-step guide to install and maintain drip irrigation system for efficient water usage in small-scale farming.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '20:35',
      channel: 'Smart Farming Solutions',
      publishedAt: '1 week ago',
      views: '67K',
      likes: '3.2K',
      category: 'Irrigation'
    },
    {
      id: 4,
      title: 'Soil Testing and Nutrient Management',
      description: 'Understanding soil health through testing and how to manage nutrients for optimal crop growth.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '18:24',
      channel: 'Soil Science Academy',
      publishedAt: '3 days ago',
      views: '28K',
      likes: '1.5K',
      category: 'Crop Management'
    },
    {
      id: 5,
      title: 'Post-Harvest Storage Techniques',
      description: 'Proper storage methods to reduce post-harvest losses and maintain crop quality for better market prices.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '14:56',
      channel: 'Harvest Management',
      publishedAt: '6 days ago',
      views: '19K',
      likes: '890',
      category: 'Harvesting'
    },
    {
      id: 6,
      title: 'Digital Marketing for Farmers',
      description: 'How to use social media and online platforms to sell your produce directly to consumers and get better prices.',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
      duration: '22:13',
      channel: 'FarmBiz Digital',
      publishedAt: '4 days ago',
      views: '15K',
      likes: '756',
      category: 'Marketing'
    }
  ];

  const filteredVideos = videos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         video.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleVideoPress = (video) => {
  Alert.alert(
    'Open Video',
    `Would you like to watch "${video.title}"?`,
    [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Watch on YouTube', onPress: () => console.log('Opening YouTube:', video.id) }
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
            Learning Videos
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            Expert farming tutorials
          </Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={{
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: '#F5F5F5',
          borderRadius: 12,
          paddingHorizontal: 16,
        }}>
          <Search size={20} color="#666" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search farming videos..."
            placeholderTextColor="#999"
            style={{
              flex: 1,
              fontSize: 16,
              paddingVertical: 12,
              paddingLeft: 12,
              color: '#333',
            }}
          />
        </View>
      </View>

      {/* Categories */}
      <View style={{
        backgroundColor: 'white',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
      }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
          }}
        >
          {categories.map((category) => (
            <CategoryChip
              key={category}
              category={category}
              isSelected={selectedCategory === category}
              onPress={setSelectedCategory}
            />
          ))}
        </ScrollView>
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
        {/* Featured Section */}
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
            📚 Featured Learning Path
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#2E7D32',
            lineHeight: 20,
            marginBottom: 12,
          }}>
            Complete Crop Management Course - From seed to harvest, learn everything about modern farming techniques.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#2E7D32',
              borderRadius: 8,
              paddingHorizontal: 16,
              paddingVertical: 8,
              alignSelf: 'flex-start',
            }}
          >
            <Text style={{
              color: 'white',
              fontSize: 14,
              fontWeight: '600',
            }}>
              Start Learning
            </Text>
          </TouchableOpacity>
        </View>

        {/* Video Results */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}>
          <Text style={{
            fontSize: 20,
            fontWeight: 'bold',
            color: '#2E7D32',
          }}>
            {selectedCategory === 'All' ? 'All Videos' : selectedCategory}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            {filteredVideos.length} videos
          </Text>
        </View>

        {filteredVideos.length > 0 ? (
          filteredVideos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPress={handleVideoPress}
            />
          ))
        ) : (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 40,
            alignItems: 'center',
            marginTop: 40,
          }}>
            <BookOpen size={48} color="#E0E0E0" />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#666',
              marginTop: 16,
              marginBottom: 8,
            }}>
              No Videos Found
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#999',
              textAlign: 'center',
            }}>
              Try adjusting your search or category filter
            </Text>
          </View>
        )}

        {/* Learning Tips */}
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
            💡 Learning Tips
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 8,
          }}>
            • Watch videos during your free time to learn new techniques
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 8,
          }}>
            • Take notes and try implementing what you learn
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
            marginBottom: 8,
          }}>
            • Share knowledge with other farmers in your community
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
            lineHeight: 20,
          }}>
            • Subscribe to channels for regular updates on farming techniques
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}