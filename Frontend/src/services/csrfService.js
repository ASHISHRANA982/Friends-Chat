
import api, { setCsrfToken } from "./api";

export const initializeCsrf = async () => {

    try {

        const response = await api.get("/user/register/get/csrf");

        setCsrfToken(response.data.data);


    } catch (error) {
        throw error;
    }
};