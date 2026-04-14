/**
 * Groq AI Integration for QuantumNav
 * Uses Groq API for improved traffic prediction and route analysis
 */

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

interface GroqConfig {
  apiKey: string;
  model: string;
  maxTokens: number;
}

const config: GroqConfig = {
  apiKey: import.meta.env.VITE_GROQ_API_KEY || '',
  model: 'mixtral-8x7b-32768',
  maxTokens: 1024,
};

interface TrafficPredictionRequest {
  hour: number;
  waypoints: number;
  region: string;
}

interface TrafficPredictionResponse {
  trafficData: Array<{
    corridor: string;
    congestion: number;
    delay: number;
  }>;
  peakHours: number[];
  confidence: number;
}

export async function predictTrafficWithAI(
  request: TrafficPredictionRequest
): Promise<TrafficPredictionResponse | null> {
  if (!config.apiKey) {
    if (import.meta.env.DEV) {
      console.warn('Groq API key not configured. Using fallback predictions.');
    }
    return null;
  }

  try {
    // Generate corridor names for the waypoints
    const corridors: Array<{ i: number; j: number }> = [];
    for (let i = 0; i < request.waypoints; i++) {
      for (let j = 0; j < request.waypoints; j++) {
        if (i !== j) corridors.push({ i, j });
      }
    }

    const prompt = `Predict traffic congestion for ${request.waypoints} waypoints in Mumbai at ${request.hour}:00 hours.
    Generate predictions for ${corridors.length} corridors: ${corridors.map((c) => `${c.i}-${c.j}`).join(', ')}.
    
    Provide JSON response with:
    - trafficData: array of {corridor: string (format "i-j"), congestion: number 0-100, delay: number 0-180 minutes}
    - peakHours: array of peak traffic hours (e.g., [8, 9, 18, 19])
    - confidence: number 85-95
    
    Consider typical Mumbai traffic patterns:
    - Morning peak: 7-9 AM
    - Evening peak: 5-7 PM
    - Night: low traffic
    
    Respond with ONLY valid JSON.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content:
              'You are a traffic prediction AI for Mumbai. Always respond with valid JSON only, no markdown code blocks.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.error('Groq API error:', response.statusText);
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // Try to extract JSON from response - handle markdown code blocks
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error('No JSON found in Groq response:', content);
      return null;
    }

    const prediction = JSON.parse(jsonMatch[0]) as TrafficPredictionResponse;

    // Validate and ensure all corridors have data
    if (!prediction.trafficData || !Array.isArray(prediction.trafficData)) {
      if (import.meta.env.DEV) {
        console.warn('Invalid trafficData structure in Groq response');
      }
      return null;
    }

    // Ensure all corridors have valid entries
    const trafficMap = new Map(prediction.trafficData.map((t) => [t.corridor, t]));
    const completeTrafficData = corridors.map((c) => {
      const corridor = `${c.i}-${c.j}`;
      return (
        trafficMap.get(corridor) || {
          corridor,
          congestion: 50,
          delay: 15,
        }
      );
    });

    return {
      ...prediction,
      trafficData: completeTrafficData,
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error calling Groq API:', error);
    }
    return null;
  }
}

interface RouteAnalysisRequest {
  distance: number;
  waypoints: number;
  optimization: 'quantum' | 'classic';
  trafficEnabled: boolean;
}

interface RouteAnalysisResponse {
  analysis: string;
  recommendations: string[];
  estimatedSavings: {
    time: number;
    co2: number;
  };
  confidence: number;
}

export async function analyzeRouteWithAI(
  request: RouteAnalysisRequest
): Promise<RouteAnalysisResponse | null> {
  if (!config.apiKey) {
    return null;
  }

  try {
    const prompt = `Analyze this optimized route:
    - Distance: ${request.distance} km
    - Waypoints: ${request.waypoints}
    - Algorithm: ${request.optimization}
    - Traffic Consideration: ${request.trafficEnabled ? 'Yes' : 'No'}
    
    Provide JSON with:
    - analysis: brief quality assessment
    - recommendations: array of improvement suggestions
    - estimatedSavings: {time: minutes, co2: kg}
    - confidence: 0-100
    
    Respond with ONLY valid JSON.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a route optimization expert. Respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: config.maxTokens,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return analysis as RouteAnalysisResponse;
  } catch (error) {
    console.error('Error analyzing route:', error);
    return null;
  }
}

interface DiversityCheckRequest {
  routes: Array<{
    tour: number[];
    distance: number;
  }>;
}

interface DiversityCheckResponse {
  diversity: number;
  clustered: boolean;
  recommendation: string;
}

export async function checkRouteDiversity(
  request: DiversityCheckRequest
): Promise<DiversityCheckResponse | null> {
  if (!config.apiKey) {
    return null;
  }

  try {
    const prompt = `Analyze ${request.routes.length} routes for diversity.
    Routes: ${JSON.stringify(request.routes)}
    
    Return JSON with:
    - diversity: 0-100 score (how different are the routes)
    - clustered: boolean (are they all similar)
    - recommendation: advice for improving diversity
    
    Respond with ONLY valid JSON.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${config.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          {
            role: 'system',
            content: 'You are a route diversity analyzer. Respond with valid JSON only.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 512,
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return null;
    }

    const diversity = JSON.parse(jsonMatch[0]);
    return diversity as DiversityCheckResponse;
  } catch (error) {
    console.error('Error checking diversity:', error);
    return null;
  }
}

export function isApiConfigured(): boolean {
  return !!config.apiKey;
}

export function getApiStatus(): {
  configured: boolean;
  model: string;
  available: boolean;
} {
  return {
    configured: !!config.apiKey,
    model: config.model,
    available: !!config.apiKey,
  };
}
