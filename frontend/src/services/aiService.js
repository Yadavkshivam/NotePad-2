// const GEMINI_API_KEY = 'AIzaSyBKvvuBy9lfa93VPKTzjjFi1GHMSXEGD4o';
// const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

export async function generateAINotes(content) {
  if (!import.meta.env.VITE_GEMINI_API_KEY) {
    throw new Error('Gemini API key is not configured.');
  }

  const prompt = `You are a note-taking assistant. Take the following content and transform it into clear, concise, and well-organized notes. 
  
Rules:
- Use bullet points for key information
- Keep it crisp and to the point
- Highlight important terms or concepts
- Remove any fluff or unnecessary words
- Organize logically with clear structure
- Maximum 200 words

Content to summarize:
${content}

Provide only the formatted notes, no additional commentary.`;

  try {
    const apiUrl = import.meta.env.VITE_GEMINI_API_URL;
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error:', errorData);
      
      // Check if it's a quota error
      if (errorData.error?.message?.includes('quota') || errorData.error?.code === 429) {
        throw new Error('API quota exceeded. Please wait a minute and try again, or get a new API key from https://makersuite.google.com/app/apikey');
      }
      
      throw new Error(errorData.error?.message || 'Failed to generate notes');
    }

    const data = await response.json();
    console.log('API Response:', data);
    
    const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) {
      throw new Error('No response from AI');
    }

    return generatedText.trim();
  } catch (error) {
    console.error('AI Generation Error:', error);
    throw error;
  }
}
