import axiosInstance from "../util/AxiosUtil";

const createInvoice = async (invoice, invoicePayload) => {
  const formDataPayload = new FormData();
  formDataPayload.append("invoice", JSON.stringify(invoicePayload));
  if (invoice !== null) {
    formDataPayload.append("document", {
      uri: invoice.uri,
      name: invoice.name,
      type: invoice.mimeType,
    });
  }
  return axiosInstance
    .post(`/invoices`, formDataPayload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => response.data);
};

const getInvoiceById = async (invoiceId) => {
  return axiosInstance
    .get(`/invoices/${invoiceId}`)
    .then((response) => response.data);
};

const getInvoices = async () => {
  return axiosInstance.get(`/invoices`).then((response) => response.data);
};

const deleteInvoiceById = async (invoiceId) => {
  return axiosInstance.delete(`/invoices/${invoiceId}`);
};

export const InvoiceService = {
  createInvoice,
  getInvoiceById,
  getInvoices,
  deleteInvoiceById,
};
