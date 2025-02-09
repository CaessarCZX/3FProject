import axios from "./axios";
import { ConfigApp } from "./axios";

export const getDataApi = async (url: string) => {
  const res = await axios.get(`/f3api/${url}`, {});
  return res;
};

export const postDataApi = async (url: string, post: object) => {
  const res = await axios.post(`/f3api/${url}`, post, ConfigApp);
  return res;
};

export const putDataApi = async (url: string, post: object) => {
  const res = await axios.put(`/f3api/${url}`, post, ConfigApp);
  return res;
};

export const patchDataApi = async (url: string, post: object) => {
  const res = await axios.patch(`/f3api/${url}`, post, {});
  return res;
};

export const deleteDataApi = async (url: string) => {
  const res = await axios.delete(`/f3api/${url}`, {});
  return res;
};

const apiRequest = async <T extends "GET" | "DELETE" | "POST" | "PUT">(
  method: T,
  endpoint: string,
  payload?: T extends "POST" | "PUT" ? object : undefined,
) => {
  try {
    const REQUEST_METHOD = {
      GET: () => getDataApi(endpoint),
      POST: () => postDataApi(endpoint, payload as object),
      PUT: () => putDataApi(endpoint, payload as object),
      DELETE: () => deleteDataApi(endpoint),
    };

    if (!(method in REQUEST_METHOD)) throw new Error("Invalid method selected");

    const response = await REQUEST_METHOD[method]();

    if (response.status !== 200) {
      throw new Error("A bad response was received");
    }

    return response.data;
  } catch (e) {
    console.error("An unexpected mistake has occurred", e);
    return null;
  }
};

export default apiRequest;
