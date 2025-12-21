import { useState, useRef, useEffect } from 'react';

const MAX_RECORDING_TIME = 20000; // 20 seconds

export default function VoiceRecorder({ onRecordingComplete, isDisabled }) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopRecording();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        // Validate recording
        if (audioBlob.size === 0) {
          console.error('Empty recording');
          return;
        }

        if (audioBlob.size > 5 * 1024 * 1024) {
          console.error('Recording too large (max 5MB)');
          alert('Жазба тым үлкен. Қысқарақ сөйлеңіз.');
          return;
        }

        onRecordingComplete(audioBlob);
        chunksRef.current = [];
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Start timer
      const startTime = Date.now();
      timerRef.current = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setRecordingTime(elapsed);

        // Auto-stop after max duration
        if (elapsed >= MAX_RECORDING_TIME) {
          stopRecording();
        }
      }, 100);

    } catch (error) {
      console.error('Failed to start recording:', error);
      alert('Микрофонға қол жеткізу мүмкін болмады. Рұқсаттарды тексеріңіз.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsRecording(false);
    setRecordingTime(0);
  };

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = Math.floor((ms % 1000) / 100);
    return `${seconds}.${milliseconds}s`;
  };

  return (
    <div className="voice-recorder">
      {isRecording ? (
        <div className="recording-controls">
          <button
            onClick={stopRecording}
            className="btn btn-stop"
          >
            Тоқтату ⏹️
          </button>
          <div className="recording-timer">
            {formatTime(recordingTime)} / {formatTime(MAX_RECORDING_TIME)}
          </div>
          <div className="recording-indicator">🔴 Жазып жатыр...</div>
        </div>
      ) : (
        <button
          onClick={startRecording}
          disabled={isDisabled}
          className="btn btn-record"
        >
          🎤 Сөйлеу
        </button>
      )}
    </div>
  );
}
