import apiRequest from "..";

const addWithdrawalWallet = (userId: string, payload: object) =>
  apiRequest("POST", `withdrawalWallet/add/${userId}`, payload);

const updateWithdrawalWallet = (userId: string, payload: object) =>
  apiRequest("PUT", `withdrawalWallet/update/${userId}`, payload);

const deleteWithdrawalWallet = (userId: string) => apiRequest("GET", `withdrawalWallet/delete/${userId}`);

export { addWithdrawalWallet, updateWithdrawalWallet, deleteWithdrawalWallet };
