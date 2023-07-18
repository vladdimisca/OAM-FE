import axiosInstance from "../util/AxiosUtil";

const createApartment = async (data) => {
  return axiosInstance
    .post(`/apartments`, data)
    .then((response) => response.data);
};

const getApartmentById = async (associationId) => {
  return axiosInstance
    .get(`/apartments/${associationId}`)
    .then((response) => response.data);
};

const getApartments = async () => {
  return axiosInstance.get(`/apartments`).then((response) => response.data);
};

export const ApartmentService = {
  createApartment,
  getApartmentById,
  getApartments,
};
