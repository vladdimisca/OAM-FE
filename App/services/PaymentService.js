import axiosInstance from "../util/AxiosUtil";

const create = async (invoiceDistributionIds) => {
  return axiosInstance
    .post(`/payments`, invoiceDistributionIds)
    .then((response) => response.data);
};

const getPayments = async () => {
  return axiosInstance.get(`/payments`).then((response) => response.data);
};

const getPaymentById = async (paymentId) => {
  return axiosInstance
    .get(`/payments/${paymentId}`)
    .then((response) => response.data);
};

export const PaymentService = {
  create,
  getPayments,
  getPaymentById,
};
