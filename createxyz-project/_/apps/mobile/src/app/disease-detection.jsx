import React, { useState, useRef } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Alert,
  ActivityIndicator,
  Modal 
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { 
  ArrowLeft, 
  Camera, 
  Image as ImageIcon, 
  X,
  AlertTriangle,
  CheckCircle,
  Leaf,
  Droplets,
  Shield
} from 'lucide-react-native';

const TreatmentStep = ({ step, description, isOrganic = false }) => (
  <View style={{
    backgroundColor: isOrganic ? '#E8F5E8' : '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: isOrganic ? '#4CAF50' : '#FF9800',
  }}>
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    }}>
      <View style={{
        backgroundColor: isOrganic ? '#4CAF50' : '#FF9800',
        borderRadius: 12,
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
      }}>
        <Text style={{
          color: 'white',
          fontSize: 12,
          fontWeight: 'bold',
        }}>
          {step}
        </Text>
      </View>
      <Text style={{
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        flex: 1,
      }}>
        {isOrganic ? 'Organic Treatment' : 'Chemical Treatment'}
      </Text>
    </View>
    <Text style={{
      fontSize: 14,
      color: '#666',
      lineHeight: 20,
      marginLeft: 36,
    }}>
      {description}
    </Text>
  </View>
);

const ResultCard = ({ disease, severity, confidence, treatments, onRetry }) => (
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
    {/* Disease Info */}
    <View style={{
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
    }}>
      <View style={{
        backgroundColor: severity === 'High' ? '#FFEBEE' : severity === 'Medium' ? '#FFF3E0' : '#E8F5E8',
        borderRadius: 12,
        padding: 12,
        marginRight: 16,
      }}>
        <AlertTriangle 
          size={24} 
          color={severity === 'High' ? '#F44336' : severity === 'Medium' ? '#FF9800' : '#4CAF50'} 
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: '#2E7D32',
          marginBottom: 4,
        }}>
          {disease}
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
        }}>
          Severity: {severity} • Confidence: {confidence}%
        </Text>
      </View>
    </View>

    {/* Severity Indicator */}
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
        Disease Assessment:
      </Text>
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
      }}>
        <View style={{
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: severity === 'High' ? '#F44336' : severity === 'Medium' ? '#FF9800' : '#4CAF50',
          marginRight: 8,
        }} />
        <Text style={{
          fontSize: 14,
          color: '#666',
        }}>
          {severity === 'High' ? 'Immediate action required' : 
           severity === 'Medium' ? 'Treatment recommended within 3-5 days' : 
           'Monitor and apply preventive measures'}
        </Text>
      </View>
    </View>

    {/* Treatment Steps */}
    <Text style={{
      fontSize: 16,
      fontWeight: 'bold',
      color: '#2E7D32',
      marginBottom: 12,
    }}>
      Recommended Treatment:
    </Text>

    {treatments.map((treatment, index) => (
      <TreatmentStep
        key={index}
        step={index + 1}
        description={treatment.description}
        isOrganic={treatment.isOrganic}
      />
    ))}

    <TouchableOpacity
      onPress={onRetry}
      style={{
        backgroundColor: '#2E7D32',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        marginTop: 16,
      }}
    >
      <Text style={{
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
      }}>
        Scan Another Plant
      </Text>
    </TouchableOpacity>
  </View>
);

