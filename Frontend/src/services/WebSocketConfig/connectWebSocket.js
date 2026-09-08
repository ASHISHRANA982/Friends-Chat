import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import Cookies from "js-cookie";
import { toast } from "sonner";
const SOCKET_URL = import.meta.env.VITE_API_URL;
import { toastStyles } from "../../components/common/toastStyles";

let stompClient = null;

export const connectWebSocket = (onMessageReceived) => {

    if (stompClient && stompClient.connected) {
        return;
    }

    const token = Cookies.get("token");
    const socket = new SockJS(`${SOCKET_URL}/chat`);

    stompClient = new Client({
        webSocketFactory: () => socket,

        connectHeaders: {
            Authorization: `Bearer ${token}`
        },

        reconnectDelay: 5000,

        onConnect: () => {

            stompClient.subscribe("/user/queue/message", (message) => {
                onMessageReceived(JSON.parse(message.body));

            });

            stompClient.subscribe("/user/queue/errors", (message) => {

                const error = JSON.parse(message.body);

                toast.warning(error.message,
                    {
                        style: toastStyles.warning
                    }
                )
            });

        },

        onStompError: (frame) => {
            const message =
                frame.headers["message"] || "Something went wrong";

            toast.warning(message
                , {
                    style: toastStyles.warning
                }
            )
        },

        onWebSocketError: (e) => {
            console.log("Socket Error", e);
        }

    });

    stompClient.activate();
};

export const sendMessage = (receiverId, content) => {

    if (!stompClient || !stompClient.connected) {
        
        toast.warning("Validate Your Credential"
            , {
                style: toastStyles.warning
            }


        )
        return;
    }
    const token = Cookies.get("token");

    stompClient.publish({
        destination: "/app/private-chat",
        headers: {
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            receiverId,
            content
        })
    });
};

export const disconnect = () => {

    if (stompClient) {
        stompClient.deactivate();
    }

};
