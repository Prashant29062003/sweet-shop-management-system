import { api } from "./client";

export const createPayment = (data) => {
  return api.post("/payments", data);
};

export const getMyPayments = () => {
  return api.get("/payments");
};

export const adminGetAllPayments = () => {
  return api.get("/payments/admin/all");
};

export const adminUpdatePaymentStatus = (id, status) => {
    return api.patch(`/payments/admin/${id}/status`, { status });
}