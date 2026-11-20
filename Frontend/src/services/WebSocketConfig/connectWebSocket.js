import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";
import { toastStyles } from "../../components/common/toastStyles";

const SOCKET_URL = import.meta.env.VITE_WS_URL;

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {

    if (stompClient && stompClient.active) {
        return;
    }

    stompClient = new Client({
        webSocketFactory: () => new SockJS(`${SOCKET_URL}/chat`),

        reconnectDelay: 5000,

        onConnect: () => {

            stompClient.subscribe("/user/queue/message", (message) => {
                onMessageReceived(JSON.parse(message.body));
            });

            stompClient.subscribe("/user/queue/errors", (message) => {
                const error = JSON.parse(message.body);
                toast.warning(error.message, { style: toastStyles.warning });
            });
        },

        onStompError: (frame) => {
            const message = frame.headers["message"] || "Something went wrong";
            toast.warning(message, { style: toastStyles.warning });
        },

        onWebSocketError: (e) => {
            console.log("Socket Error", e);
        }
    });

    stompClient.activate();
};

export const sendMessage = (receiverId, content) => {

    if (!stompClient || !stompClient.connected) {
        toast.warning("Validate Your Credential", { style: toastStyles.warning });
        return;
    }

    stompClient.publish({
        destination: "/app/private-chat",
        body: JSON.stringify({ receiverId, content })
    });
};

export const disconnect = () => {
    if (stompClient) {
        stompClient.deactivate();
        stompClient = null;
    }
};
