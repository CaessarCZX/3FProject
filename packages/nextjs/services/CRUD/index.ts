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
