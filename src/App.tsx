import React, { useState } from 'react';
import Select from 'react-select';
import { generateSong } from './utils/songGenerator';
import type { Song, Language, Mood } from './types';

const languages: Language[] = [
  { value: 'English', label: 'English' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Hindi', label: 'Hindi' }
];

const moods: Mood[] = [
  { value: 'happy', label: 'Happy', color: '#22c55e' },
  { value: 'sad', label: 'Sad', color: '#3b82f6' },
  { value: 'funny', label: 'Funny', color: '#f59e0b' },
  { value: 'sarcastic', label: 'Sarcastic', color: '#8b5cf6' },
  { value: 'romantic', label: 'Romantic', color: '#ec4899' },
  { value: 'energetic', label: 'Energetic', color: '#ef4444' },
  { value: 'peaceful', label: 'Peaceful', color: '#06b6d4' },
  { value: 'angry', label: 'Angry', color: '#dc2626' }
];

function App() {
  const [theme, setTheme] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<Language | null>(languages[0]);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(moods[0]);
  const [song, setSong] = useState<Song | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!theme || !selectedLanguage || !selectedMood) {
      setError('Please enter a theme, select a language, and choose a mood');
      return;
    }

    setLoading(true);
    setError('');
    setSong(null);
    
    try {
      const generatedSong = await generateSong(theme, selectedLanguage.value, selectedMood.value);
      setSong(generatedSong);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate song. Please try again.';
      setError(errorMessage);
      console.error('Song generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-gray-700">
          <h1 className="text-5xl font-bold text-center text-white mb-12 tracking-tight">
            Lyrical Canvas
          </h1>
          
          <div className="space-y-8">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Theme or Topic
              </label>
              <input
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="Enter a theme for your song..."
                className="w-full px-4 py-3 bg-gray-700/50 border-2 border-gray-600 rounded-lg 
                         text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 
                         focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Language
              </label>
              <Select
                options={languages}
                value={selectedLanguage}
                onChange={(option) => setSelectedLanguage(option)}
                isDisabled={loading}
                className="text-gray-800"
                styles={{
                  control: (base) => ({
                    ...base,
                    background: 'rgba(55, 65, 81, 0.5)',
                    borderColor: '#4B5563',
                    borderWidth: '2px',
                    '&:hover': {
                      borderColor: '#6B7280'
                    }
                  }),
                  option: (base, state) => ({
                    ...base,
                    backgroundColor: state.isSelected ? '#6B7280' : state.isFocused ? '#4B5563' : '#1F2937',
                    color: '#F9FAFB',
                    '&:hover': {
                      backgroundColor: '#4B5563'
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1F2937'
                  }),
                  singleValue: (base) => ({
                    ...base,
                    color: '#F9FAFB'
                  })
                }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mood
              </label>
              <Select
                options={moods}
                value={selectedMood}
                onChange={(option) => setSelectedMood(option)}
                isDisabled={loading}
                className="text-gray-800"
                styles={{
                  control: (base) => ({
                    ...base,
                    background: 'rgba(55, 65, 81, 0.5)',
                    borderColor: '#4B5563',
                    borderWidth: '2px',
                    '&:hover': {
                      borderColor: '#6B7280'
                    }
                  }),
                  option: (base, { data }) => ({
                    ...base,
                    backgroundColor: 'transparent',
                    color: '#F9FAFB',
                    '&:hover': {
                      backgroundColor: '#4B5563'
                    },
                    ':before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      marginRight: '8px',
                      borderRadius: '50%',
                      backgroundColor: (data as Mood).color
                    }
                  }),
                  menu: (base) => ({
                    ...base,
                    backgroundColor: '#1F2937'
                  }),
                  singleValue: (base, { data }) => ({
                    ...base,
                    color: '#F9FAFB',
                    display: 'flex',
                    alignItems: 'center',
                    ':before': {
                      content: '""',
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      marginRight: '8px',
                      borderRadius: '50%',
                      backgroundColor: (data as Mood).color
                    }
                  })
                }}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="generate-button w-full bg-gradient-to-r from-purple-600 to-blue-600 
                       text-white py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 
                       transition-all duration-300 disabled:from-gray-600 disabled:to-gray-700 
                       disabled:cursor-not-allowed shadow-lg font-medium text-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating your lyrics...
                </span>
              ) : (
                "Generate Lyrics"
              )}
            </button>

            {error && (
              <div className="text-red-400 text-center p-4 bg-red-900/30 rounded-lg border border-red-800">
                {error}
              </div>
            )}

            {song && (
              <div className="lyrics-container mt-8 p-6 bg-gray-800/30 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-2xl font-semibold text-white">
                    {song.theme} - {song.language}
                  </h2>
                  <span 
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{ 
                      backgroundColor: moods.find(m => m.value === song.mood)?.color + '20',
                      color: moods.find(m => m.value === song.mood)?.color 
                    }}
                  >
                    {song.mood}
                  </span>
                </div>
                <div className="whitespace-pre-wrap text-gray-300 leading-relaxed custom-scrollbar max-h-96 overflow-y-auto">
                  {song.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;