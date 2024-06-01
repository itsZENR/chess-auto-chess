// websocket.js
export class WebSocketHandler {
  constructor() {
    this.chatSocket = null;
  }

  connect(roomName) {
    this.chatSocket = new WebSocket(
      "ws://" + window.location.host + "/ws/game/" + roomName + "/"
    );

    this.chatSocket.addEventListener("open", () => {
      this.onSocketOpen();
    });

    this.chatSocket.addEventListener("message", (event) => {
      this.onSocketMessage(event);
    });

    this.chatSocket.addEventListener("close", () => {
      this.onSocketClose();
    });

    this.chatSocket.addEventListener("error", (error) => {
      this.onSocketError(error);
    });
  }

  onSocketOpen() {
    console.log("WebSocket connection opened");
    return true;
  }

  onSocketMessage(event) {
    const data = JSON.parse(event.data);
    console.log("WebSocket received message:", data);
    if (this.messageHandler) {
      this.messageHandler(data);
    }
  }

  onSocketClose() {
    console.log("WebSocket connection closed");
  }

  onSocketError(error) {
    console.error("WebSocket error:", error);
    // Обработка ошибок WebSocket
  }

  sendMessageToServer(message) {
    if (this.chatSocket.readyState === WebSocket.OPEN) {
      this.chatSocket.send(
        JSON.stringify({
          message: message,
        })
      );
    } else {
      console.error("WebSocket is not open to send messages");
    }
  }
}
