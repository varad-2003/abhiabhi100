// Chatbot API endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, context, language = 'en' } = body;

    if (!message) {
      return Response.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Process the message and generate response
    const response = await generateChatbotResponse(message, context, language);

    return Response.json({
      success: true,
      data: {
        response: response.text,
        actions: response.actions,
        quickReplies: response.quickReplies,
        context: response.context,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Chatbot error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

async function generateChatbotResponse(message, context, language) {
  const lowerMessage = message.toLowerCase();
  
  // Intent detection based on keywords
  let intent = detectIntent(lowerMessage);
  let response = {
    text: '',
    actions: [],
    quickReplies: [],
    context: { ...context, lastIntent: intent }
  };

  switch (intent) {
    case 'crop_recommendation':
      response.text = "I can help you with crop recommendations! To give you the best suggestions, I need to know about your soil conditions and location. Would you like me to guide you through our Crop Recommendation tool?";
      response.actions = [
        {
          type: 'navigate',
          target: '/crop-recommendation',
          label: 'Open Crop Recommendation'
        }
      ];
      response.quickReplies = [
        'Yes, guide me',
        'I have soil test results',
        'What information do you need?'
      ];
      break;

    case 'disease_detection':
      response.text = "I can help you identify crop diseases! You can take a photo of the affected plant using our Disease Detection feature. Make sure to capture a clear image of the diseased area with good lighting.";
      response.actions = [
        {
          type: 'navigate',
          target: '/disease-detection',
          label: 'Open Disease Detection'
        }
      ];
      response.quickReplies = [
        'Take photo now',
        'Upload from gallery',
        'Disease symptoms guide'
      ];
      break;

    case 'weather':
      response.text = "I can provide weather information for your location. Our weather service gives you 7-day forecasts, farming advice based on weather conditions, and alerts for extreme weather.";
      response.actions = [
        {
          type: 'navigate',
          target: '/weather',
          label: 'Check Weather'
        }
      ];
      response.quickReplies = [
        'Current weather',
        '7-day forecast',
        'Farming advice'
      ];
      break;

    case 'market_prices':
      response.text = "I can help you check current market prices for various crops. Our price data is updated regularly from major agricultural markets across Maharashtra.";
      response.actions = [
        {
          type: 'navigate',
          target: '/market-prices',
          label: 'View Market Prices'
        }
      ];
      response.quickReplies = [
        'Rice prices',
        'Wheat prices',
        'Vegetable prices'
      ];
      break;

    case 'iot_sensors':
      response.text = "Our IoT sensor rental service helps you monitor your farm conditions in real-time. You can rent soil moisture sensors, weather stations, and other smart farming equipment.";
      response.actions = [
        {
          type: 'navigate',
          target: '/iot-rental',
          label: 'Browse Sensors'
        }
      ];
      response.quickReplies = [
        'Soil moisture sensor',
        'Weather station',
        'Rental prices'
      ];
      break;

    case 'learning':
      response.text = "I can help you find farming tutorials and educational content. Our learning section has videos on crop management, disease control, irrigation, and modern farming techniques.";
      response.actions = [
        {
          type: 'navigate',
          target: '/learning',
          label: 'Browse Videos'
        }
      ];
      response.quickReplies = [
        'Crop management',
        'Disease control',
        'Irrigation techniques'
      ];
      break;

    case 'soil_health':
      response.text = "Soil health is crucial for good crop yields! Key factors include pH level (6.0-7.5 for most crops), organic matter content, and NPK levels. Regular soil testing helps you understand what your soil needs.";
      response.quickReplies = [
        'How to test soil pH?',
        'Improve soil fertility',
        'Organic matter benefits'
      ];
      break;

    case 'irrigation':
      response.text = "Proper irrigation is essential for healthy crops. The amount and frequency depend on your crop type, soil, and weather. Drip irrigation is very efficient for water conservation.";
      response.quickReplies = [
        'Drip irrigation setup',
        'Watering schedule',
        'Water conservation tips'
      ];
      break;

    case 'fertilizer':
      response.text = "Fertilizer application should be based on soil test results and crop requirements. NPK (Nitrogen, Phosphorus, Potassium) are the main nutrients. Organic fertilizers like compost are also excellent for soil health.";
      response.quickReplies = [
        'NPK ratios for crops',
        'Organic fertilizers',
        'Application timing'
      ];
      break;

    case 'pest_control':
      response.text = "Integrated Pest Management (IPM) is the best approach. This includes using beneficial insects, crop rotation, organic sprays like neem oil, and chemical pesticides only when necessary.";
      response.quickReplies = [
        'Organic pest control',
        'Beneficial insects',
        'Neem oil application'
      ];
      break;

    case 'greeting':
      response.text = "Hello! I'm KisanMitra, your farming assistant. I can help you with crop recommendations, disease detection, weather information, market prices, and farming advice. What would you like to know?";
      response.quickReplies = [
        'Recommend crops',
        'Detect disease',
        'Check weather',
        'Market prices'
      ];
      break;

    case 'help':
      response.text = "I can assist you with:\n• Crop recommendations based on your soil\n• Disease detection from plant photos\n• Weather forecasts and farming advice\n• Current market prices\n• IoT sensor rentals\n• Learning resources and tutorials\n\nWhat would you like help with?";
      response.quickReplies = [
        'Crop recommendations',
        'Disease detection',
        'Weather forecast',
        'Market prices'
      ];
      break;

    default:
      response.text = "I understand you're asking about farming, but I need more specific information to help you better. I can assist with crop recommendations, disease detection, weather, market prices, and farming techniques. What specific topic interests you?";
      response.quickReplies = [
        'Crop recommendations',
        'Disease detection',
        'Weather info',
        'Market prices',
        'Farming tips'
      ];
      break;
  }

  // Add language-specific responses if needed
  if (language === 'hi') {
    response = translateToHindi(response);
  }

  return response;
}

function detectIntent(message) {
  const intents = {
    crop_recommendation: [
      'crop', 'recommend', 'suggestion', 'what to grow', 'which crop', 'farming advice',
      'soil', 'plant', 'cultivation', 'grow', 'fasal', 'kheti'
    ],
    disease_detection: [
      'disease', 'pest', 'problem', 'sick', 'dying', 'spots', 'infection',
      'leaf', 'plant health', 'treatment', 'cure', 'bimari', 'keeda'
    ],
    weather: [
      'weather', 'rain', 'temperature', 'forecast', 'climate', 'monsoon',
      'humidity', 'wind', 'mausam', 'barish'
    ],
    market_prices: [
      'price', 'market', 'sell', 'rate', 'cost', 'mandi', 'bhav', 'kimat'
    ],
    iot_sensors: [
      'sensor', 'iot', 'monitoring', 'smart', 'technology', 'equipment',
      'device', 'rental', 'rent'
    ],
    learning: [
      'learn', 'tutorial', 'video', 'education', 'training', 'course',
      'how to', 'guide', 'technique', 'method'
    ],
    soil_health: [
      'soil', 'ph', 'fertility', 'nutrients', 'organic matter', 'compost',
      'soil test', 'mitti'
    ],
    irrigation: [
      'water', 'irrigation', 'watering', 'drip', 'sprinkler', 'moisture',
      'pani', 'sinchai'
    ],
    fertilizer: [
      'fertilizer', 'npk', 'nitrogen', 'phosphorus', 'potassium', 'manure',
      'khad', 'urvarak'
    ],
    pest_control: [
      'pest', 'insect', 'bug', 'spray', 'pesticide', 'control', 'neem',
      'keeda', 'makoda'
    ],
    greeting: [
      'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening',
      'namaste', 'namaskar'
    ],
    help: [
      'help', 'assist', 'support', 'what can you do', 'features', 'madad'
    ]
  };

  for (const [intent, keywords] of Object.entries(intents)) {
    if (keywords.some(keyword => message.includes(keyword))) {
      return intent;
    }
  }

  return 'unknown';
}

function translateToHindi(response) {
  // Basic translation mapping - in production, use proper translation service
  const translations = {
    'I can help you with crop recommendations!': 'मैं आपको फसल की सिफारिशों में मदद कर सकता हूं!',
    'Hello! I\'m KisanMitra': 'नमस्ते! मैं किसानमित्र हूं',
    'Crop recommendations': 'फसल सिफारिशें',
    'Disease detection': 'रोग पहचान',
    'Weather forecast': 'मौसम पूर्वानुमान',
    'Market prices': 'बाजार भाव'
  };

  // Simple translation - in production, implement proper i18n
  let translatedText = response.text;
  for (const [english, hindi] of Object.entries(translations)) {
    translatedText = translatedText.replace(english, hindi);
  }

  return {
    ...response,
    text: translatedText
  };
}

// GET endpoint for testing
export async function GET() {
  return Response.json({
    message: 'KisanMitra Chatbot API',
    endpoints: {
      POST: '/api/chatbot - Send message to chatbot'
    },
    requiredFields: [
      'message'
    ],
    optionalFields: [
      'context',
      'language (en/hi)'
    ],
    supportedIntents: [
      'crop_recommendation',
      'disease_detection', 
      'weather',
      'market_prices',
      'iot_sensors',
      'learning',
      'soil_health',
      'irrigation',
      'fertilizer',
      'pest_control'
    ]
  });
}