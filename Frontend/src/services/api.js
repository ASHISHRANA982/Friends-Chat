import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,

    headers: {
        "Content-Type": "application/json",
    },

    withCredentials: true,

    withXSRFToken: false
});

let csrfToken = null;

export const setCsrfToken = (token) => {
    csrfToken = token;
};

api.interceptors.request.use((config) => {

    const method = config.method?.toLowerCase();

    const safeMethods = ["get", "head", "options"];

    if (!safeMethods.includes(method) && csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
});

export default api;


export const getCsrfToken =() => {
    return csrfToken;
};