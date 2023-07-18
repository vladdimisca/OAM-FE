import mime from "mime";
import axiosInstance from "../util/AxiosUtil";

const register = async (data) => {
  return axiosInstance.post(`/users`, data).then((response) => response.data);
};

const login = async (email, password) => {
  return axiosInstance
    .post(`/users/login`, {
      email,
      password,
    })
    .then((response) => {
      return {
        userId: response.headers.userid,
        token: response.headers.authorization,
      };
    });
};

const getUserById = async (userId) => {
  return axiosInstance
    .get(`/users/${userId}`)
    .then((response) => response.data);
};

const updateUserById = async (userId, user) => {
  return axiosInstance
    .put(`/users/${userId}`, user)
    .then((response) => response.data);
};

const updateProfilePictureById = async (userId, image) => {
  const formDataPayload = new FormData();
  formDataPayload.append("image", {
    uri: image.uri,
    name: image.uri.split("/").pop(),
    type: mime.getType(image.uri),
  });
  return axiosInstance
    .patch(`/users/${userId}/profilePicture`, formDataPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

const changePassword = async (userId, oldPassword, newPassword) => {
  return axiosInstance.patch(`/users/${userId}/password`, {
    newPassword,
    oldPassword,
  });
};

const deleteAccount = async (userId, password) => {
  return axiosInstance.delete(`/users/${userId}`, {
    headers: {
      Password: password,
    },
  });
};

const recoverAccount = async (email) => {
  return axiosInstance
    .post(`/users/${email}/forgotPassword`)
    .then((response) => response.data);
};

export const UserService = {
  register,
  login,
  getUserById,
  updateUserById,
  updateProfilePictureById,
  changePassword,
  deleteAccount,
  recoverAccount,
};
