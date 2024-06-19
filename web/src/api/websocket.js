import {ref} from 'vue';

export function connectWebsocket(idRoom) {

    const url = process.env.VUE_APP_URL
    const isConnected = ref(false);
    const ws = new WebSocket(`ws://${url}/ws/${idRoom}/`)

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
