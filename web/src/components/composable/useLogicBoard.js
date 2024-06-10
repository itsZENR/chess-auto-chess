export function useLogicBoard() {

    const receivedWebsocket = (ws) => {
        ws.onmessage = function (event) {
            const data = JSON.parse(event.data);
            console.log("==New message:==", data);
        }
    }

    return {receivedWebsocket}
}