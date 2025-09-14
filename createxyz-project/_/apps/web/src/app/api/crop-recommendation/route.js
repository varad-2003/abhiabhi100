// Crop Recommendation API endpoint
export async function POST(request) {
  try {
    const body = await request.json();
    const { location, soilPH, nitrogen, phosphorus, potassium, moisture, area } = body;

    // Validate required fields
    if (!location || !soilPH || !nitrogen || !phosphorus || !potassium || !moisture || !area) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Mock ML model response - In production, this would call your ML API
    const recommendations = generateCropRecommendations({
      location,
      soilPH: parseFloat(soilPH),
      nitrogen: parseFloat(nitrogen),
      phosphorus: parseFloat(phosphorus),
      potassium: parseFloat(potassium),
      moisture: parseFloat(moisture),
      area: parseFloat(area)
    });

    return Response.json({
      success: true,
      data: {
        location,
        soilConditions: {
          pH: parseFloat(soilPH),
          nitrogen: parseFloat(nitrogen),
          phosphorus: parseFloat(phosphorus),
          potassium: parseFloat(potassium),
          moisture: parseFloat(moisture)
        },
        farmArea: parseFloat(area),
        recommendations,
        generatedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Crop recommendation error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateCropRecommendations(params) {
  const { soilPH, nitrogen, phosphorus, potassium, moisture, area } = params;
  
  // Mock recommendation logic based on soil parameters
  const crops = [];

  // Rice recommendation logic
  if (soilPH >= 5.5 && soilPH <= 7.0 && moisture >= 20 && nitrogen >= 30) {
    crops.push({
      crop: 'Rice (Basmati)',
      yield: (4.2 * area).toFixed(1),
      profit: (45000 * area).toFixed(0),
      sustainability: '8.5',
      confidence: 92,
      reasons: [
        'Optimal pH range for rice cultivation',
        'Adequate moisture content',
        'Sufficient nitrogen levels'
      ],
      actions: [
        'Prepare soil with organic compost',
        'Maintain water levels at 2-3 inches',
        'Apply recommended NPK fertilizers',
        'Monitor for pest and diseases'
      ]
    });
  }

  // Wheat recommendation logic
  if (soilPH >= 6.0 && soilPH <= 7.5 && phosphorus >= 40 && potassium >= 15) {
    crops.push({
      crop: 'Wheat',
      yield: (3.8 * area).toFixed(1),
      profit: (38000 * area).toFixed(0),
      sustainability: '7.8',
      confidence: 87,
      reasons: [
        'Good pH for wheat growth',
        'Adequate phosphorus content',
        'Suitable potassium levels'
      ],
      actions: [
        'Prepare well-drained seedbed',
        'Apply phosphorus before sowing',
        'Ensure proper irrigation timing',
        'Monitor for rust diseases'
      ]
    });
  }

  // Sugarcane recommendation logic
  if (soilPH >= 6.0 && soilPH <= 8.0 && nitrogen >= 40 && moisture >= 25) {
    crops.push({
      crop: 'Sugarcane',
      yield: (65 * area).toFixed(1),
      profit: (85000 * area).toFixed(0),
      sustainability: '6.5',
      confidence: 78,
      reasons: [
        'Suitable pH range',
        'High nitrogen requirement met',
        'Good moisture content'
      ],
      actions: [
        'Plant during optimal season',
        'Ensure continuous water supply',
        'Apply nitrogen in split doses',
        'Regular earthing up required'
      ]
    });
  }

  // Cotton recommendation logic
  if (soilPH >= 5.8 && soilPH <= 8.0 && potassium >= 20 && moisture <= 30) {
    crops.push({
      crop: 'Cotton',
      yield: (2.5 * area).toFixed(1),
      profit: (55000 * area).toFixed(0),
      sustainability: '7.2',
      confidence: 85,
      reasons: [
        'Optimal pH for cotton',
        'Good potassium availability',
        'Moderate moisture suitable'
      ],
      actions: [
        'Use certified Bt cotton seeds',
        'Apply potassium before flowering',
        'Monitor for bollworm',
        'Ensure proper drainage'
      ]
    });
  }

  // If no specific crops match, provide general recommendations
  if (crops.length === 0) {
    crops.push({
      crop: 'Mixed Vegetables',
      yield: (8.0 * area).toFixed(1),
      profit: (35000 * area).toFixed(0),
      sustainability: '8.0',
      confidence: 70,
      reasons: [
        'Versatile crop option',
        'Good for soil health',
        'Market demand available'
      ],
      actions: [
        'Improve soil pH if needed',
        'Add organic matter',
        'Practice crop rotation',
        'Use integrated pest management'
      ]
    });
  }

  // Sort by confidence and return top 3
  return crops
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, 3);
}

// GET endpoint for testing
export async function GET() {
  return Response.json({
    message: 'Crop Recommendation API',
    endpoints: {
      POST: '/api/crop-recommendation - Get crop recommendations based on soil parameters'
    },
    requiredFields: [
      'location',
      'soilPH',
      'nitrogen',
      'phosphorus', 
      'potassium',
      'moisture',
      'area'
    ]
  });
}