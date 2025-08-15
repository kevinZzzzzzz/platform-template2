import { useEffect, useState, useCallback } from 'react';

type WebSocketState = 'connecting' | 'open' | 'closed' | 'error'
class WebSocketManager {
  private static instance: WebSocketManager | null = null;
  private ws: WebSocket | null = null;
  private listeners: ((event: MessageEvent) => void)[] = [];
  private errorListeners: ((error: Event) => void)[] = [];
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private heartbeatInterval: NodeJS.Timeout | null = null;

  // 单例获取方法
  public static getInstance(): WebSocketManager {
      if (!this.instance) {
          this.instance = new WebSocketManager();
      }
      return this.instance;
  }

  // 初始化连接
  public connect(url: string): void {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

      this.ws = new WebSocket(url);
      this.ws.onopen = () => {
          console.log("WebSocket connected");
          this.startHeartbeat(); // 启动心跳
      };
      
      this.ws.onmessage = (event) => {
          this.listeners.forEach(listener => listener(event));
      };

      this.ws.onerror = (error) => {
          this.errorListeners.forEach(listener => listener(error));
      };

      this.ws.onclose = () => {
          this.stopHeartbeat();
          if (this.reconnectAttempts < this.maxReconnectAttempts) {
              setTimeout(() => this.connect(url), 3000); // 3秒后重连
              this.reconnectAttempts++;
          }
      };
  }

  // 发送消息
  public send(data: string | object): void {
      if (this.ws?.readyState === WebSocket.OPEN) {
          const message = typeof data === 'string' ? data : JSON.stringify(data);
          this.ws.send(message);
      }
  }

  // 关闭连接
  public disconnect(): void {
      this.ws?.close();
      this.stopHeartbeat();
      this.reconnectAttempts = 0;
  }

  // 注册消息监听
  public addMessageListener(listener: (event: MessageEvent) => void): void {
      this.listeners.push(listener);
  }

  // 注册错误监听
  public addErrorListener(listener: (error: Event) => void): void {
      this.errorListeners.push(listener);
  }

  // 心跳机制（每30秒发送一次）
  private startHeartbeat(): void {
      this.heartbeatInterval = setInterval(() => {
          this.send({ type: "ping" });
      }, 30000);
  }

  private stopHeartbeat(): void {
      if (this.heartbeatInterval) clearInterval(this.heartbeatInterval);
  }
}

// export default WebSocketManager.getInstance();

const useWebSocket = (url: string) => {
  const [status, setStatus] = useState<WebSocketState>('connecting');
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [error, setError] = useState<Event | null>(null);

  // 消息处理回调
  const handleMessage = useCallback((event: MessageEvent) => {
      try {
          const data = JSON.parse(event.data);
          setLastMessage(data);
      } catch (e) {
          console.error("消息解析失败", e);
      }
  }, []);

  // 错误处理回调
  const handleError = useCallback((error: Event) => {
      setError(error);
      setStatus('error');
  }, []);

  // 初始化连接和监听
  useEffect(() => {
      WebSocketManager?.connect(url);
      WebSocketManager?.addMessageListener(handleMessage);
      WebSocketManager?.addErrorListener(handleError);

      return () => {
          // 清理监听（但不关闭连接！）
          WebSocketManager?.disconnect();
      };
  }, [url, handleMessage, handleError]);

  // 发送消息方法
  const sendMessage = useCallback((data: string | object) => {
      WebSocketManager?.send(data);
  }, []);

  // 手动断开连接
  const disconnect = useCallback(() => {
      WebSocketManager?.disconnect();
      setStatus('closed');
  }, []);

  return {
      status,
      lastMessage,
      error,
      sendMessage,
      disconnect
  };
}

export default useWebSocket
