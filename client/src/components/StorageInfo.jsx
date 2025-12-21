import { useState, useEffect } from 'react';

export default function StorageInfo({ show, onClose }) {
  const [storageSize, setStorageSize] = useState(0);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (show) {
      updateStorageInfo();
    }
  }, [show]);

  const updateStorageInfo = () => {
    try {
      const data = sessionStorage.getItem('ai-cosmos-chat-messages');
      if (data) {
        const messages = JSON.parse(data);
        setMessageCount(messages.length);
        setStorageSize(new Blob([data]).size);
      } else {
        setMessageCount(0);
        setStorageSize(0);
      }
    } catch (error) {
      console.error('Failed to get storage info:', error);
    }
  };

  if (!show) return null;

  return (
    <div className="storage-info-overlay" onClick={onClose}>
      <div className="storage-info-modal" onClick={(e) => e.stopPropagation()}>
        <div className="storage-info-header">
          <h3>💾 Информация о хранилище</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="storage-info-content">
          <div className="info-item">
            <span className="info-label">💬 Сообщений сохранено:</span>
            <span className="info-value">{messageCount}</span>
          </div>

          <div className="info-item">
            <span className="info-label">📦 Размер данных:</span>
            <span className="info-value">{(storageSize / 1024).toFixed(2)} KB</span>
          </div>

          <div className="info-item">
            <span className="info-label">🔐 Тип хранилища:</span>
            <span className="info-value">sessionStorage</span>
          </div>

          <div className="storage-info-description">
            <h4>🎯 Как это работает:</h4>
            <ul>
              <li>✅ Данные сохраняются при обновлении страницы</li>
              <li>✅ Данные доступны только в текущей вкладке</li>
              <li>❌ Данные удаляются при закрытии вкладки</li>
              <li>❌ Данные удаляются при закрытии браузера</li>
            </ul>
          </div>

          <div className="storage-info-actions">
            <button className="btn-info" onClick={onClose}>
              Понятно
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
