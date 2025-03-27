// components/Inventory.jsx - Inventory management
import React, { useState, useEffect, useContext } from 'react';
import { Edit2, AlertTriangle, PlusCircle } from 'lucide-react';
import Layout from './Layout';
import AuthContext from '../contexts/AuthContext';
import NotificationContext from '../contexts/NotificationContext';
import { getInventory, updateInventoryItem } from '../services/apiService';

const Inventory = () => {
  const { user } = useContext(AuthContext);
  const { addNotification } = useContext(NotificationContext);
  
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editForm, setEditForm] = useState({
    currentStock: '',
    minLevel: ''
  });
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setIsLoading(true);
        const inventoryData = await getInventory(user.id);
        setInventory(inventoryData);
        setFilteredInventory(inventoryData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        addNotification('ไม่สามารถโหลดข้อมูลคลังสินค้าได้', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInventory();
  }, [user.id, addNotification]);
  
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredInventory(inventory);
    } else {
      const filtered = inventory.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventory(filtered);
    }
  }, [searchTerm, inventory]);
  
  const handleEditClick = (item) => {
    setEditingItem(item.id);
    setEditForm({
      currentStock: item.currentStock,
      minLevel: item.minLevel
    });
  };
  
  const handleEditCancel = () => {
    setEditingItem(null);
  };
  
  const handleEditSave = async (itemId) => {
    try {
      const updatedData = {
        id: itemId,
        currentStock: parseFloat(editForm.currentStock),
        minLevel: parseFloat(editForm.minLevel)
      };
      
      // Validate input
      if (isNaN(updatedData.currentStock) || isNaN(updatedData.minLevel)) {
        addNotification('กรุณากรอกตัวเลขให้ถูกต้อง', 'error');
        return;
      }
      
      if (updatedData.currentStock < 0 || updatedData.minLevel < 0) {
        addNotification('ตัวเลขต้องมากกว่าหรือเท่ากับ 0', 'error');
        return;
      }
      
      const response = await updateInventoryItem(updatedData);
      
      if (response.success) {
        // Update local state
        setInventory(prevInventory => 
          prevInventory.map(item => 
            item.id === itemId 
              ? { ...item, currentStock: updatedData.currentStock, minLevel: updatedData.minLevel } 
              : item
          )
        );
        
        addNotification('อัปเดตข้อมูลสำเร็จ', 'success');
        setEditingItem(null);
      } else {
        throw new Error(response.message || 'Failed to update inventory item');
      }
    } catch (error) {
      console.error('Error updating inventory item:', error);
      addNotification('อัปเดตข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง', 'error');
    }
  };
  
  const getStockStatus = (item) => {
    if (item.currentStock <= 0) {
      return { status: 'empty', label: 'หมด', color: 'text-red-500' };
    } else if (item.currentStock < item.minLevel) {
      return { status: 'low', label: 'ใกล้หมด', color: 'text-orange-500' };
    } else {
      return { status: 'ok', label: 'ปกติ', color: 'text-green-500' };
    }
  };

  return (
    <Layout>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">สินค้าคงคลัง</h2>
        
        {/* Inventory Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">รายการทั้งหมด</h3>
            <p className="text-2xl font-bold mt-1">{inventory.length}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">สินค้าใกล้หมด</h3>
            <p className="text-2xl font-bold mt-1 text-orange-500">
              {inventory.filter(item => item.currentStock > 0 && item.currentStock < item.minLevel).length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-medium text-gray-500">สินค้าหมดคลัง</h3>
            <p className="text-2xl font-bold mt-1 text-red-500">
              {inventory.filter(item => item.currentStock <= 0).length}
            </p>
          </div>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="ค้นหาสินค้าคงคลัง..." 
                className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <button
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <PlusCircle size={16} className="mr-2" />
              เพิ่มรายการ
            </button>
          </div>
        </div>
        
        {/* Inventory Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">ไม่พบข้อมูลสินค้าคงคลัง</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สินค้า
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      หมวดหมู่
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      คงเหลือ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ขั้นต่ำ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      สถานะ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      จัดการ
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => {
                    const stockStatus = getStockStatus(item);
                    
                    return (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 overflow-hidden">
                              <img 
                                src={item.image} 
                                alt={item.name}
                                className="h-full w-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "/api/placeholder/40/40";
                                }}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{item.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-20 px-2 py-1 border rounded-md"
                              value={editForm.currentStock}
                              onChange={(e) => setEditForm({...editForm, currentStock: e.target.value})}
                            />
                          ) : (
                            <div className={`text-sm font-medium ${stockStatus.color}`}>
                              {item.currentStock} {item.unit}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {editingItem === item.id ? (
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-20 px-2 py-1 border rounded-md"
                              value={editForm.minLevel}
                              onChange={(e) => setEditForm({...editForm, minLevel: e.target.value})}
                            />
                          ) : (
                            <div className="text-sm text-gray-900">{item.minLevel} {item.unit}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            stockStatus.status === 'empty' ? 'bg-red-100 text-red-800' :
                            stockStatus.status === 'low' ? 'bg-orange-100 text-orange-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {stockStatus.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {editingItem === item.id ? (
                            <div className="flex space-x-2">
                              <button 
                                onClick={() => handleEditSave(item.id)} 
                                className="text-green-600 hover:text-green-900"
                              >
                                บันทึก
                              </button>
                              <button 
                                onClick={handleEditCancel} 
                                className="text-red-600 hover:text-red-900"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          ) : (
                            <button 
                              onClick={() => handleEditClick(item)} 
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit2 size={16} />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;