class SocketService {
    constructor() {
        this.socket = null;
        this.onMessage = null;
        this.reconnectTimer = null;
    }

    connect(token, onMessageCallback) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) return;

        this.onMessage = onMessageCallback;

        // Token is passed as query param - browsers cannot send custom headers during WS upgrade
        const wsUrl = import.meta.env.VITE_WS_URL || `ws://localhost:8080/api/v1/ws/chat?token=${token}`;
        // Ensure token is attached if using the base URL from env
        const finalUrl = wsUrl.includes('?token=') ? wsUrl : `${wsUrl}?token=${token}`;
        
        this.socket = new WebSocket(finalUrl);

        this.socket.onopen = () => {
            console.log('[WS] Connected to chat server');
        };

        this.socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (this.onMessage) {
                    this.onMessage(data);
                }
            } catch (err) {
                console.error('[WS] Failed to parse message:', err);
            }
        };

        this.socket.onerror = (err) => {
            console.error('[WS] Error:', err);
        };

        this.socket.onclose = () => {
            console.log('[WS] Connection closed');
            this.socket = null;
        };
    }

    disconnect() {
        if (this.reconnectTimer) {
            clearTimeout(this.reconnectTimer);
            this.reconnectTimer = null;
        }
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    isConnected() {
        return this.socket && this.socket.readyState === WebSocket.OPEN;
    }
}

const socketService = new SocketService();
export default socketService;
