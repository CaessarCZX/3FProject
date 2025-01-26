import { putDataApi } from "..";

export const updateUser = async (userId: string, payload: object) => {
  try {
    const response = putDataApi(`users/${userId}`, payload);
    return response;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
  }
};
