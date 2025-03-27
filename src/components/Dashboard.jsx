// components/Dashboard.jsx - Dashboard page
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bell, ShoppingCart, Truck, Package } from 'lucide-react';
import Layout from './Layout';
import AuthContext from '../contexts/AuthContext';
import { getLowStockItems, getRecentOrders, getNextDelivery } from '../services/apiService';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [lowStockItems, setLowStockItems] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [nextDelivery, setNextDelivery] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        // In a real app, you would fetch real data from your API
        const stockItems = await getLowStockItems(user.id);
        const orders = await getRecentOrders(user.id);
        const delivery = await getNextDelivery(user.id);
        
        setLowStockItems(stockItems);
        setRecentOrders(orders);
        setNextDelivery(delivery);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [user.id]);

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">แดชบอร์ด</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Alert Card */}
            {lowStockItems.length > 0 && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-4 rounded-lg">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <Bell className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <span className="font-medium">แจ้งเตือน:</span> วัตถุดิบ {lowStockItems.length} รายการใกล้หมด โปรดสั่งซื้อเพิ่ม
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Next Delivery */}
            {nextDelivery && (
              <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
                <h3 className="font-medium text-gray-700 mb-2">การจัดส่งครั้งถัดไป</h3>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">วันที่จัดส่ง</p>
                    <p className="font-semibold">{nextDelivery.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">เวลา</p>
                    <p className="font-semibold">{nextDelivery.timeWindow}</p>
                  </div>
                  <div className={`text-xs font-medium px-2.5 py-0.5 rounded ${
                    nextDelivery.status === 'scheduled' ? 'bg-blue-100 text-blue-800' : 
                    nextDelivery.status === 'enroute' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {nextDelivery.status === 'scheduled' ? 'กำหนดการ' : 
                     nextDelivery.status === 'enroute' ? 'กำลังจัดส่ง' : 'จัดส่งแล้ว'}
                  </div>
                </div>
              </div>
            )}
            
            {/* Low Stock Items */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">สินค้าใกล้หมด</h3>
                <Link to="/order" className="text-sm text-green-600 hover:text-green-800">
                  สั่งซื้อทั้งหมด
                </Link>
              </div>
              
              {lowStockItems.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">ไม่มีสินค้าใกล้หมด</p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map(item => (
                    <div key={item.id} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-gray-500">ขั้นต่ำ: {item.minLevel} {item.unit}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-red-500 font-bold">{item.currentStock} {item.unit}</p>
                        <Link 
                          to={`/order?product=${item.id}`} 
                          className="text-xs text-blue-600 hover:text-blue-800"
                        >
                          สั่งซื้อเลย
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-medium text-gray-700">คำสั่งซื้อล่าสุด</h3>
                <Link to="/order-history" className="text-sm text-green-600 hover:text-green-800">
                  ดูทั้งหมด
                </Link>
              </div>
              
              {recentOrders.length === 0 ? (
                <p className="text-sm text-gray-500 py-2">ยังไม่มีคำสั่งซื้อ</p>
              ) : (
                <div className="space-y-3">
                  {recentOrders.map(order => (
                    <div key={order.id} className="border-b pb-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{order.orderNumber}</p>
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          order.status === 'processing' ? 'bg-blue-100 text-blue-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'delivered' ? 'จัดส่งแล้ว' : 
                           order.status === 'pending' ? 'รอดำเนินการ' : 
                           order.status === 'processing' ? 'กำลังจัดส่ง' : 
                           order.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">{order.date}</p>
                      <div className="flex justify-between mt-1">
                        <p className="text-sm">สินค้า {order.itemCount} รายการ</p>
                        <p className="font-medium">฿{order.total.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;