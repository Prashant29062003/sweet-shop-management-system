import {React, useState} from 'react'
import {Card, Input, Alert, Button } from '../index';
import { useAuth } from '../../context';


const InventoryForm = ({ sweet, onSubmit, onCancel }) => {
  const { user } = useAuth();
  if(user && user.role !== 'admin' && user.role !== 'staff'){
    return (
        <Card className='p-6'>
            <Alert>
                Access Denied. Only Admin and Staff can update inventory.
            </Alert>
            <Button onClick={onCancel} className="mt-4 w-full">Go back</Button>
        </Card>
    )
  }
  const [quantity, setQuantity] = useState(sweet?.quantityInStock || 0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setError('');
    setLoading(true);


    const payload = {
        quantityInStock: parseInt(quantity),
        // Optional: Include user info for auditing in the update request
        updatedBy: user ? user.id : 'anonymous', 
        updatedByEmail: user ? user.email : 'N/A'
    };
    try {
            // Pass the enhanced payload to the API handler (onSubmit)
            await onSubmit(sweet._id, payload); 
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
  };

    

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-gray-900">
        Update Inventory: {sweet.name}
      </h3>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Current Stock:</span>
            <span className="text-lg font-semibold text-gray-900">{sweet.quantityInStock}</span>
          </div>
        </div>

        <Input
          label="New Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          disabled={loading}
        />

        {error && <Alert variant="error">{error}</Alert>}

        <div className="flex gap-3">
          <Button onClick={handleSubmit} disabled={loading} className="flex-1">
            {loading ? 'Updating...' : 'Update Inventory'}
          </Button>
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default InventoryForm
