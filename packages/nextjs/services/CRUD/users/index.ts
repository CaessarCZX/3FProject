import { getDataApi, putDataApi } from "..";

export const updateUser = async (userId: string, payload: object) => {
  try {
    const response = await putDataApi(`users/${userId}`, payload);
    return response;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
  }
};

export const getUser = async (userId: string) => {
  try {
    const response = await getDataApi(`users/${userId}`);

    if (response.status !== 200) {
      throw new Error("A bad response was received");
    }

    const { data } = response;

    return data;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
  }
};