export default function DiseaseDetectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const cameraRef = useRef();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Mock analysis result
  const mockResult = {
    disease: 'Leaf Blight',
    severity: 'Medium',
    confidence: 87,
    treatments: [
      {
        description: 'Apply neem oil spray (10ml per liter of water) in early morning or evening. Repeat every 3-4 days.',
        isOrganic: true
      },
      {
        description: 'Remove affected leaves and burn them to prevent spread. Ensure proper air circulation.',
        isOrganic: true
      },
      {
        description: 'Apply copper-based fungicide (Copper Oxychloride 50% WP) at 2g per liter of water if organic treatment is insufficient.',
        isOrganic: false
      }
    ]
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
      });
      
      setSelectedImage(photo.uri);
      setShowCamera(false);
      analyzeImage(photo.uri);
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImage(result.assets[0].uri);
    }
  };

  const analyzeImage = async (imageUri) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // Simulate API call
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult(mockResult);
    }, 3000);
  };

  const resetAnalysis = () => {
    setSelectedImage(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  if (!permission) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#2E7D32" />
    </View>;
  }

  if (!permission.granted) {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#F8F9FA',
      }}>
        <Camera size={64} color="#2E7D32" />
        <Text style={{
          fontSize: 18,
          fontWeight: 'bold',
          color: '#2E7D32',
          textAlign: 'center',
          marginTop: 16,
          marginBottom: 8,
        }}>
          Camera Permission Required
        </Text>
        <Text style={{
          fontSize: 14,
          color: '#666',
          textAlign: 'center',
          marginBottom: 24,
        }}>
          We need camera access to help you detect crop diseases
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: '#2E7D32',
            borderRadius: 12,
            paddingHorizontal: 24,
            paddingVertical: 12,
          }}
        >
          <Text style={{
            color: 'white',
            fontSize: 16,
            fontWeight: '600',
          }}>
            Grant Permission
          </Text>
        </TouchableOpacity>
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
            Disease Detection
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#666',
          }}>
            AI-powered crop disease identification
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
        {!selectedImage && !isAnalyzing && !analysisResult && (
          <>
            {/* Instructions */}
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
                How to Get Best Results
              </Text>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Leaf size={20} color="#4CAF50" />
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  marginLeft: 12,
                  flex: 1,
                }}>
                  Take a clear photo of the affected leaf or plant part
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Shield size={20} color="#4CAF50" />
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  marginLeft: 12,
                  flex: 1,
                }}>
                  Ensure good lighting and focus on the diseased area
                </Text>
              </View>

              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
                <Droplets size={20} color="#4CAF50" />
                <Text style={{
                  fontSize: 14,
                  color: '#666',
                  marginLeft: 12,
                  flex: 1,
                }}>
                  Avoid blurry images and include some healthy parts for comparison
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <TouchableOpacity
              onPress={() => setShowCamera(true)}
              style={{
                backgroundColor: '#2E7D32',
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                marginBottom: 16,
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <Camera size={24} color="white" />
              <Text style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 12,
              }}>
                Take Photo
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={pickImage}
              style={{
                backgroundColor: 'white',
                borderRadius: 16,
                padding: 20,
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#2E7D32',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <ImageIcon size={24} color="#2E7D32" />
              <Text style={{
                color: '#2E7D32',
                fontSize: 18,
                fontWeight: 'bold',
                marginLeft: 12,
              }}>
                Choose from Gallery
              </Text>
            </TouchableOpacity>
          </>
        )}

        {/* Selected Image */}
        {selectedImage && (
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
            <Image
              source={{ uri: selectedImage }}
              style={{
                width: '100%',
                height: 300,
                borderRadius: 12,
                marginBottom: 16,
              }}
              contentFit="cover"
            />
            
            {!isAnalyzing && !analysisResult && (
              <TouchableOpacity
                onPress={resetAnalysis}
                style={{
                  backgroundColor: '#F5F5F5',
                  borderRadius: 12,
                  padding: 12,
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: '#666',
                  fontSize: 16,
                  fontWeight: '600',
                }}>
                  Choose Different Image
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Analysis Loading */}
        {isAnalyzing && (
          <View style={{
            backgroundColor: 'white',
            borderRadius: 16,
            padding: 40,
            alignItems: 'center',
            marginBottom: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
            elevation: 4,
          }}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: '#2E7D32',
              marginTop: 16,
              marginBottom: 8,
            }}>
              Analyzing Image...
            </Text>
            <Text style={{
              fontSize: 14,
              color: '#666',
              textAlign: 'center',
            }}>
              Our AI is examining your plant for diseases and pests
            </Text>
          </View>
        )}

        {/* Analysis Result */}
        {analysisResult && (
          <ResultCard
            disease={analysisResult.disease}
            severity={analysisResult.severity}
            confidence={analysisResult.confidence}
            treatments={analysisResult.treatments}
            onRetry={resetAnalysis}
          />
        )}
      </ScrollView>

      {/* Camera Modal */}
      <Modal
        visible={showCamera}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <View style={{ flex: 1 }}>
          <CameraView
            ref={cameraRef}
            style={{ flex: 1 }}
            facing="back"
          >
            <View style={{
              flex: 1,
              backgroundColor: 'transparent',
              paddingTop: insets.top,
            }}>
              {/* Camera Header */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingHorizontal: 20,
                paddingVertical: 16,
              }}>
                <TouchableOpacity
                  onPress={() => setShowCamera(false)}
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    borderRadius: 20,
                    padding: 8,
                  }}
                >
                  <X size={24} color="white" />
                </TouchableOpacity>
                <Text style={{
                  color: 'white',
                  fontSize: 18,
                  fontWeight: 'bold',
                }}>
                  Scan Plant Disease
                </Text>
                <View style={{ width: 40 }} />
              </View>

              {/* Camera Controls */}
              <View style={{
                position: 'absolute',
                bottom: insets.bottom + 40,
                left: 0,
                right: 0,
                alignItems: 'center',
              }}>
                <TouchableOpacity
                  onPress={takePicture}
                  style={{
                    width: 80,
                    height: 80,
                    borderRadius: 40,
                    backgroundColor: 'white',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 4,
                    borderColor: '#2E7D32',
                  }}
                >
                  <Camera size={32} color="#2E7D32" />
                </TouchableOpacity>
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </View>
  );
}