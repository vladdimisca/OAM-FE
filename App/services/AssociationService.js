import axiosInstance from "../util/AxiosUtil";

const createAssociation = async (data) => {
  return axiosInstance
    .post(`/associations`, data)
    .then((response) => response.data);
};

const updateAssociationById = async (associationId, data) => {
  return axiosInstance
    .put(`/associations/${associationId}`, data)
    .then((response) => response.data);
};

const getAssociationById = async (associationId) => {
  return axiosInstance
    .get(`/associations/${associationId}`)
    .then((response) => response.data);
};

const getAssociations = async (role) => {
  return axiosInstance
    .get(`/associations`, { params: { role } })
    .then((response) => response.data);
};

const deleteAssociationById = async (associationId) => {
  return axiosInstance.delete(`/associations/${associationId}`);
};

const joinAssociation = async (code) => {
  return axiosInstance.post(`/associations/join`, "", { params: { code } });
};

export const AssociationService = {
  createAssociation,
  updateAssociationById,
  getAssociationById,
  getAssociations,
  deleteAssociationById,
  joinAssociation,
};
