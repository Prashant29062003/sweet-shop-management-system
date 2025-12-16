import React from "react";
import { Card, Button, Badge } from "../components"; 

const SweetDetailModal = ({ sweet, onClose }) => {
  if (!sweet) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl relative animate-in fade-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-semibold text-xl rounded-4xl border cursor-pointer border-red-500 hover:bg-red-300 w-8 h-8 hover:border-red-300"
        >
          X
        </button>

        <div className="md:flex">
          <div className="md:w-1/2">
            <img
              src={sweet.image || "https://via.placeholder.com/300?text=Sweet" || ""}
              alt={sweet.name}
              className="w-full h-64 object-cover rounded-l-lg"
            />
          </div>
          <div className="p-6 md:w-1/2 space-y-4">
            <Badge variant="info" className="mb-2">
              {sweet.category || "Confectionery"}
            </Badge>
            <h2 className="text-3xl font-bold text-gray-900">{sweet.name}</h2>
            <p className="text-gray-600">{sweet.description}</p>

            <div className="pt-4 border-t">
              <div className="flex justify-between mb-2">
                <span className="text-gray-500">Price per unit:</span>
                <span className="font-bold text-amber-700 text-xl">
                  ₹{sweet.price}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Available Stock:</span>
                <span
                  className={`font-bold ${
                    sweet.quantityInStock < 10
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {sweet.quantityInStock} units
                </span>
              </div>
            </div>

            <Button onClick={onClose} className="w-full mt-6">
              Close Preview
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SweetDetailModal;
