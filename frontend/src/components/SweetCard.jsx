import React from "react";

import { Card, Badge, Button } from "./index";
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";
import { useCart } from "../context";

const SweetCard = ({ sweet, onEdit, onUpdateInventory }) => {
  const canUpdateSweet = usePermission(PERMISSIONS.UPDATE_SWEET);
  const canUpdateInventory = usePermission(PERMISSIONS.UPDATE_INVENTORY);
  const canUpdateUser = usePermission(PERMISSIONS.MANAGE_USERS);

  const isLowStock = sweet.quantityInStock < 10;

  const {addToCart} = useCart();

  const imageSrc = sweet.imageUrl || sweet.image || `https://placehold.co/600x400?text=${encodeURIComponent(sweet.name)}`;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative mb-3">
        <img
          src={imageSrc}
          alt={sweet.name}
          className="w-full h-40 object-cover rounded-md bg-gray-100"
          onError={(e) => {
            e.currentTarget.src = "https://placehold.co/600x400?text=Sweet";
          }}
          loading="lazy"
        />
        {isLowStock && (
          <span className="absolute top-2 right-2">
            <Badge variant="danger">Low Stock</Badge>
          </span>
        )}
        {sweet.category && (
          <span className="absolute bottom-2 left-2">
            <Badge variant="info">{sweet.category}</Badge>
          </span>
        )}
      </div>

      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{sweet.name}</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {sweet.description || "No description available"}
      </p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-amber-600">₹{sweet.price}</p>
          <p className="text-xs text-gray-500">per piece</p>
        </div>
        <div className="text-right">
          <p
            className={`text-lg font-semibold ${
              isLowStock ? "text-red-600" : "text-green-600"
            }`}
          >
            {sweet.quantityInStock} Kg
          </p>
          <p className="text-xs text-gray-500">in stock</p>
        </div>
      </div>

      <div className="flex gap-2">
        {canUpdateSweet && (
          <Button
            variant="secondary"
            onClick={(e) => onEdit(e)}
            className="flex-1 text-sm"
          >
            Edit Details
          </Button>
        )}
        {canUpdateInventory && (
          <Button
            variant="primary"
            onClick={(e) => onUpdateInventory(e)}
            className="flex-1 text-sm"
          >
            Update Stock
          </Button>
        )}

        {!canUpdateUser && (
          <Button
            variant="primary"
            className="flex-1"
            onClick={(e) => {
              e.stopPropagation();
              addToCart(sweet);
            }}
            disabled={sweet.quantityInStock === 0}
          >
            {sweet.quantityInStock === 0 ? "Out of Stock" : "Add to Basket"}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SweetCard;
