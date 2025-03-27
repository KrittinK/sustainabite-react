// components/Ordering.jsx - Order page
import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from './Layout';
import CartContext from '../contexts/CartContext';
import NotificationContext from '../contexts/NotificationContext';
import AuthContext from '../contexts/AuthContext';
import { getCategories, getProducts } from '../services/apiService';

const Ordering = () => {
  const [searchParams] = useSearchParams();
  const highlightProductId = searchParams.get('product');
  
  const { user } = useContext(AuthContext);
  const { cart, addToCart } = useContext(CartContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategoriesAndProducts = async () => {
      try {
        setIsLoading(true);
        const categoriesData = await getCategories();
        const productsData = await getProducts();
        
        setCategories(categoriesData);
        setProducts(productsData);
        
        // If a product ID is provided in URL, highlight that product's category
        if (highlightProductId) {
          const product = productsData.find(p => p.id === parseInt(highlightProductId));
          if (product) {
            setSelectedCategory(product.categoryId);
          }
        }
      } catch (error) {
        console.error('Error fetching categories and products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategoriesAndProducts();
  }, [highlightProductId]);

  const handleAddToCart = (product) => {
    addToCart(product);
    addNotification(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว`, 'success');
  };

  const filteredProducts = selectedCategory 
    ? products.filter(product => 
        product.categoryId === selectedCategory && 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">สั่งวัตถุดิบ</h2>
        
        {/* Search Bar */}
        <div className="relative mb-4">
          <input 
            type="text" 
            placeholder="ค้นหาวัตถุดิบ..." 
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Categories */}
            <div className="mb-6 overflow-x-auto">
              <div className="flex space-x-2 pb-2">
                <button 
                  className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                    selectedCategory === null 
                      ? 'bg-green-600 text-white' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                  onClick={() => setSelectedCategory(null)}
                >
                  ทั้งหมด
                </button>
                {categories.map(category => (
                  <button 
                    key={category.id}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap ${
                      selectedCategory === category.id 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Products */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredProducts.map(product => {
                const inCart = cart.find(item => item.id === product.id);
                const isHighlighted = product.id === parseInt(highlightProductId);
                
                return (
                  <div 
                    key={product.id} 
                    className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                      isHighlighted ? 'ring-2 ring-green-500' : ''
                    }`}
                  >
                    <div className="relative">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-full h-40 object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/api/placeholder/200/150";
                        }}
                      />
                      {product.discount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                          {product.discount}
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h4 className="font-medium">{product.name}</h4>
                      <div className="flex justify-between items-center mt-2">
                        <div>
                          <p className="text-gray-700">฿{product.price}/{product.unit}</p>
                          {product.stock <= product.minStock && (
                            <p className="text-xs text-red-500">เหลือน้อย!</p>
                          )}
                        </div>
                        <button 
                          className={`px-3 py-1 rounded-lg text-sm ${
                            inCart 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                          onClick={() => handleAddToCart(product)}
                        >
                          {inCart ? `ในตะกร้า (${inCart.quantity})` : 'เพิ่ม'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {filteredProducts.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">ไม่พบสินค้าที่ค้นหา</p>
              </div>
            )}
            
            {/* Cart Floating Button - Mobile Only */}
            {cart.length > 0 && (
              <div className="fixed bottom-20 right-4 md:hidden">
                <Link 
                  to="/cart" 
                  className="bg-green-600 text-white p-4 rounded-full shadow-lg flex items-center justify-center"
                >
                  <ShoppingCart size={24} />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default Ordering;