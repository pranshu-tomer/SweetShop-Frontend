import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { sweetsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import { Edit, Trash2, ShoppingCart, Package } from 'lucide-react';
import { toast } from 'sonner';
import PurchaseModal from './PurchaseModal';


const SweetCard = ({ sweet, onUpdate }) => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await sweetsAPI.delete(sweet.id);
      toast.success('Sweet deleted successfully!');
      onUpdate();
    } catch (error) {
      const err = error;
      toast.error(err.response?.data?.message || 'Failed to delete sweet');
    } finally {
      setDeleting(false);
    }
  };

  const handlePurchaseSuccess = () => {
    setShowPurchaseModal(false);
    onUpdate();
    toast.success('Purchase completed successfully!');
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price);
  };

  const getStockBadge = () => {
    if (sweet.quantity === 0) {
      return <Badge variant="destructive">Out of Stock</Badge>;
    } else if (sweet.quantity < 10) {
      return <Badge variant="secondary">Low Stock</Badge>;
    } else {
      return <Badge variant="default" className="bg-green-100 text-green-800">In Stock</Badge>;
    }
  };

  return (
    <>
      <Card className="h-full flex flex-col hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
                {sweet.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {sweet.category}
              </CardDescription>
            </div>
            {getStockBadge()}
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col justify-between">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-pink-600">
                {formatPrice(sweet.price)}
              </span>
              <div className="flex items-center text-sm text-gray-500">
                <Package className="h-4 w-4 mr-1" />
                <span>{sweet.quantity} left</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              className="w-full bg-pink-500 hover:bg-pink-600"
              disabled={sweet.quantity === 0}
              onClick={() => setShowPurchaseModal(true)}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              {sweet.quantity === 0 ? 'Out of Stock' : 'Purchase'}
            </Button>

            {isAdmin && (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => navigate(`/sweets/${sweet.id}/edit`)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Sweet</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{sweet.name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDelete}
                        disabled={deleting}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        {deleting ? 'Deleting...' : 'Delete'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <PurchaseModal
        sweet={sweet}
        isOpen={showPurchaseModal}
        onClose={() => setShowPurchaseModal(false)}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
};

export default SweetCard;