// components/OrderConfirmation.jsx - Order confirmation page
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import Layout from './Layout';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState({
    id: orderId,
    date: new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
    estimatedDelivery: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
    items: Math.floor(Math.random() * 10) + 5,
    total: Math.floor(Math.random() * 2000) + 1000
  });
  
  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <div className="mb-6">
            <CheckCircle size={64} className="mx-auto text-green-500" />
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">ขอบคุณสำหรับคำสั่งซื้อ!</h2>
          <p className="text-gray-600 mb-6">คำสั่งซื้อของคุณได้รับการยืนยันเรียบร้อยแล้ว</p>
          
          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">หมายเลขคำสั่งซื้อ:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">วันที่สั่งซื้อ:</span>
              <span>{order.date}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">วันที่จัดส่งโดยประมาณ:</span>
              <span>{order.estimatedDelivery}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-medium">จำนวนรายการ:</span>
              <span>{order.items} รายการ</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">ยอดรวม:</span>
              <span className="font-bold">฿{order.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <Link to="/" className="block w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700">
              กลับไปยังหน้าแรก
            </Link>
            <Link to="/order-history" className="block w-full py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">
              ดูประวัติคำสั่งซื้อ
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;