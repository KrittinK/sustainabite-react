// components/OrderHistory.jsx - Order history page
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronUp, ChevronRight } from 'lucide-react';
import Layout from './Layout';
import AuthContext from '../contexts/AuthContext';

const OrderHistory = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock order history data
        const mockOrders = [
          {
            id: 'ORD-2023-001',
            date: '22 ก.พ. 2568',
            status: 'delivered',
            itemCount: 10,
            total: 1250,
            items: [
              { id: 1, name: 'ข้าวหอมมะลิ', quantity: 5, price: 60, total: 300, unit: 'กก.' },
              { id: 2, name: 'น้ำมันพืช', quantity: 2, price: 55, total: 110, unit: 'ลิตร' },
              { id: 3, name: 'เนื้อไก่', quantity: 3, price: 90, total: 270, unit: 'กก.' }
            ]
          },
          {
            id: 'ORD-2023-002',
            date: '15 ก.พ. 2568',
            status: 'delivered',
            itemCount: 8,
            total: 950,
            items: [
              { id: 1, name: 'ข้าวหอมมะลิ', quantity: 3, price: 60, total: 180, unit: 'กก.' },
              { id: 4, name: 'เนื้อหมู', quantity: 2, price: 120, total: 240, unit: 'กก.' },
              { id: 7, name: 'ผักคะน้า', quantity: 2, price: 40, total: 80, unit: 'กก.' }
            ]
          },
          {
            id: 'ORD-2023-003',
            date: '8 ก.พ. 2568',
            status: 'delivered',
            itemCount: 12,
            total: 1350,
            items: [
              { id: 2, name: 'น้ำมันพืช', quantity: 3, price: 55, total: 165, unit: 'ลิตร' },
              { id: 5, name: 'เนื้อไก่', quantity: 4, price: 90, total: 360, unit: 'กก.' },
              { id: 9, name: 'ไข่ไก่', quantity: 30, price: 4, total: 120, unit: 'ฟอง' }
            ]
          },
          {
            id: 'ORD-2023-004',
            date: '1 ก.พ. 2568',
            status: 'delivered',
            itemCount: 6,
            total: 750,
            items: [
              { id: 1, name: 'ข้าวหอมมะลิ', quantity: 2, price: 60, total: 120, unit: 'กก.' },
              { id: 4, name: 'เนื้อหมู', quantity: 1, price: 120, total: 120, unit: 'กก.' },
              { id: 10, name: 'นมสด', quantity: 10, price: 20, total: 200, unit: 'กล่อง' }
            ]
          }
        ];
        
        setOrders(mockOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, [user.id]);
  
  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };
  
  const getStatusLabel = (status) => {
    switch (status) {
      case 'delivered':
        return { label: 'จัดส่งแล้ว', bgColor: 'bg-green-100', textColor: 'text-green-800' };
      case 'processing':
        return { label: 'กำลังจัดส่ง', bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case 'pending':
        return { label: 'รอดำเนินการ', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' };
      case 'cancelled':
        return { label: 'ยกเลิก', bgColor: 'bg-red-100', textColor: 'text-red-800' };
      default:
        return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">ประวัติคำสั่งซื้อ</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-4">ยังไม่มีประวัติคำสั่งซื้อ</p>
            <Link 
              to="/order"
              className="inline-block bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
            >
              เลือกซื้อสินค้า
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;
              const statusInfo = getStatusLabel(order.status);
              
              return (
                <div key={order.id} className="border-b last:border-b-0">
                  <div 
                    className="p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleOrderExpand(order.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center">
                          <span className="font-medium">{order.id}</span>
                          <span className="ml-2 text-sm text-gray-500">({order.date})</span>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          สินค้า {order.itemCount} รายการ | ฿{order.total.toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                      // components/OrderHistory.jsx (continued)
                        <span className={`px-2 py-1 text-xs rounded-full ${statusInfo.bgColor} ${statusInfo.textColor} mr-3`}>
                          {statusInfo.label}
                        </span>
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="p-4 bg-gray-50">
                      <h4 className="font-medium mb-2">รายการสินค้า</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                สินค้า
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                จำนวน
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ราคาต่อหน่วย
                              </th>
                              <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                รวม
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map((item) => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {item.name}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                  {item.quantity} {item.unit}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                  ฿{item.price}/{item.unit}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  ฿{item.total}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="bg-gray-50">
                              <td colSpan="3" className="px-4 py-2 text-sm font-medium text-right">
                                รวมทั้งหมด
                              </td>
                              <td className="px-4 py-2 whitespace-nowrap text-sm font-bold">
                                ฿{order.total.toLocaleString()}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      
                      <div className="mt-4 flex justify-end">
                        <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                          สั่งซื้อซ้ำ <ChevronRight size={16} className="ml-1" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OrderHistory;