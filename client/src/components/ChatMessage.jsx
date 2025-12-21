import { useEffect, useState } from 'react';

export default function ChatMessage({ message, isUser, isNew }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isNew) {
      setTimeout(() => setVisible(true), 50);
    } else {
      setVisible(true);
    }
  }, [isNew]);

  return (
    <div className={`chat-message ${isUser ? 'user' : 'ai'} ${visible ? 'visible' : ''}`}>
      <div className="message-avatar">
        {isUser ? '👤' : '🤖'}
      </div>
      <div className="message-content">
        <div className="message-header">
          {isUser ? 'Сіз' : 'AI Көмекші'}
        </div>
        <div className="message-text">
          {message}
        </div>
      </div>
    </div>
  );
}
