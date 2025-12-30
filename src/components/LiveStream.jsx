import { useEffect, useRef, useState } from 'react';

export function LiveStream({ campaignId, enabled, onUpdate }) {
  const eventSourceRef = useRef(null);
  const [error, setError] = useState(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 2;

  useEffect(() => {
    if (!enabled || !campaignId) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      return;
    }

    const connect = () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }

      const url = `https://mixo-fe-backend-task.vercel.app/campaigns/${campaignId}/insights/stream`;
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          onUpdate(data);
          setError(null);
          reconnectAttemptsRef.current = 0;
        } catch (err) {
          console.error('Error parsing SSE data:', err);
        }
      };

      eventSource.onerror = (err) => {
        console.error('SSE error:', err);
        setError('Connection error');
        
        if (eventSource.readyState === EventSource.CLOSED) {
          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            reconnectAttemptsRef.current++;
            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, 2000);
          } else {
            setError('Max reconnection attempts reached');
          }
        }
      };
    };

    connect();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      reconnectAttemptsRef.current = 0;
    };
  }, [enabled, campaignId, onUpdate]);

  return error ? <div className="live-stream-error">{error}</div> : null;
}