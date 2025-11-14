import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { sweetsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Save } from 'lucide-react';
import { toast } from 'sonner';

const CATEGORIES = [
  'Chocolate',
  'Gummy',
  'Hard Candy',
  'Lollipop',
  'Caramel',
  'Mint',
  'Sour',
  'Sugar Free',
];

const SweetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<SweetFormData>({
    name: '',
    category: '',
    price: '',
    quantity: '',
  });
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(isEditing);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing && id) {
      fetchSweetData(id);
    }
  }, [isEditing, id]);

  const fetchSweetData = async (sweetId) => {
    try {
      setFetchingData(true);
      const response = await sweetsAPI.getAll();
      const sweet = response.data.find((s) => s.id === sweetId);
      
      if (sweet) {
        setFormData({
          name: sweet.name,
          category: sweet.category,
          price: sweet.price.toString(),
          quantity: sweet.quantity.toString(),
        });
      } else {
        toast.error('Sweet not found');
        navigate('/dashboard');
      }
    } catch (err) {
      toast.error('Failed to fetch sweet data');
      navigate('/dashboard');
    } finally {
      setFetchingData(false);
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('Price must be greater than 0');
      return false;
    }
    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      setError('Quantity must be 0 or greater');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    setLoading(true);
    try {
      const sweetData = {
        name: formData.name.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
      };

      if (isEditing && id) {
        await sweetsAPI.update(id, sweetData);
        toast.success('Sweet updated successfully!');
      } else {
        await sweetsAPI.create(sweetData);
        toast.success('Sweet created successfully!');
      }

      navigate('/dashboard');
    } catch (err) {
      const error = err;
      const errorMessage = error.response?.data?.message || 
        `Failed to ${isEditing ? 'update' : 'create'} sweet`;
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(''); // Clear error when user starts typing
  };

  if (fetchingData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit Sweet' : 'Add New Sweet'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEditing ? 'Update sweet information' : 'Add a new sweet to your inventory'}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Sweet Information</CardTitle>
            <CardDescription>
              Fill in the details for your sweet product
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter sweet name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => handleInputChange('quantity', e.target.value)}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-pink-500 hover:bg-pink-600"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading 
                    ? (isEditing ? 'Updating...' : 'Creating...') 
                    : (isEditing ? 'Update Sweet' : 'Create Sweet')
                  }
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default SweetForm;