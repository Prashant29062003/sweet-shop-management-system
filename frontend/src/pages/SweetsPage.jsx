import { React, useState, useEffect, useRef } from "react";
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
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState("");

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSweet, setEditingSweet] = useState(null);
  const [updatingInventory, setUpdatingInventory] = useState(null);
  const [previewSweet, setPreviewSweet] = useState(null);

  const [searchItem, setSearchItem] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(9);

  const cacheRef = useRef(new Map());
  const canCreateSweet = usePermission(PERMISSIONS.CREATE_SWEET);

  // Debounce logic
  useEffect(() => {
    if (searchItem) setIsTyping(true);

    const handler = setTimeout(() => {
      setDebouncedSearch(searchItem);
      setIsTyping(false);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchItem]);

  const getQueryKey = () =>
    `${currentPage}|${limit}|${debouncedSearch}|${category}|${sort}`;

  const fetchSweets = async () => {
    const key = getQueryKey();
    const cached = cacheRef.current.get(key);
    if (cached) {
      setSweets(cached.sweets || []);
      setTotalPages(cached.totalPages || 1);
      setError("");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const response = await getSweets(currentPage, limit, debouncedSearch, category, sort);
      const sweets = response.sweets || [];
      const totalPages = response.pagination.totalPages || 1;
      setSweets(sweets);
      setTotalPages(totalPages);
      cacheRef.current.set(key, { sweets, totalPages });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, [currentPage, debouncedSearch, category, sort]);

  // Reset to page 1 on search/category/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, category, sort]);

  const invalidateCache = () => cacheRef.current.clear();

  const handleCreateSweet = async (data) => {
    const res = await createSweet(data);
    invalidateCache();
    await fetchSweets();
    setShowCreateForm(false);
    return res;
  };

  const handleUpdateSweet = async (data) => {
    await updateSweet(editingSweet._id, data);
    setEditingSweet(null);
    invalidateCache();
    fetchSweets();
  };

  const handleUpdateInventory = async (sweetId, data) => {
    if (!sweetId) {
      throw new Error("Sweet ID missing while updating inventory");
    }
    await updateInventory(sweetId, data);
    setUpdatingInventory(null);
    invalidateCache();
    fetchSweets();
  };

  if (loading && sweets.length === 0) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border p-4 animate-pulse space-y-3"
            >
              <div className="h-40 bg-gray-200 rounded-md" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
              <div className="h-8 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
        <p className="text-center text-gray-500">Loading sweets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {canCreateSweet && !showCreateForm && !editingSweet && (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 md:p-8 border border-amber-100">


          <Button onClick={() => setShowCreateForm(true)} className="self-start">
            + Create Sweet
          </Button>
        </div>
      )}

      <Card className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
          <div className="md:col-span-2 relative">
            <Input
              label="Search"
              placeholder="Search by name, description or category..."
              value={searchItem}
              onChange={(e) => setSearchItem(e.target.value)}
            />
            {searchItem && (
              <button
                type="button"
                onClick={() => setSearchItem("")}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
            {(isTyping || loading) && (
              <div className="absolute right-8 top-9 flex items-center">
                <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Category</label>
            <select
              className="p-2 border rounded-md bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {["Indian", "International", "Chocolate", "Candy", "Bakery", "Dry Fruits", "Festival Special", "Other"].map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Sort</label>
            <select
              className="p-2 border rounded-md bg-white"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="name_asc">Name A-Z</option>
              <option value="name_desc">Name Z-A</option>
              <option value="price_asc">Price Low-High</option>
              <option value="price_desc">Price High-Low</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            {loading
              ? "Loading..."
              : sweets.length > 0
              ? `Showing ${sweets.length} of ${totalPages * limit || sweets.length} sweets`
              : "No sweets to display"}
          </span>
          {(searchItem || category !== "all" || sort !== "newest") && (
            <button
              type="button"
              onClick={() => {
                setSearchItem("");
                setCategory("all");
                setSort("newest");
              }}
              className="text-amber-700 hover:underline font-medium"
            >
              Clear filters
            </button>
          )}
        </div>
      </Card>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sweets.map((sweet) => (
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
      <div className="flex flex-col items-center space-y-4 mt-10 pb-10">
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="secondary"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>

          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => setCurrentPage(index + 1)}
                className={`w-10 h-10 rounded-full border ${currentPage === index + 1
                    ? "bg-amber-500 text-white border-amber-500"
                    : "bg-white text-gray-600 hover:bg-amber-50"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <Button
            variant="secondary"
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
        <p className="text-sm text-gray-500">
          Showing Page {currentPage} of {totalPages}
        </p>
      </div>

      {previewSweet && (
        <SweetDetailModal
          sweet={previewSweet}
          onClose={() => setPreviewSweet(null)}
        />
      )}

      {sweets.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🍬</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchItem || category !== "all"
              ? "No sweets match your filters."
              : "No sweets yet"}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchItem || category !== "all"
              ? "Try a different search or clear filters."
              : canCreateSweet
                ? "Create your first sweet to get started"
                : "No sweets have been added yet"}
          </p>
          {(searchItem || category !== "all" || sort !== "newest") && (
            <Button
              variant="secondary"
              onClick={() => {
                setSearchItem("");
                setCategory("all");
                setSort("newest");
              }}
            >
              Clear filters
            </Button>
          )}
        </Card>
      )}
    </div>
  );
};

export default SweetsPage;
