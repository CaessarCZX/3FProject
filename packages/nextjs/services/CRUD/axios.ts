import axios, { AxiosRequestConfig } from "axios";

const serverURL = process.env.NEXT_PUBLIC_API_BACKEND;

export const ConfigApp: AxiosRequestConfig = {
  headers: { "Content-Type": "application/json" },
};

const instance = axios.create({
  baseURL: serverURL,
  withCredentials: true,
});

export default instance;
