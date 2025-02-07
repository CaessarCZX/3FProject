import { getDataApi, postDataApi, putDataApi } from "..";

const addWithdrawalWallet = async (userId: string, payload: object) => {
  try {
    const response = await postDataApi(`withdrawalWallet/add/${userId}`, payload);

    if (response.status !== 200) {
      throw new Error("A bad response was received");
    }

    const { data } = response;

    return data;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
    return null;
  }
};

const updateWithdrawalWallet = async (userId: string, payload: object) => {
  try {
    const response = await putDataApi(`withdrawalWallet/update/${userId}`, payload);

    if (response.status !== 200) {
      throw new Error("A bad response was received");
    }

    const { data } = response;

    return data;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
    return null;
  }
};

const deleteWithdrawalWallet = async (userId: string) => {
  try {
    const response = await getDataApi(`withdrawalWallet/delete/${userId}`);

    if (response.status !== 200) {
      throw new Error("A bad response was received");
    }
    console.log(response);
    const { data } = response;

    return data;
  } catch (e) {
    console.error("An unespected mistake has occurred", e);
    return null;
  }
};

export { addWithdrawalWallet, updateWithdrawalWallet, deleteWithdrawalWallet };
