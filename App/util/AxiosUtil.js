import axios from "axios";
import { CommonActions } from "@react-navigation/routers";

// navigation
import * as RootNavigation from "./RootNavigation";

// storage
import { UserStorage } from "./UserStorage";

// config
import config from "../../config";

const axiosInstance = axios.create({
  baseURL: config.BACKEND_BASE_URL,
});

const errorHandler = async (error) => {
  if (
    error?.response?.status === 403 &&
    error?.response?.config?.url !== "/users/login" &&
    error?.response?.data === ""
  ) {
    await UserStorage.clearStorage();

    RootNavigation.dispatch(
      CommonActions.reset({
        index: 0,
        key: null,
        routes: [
          {
            name: "Authentication",
            state: {
              routes: [{ name: "Login" }],
            },
          },
        ],
      })
    );

    return new Promise(() => {});
  }

  return Promise.reject(error);
};

axiosInstance.interceptors.request.use(
  async (request) => {
    const { token } = await UserStorage.retrieveUserIdAndToken();
    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }
    return request;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => errorHandler(error)
);

export default axiosInstance;
