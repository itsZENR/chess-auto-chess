import {ref} from "vue";

export function useWebsocket() {

    const sendMessageToServer = (ws, message) => {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    message: message,
                })
            );
        } else {
            console.error("WebSocket is not open to send messages");
        }
    }

    const messageWebsocket = ref(null)
    const receivedWebsocket = (ws) => {
        ws.onmessage = (event) => {
            messageWebsocket.value = JSON.parse(event.data);
        }
    }

    return {sendMessageToServer, receivedWebsocket, messageWebsocket}
}
