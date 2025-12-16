import React from 'react'

import {Card, Badge, Button} from './index';
import { usePermission } from '../hooks/usePermission';
import { PERMISSIONS } from '../constants/permissions';

const SweetCard = ({ sweet, onEdit, onUpdateInventory }) => {
  const canUpdateSweet = usePermission(PERMISSIONS.UPDATE_SWEET);
  const canUpdateInventory = usePermission(PERMISSIONS.UPDATE_INVENTORY);

  const isLowStock = sweet.quantityInStock < 10;

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-900">{sweet.name}</h3>
        {isLowStock && <Badge variant="danger">Low Stock</Badge>}
      </div>

      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {sweet.description || 'No description available'}
      </p>

      <div className="flex justify-between items-center mb-4">
        <div>
          <p className="text-2xl font-bold text-amber-600">₹{sweet.price}</p>
          <p className="text-xs text-gray-500">per piece</p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-semibold ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
            {sweet.quantityInStock}
          </p>
          <p className="text-xs text-gray-500">in stock</p>
        </div>
      </div>

      <div className="flex gap-2">
        {canUpdateSweet && (
          <Button variant="secondary" onClick={(e) => onEdit(e)} className="flex-1 text-sm">
            Edit Details
          </Button>
        )}
        {canUpdateInventory && (
          <Button variant="primary" onClick={(e) => onUpdateInventory(e)} className="flex-1 text-sm">
            Update Stock
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SweetCard
