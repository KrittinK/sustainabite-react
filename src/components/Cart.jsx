// components/Cart.jsx - Shopping cart
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, MinusCircle, PlusCircle } from 'lucide-react';
import Layout from './Layout';
import CartContext from '../contexts/CartContext';
import NotificationContext from '../contexts/NotificationContext';
import AuthContext from '../contexts/AuthContext';
import { createOrder } from '../services/apiService';

const Cart = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { cart, removeFromCart, updateCartItemQuantity } = useContext(CartContext);
  const { addNotification } = useContext(NotificationContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryNote, setDeliveryNote] = useState('');

  // Calculate total
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shippingFee = subtotal > 1000 ? 0 : 50; // Free shipping for orders over 1000 baht
  const total = subtotal + shippingFee;

  const handleCheckout = async () => {
    if (cart.length === 0) {
      addNotification('กรุณาเพิ่มสินค้าในตะกร้า', 'error');
      return;
    }

    if (!deliveryDate) {
      addNotification('กรุณาเลือกวันที่จัดส่ง', 'error');
      return;
    }

    try {
      setIsSubmitting(true);
      
      const orderData = {
        userId: user.id,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        subtotal,
        shippingFee,
        total,
        deliveryDate,
        deliveryNote,
        status: 'pending'
      };
      
      const response = await createOrder(orderData);
      
      if (response.success) {
        addNotification('สั่งซื้อสำเร็จ! เราจะดำเนินการจัดส่งให้เร็วที่สุด', 'success');
        // Clear cart
        cart.forEach(item => removeFromCart(item.id));
        // Redirect to order confirmation
        navigate(`/order-confirmation/${response.orderId}`);
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      addNotification('เกิดข้อผิดพลาดระหว่างการสั่งซื้อ กรุณาลองอีกครั้ง', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">ตะกร้าสินค้า</h2>
        
        {cart.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">ไม่มีสินค้าในตะกร้า</p>
            <button 
              onClick={() => navigate('/order')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              เลือกซื้อสินค้า
            </button>
          </div>
        ) : (
          <div className="md:flex md:space-x-4">
            <div className="md:w-2/3">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-4">รายการสินค้า</h3>
                
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center border-b pb-4">
                      <div className="w-16 h-16 flex-shrink-0 mr-4 bg-gray-100 rounded-lg overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/api/placeholder/100/100";
                          }}
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-gray-500">฿{item.price}/{item.unit}</p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity - 1)}
                          className="text-gray-500 hover:text-red-500"
                        >
                          <MinusCircle size={20} />
                        </button>
                        
                        <span className="w-8 text-center">{item.quantity}</span>
                        
                        <button 
                          onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                          className="text-gray-500 hover:text-green-500"
                        >
                          <PlusCircle size={20} />
                        </button>
                      </div>
                      
                      <div className="ml-4 text-right">
                        <p className="font-medium">฿{(item.price * item.quantity).toLocaleString()}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm flex items-center mt-1"
                        >
                          <Trash2 size={14} className="mr-1" /> ลบ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="md:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-4">สรุปคำสั่งซื้อ</h3>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">ราคาสินค้า</span>
                    <span>฿{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">ค่าจัดส่ง</span>
                    <span>{shippingFee === 0 ? 'ฟรี' : `฿${shippingFee}`}</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-medium">
                      <span>รวมทั้งหมด</span>
                      <span>฿{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    วันที่ต้องการจัดส่ง*
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={deliveryDate}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    หมายเหตุการจัดส่ง
                  </label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="เช่น เวลาที่ต้องการให้จัดส่ง หรือสถานที่จัดส่ง"
                    value={deliveryNote}
                    onChange={(e) => setDeliveryNote(e.target.value)}
                  ></textarea>
                </div>
                
                <button 
                  onClick={handleCheckout}
                  disabled={isSubmitting || cart.length === 0}
                  className={`w-full py-3 rounded-lg font-medium ${
                    isSubmitting || cart.length === 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {isSubmitting ? 'กำลังดำเนินการ...' : 'ยืนยันการสั่งซื้อ'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
