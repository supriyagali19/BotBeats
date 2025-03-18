import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);

export async function generateSong(theme: string, language: string, mood: string): Promise<Song> {
  if (!import.meta.env.VITE_HUGGINGFACE_API_KEY) {
    throw new Error('Hugging Face API key is missing');
  }

  try {
    const moodInstructions = getMoodInstructions(mood);
    const lyricsPrompt = `Write a ${mood} song in ${language} about ${theme}.
The song should have this structure:
[Verse 1]
[Chorus]
[Verse 2]
[Chorus]

${moodInstructions}
Keep it simple and meaningful.`;
    
    const lyricsResponse = await hf.textGeneration({
      model: 'mistralai/Mistral-7B-Instruct-v0.1',
      inputs: lyricsPrompt,
      parameters: {
        max_new_tokens: 256,
        temperature: 0.7,
        top_p: 0.9,
        repetition_penalty: 1.1,
        return_full_text: false
      }
    });

    if (!lyricsResponse.generated_text) {
      throw new Error('No lyrics were generated');
    }

    const lyrics = lyricsResponse.generated_text.trim();

    return {
      content: lyrics,
      language,
      theme,
      mood
    };
  } catch (error) {
    console.error('Error in song generation:', error);
    if (error instanceof Error) {
      throw new Error(`Song generation failed: ${error.message}`);
    }
    throw new Error('Song generation failed: Unknown error occurred');
  }
}

function getMoodInstructions(mood: string): string {
  const moodGuides = {
    happy: "Make the lyrics upbeat and joyful. Use positive words and metaphors that convey happiness and celebration.",
    sad: "Create emotional, melancholic lyrics. Use deep, meaningful metaphors that express sadness and reflection.",
    funny: "Include humorous elements and witty wordplay. Make it light-hearted and entertaining.",
    sarcastic: "Add clever, ironic twists. Use subtle mockery and witty observations.",
    romantic: "Focus on love and affection. Use sweet, tender expressions and romantic imagery.",
    energetic: "Make it dynamic and lively. Use powerful words and exciting rhythmic patterns.",
    peaceful: "Create calm, serene lyrics. Use gentle imagery and soothing expressions.",
    angry: "Express strong emotions and intensity. Use powerful words and intense metaphors."
  };
  
  return moodGuides[mood as keyof typeof moodGuides] || "Keep the tone natural and balanced.";
}