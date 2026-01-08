import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

const createAxiosInstance = (config = {}) =>
  axios.create({
    baseURL,
    timeout: 20000, // 20 seconds
    ...config,
  });

export const axiosPublic = createAxiosInstance();
export const axiosPrivate = createAxiosInstance();

axiosPrivate.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.accessToken) {
      config.headers.Authorization = `Bearer ${session.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await signOut({ callbackUrl: "/signin" });
    }

    return Promise.reject(error);
  }
);
