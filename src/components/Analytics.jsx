// components/Analytics.jsx - Analytics and insights
import React, { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout.jsx';
import AuthContext from '../contexts/AuthContext';
import NotificationContext from '../contexts/NotificationContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getOrderAnalytics, getCostSavingsData } from '../services/apiService';

const Analytics = () => {
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [timeRange, setTimeRange] = useState('month'); // 'week', 'month', 'year'
  const [orderData, setOrderData] = useState([]);
  const [savingsData, setSavingsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch order analytics data
        const orderAnalytics = await getOrderAnalytics(user.id, timeRange);
        setOrderData(orderAnalytics);
        
        // Fetch cost savings data
        const costSavings = await getCostSavingsData(user.id, timeRange);
        setSavingsData(costSavings);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
        addNotification('ไม่สามารถโหลดข้อมูลการวิเคราะห์ได้', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAnalyticsData();
  }, [user.id, timeRange, addNotification]);
  
  return (
    <Layout>
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 className="text-xl font-semibold">วิเคราะห์ข้อมูล</h2>
          
          <div className="mt-2 sm:mt-0">
            <select
              className="py-2 pl-3 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">7 วันล่าสุด</option>
              <option value="month">30 วันล่าสุด</option>
              <option value="year">12 เดือนล่าสุด</option>
            </select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
          </div>
        ) : (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">คำสั่งซื้อทั้งหมด</h3>
                <p className="text-2xl font-bold mt-1">
                  {orderData.reduce((total, item) => total + item.orders, 0)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">ค่าใช้จ่ายทั้งหมด</h3>
                <p className="text-2xl font-bold mt-1">
                  ฿{orderData.reduce((total, item) => total + item.totalSpent, 0).toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-sm p-4">
                <h3 className="text-sm font-medium text-gray-500">ประหยัดค่าใช้จ่าย</h3>
                <p className="text-2xl font-bold mt-1 text-green-600">
                  ฿{savingsData.reduce((total, item) => total + item.savings, 0).toLocaleString()}
                </p>
              </div>
            </div>
            
            {/* Order Analytics Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">คำสั่งซื้อและค่าใช้จ่าย</h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={orderData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip formatter={(value, name) => {
                      if (name === "totalSpent" || name === "avgOrderValue") {
                        return [`฿${value.toLocaleString()}`, name === "totalSpent" ? "ค่าใช้จ่ายรวม" : "มูลค่าเฉลี่ยต่อคำสั่งซื้อ"];
                      }
                      return [value, name === "orders" ? "จำนวนคำสั่งซื้อ" : name];
                    }} />
                    <Legend formatter={(value) => {
                      if (value === "orders") return "จำนวนคำสั่งซื้อ";
                      if (value === "totalSpent") return "ค่าใช้จ่ายรวม";
                      if (value === "avgOrderValue") return "มูลค่าเฉลี่ยต่อคำสั่งซื้อ";
                      return value;
                    }} />
                    <Line yAxisId="left" type="monotone" dataKey="orders" stroke="#8884d8" activeDot={{ r: 8 }} name="orders" />
                    <Line yAxisId="right" type="monotone" dataKey="totalSpent" stroke="#82ca9d" name="totalSpent" />
                    <Line yAxisId="right" type="monotone" dataKey="avgOrderValue" stroke="#ffc658" name="avgOrderValue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Cost Savings Chart */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <h3 className="font-medium text-gray-700 mb-4">การประหยัดค่าใช้จ่าย เทียบกับราคาตลาด</h3>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={savingsData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => {
                      return [`฿${value.toLocaleString()}`, name === "marketPrice" ? "ราคาตลาด" : 
                                          name === "sustainaBitePrice" ? "ราคา SustainaBite" : "ประหยัด"];
                    }} />
                    <Legend formatter={(value) => {
                      if (value === "marketPrice") return "ราคาตลาด";
                      if (value === "sustainaBitePrice") return "ราคา SustainaBite";
                      if (value === "savings") return "ประหยัด";
                      return value;
                    }} />
                    <Bar dataKey="marketPrice" fill="#8884d8" name="marketPrice" />
                    <Bar dataKey="sustainaBitePrice" fill="#82ca9d" name="sustainaBitePrice" />
                    <Bar dataKey="savings" fill="#ffc658" name="savings" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            {/* Savings Analysis Table */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h3 className="font-medium text-gray-700 mb-4">การเปรียบเทียบราคา: ตลาด vs SustainaBite</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        หมวดหมู่
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ราคาตลาด
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ราคา SustainaBite
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ประหยัด
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ประหยัด %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {savingsData.map((item, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ฿{item.marketPrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ฿{item.sustainaBitePrice.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          ฿{item.savings.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                          {((item.savings / item.marketPrice) * 100).toFixed(1)}%
                        </td>
                      </tr>
                    ))}
                    
                    {/* Total Row */}
                    <tr className="bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        รวมทั้งหมด
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ฿{savingsData.reduce((total, item) => total + item.marketPrice, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                        ฿{savingsData.reduce((total, item) => total + item.sustainaBitePrice, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        ฿{savingsData.reduce((total, item) => total + item.savings, 0).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-600">
                        {(savingsData.reduce((total, item) => total + item.savings, 0) / 
                          savingsData.reduce((total, item) => total + item.marketPrice, 0) * 100).toFixed(1)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default Analytics;