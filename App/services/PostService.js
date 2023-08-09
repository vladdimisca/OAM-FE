import axiosInstance from "../util/AxiosUtil";

const createPost = async (post) => {
  return axiosInstance.post(`/posts`, post).then((response) => response.data);
};

const getPostById = async (postId) => {
  return axiosInstance
    .get(`/posts/${postId}`)
    .then((response) => response.data);
};

const getPosts = async () => {
  return axiosInstance.get(`/posts`).then((response) => response.data);
};

const deletePostById = async (postId) => {
  return axiosInstance.delete(`/posts/${postId}`);
};

export const PostService = {
  createPost,
  getPostById,
  getPosts,
  deletePostById,
};
