import axiosInstance from "../util/AxiosUtil";

const createAssociation = async (data) => {
  return axiosInstance
    .post(`/associations`, data)
    .then((response) => response.data);
};

const getAssociationById = async (associationId) => {
  return axiosInstance
    .get(`/associations/${associationId}`)
    .then((response) => response.data);
};

const getAssociations = async () => {
  return axiosInstance.get(`/associations`).then((response) => response.data);
};

export const AssociationService = {
  createAssociation,
  getAssociationById,
  getAssociations,
};
