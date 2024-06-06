export function connectWebsocket() {
    console.log("Starting connection to WebSocket Server")
    const ws = new WebSocket("wss://echo.websocket.org")

    ws.onopen = function (event) {
        console.log("Успешное подключение к websocket")
    }

    ws.onmessage = function (event) {
        console.log("onmessage", event.data);
    }

    ws.onclose = function () {
        console.log("Соединение Websocket закрыто");
    }

     ws.onerror = function (error) {
        console.error("Error", error.detail);
    }

    return {ws}
}
