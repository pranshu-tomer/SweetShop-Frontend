import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { sweetsAPI } from '@/lib/api';
import Layout from '@/components/Layout';
import SweetCard from '@/components/SweetCard';
import SearchBar from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Package, Contact } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';


const Dashboard = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');

  const fetchSweets = useCallback(async (filters) => {
    try {
      setSearching(!!filters);
      setError('');

      let response;
      if (filters && (filters.name || filters.category || filters.minPrice || filters.maxPrice)) {
        const searchParams = {};
        if (filters.name) searchParams.name = filters.name;
        if (filters.category) searchParams.category = filters.category;
        if (filters.minPrice) searchParams.minPrice = parseFloat(filters.minPrice);
        if (filters.maxPrice) searchParams.maxPrice = parseFloat(filters.maxPrice);

        response = await sweetsAPI.search(searchParams);
      } else {
        response = await sweetsAPI.getAll();
      }

      setSweets(response.data);
    } catch (err) {
      const error = err;
      const errorMessage = error.response?.data?.message || 'Failed to fetch sweets';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    fetchSweets();
  }, [fetchSweets]);

  const handleSearch = useCallback((filters) => {
    fetchSweets(filters);
  }, [fetchSweets]);

  const handleSweetUpdate = () => {
    fetchSweets();
  };

  if (loading) {
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sweet Shop Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Discover and purchase delicious sweets
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => navigate('/sweets/new')}
              className="bg-pink-500 hover:bg-pink-600"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Sweet
            </Button>
          )}
        </div>

        {/* Search and Filters */}
        <SearchBar onSearch={handleSearch} loading={searching} />

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Sweets Grid */}
        {sweets.length === 0 && !loading && !error ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No sweets found</h3>
            <p className="text-gray-500 mb-4">
              {isAdmin 
                ? "Start by adding some sweets to your inventory." 
                : "Check back later for new sweet arrivals!"}
            </p>
            {isAdmin && (
              <Button
                onClick={() => navigate('/sweets/new')}
                className="bg-pink-500 hover:bg-pink-600"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Sweet
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sweets.map((sweet) => (
              <SweetCard
                key={sweet.id}
                sweet={sweet}
                onUpdate={handleSweetUpdate}
              />
            ))}
          </div>
        )}

        {/* Results Summary */}
        {sweets.length > 0 && (
          <div className="text-center text-sm text-gray-500 pt-4">
            Showing {sweets.length} sweet{sweets.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;