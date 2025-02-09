import apiRequest from "..";

const updateUser = async (userId: string, payload: object) => apiRequest("PUT", `users/${userId}`, payload);

const getUser = async (userId: string) => apiRequest("GET", `users/${userId}`);

export { updateUser, getUser };
