import axios from "axios";
import type { HttpError } from "@refinedev/core";

const axiosInstance = axios.create();

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
