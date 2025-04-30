import axios from "axios";
import type { HttpError } from "@refinedev/core";
import { TOKEN_KEY } from "@/authProvider";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: HttpError = {
      ...error,
      message: error.response?.data?.message,
      statusCode: error.response?.status || error.response?.data?.status,
    };

    return Promise.reject(customError);
  },
);

export { axiosInstance };
