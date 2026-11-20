import React from "react";
import { Card, Button, Badge } from "../components";
import Modal from "./Modal";

const PaymentDetailModal = ({ payment, onClose }) => {
  if (!payment) return null;

  const items = Array.isArray(payment.items) ? payment.items : [];
  const total = payment.amount;

  return (
    <Modal isOpen={!!payment} onClose={onClose} size="lg" title="Order Details">
      <div className="space-y-4">

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-gray-500">Order ID</p>
              <p className="font-medium text-gray-900 break-all">{payment._id}</p>
            </div>
            <div>
              <p className="text-gray-500">Date</p>
              <p className="font-medium text-gray-900">
                {new Date(payment.createdAt).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Method</p>
              <p className="font-medium text-gray-900 uppercase">{payment.method}</p>
            </div>
            <div>
              <p className="text-gray-500">Status</p>
              <Badge variant={payment.status === "success" ? "success" : "warning"}>
                {payment.status}
              </Badge>
            </div>
          </div>

          <div className="border-t pt-4">
            <h3 className="font-semibold text-gray-900 mb-2">Items</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item, idx) => {
                const sweet = item.sweet || {};
                const img =
                  (Array.isArray(sweet.images) && sweet.images.length
                    ? sweet.images[0]
                    : null) ||
                  sweet.imageUrl ||
                  "https://placehold.co/80x80?text=Sweet";
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 bg-gray-50 rounded-lg p-2"
                  >
                    <img
                      src={img}
                      alt={sweet.name || "Sweet"}
                      className="w-12 h-12 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = "https://placehold.co/80x80?text=Sweet";
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {sweet.name || "Unknown sweet"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ₹{sweet.price || 0} × {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-bold text-amber-700">
                      ₹{(sweet.price || 0) * item.quantity}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">Total</span>
            <span className="text-lg font-bold text-amber-700">₹{total}</span>
          </div>

        </div>
    </Modal>
  );
};

export default PaymentDetailModal;