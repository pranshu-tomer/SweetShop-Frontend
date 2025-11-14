import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Candy, ShoppingCart, Star, Users } from 'lucide-react';

const Landing = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <Candy className="h-20 w-20 text-pink-500" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                Sweet Shop
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover the sweetest treats and manage your candy business with our comprehensive management system.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3"
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-pink-500 text-pink-500 hover:bg-pink-50 px-8 py-3"
                onClick={() => navigate('/register')}
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need for Your Sweet Business
            </h2>
            <p className="text-lg text-gray-600">
              Manage inventory, process orders, and delight customers with our all-in-one platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <ShoppingCart className="h-12 w-12 text-pink-500" />
                </div>
                <CardTitle>Easy Shopping</CardTitle>
                <CardDescription>
                  Browse and purchase your favorite sweets with our intuitive interface
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Star className="h-12 w-12 text-orange-500" />
                </div>
                <CardTitle>Quality Products</CardTitle>
                <CardDescription>
                  Premium sweets and candies sourced from the finest ingredients
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  <Users className="h-12 w-12 text-purple-500" />
                </div>
                <CardTitle>Admin Management</CardTitle>
                <CardDescription>
                  Comprehensive tools for inventory management and business operations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-pink-500 to-orange-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Sweet Journey?
          </h2>
          <p className="text-xl text-pink-100 mb-8">
            Join thousands of satisfied customers and business owners.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="bg-white text-pink-500 hover:bg-gray-100 px-8 py-3"
            onClick={() => navigate('/register')}
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Landing;