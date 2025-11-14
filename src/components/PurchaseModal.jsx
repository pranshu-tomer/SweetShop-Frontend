import React, { useState } from 'react';
import { sweetsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';


const PurchaseModal = ({ sweet, isOpen, onClose, onSuccess }) => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (quantity <= 0) {
      setError('Quantity must be greater than 0');
      return;
    }

    if (quantity > sweet.quantity) {
      setError(`Only ${sweet.quantity} items available in stock`);
      return;
    }

    setLoading(true);
    try {
      await sweetsAPI.purchase(sweet.id, quantity);
      onSuccess();
    } catch (err) {
      const error = err;
      const errorMessage = error.response?.data?.message || 'Purchase failed. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const totalPrice = sweet.price * quantity;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <ShoppingCart className="h-5 w-5 mr-2 text-pink-500" />
            Purchase {sweet.name}
          </DialogTitle>
          <DialogDescription>
            Select the quantity you want to purchase
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{sweet.name}</span>
                <span className="text-sm text-gray-600">{sweet.category}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-pink-600">
                  {formatPrice(sweet.price)} each
                </span>
                <span className="text-sm text-gray-500">
                  {sweet.quantity} available
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={sweet.quantity}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                required
              />
            </div>

            <div className="bg-pink-50 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Price:</span>
                <span className="text-xl font-bold text-pink-600">
                  {formatPrice(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-pink-500 hover:bg-pink-600"
              disabled={loading}
            >
              {loading ? 'Processing...' : `Purchase ${formatPrice(totalPrice)}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PurchaseModal;