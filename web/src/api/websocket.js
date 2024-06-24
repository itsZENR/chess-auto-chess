import {ref} from 'vue';

export function connectWebsocket(idRoom, domain) {

    const isConnected = ref(false);
    const useHttps = process.env.NGINX_USE_HTTPS === '1';
    const ws = useHttps ? new WebSocket(`wss://${domain}/ws/${idRoom}/`) : new WebSocket(`ws://${domain}/ws/${idRoom}/`)

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
