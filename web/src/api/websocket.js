export function connectWebsocket(idRoom) {
    console.log("Starting connection to WebSocket Server")
    const ws = new WebSocket(`ws://127.0.0.1:80/ws/${idRoom}/`)

    ws.onopen = function (event) {
        console.log("Успешное подключение к websocket")
        ws.send(JSON.stringify({
          message: "hii",
        }));
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
