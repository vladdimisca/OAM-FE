import axiosInstance from "../util/AxiosUtil";

const createComment = async (comment) => {
  return axiosInstance
    .post(`/comments`, comment)
    .then((response) => response.data);
};

const getCommentById = async (commentId) => {
  return axiosInstance
    .get(`/comments/${commentId}`)
    .then((response) => response.data);
};

const getComments = async () => {
  return axiosInstance.get(`/comments`).then((response) => response.data);
};

const deleteCommentById = async (commentId) => {
  return axiosInstance.delete(`/comments/${commentId}`);
};

export const CommentService = {
  createComment,
  getCommentById,
  getComments,
  deleteCommentById,
};
