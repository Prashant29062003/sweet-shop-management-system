import { React, useState, useEffect, useMemo } from "react";
import { Card, Alert, Badge, Input, Button } from "../components";
import { api } from "../api/client";
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    price: 0,
    quantityInStock: 0,
    description: "",
  });

  const canUpdateSweet = usePermission(PERMISSIONS.UPDATE_SWEET);
  const canUpdateStock = usePermission(PERMISSIONS.UPDATE_INVENTORY);
  const hasAnyEditPermission = canUpdateSweet || canUpdateStock;

  const filteredInventory = useMemo(() => {
    if (!showLowStockOnly) return inventory;
    return inventory.filter((item) => item.quantityInStock < 10);
  }, [inventory, showLowStockOnly]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await api.get("/inventory");
      setInventory(response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const openUpdateModal = (item) => {
    setFormData({
      id: item._id,
      name: item.name,
      price: item.price,
      quantityInStock: item.quantityInStock,
      description: item.description || "",
    });
    setIsModalOpen(true);
  };

  const handleUpdateProduct = async () => {
    if (formData.quantityInStock < 0) return alert("Stock can't be negative.");

    try {
      setUpdateLoading(true);

      let payload = {};
      let response;

      if (canUpdateSweet) {
        payload = {
          name: formData.name,
          price: Number(formData.price),
          quantityInStock: Number(formData.quantityInStock),
          description: formData.description,
        };

        response = await api.put(`/sweets/${formData.id}`, payload);
        
      } else {
        payload = {
          quantityInStock: Number(formData.quantityInStock),
        };

        response = await api.patch(`/sweets/${formData.id}/inventory`, payload);
      }

      await fetchInventory();
      setIsModalOpen(false);
    } catch (err) {
      const message = err.response?.message || err.message;
      alert("Failed to update: " + message);
    } finally {
      setUpdateLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-2">📊</div>
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    );
  }

  const totalItems = inventory.length;

  const lowStockCount = inventory.filter(
    (item) => item.quantityInStock < 10
  ).length;

  const totalStockValue = inventory.reduce(
    (acc, item) => acc + item.price * item.quantityInStock,
    0
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Inventory Overview</h2>
        <p className="text-gray-600 text-sm mt-1">
          Monitor stock levels across all products
        </p>
      </div>

      {hasAnyEditPermission && (
        <div className="flex justify-between items-center gap-3 bg-white p-2 px-4 rounded-lg border shadow-sm">
          <div>
            <span className="text-sm font-medium text-gray-700">Edit Mode</span>
          <button
            onClick={() => setIsEditMode(!isEditMode)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              isEditMode ? "bg-amber-500" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isEditMode ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          </div>

          <div>
            <button
              onClick={() => setShowLowStockOnly(!showLowStockOnly)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all ${
                showLowStockOnly
                  ? "bg-red-50 border-red-200 text-red-700 shadow-sm"
                  : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <span
                className={showLowStockOnly ? "text-red-500" : "text-gray-400"}
              >
                ⚠️
              </span>
              Low Stock Only ({lowStockCount})
            </button>
          </div>
        </div>
      )}

      {error && <Alert variant="error">{error}</Alert>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-amber-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Total Products
          </p>
          <p className="text-2xl font-bold">{totalItems}</p>
        </Card>

        <Card className="p-4 border-l-4 border-red-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Low Stock Alerts
          </p>
          <p className="text-2xl font-bold text-red-600">{lowStockCount}</p>
        </Card>

        <Card className="p-4 border-l-4 border-green-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Inventory Value
          </p>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-blue-500">
          <p className="text-sm text-gray-500 uppercase font-bold">
            Potential Sales Value
          </p>
          <p className="text-2xl font-bold text-blue-600">
            ₹{totalStockValue.toLocaleString("en-IN")}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Based on current stock and prices
          </p>
        </Card>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sweet Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                {isEditMode && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-amber-600 uppercase">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInventory.map((item) => (
                <tr
                  key={item._id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-400 truncate max-w-[200px]">
                      {item.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">₹{item.price}</td>
                  <td className="px-6 py-4 text-sm">{item.quantityInStock}</td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={item.quantityInStock < 10 ? "danger" : "success"}
                    >
                      {item.quantityInStock < 10 ? "Low Stock" : "Healthy"}
                    </Badge>
                  </td>
                  {isEditMode && (
                    <td className="px-6 py-4 text-right">
                      <Button size="sm" onClick={() => openUpdateModal(item)}>
                        {canUpdateSweet ? "Edit All" : "Update Stock"}
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {filteredInventory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-gray-600">
                {showLowStockOnly
                  ? "Great! No low stock items found."
                  : "No inventory data available"}
              </p>
              {showLowStockOnly && (
                <button
                  onClick={() => setShowLowStockOnly(false)}
                  className="mt-2 text-amber-600 text-sm font-medium hover:underline"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h3 className="text-xl font-bold">
              {canUpdateSweet
                ? "Edit Product Details"
                : "Update Stock Quantity"}
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Sweet Name {!canUpdateSweet && "🔒"}
                </label>
                <Input
                  disabled={!canUpdateSweet}
                  className={
                    !canUpdateSweet ? "bg-gray-100 cursor-not-allowed" : ""
                  }
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Price (₹)
                </label>
                <Input
                  type="number"
                  disabled={!canUpdateSweet}
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500">
                  Stock Quantity
                </label>
                <Input
                  type="number"
                  autoFocus={!canUpdateSweet}
                  value={formData.quantityInStock}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantityInStock: e.target.value,
                    })
                  }
                />
              </div>

              <div className="col-span-2">
                <label className="text-xs font-bold uppercase text-gray-500">
                  Description
                </label>
                <textarea
                  disabled={!canUpdateSweet}
                  className={`w-full border rounded-md p-2 text-sm outline-none focus:ring-2 focus:ring-amber-500 ${
                    !canUpdateSweet ? "bg-gray-50 text-gray-400" : ""
                  }`}
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleUpdateProduct}
                disabled={updateLoading}
              >
                {updateLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryPage;
