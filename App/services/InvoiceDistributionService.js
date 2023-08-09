import axiosInstance from "../util/AxiosUtil";

const getInvoiceDistributionById = async (invoiceId) => {
  return axiosInstance
    .get(`/invoiceDistributions/${invoiceId}`)
    .then((response) => response.data);
};

const getInvoiceDistributions = async () => {
  return axiosInstance
    .get(`/invoiceDistributions`)
    .then((response) => response.data);
};

export const InvoiceDistributionService = {
  getInvoiceDistributionById,
  getInvoiceDistributions,
};
