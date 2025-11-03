import { NextResponse } from 'next/server';
import geminiConfig from '@/config/gemini';

const API_KEY = "AIzaSyD-RUIISrW7HkDyjry2vcTusTZh0hF2y-o"

export async function POST(request) {
  try {
    const { prompt } = await request.json();
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    const response = await fetch(geminiConfig.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: geminiConfig.temperature,
          topK: geminiConfig.topK,
          topP: geminiConfig.topP,
          maxOutputTokens: geminiConfig.maxOutputTokens,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch from Gemini API' },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    // Ekstrak teks dari respons Gemini
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    
    // Coba parse teks sebagai JSON untuk mendapatkan ide-ide bisnis
    let ideas = [];
    try {
      // Cari bagian teks yang berisi array JSON
      const jsonMatch = generatedText.match(/\\[\\s*\\{.*\\}\\s*\\]/s);
      if (jsonMatch) {
        ideas = JSON.parse(jsonMatch[0]);
      } else {
        // Jika tidak ada format JSON yang jelas, coba parse seluruh teks
        ideas = JSON.parse(generatedText);
      }
    } catch (error) {
      console.error('Error parsing Gemini response as JSON:', error);
      // Jika gagal parse, kembalikan teks mentah untuk diproses di client
      return NextResponse.json({ rawText: generatedText });
    }

    return NextResponse.json({ ideas });
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}