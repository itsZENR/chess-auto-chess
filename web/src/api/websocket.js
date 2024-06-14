import {ref} from 'vue';

export function connectWebsocket(idRoom) {
    console.log("Starting connection to WebSocket Server")
    const isConnected = ref(false);
    // const ws = new WebSocket(`ws://127.0.0.1:80/ws/${idRoom}/`)
    const ws = new WebSocket(`ws://195.133.48.150:80/ws/${idRoom}/`)

    ws.onopen = function (event) {
        console.log("Успешное подключение к websocket")
        isConnected.value = true
        ws.send(JSON.stringify({
            message: "Игрок",
        }));
    }

    ws.onclose = function () {
        console.log("Соединение Websocket закрыто");
    }

    ws.onerror = function (error) {
        console.error("Error", error.detail);
    }

    return {ws, isConnected}
}
