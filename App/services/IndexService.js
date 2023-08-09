import axiosInstance from "../util/AxiosUtil";

const createIndex = async (indexPayload) => {
  return axiosInstance
    .post(`/indexes`, indexPayload)
    .then((response) => response.data);
};

const getIndexById = async (indexId) => {
  return axiosInstance
    .get(`/indexes/${indexId}`)
    .then((response) => response.data);
};

const getIndexes = async () => {
  return axiosInstance.get(`/indexes`).then((response) => response.data);
};

const deleteIndexById = async (indexId) => {
  return axiosInstance.delete(`/indexes/${indexId}`);
};

export const IndexService = {
  createIndex,
  getIndexById,
  getIndexes,
  deleteIndexById,
};
