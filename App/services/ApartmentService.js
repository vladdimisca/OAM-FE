import axiosInstance from "../util/AxiosUtil";

const createApartment = async (data) => {
  return axiosInstance
    .post(`/apartments`, data)
    .then((response) => response.data);
};

const updateApartmentById = async (apartmentId, data) => {
  return axiosInstance
    .put(`/apartments/${apartmentId}`, data)
    .then((response) => response.data);
};

const getApartmentById = async (apartmentId) => {
  return axiosInstance
    .get(`/apartments/${apartmentId}`)
    .then((response) => response.data);
};

const getApartments = async (associationId) => {
  return axiosInstance
    .get(`/apartments`, { params: { associationId } })
    .then((response) => response.data);
};

const deleteApartmentById = async (apartmentId) => {
  return axiosInstance.delete(`/apartments/${apartmentId}`);
};

const leaveApartmentById = async (apartmentId) => {
  return axiosInstance.post(`/apartments/${apartmentId}/leave`);
};

export const ApartmentService = {
  createApartment,
  updateApartmentById,
  getApartmentById,
  getApartments,
  deleteApartmentById,
  leaveApartmentById,
};
