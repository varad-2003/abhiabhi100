// Disease Detection API endpoint
export async function POST(request) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');
    const cropType = formData.get('cropType') || 'unknown';

    if (!imageFile) {
      return Response.json(
        { error: 'No image file provided' },
        { status: 400 }
      );
    }

    // In production, you would:
    // 1. Upload image to cloud storage
    // 2. Send to ML model for analysis
    // 3. Return structured results

    // Mock disease detection response
    const detectionResult = generateDiseaseDetection(cropType);

    return Response.json({
      success: true,
      data: {
        imageProcessed: true,
        cropType,
        detection: detectionResult,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Disease detection error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateDiseaseDetection(cropType) {
  // Mock disease detection results
  const diseases = [
    {
      name: 'Leaf Blight',
      severity: 'Medium',
      confidence: 87,
      description: 'A fungal disease that affects leaves, causing brown spots and eventual leaf death.',
      symptoms: [
        'Brown spots on leaves',
        'Yellowing around spots',
        'Leaf wilting',
        'Reduced plant vigor'
      ],
      treatments: [
        {
          type: 'Organic',
          description: 'Apply neem oil spray (10ml per liter of water) in early morning or evening. Repeat every 3-4 days.',
          priority: 1
        },
        {
          type: 'Organic',
          description: 'Remove affected leaves and burn them to prevent spread. Ensure proper air circulation.',
          priority: 2
        },
        {
          type: 'Chemical',
          description: 'Apply copper-based fungicide (Copper Oxychloride 50% WP) at 2g per liter of water if organic treatment is insufficient.',
          priority: 3
        }
      ],
      prevention: [
        'Maintain proper plant spacing',
        'Avoid overhead watering',
        'Remove plant debris regularly',
        'Apply preventive fungicide sprays'
      ]
    },
    {
      name: 'Powdery Mildew',
      severity: 'Low',
      confidence: 92,
      description: 'A fungal disease characterized by white powdery growth on leaves and stems.',
      symptoms: [
        'White powdery coating on leaves',
        'Stunted growth',
        'Leaf curling',
        'Reduced photosynthesis'
      ],
      treatments: [
        {
          type: 'Organic',
          description: 'Spray baking soda solution (1 tsp per liter water) weekly.',
          priority: 1
        },
        {
          type: 'Organic',
          description: 'Apply milk spray (1:10 ratio with water) twice weekly.',
          priority: 2
        },
        {
          type: 'Chemical',
          description: 'Use sulfur-based fungicide as per manufacturer instructions.',
          priority: 3
        }
      ],
      prevention: [
        'Ensure good air circulation',
        'Avoid overcrowding plants',
        'Water at soil level',
        'Remove infected plant parts'
      ]
    },
    {
      name: 'Bacterial Wilt',
      severity: 'High',
      confidence: 78,
      description: 'A bacterial disease that causes rapid wilting and death of plants.',
      symptoms: [
        'Sudden wilting of plants',
        'Brown discoloration of stems',
        'Bacterial ooze from cut stems',
        'Plant death within days'
      ],
      treatments: [
        {
          type: 'Organic',
          description: 'Remove and destroy infected plants immediately to prevent spread.',
          priority: 1
        },
        {
          type: 'Organic',
          description: 'Apply beneficial bacteria (Pseudomonas fluorescens) to soil.',
          priority: 2
        },
        {
          type: 'Chemical',
          description: 'Soil drenching with copper-based bactericide may help in early stages.',
          priority: 3
        }
      ],
      prevention: [
        'Use disease-free seeds',
        'Avoid waterlogging',
        'Practice crop rotation',
        'Disinfect tools between plants'
      ]
    }
  ];

  // Return a random disease for demo purposes
  const randomDisease = diseases[Math.floor(Math.random() * diseases.length)];
  
  return {
    ...randomDisease,
    detectedAt: new Date().toISOString(),
    recommendedActions: getRecommendedActions(randomDisease.severity),
    followUpAdvice: getFollowUpAdvice(randomDisease.severity)
  };
}

function getRecommendedActions(severity) {
  switch (severity) {
    case 'High':
      return [
        'Take immediate action within 24 hours',
        'Isolate affected plants',
        'Contact local agricultural extension officer',
        'Document the spread for monitoring'
      ];
    case 'Medium':
      return [
        'Begin treatment within 3-5 days',
        'Monitor spread to neighboring plants',
        'Increase inspection frequency',
        'Prepare organic treatments'
      ];
    case 'Low':
      return [
        'Monitor plant health regularly',
        'Apply preventive measures',
        'Maintain good cultural practices',
        'Consider organic treatments'
      ];
    default:
      return ['Monitor and assess plant health'];
  }
}

function getFollowUpAdvice(severity) {
  const baseAdvice = [
    'Take photos to track progress',
    'Keep records of treatments applied',
    'Monitor weather conditions',
    'Consult with other farmers in your area'
  ];

  if (severity === 'High') {
    baseAdvice.unshift('Schedule follow-up inspection in 2-3 days');
  } else if (severity === 'Medium') {
    baseAdvice.unshift('Schedule follow-up inspection in 1 week');
  } else {
    baseAdvice.unshift('Schedule follow-up inspection in 2 weeks');
  }

  return baseAdvice;
}

// GET endpoint for testing
export async function GET() {
  return Response.json({
    message: 'Disease Detection API',
    endpoints: {
      POST: '/api/disease-detection - Analyze crop images for disease detection'
    },
    requiredFields: [
      'image (file)',
      'cropType (optional)'
    ],
    supportedFormats: ['jpg', 'jpeg', 'png'],
    maxFileSize: '10MB'
  });
}