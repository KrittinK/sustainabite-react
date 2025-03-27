// components/Prediction.jsx - Enhanced with direct purchasing functionality
import React, { useState, useContext, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ShoppingCart, AlertCircle, Check } from 'lucide-react';
import Layout from './Layout';
import CartContext from '../contexts/CartContext';
import NotificationContext from '../contexts/NotificationContext';
import { getProducts } from '../services/apiService';

const Prediction = () => {
  const [selectedStall, setSelectedStall] = useState('noodle');
  const [selectedDay, setSelectedDay] = useState('monday');
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const { addToCart } = useContext(CartContext);
  const { addNotification } = useContext(NotificationContext);

  // Fetch products for purchasing
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getProducts();
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Basic stall options
  const stallOptions = [
    { id: 'noodle', name: 'ร้านก๋วยเตี๋ยว' },
    { id: 'rice', name: 'ร้านข้าวแกง' },
    { id: 'grill', name: 'ร้านปิ้งย่าง' }
  ];

  // Basic day options
  const dayOptions = [
    { id: 'monday', name: 'วันจันทร์' },
    { id: 'friday', name: 'วันศุกร์' }
  ];

  // Dish prediction data
  const dishPredictions = {
    noodle: {
      monday: [
        { 
          name: 'ผัดไทย', 
          orders: 95, 
          ingredients: [
            { name: 'เส้นก๋วยเตี๋ยวเล็ก', amount: '9.5 กก.' },
            { name: 'เต้าหู้', amount: '4.8 กก.' },
            { name: 'ถั่วงอก', amount: '3.8 กก.' },
            { name: 'ไข่', amount: '35 ฟอง' },
            { name: 'ถั่วลิสง', amount: '1.4 กก.' },
            { name: 'ซอสผัดไทย', amount: '2.8 ลิตร' }
          ]
        },
        { 
          name: 'ผัดซีอิ๊ว', 
          orders: 58, 
          ingredients: [
            { name: 'เส้นใหญ่', amount: '5.8 กก.' },
            { name: 'ไก่', amount: '4.1 กก.' },
            { name: 'คะน้า', amount: '2.9 กก.' },
            { name: 'ไข่', amount: '23 ฟอง' },
            { name: 'ซีอิ๊วหวาน', amount: '1.2 ลิตร' }
          ]
        },
        { 
          name: 'ก๋วยเตี๋ยวต้มยำ', 
          orders: 42, 
          ingredients: [
            { name: 'เส้นก๋วยเตี๋ยว', amount: '4.2 กก.' },
            { name: 'หมู', amount: '2.9 กก.' },
            { name: 'กุ้ง', amount: '2.1 กก.' },
            { name: 'เห็ด', amount: '1.3 กก.' },
            { name: 'น้ำพริกต้มยำ', amount: '0.8 กก.' },
            { name: 'มะนาว', amount: '20 ลูก' }
          ]
        }
      ],
      friday: [
        { 
          name: 'ผัดไทย', 
          orders: 120, 
          ingredients: [
            { name: 'เส้นก๋วยเตี๋ยวเล็ก', amount: '12.0 กก.' },
            { name: 'เต้าหู้', amount: '6.0 กก.' },
            { name: 'ถั่วงอก', amount: '4.8 กก.' },
            { name: 'ไข่', amount: '45 ฟอง' },
            { name: 'ถั่วลิสง', amount: '1.8 กก.' },
            { name: 'ซอสผัดไทย', amount: '3.6 ลิตร' }
          ]
        },
        { 
          name: 'ราดหน้า', 
          orders: 70, 
          ingredients: [
            { name: 'เส้นใหญ่', amount: '7.0 กก.' },
            { name: 'หมู', amount: '4.9 กก.' },
            { name: 'คะน้า', amount: '3.5 กก.' },
            { name: 'น้ำราดหน้า', amount: '2.8 ลิตร' }
          ]
        },
        { 
          name: 'ก๋วยเตี๋ยวต้มยำ', 
          orders: 65, 
          ingredients: [
            { name: 'เส้นก๋วยเตี๋ยว', amount: '6.5 กก.' },
            { name: 'หมู', amount: '4.6 กก.' },
            { name: 'กุ้ง', amount: '3.3 กก.' },
            { name: 'เห็ด', amount: '2.0 กก.' },
            { name: 'น้ำพริกต้มยำ', amount: '1.3 กก.' },
            { name: 'มะนาว', amount: '33 ลูก' }
          ]
        }
      ]
    },
    rice: {
      monday: [
        { 
          name: 'ผัดกระเพรา', 
          orders: 90, 
          ingredients: [
            { name: 'ข้าว', amount: '18.0 กก.' },
            { name: 'ไก่', amount: '13.5 กก.' },
            { name: 'ใบกระเพรา', amount: '2.7 กก.' },
            { name: 'พริก', amount: '0.9 กก.' },
            { name: 'กระเทียม', amount: '0.7 กก.' },
            { name: 'ไข่', amount: '90 ฟอง' }
          ]
        },
        { 
          name: 'แกงเขียวหวาน', 
          orders: 70, 
          ingredients: [
            { name: 'ข้าว', amount: '14.0 กก.' },
            { name: 'ไก่', amount: '10.5 กก.' },
            { name: 'น้ำพริกแกงเขียวหวาน', amount: '1.8 กก.' },
            { name: 'กะทิ', amount: '7.0 ลิตร' },
            { name: 'มะเขือพวง', amount: '3.5 กก.' },
            { name: 'ใบโหระพา', amount: '0.7 กก.' }
          ]
        },
        { 
          name: 'ข้าวผัด', 
          orders: 40, 
          ingredients: [
            { name: 'ข้าว', amount: '8.0 กก.' },
            { name: 'ผักรวม', amount: '2.0 กก.' },
            { name: 'ไข่', amount: '40 ฟอง' },
            { name: 'กระเทียม', amount: '0.4 กก.' },
            { name: 'ซีอิ๊ว', amount: '0.8 ลิตร' }
          ]
        }
      ],
      friday: [
        { 
          name: 'ผัดกระเพรา', 
          orders: 110, 
          ingredients: [
            { name: 'ข้าว', amount: '22.0 กก.' },
            { name: 'ไก่', amount: '16.5 กก.' },
            { name: 'ใบกระเพรา', amount: '3.3 กก.' },
            { name: 'พริก', amount: '1.1 กก.' },
            { name: 'กระเทียม', amount: '0.9 กก.' },
            { name: 'ไข่', amount: '110 ฟอง' }
          ]
        },
        { 
          name: 'แกงเขียวหวาน', 
          orders: 90, 
          ingredients: [
            { name: 'ข้าว', amount: '18.0 กก.' },
            { name: 'ไก่', amount: '13.5 กก.' },
            { name: 'น้ำพริกแกงเขียวหวาน', amount: '2.3 กก.' },
            { name: 'กะทิ', amount: '9.0 ลิตร' },
            { name: 'มะเขือพวง', amount: '4.5 กก.' },
            { name: 'ใบโหระพา', amount: '0.9 กก.' }
          ]
        },
        { 
          name: 'ข้าวผัด', 
          orders: 60, 
          ingredients: [
            { name: 'ข้าว', amount: '12.0 กก.' },
            { name: 'ผักรวม', amount: '3.0 กก.' },
            { name: 'ไข่', amount: '60 ฟอง' },
            { name: 'กระเทียม', amount: '0.6 กก.' },
            { name: 'ซีอิ๊ว', amount: '1.2 ลิตร' }
          ]
        }
      ]
    },
    grill: {
      monday: [
        { 
          name: 'ไก่ย่าง', 
          orders: 75, 
          ingredients: [
            { name: 'ไก่', amount: '22.5 กก.' },
            { name: 'กระเทียม', amount: '0.8 กก.' },
            { name: 'ตะไคร้', amount: '1.5 กก.' },
            { name: 'ข้าว', amount: '15.0 กก.' },
            { name: 'น้ำจิ้มไก่', amount: '2.3 ลิตร' }
          ]
        },
        { 
          name: 'หมูปิ้ง', 
          orders: 60, 
          ingredients: [
            { name: 'หมู', amount: '15.0 กก.' },
            { name: 'กระเทียม', amount: '0.6 กก.' },
            { name: 'กะทิ', amount: '3.0 ลิตร' },
            { name: 'ข้าว', amount: '12.0 กก.' },
            { name: 'น้ำจิ้มแจ่ว', amount: '1.8 ลิตร' }
          ]
        },
        { 
          name: 'สะเต๊ะ', 
          orders: 25, 
          ingredients: [
            { name: 'ไก่', amount: '6.3 กก.' },
            { name: 'น้ำจิ้มสะเต๊ะ', amount: '3.8 ลิตร' },
            { name: 'อาจาด', amount: '2.5 กก.' },
            { name: 'ข้าว', amount: '5.0 กก.' }
          ]
        }
      ],
      friday: [
        { 
          name: 'ไก่ย่าง', 
          orders: 95, 
          ingredients: [
            { name: 'ไก่', amount: '28.5 กก.' },
            { name: 'กระเทียม', amount: '1.0 กก.' },
            { name: 'ตะไคร้', amount: '1.9 กก.' },
            { name: 'ข้าว', amount: '19.0 กก.' },
            { name: 'น้ำจิ้มไก่', amount: '2.9 ลิตร' }
          ]
        },
        { 
          name: 'หมูปิ้ง', 
          orders: 80, 
          ingredients: [
            { name: 'หมู', amount: '20.0 กก.' },
            { name: 'กระเทียม', amount: '0.8 กก.' },
            { name: 'กะทิ', amount: '4.0 ลิตร' },
            { name: 'ข้าว', amount: '16.0 กก.' },
            { name: 'น้ำจิ้มแจ่ว', amount: '2.4 ลิตร' }
          ]
        },
        { 
          name: 'ปลาเผา', 
          orders: 45, 
          ingredients: [
            { name: 'ปลา', amount: '18.0 กก.' },
            { name: 'ตะไคร้', amount: '0.9 กก.' },
            { name: 'ใบมะกรูด', amount: '0.5 กก.' },
            { name: 'เกลือ', amount: '0.5 กก.' },
            { name: 'ข้าว', amount: '9.0 กก.' },
            { name: 'น้ำจิ้มซีฟู้ด', amount: '2.3 ลิตร' }
          ]
        }
      ]
    }
  };

  // Get current predictions
  const currentDishes = dishPredictions[selectedStall]?.[selectedDay] || [];
  
  // Format chart data
  const chartData = currentDishes.map(dish => ({
    name: dish.name,
    orders: dish.orders
  }));
  
  // Calculate total orders
  const totalOrders = currentDishes.reduce((sum, dish) => sum + dish.orders, 0);

  // Helper to find a matching product for the ingredient
  const findMatchingProduct = (ingredient) => {
    const ingredientName = ingredient.name.toLowerCase();
    
    // Clean up the ingredient name to match potential product names
    const normalized = ingredientName
      .replace('เส้น', '')
      .replace('น้ำพริก', '')
      .replace('น้ำจิ้ม', '')
      .trim();
    
    return products.find(product => {
      const productName = product.name.toLowerCase();
      return productName.includes(normalized) || normalized.includes(productName);
    });
  };

  // Handle adding ingredient to cart
  const handleAddIngredientToCart = (ingredient) => {
    const matchingProduct = findMatchingProduct(ingredient);
    
    if (matchingProduct) {
      // Extract numeric part from amount string (e.g., "9.5 กก." -> 9.5)
      const amountStr = ingredient.amount;
      const amountMatch = amountStr.match(/(\d+(\.\d+)?)/);
      const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;
      
      // Set adding to cart status for UI feedback
      setAddingToCart(prev => ({ ...prev, [ingredient.name]: true }));
      
      // Add to cart with proper quantity
      addToCart(matchingProduct, amount);
      addNotification(`เพิ่ม ${matchingProduct.name} (${ingredient.amount}) ลงในตะกร้าแล้ว`, 'success');
      
      // Reset adding to cart status after a delay
      setTimeout(() => {
        setAddingToCart(prev => ({ ...prev, [ingredient.name]: false }));
      }, 1500);
    } else {
      addNotification(`ไม่พบสินค้าสำหรับ ${ingredient.name} ในระบบ`, 'error');
    }
  };

  // Handle adding all ingredients for a dish to cart
  const handleAddDishToCart = (dish) => {
    let addedCount = 0;
    const notFoundIngredients = [];
    
    dish.ingredients.forEach(ingredient => {
      const matchingProduct = findMatchingProduct(ingredient);
      
      if (matchingProduct) {
        // Extract numeric part from amount string
        const amountStr = ingredient.amount;
        const amountMatch = amountStr.match(/(\d+(\.\d+)?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;
        
        addToCart(matchingProduct, amount);
        addedCount++;
      } else {
        notFoundIngredients.push(ingredient.name);
      }
    });
    
    if (addedCount === dish.ingredients.length) {
      addNotification(`เพิ่มวัตถุดิบสำหรับ ${dish.name} ทั้งหมดลงในตะกร้าแล้ว`, 'success');
    } else if (addedCount > 0) {
      addNotification(`เพิ่มวัตถุดิบสำหรับ ${dish.name} บางส่วนแล้ว (ไม่พบบางรายการ)`, 'info');
    } else {
      addNotification(`ไม่พบวัตถุดิบสำหรับ ${dish.name} ในระบบ`, 'error');
    }
  };
  
  // Handle adding all ingredients for all dishes to cart
  const handleAddAllToCart = () => {
    const allIngredients = new Map();
    
    // Collect all unique ingredients with their total amounts
    currentDishes.forEach(dish => {
      dish.ingredients.forEach(ing => {
        const key = ing.name;
        const existingAmount = allIngredients.get(key)?.amount || '0';
        
        // Extract numeric values
        const currentAmountMatch = ing.amount.match(/(\d+(\.\d+)?)/);
        const currentAmount = currentAmountMatch ? parseFloat(currentAmountMatch[1]) : 0;
        
        const existingAmountMatch = existingAmount.match(/(\d+(\.\d+)?)/);
        const existingAmountValue = existingAmountMatch ? parseFloat(existingAmountMatch[1]) : 0;
        
        // Calculate total and preserve unit
        const unit = ing.amount.replace(/\d+(\.\d+)?/, '').trim();
        const totalAmount = (currentAmount + existingAmountValue).toFixed(1) + ' ' + unit;
        
        allIngredients.set(key, {
          name: key,
          amount: totalAmount
        });
      });
    });
    
    // Add all to cart
    let addedCount = 0;
    const allIngredientsArray = Array.from(allIngredients.values());
    
    allIngredientsArray.forEach(ingredient => {
      const matchingProduct = findMatchingProduct(ingredient);
      
      if (matchingProduct) {
        // Extract numeric part from amount string
        const amountStr = ingredient.amount;
        const amountMatch = amountStr.match(/(\d+(\.\d+)?)/);
        const amount = amountMatch ? parseFloat(amountMatch[1]) : 1;
        
        addToCart(matchingProduct, amount);
        addedCount++;
      }
    });
    
    if (addedCount === allIngredientsArray.length) {
      addNotification(`เพิ่มวัตถุดิบทั้งหมดลงในตะกร้าแล้ว`, 'success');
    } else if (addedCount > 0) {
      addNotification(`เพิ่มวัตถุดิบบางส่วนแล้ว (${addedCount}/${allIngredientsArray.length})`, 'info');
    } else {
      addNotification(`ไม่พบวัตถุดิบในระบบ`, 'error');
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">การคาดการณ์ความต้องการอาหาร</h2>
        
        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภทร้านอาหาร</label>
              <select 
                value={selectedStall}
                onChange={(e) => setSelectedStall(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              >
                {stallOptions.map(stall => (
                  <option key={stall.id} value={stall.id}>{stall.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วัน</label>
              <select 
                value={selectedDay}
                onChange={(e) => setSelectedDay(e.target.value)}
                className="border border-gray-300 rounded-md p-2 text-sm"
              >
                {dayOptions.map(day => (
                  <option key={day.id} value={day.id}>{day.name}</option>
                ))}
              </select>
            </div>
            
            <div className="ml-auto">
              <button 
                onClick={handleAddAllToCart}
                className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                disabled={isLoading}
              >
                <ShoppingCart className="mr-2" size={18} />
                สั่งซื้อวัตถุดิบทั้งหมด
              </button>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">จำนวนออเดอร์ทั้งหมด</h3>
            <p className="text-2xl font-bold mt-1">{totalOrders}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">เมนูยอดนิยม</h3>
            <p className="text-2xl font-bold mt-1">{currentDishes[0]?.name || 'ไม่มีข้อมูล'}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">จำนวนเมนู</h3>
            <p className="text-2xl font-bold mt-1">{currentDishes.length}</p>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <h3 className="font-medium text-gray-700 mb-4">จำนวนออเดอร์ที่คาดการณ์</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend formatter={() => 'จำนวนออเดอร์'} />
                <Bar dataKey="orders" fill="#16a34a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Dish Cards with Ingredients */}
        <div className="mb-6">
          <h3 className="font-medium text-gray-700 mb-4">รายละเอียดเมนูและวัตถุดิบ</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentDishes.map((dish, dishIndex) => (
              <div key={dishIndex} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-lg">{dish.name}</h4>
                      <p className="text-sm text-gray-500">{dish.orders} ออเดอร์</p>
                    </div>
                    <button
                      onClick={() => handleAddDishToCart(dish)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-green-700 flex items-center"
                    >
                      <ShoppingCart size={14} className="mr-1" /> สั่งซื้อวัตถุดิบทั้งหมด
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h5 className="text-sm font-medium text-gray-700 mb-2">วัตถุดิบที่ต้องใช้:</h5>
                  <ul className="space-y-2">
                    {dish.ingredients.map((ingredient, ingredientIndex) => {
                      const isAdding = addingToCart[ingredient.name];
                      const matchingProduct = findMatchingProduct(ingredient);
                      
                      return (
                        <li key={ingredientIndex} className="flex justify-between items-center border-b pb-2">
                          <div>
                            <span className="text-sm">{ingredient.name}: </span>
                            <span className="text-sm font-medium">{ingredient.amount}</span>
                          </div>
                          <button
                            onClick={() => handleAddIngredientToCart(ingredient)}
                            disabled={isAdding}
                            className={`px-2 py-1 rounded text-xs flex items-center ${
                              isAdding ? 'bg-green-100 text-green-800' : 'bg-blue-600 text-white hover:bg-blue-700'
                            } ${!matchingProduct ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title={!matchingProduct ? 'ไม่พบสินค้าในระบบ' : ''}
                          >
                            {isAdding ? (
                              <>
                                <Check size={12} className="mr-1" /> เพิ่มแล้ว
                              </>
                            ) : !matchingProduct ? (
                              <>
                                <AlertCircle size={12} className="mr-1" /> ไม่พบสินค้า
                              </>
                            ) : (
                              <>
                                <ShoppingCart size={12} className="mr-1" /> สั่งซื้อ
                              </>
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Suggested Items - Based on frequently purchased together */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-medium text-gray-700 mb-4">แนะนำวัตถุดิบเพิ่มเติม</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {products.slice(0, 4).map((product, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <div className="h-32 bg-gray-100 flex items-center justify-center">
                  <img 
                    src="/api/placeholder/200/150" 
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h4 className="font-medium">{product.name}</h4>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-700">฿{product.price}/{product.unit}</span>
                    <button
                      onClick={() => {
                        addToCart(product, 1);
                        addNotification(`เพิ่ม ${product.name} ลงในตะกร้าแล้ว`, 'success');
                      }}
                      className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                    >
                      สั่งซื้อ
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Prediction;