// components/Profile.jsx - User profile
import React, { useContext, useState } from 'react';
import Layout from './Layout';
import AuthContext from '../contexts/AuthContext';
import NotificationContext from '../contexts/NotificationContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [formData, setFormData] = useState({
    storeName: user.storeName || '',
    email: user.email || '',
    address: user.address || '',
    phone: user.phone || ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSave = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, update user data in the backend
      
      addNotification('บันทึกข้อมูลสำเร็จ', 'success');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      addNotification('เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">โปรไฟล์</h2>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium">ข้อมูลร้านค้า</h3>
            
            {!isEditing ? (
              <button 
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                แก้ไข
              </button>
            ) : (
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400"
                  disabled={isSubmitting}
                >
                  ยกเลิก
                </button>
                <button 
                  onClick={handleSave}
                  className={`px-4 py-2 bg-green-600 text-white rounded-lg ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-green-700'
                  }`}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ชื่อร้านค้า
              </label>
              {isEditing ? (
                <input 
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{formData.storeName}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                อีเมล
              </label>
              {isEditing ? (
                <input 
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{formData.email}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                ที่อยู่
              </label>
              {isEditing ? (
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{formData.address}</p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                เบอร์โทรศัพท์
              </label>
              {isEditing ? (
                <input 
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded-lg">{formData.phone || '-'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;