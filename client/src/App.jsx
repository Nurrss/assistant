import { useState, useRef, useEffect } from 'react';
import VoiceRecorder from './components/VoiceRecorder';
import AudioPlayer from './components/AudioPlayer';
import ChatMessage from './components/ChatMessage';
import SpaceBackground from './components/SpaceBackground';
import './styles/App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const STATE = {
  IDLE: 'idle',
  LISTENING: 'listening',
  PROCESSING: 'processing',
  SPEAKING: 'speaking',
  ERROR: 'error',
};

const STORAGE_KEY = 'ai-cosmos-chat-messages';

/**
 * Decode base64 string with UTF-8 support (for Kazakh/Cyrillic text)
 * @param {string} base64String - Base64 encoded string
 * @returns {string} Decoded UTF-8 string
 */
function decodeBase64UTF8(base64String) {
  const binaryString = atob(base64String);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new TextDecoder('utf-8').decode(bytes);
}

function App() {
  const [state, setState] = useState(STATE.IDLE);
  const [messages, setMessages] = useState(() => {
    // Load messages from sessionStorage on initial mount
    try {
      const savedMessages = sessionStorage.getItem(STORAGE_KEY);
      return savedMessages ? JSON.parse(savedMessages) : [];
    } catch (error) {
      console.error('Failed to load messages from sessionStorage:', error);
      return [];
    }
  });
  const [audioBlob, setAudioBlob] = useState(null);
  const [error, setError] = useState(null);
  const chatContainerRef = useRef(null);

  // Save messages to sessionStorage whenever they change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      console.error('Failed to save messages to sessionStorage:', error);
    }
  }, [messages]);

  // Auto-scroll to bottom when new message
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleRecordingComplete = async (recordedBlob) => {
    setState(STATE.PROCESSING);
    setError(null);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append('audio', recordedBlob, 'recording.webm');

      // Send to backend
      const response = await fetch(`${API_URL}/api/voice-chat`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Сервер қатесі');
      }

      // Extract transcript and AI response from headers
      const transcriptHeader = response.headers.get('X-Transcript');
      const responseHeader = response.headers.get('X-Response');

      let userMessage = '';
      let aiMessage = '';

      if (transcriptHeader) {
        try {
          userMessage = decodeBase64UTF8(transcriptHeader);
        } catch (e) {
          console.error('Failed to decode transcript:', e);
        }
      }

      if (responseHeader) {
        try {
          aiMessage = decodeBase64UTF8(responseHeader);
        } catch (e) {
          console.error('Failed to decode response:', e);
        }
      }

      // Add messages to chat history ONLY if they have content
      const newMessages = [];

      if (userMessage && userMessage.trim().length > 0) {
        newMessages.push({
          id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          text: userMessage.trim(),
          isUser: true,
        });
      }

      if (aiMessage && aiMessage.trim().length > 0) {
        newMessages.push({
          id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
          text: aiMessage.trim(),
          isUser: false,
        });
      }

      // Only update messages if we have valid content
      if (newMessages.length > 0) {
        setMessages((prev) => [...prev, ...newMessages]);
      }

      // Get audio blob
      const audioData = await response.blob();
      setAudioBlob(audioData);
      setState(STATE.SPEAKING);
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Белгісіз қате орын алды');
      setState(STATE.ERROR);
    }
  };

  const handlePlayComplete = () => {
    setState(STATE.IDLE);
  };

  const handleRetry = () => {
    setState(STATE.IDLE);
    setError(null);
  };

  const clearChat = () => {
    setMessages([]);
    setState(STATE.IDLE);
    setError(null);
    setAudioBlob(null);
    // Clear sessionStorage
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear sessionStorage:', error);
    }
  };

  const getStateMessage = () => {
    switch (state) {
      case STATE.IDLE:
        return '🎤 Микрофонды басып сөйлеңіз';
      case STATE.LISTENING:
        return '👂 Тыңдап жатыр...';
      case STATE.PROCESSING:
        return '⚙️ Өңдеуде...';
      case STATE.SPEAKING:
        return '🔊 Жауап беруде...';
      case STATE.ERROR:
        return '❌ Қате орын алды';
      default:
        return '';
    }
  };

  const isDisabled = state !== STATE.IDLE;

  return (
    <div className="app">
      <SpaceBackground />

      <div className="app-container">
        <header className="header">
          <div className="header-content">
            <div className="logo">
              <span className="logo-icon">🌌</span>
              <h1>AI Ғарыш Көмекші</h1>
            </div>
            <p className="subtitle">
              Қазақ тілінде космостық AI-мен сөйлесіңіз
            </p>
          </div>
        </header>

        <main className="main">
          <div className="chat-container" ref={chatContainerRef}>
            {messages.length === 0 ? (
              <div className="welcome-message">
                <div className="planet-animation">🪐</div>
                <h2>Сәлем! Мен сіздің AI көмекшіңізбін</h2>
                <p>Микрофон түймесін басып, қазақ тілінде сөйлеңіз</p>
                <div className="features">
                  <div className="feature">✨ Дауысты тану</div>
                  <div className="feature">🤖 AI жауаптар</div>
                  <div className="feature">🔊 Дауыспен жауап</div>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, index) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.text}
                    isUser={msg.isUser}
                    isNew={index >= messages.length - 2}
                  />
                ))}
              </>
            )}
          </div>

          <div className="controls-container">
            <div className="status-bar">
              <div className={`status-indicator ${state}`}>
                {getStateMessage()}
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="btn-clear"
                  title="Тарихты тазалау"
                >
                  🗑️
                </button>
              )}
            </div>

            {error && (
              <div className="error-section">
                <div className="error-message">
                  <strong>Қате:</strong> {error}
                </div>
                <button onClick={handleRetry} className="btn btn-retry">
                  Қайталау
                </button>
              </div>
            )}

            <div className="recorder-section">
              <VoiceRecorder
                onRecordingComplete={handleRecordingComplete}
                isDisabled={isDisabled}
              />
            </div>
          </div>

          {state === STATE.SPEAKING && audioBlob && (
            <AudioPlayer
              audioBlob={audioBlob}
              onPlayComplete={handlePlayComplete}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
