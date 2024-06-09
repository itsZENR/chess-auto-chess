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

    return {sendMessageToServer}
}
