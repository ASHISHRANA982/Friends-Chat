import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { toast } from "sonner";
import { toastStyles } from "../../components/common/toastStyles";
import { getCsrfToken } from "../api";

const SOCKET_URL = import.meta.env.VITE_API_URL;

let stompClient = null;

export const connectWebSocket = async (onMessageReceived) => {

    if (stompClient && stompClient.active) {
        return;
    }

    try {

        const csrfToken = await getCsrfToken();

        if (!csrfToken) {
            throw new Error("CSRF token not available");
        }

        stompClient = new Client({

            webSocketFactory: () => {
                return new SockJS(`${SOCKET_URL}/chat`);
            },

            connectHeaders: {
                "X-XSRF-TOKEN": csrfToken
            },

            reconnectDelay: 5000,

            onConnect: () => {

                console.log("WebSocket connected");

                stompClient.subscribe("/user/queue/message", (message) => {
                    onMessageReceived(JSON.parse(message.body));
                });

                stompClient.subscribe("/user/queue/errors", (message) => {

                    const error = JSON.parse(message.body);

                    toast.warning(error.message, {
                        style: toastStyles.warning
                    });
                });
            },

            onStompError: (frame) => {

                const message =
                    frame.headers["message"] || "Something went wrong";

                toast.warning(message, {
                    style: toastStyles.warning
                });
            },

            onWebSocketError: (e) => {
                console.error("Socket Error", e);
            },

            onWebSocketClose: (event) => {
                console.log("Socket closed:", event.code, event.reason);
            }
        });

        stompClient.activate();

    } catch (error) {

        console.error("WebSocket initialization failed:", error);

        toast.warning("Unable to initialize chat connection", {
            style: toastStyles.warning
        });
    }
};

export const sendMessage = (receiverId, content) => {

    if (!stompClient || !stompClient.connected) {

        toast.warning("Validate Your Credential", {
            style: toastStyles.warning
        });

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
