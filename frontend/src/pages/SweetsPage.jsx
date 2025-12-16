import { React, useState, useEffect } from "react";
import { usePermission } from "../hooks/usePermission";
import { PERMISSIONS } from "../constants/permissions";
import {
  getSweets,
  createSweet,
  updateSweet,
  updateInventory,
} from "../api/sweet.api";

import {
  Input,
  Button,
  Alert,
  SweetForm,
  InventoryForm,
  SweetCard,
  Card,
  SweetDetailModal,
} from "../components/index";

const SweetsPage = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [updatingInventory, setUpdatingInventory] = useState(null);
  const [searchItem, setSearchItem] = useState("");
  const [previewSweet, setPreviewSweet] = useState(null);

  const canCreateSweet = usePermission(PERMISSIONS.CREATE_SWEET);

  const fetchSweets = async () => {
    try {
      setLoading(true);
      const response = await getSweets();
      setSweets(response || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleCreateSweet = async (data) => {
    const res = await createSweet(data);
    await fetchSweets();
    setShowCreateForm(false);
    return res;
  };

  const handleUpdateSweet = async (data) => {
    await updateSweet(editingSweet._id, data);
    setEditingSweet(null);
    fetchSweets();
  };

  const handleUpdateInventory = async (sweetId, data) => {
    if (!sweetId) {
      throw new Error("Sweet ID missing while updating inventory");
    }
    await updateInventory(sweetId, data);
    setUpdatingInventory(null);
    fetchSweets();
  };

  const filteredSweets = sweets.filter(
    (sweet) =>
      sweet.name.toLowerCase().includes(searchItem.toLowerCase()) ||
      sweet.description.toLowerCase().includes(searchItem.toLowerCase())
  );

  if (loading && sweets.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-2">🍬</div>
          <p className="text-gray-600">Loading sweets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Sweets Management
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            Manage your sweet inventory
          </p>
        </div>
        {canCreateSweet && !showCreateForm && !editingSweet && (
          <Button onClick={() => setShowCreateForm(true)}>
            + Create Sweet
          </Button>
        )}
      </div>

      <div className="flex max-w-lg">
        <Input
          placeholder="Search by sweet name or description..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {(showCreateForm || editingSweet) && (
        <div className="bg-amber-50 p-6 rounded-lg border-2 border-amber-200 mb-8">
          <h3 className="text-lg font-bold mb-4">
            {editingSweet
              ? `Editing: ${editingSweet.name}`
              : "Create New Sweet"}
          </h3>
          <SweetForm
            sweet={editingSweet}
            onSubmit={editingSweet ? handleUpdateSweet : handleCreateSweet}
            onCancel={() => {
              setShowCreateForm(false);
              setEditingSweet(null);
            }}
          />
        </div>
      )}

      {updatingInventory && (
        <InventoryForm
          sweet={updatingInventory}
          onSubmit={handleUpdateInventory}
          onCancel={() => setUpdatingInventory(null)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSweets.map((sweet) => (
          <div
            key={sweet._id}
            onClick={() => setPreviewSweet(sweet)}
            className="cursor-pointer"
          >
            <SweetCard
              sweet={sweet}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingSweet(sweet);
              }}
              onUpdateInventory={(e) => {
                e.stopPropagation();
                setUpdatingInventory(sweet);
              }}
            />
          </div>
        ))}
      </div>

      {previewSweet && (
        <SweetDetailModal
          sweet={previewSweet}
          onClose={() => setPreviewSweet(null)}
        />
      )}

      {filteredSweets.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🍬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchItem ? "No sweets match your search." : "No sweets yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {canCreateSweet
              ? "Create your first sweet to get started"
              : "No sweets have been added yet"}
          </p>
        </Card>
      )}
    </div>
  );
};

export default SweetsPage;
