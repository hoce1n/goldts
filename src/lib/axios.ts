import axios, { InternalAxiosRequestConfig } from "axios"
import { useAuthStore } from "@/stores/auth.store";


let isRefreshing = false;
let failedQueue: {
    resolve: (token: string | null) => void;
    reject: (error: any) => void;
}[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((p) => {
      if (error) p.reject(error);
      else p.resolve(token);
    });
    failedQueue = [];
  };

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    },
    // timeout: 10000
});

api.interceptors.request.use((config: InternalAxiosRequestConfig<any>) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`
    }

    return config;
});


api.interceptors.response.use(
    res => res,
    async (error) => {
        const original = error.config;

        if (error.response?.status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        if (isRefreshing) {
            return new Promise(function (resolve, reject) {
              failedQueue.push({ resolve, reject });
            }).then((token) => {
              original.headers.Authorization = "Bearer " + token;
              return api(original);
            });
        }

        isRefreshing = true;

        try {
            const refreshRes = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/Auth/refresh-token`,
                {},
                { withCredentials: true }
            );

            const newToken = refreshRes.data.data.accessToken;

            useAuthStore.getState().setAccessToken(newToken);

            processQueue(null, newToken);

            original.headers.Authorization = "Bearer " + newToken;

            return api(original);
        } catch (err) {
            processQueue(err, null);

            useAuthStore.getState().setAccessToken(null);
            useAuthStore.getState().setUser(null);

            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);