import React, {useState} from 'react'
import {Card, Input, Button, Alert} from "../index"

const SweetForm = ({ sweet, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: sweet?.name || '',
    description: sweet?.description || '',
    price: sweet?.price || '',
    quantityInStock: sweet?.quantityInStock || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isEdit = !!sweet;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    const price = Number(formData.price);
    const quantity = Number(formData.quantityInStock);

    if(Number.isNaN(price)){
        setError("Price must be a valid number.");
        setLoading(false);
        return;
    }
    if(Number.isNaN(quantity)){
        setError("Quantity must be a valid number.");
        setLoading(false);
        return;
    }

    try {
      await onSubmit({
        ...formData,
        price,
        quantityInStock: quantity,
      });
      onCancel();
    } catch (err) {
        if (err?.response?.status === 409) {
            setError("Sweet already exists. Please use a different name.");
        } else {
            setError(err.message || "Something went wrong");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">
        {isEdit ? 'Edit Sweet' : 'Create New Sweet'}
      </h3>

      <div className="space-y-4">
        <Input
          label="Sweet Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Gulab Jamun"
          disabled={loading}
        />

        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Brief description of the sweet"
          disabled={loading}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Price (₹)"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            disabled={loading}
          />

          <Input
            label="Initial Quantity"
            type="number"
            value={formData.quantityInStock}
            onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
            placeholder="0"
            disabled={loading || isEdit}
          />
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex gap-3 pt-2">
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Saving...' : isEdit ? 'Update Sweet' : 'Create Sweet'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SweetForm
