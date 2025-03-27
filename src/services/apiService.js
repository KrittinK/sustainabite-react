// services/apiService.js - API service for data fetching
// Mock implementation for demonstration purposes
// In a real application, this would make actual API calls

// Demo data


const users = [
    {
      id: 'user1',
      email: 'demo@sustainabite.com',
      password: 'password',
      storeName: 'ร้านอาหารสุขภาพดี',
      address: '123 ถนนสุขุมวิท, กรุงเทพฯ'
    }
  ];
  
  const inventoryData = [
    { id: 1, name: 'ข้าวหอมมะลิ', category: 'ข้าวและแป้ง', currentStock: 8, minLevel: 10, unit: 'กก.', image: 'sustainabite/src/images/rice.jpg' },
    { id: 2, name: 'น้ำมันพืช', category: 'น้ำมันและเครื่องปรุง', currentStock: 3, minLevel: 5, unit: 'ลิตร', image: '/api/placeholder/40/40' },
    { id: 3, name: 'ไก่สด', category: 'เนื้อสัตว์', currentStock: 2, minLevel: 5, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 4, name: 'หมูสด', category: 'เนื้อสัตว์', currentStock: 4, minLevel: 5, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 5, name: 'มะเขือเทศ', category: 'ผักและผลไม้', currentStock: 1, minLevel: 3, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 6, name: 'หอมหัวใหญ่', category: 'ผักและผลไม้', currentStock: 0.5, minLevel: 2, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 7, name: 'พริก', category: 'ผักและผลไม้', currentStock: 0.2, minLevel: 1, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 8, name: 'กระเทียม', category: 'ผักและผลไม้', currentStock: 0, minLevel: 1, unit: 'กก.', image: '/api/placeholder/40/40' },
    { id: 9, name: 'ไข่ไก่', category: 'ไข่และนม', currentStock: 20, minLevel: 30, unit: 'ฟอง', image: '/api/placeholder/40/40' },
    { id: 10, name: 'น้ำตาล', category: 'น้ำมันและเครื่องปรุง', currentStock: 2, minLevel: 3, unit: 'กก.', image: '/api/placeholder/40/40' }
  ];
  
  const categories = [
    { id: 1, name: 'ข้าวและแป้ง' },
    { id: 2, name: 'น้ำมันและเครื่องปรุง' },
    { id: 3, name: 'เนื้อสัตว์' },
    { id: 4, name: 'ผักและผลไม้' },
    { id: 5, name: 'ไข่และนม' }
  ];
  
  const products = [
    { id: 1, name: 'ข้าวหอมมะลิออร์แกนิก', categoryId: 1, price: 60, unit: 'กก.', stock: 100, minStock: 10, discount: '10% ลด', image: 'sustainabite/src/images/rice.jpg' },
    { id: 2, name: 'ข้าวกล้อง', categoryId: 1, price: 55, unit: 'กก.', stock: 80, minStock: 10, image: '/api/placeholder/200/150' },
    { id: 3, name: 'น้ำมันถั่วเหลือง', categoryId: 2, price: 50, unit: 'ลิตร', stock: 30, minStock: 5, discount: '5% ลด', image: '/api/placeholder/200/150' },
    { id: 4, name: 'น้ำมันรำข้าว', categoryId: 2, price: 60, unit: 'ลิตร', stock: 25, minStock: 5, image: '/api/placeholder/200/150' },
    { id: 5, name: 'เนื้อไก่', categoryId: 3, price: 90, unit: 'กก.', stock: 40, minStock: 5, image: '/api/placeholder/200/150' },
    { id: 6, name: 'เนื้อหมู', categoryId: 3, price: 120, unit: 'กก.', stock: 35, minStock: 5, image: '/api/placeholder/200/150' },
    { id: 7, name: 'ผักคะน้า', categoryId: 4, price: 40, unit: 'กก.', stock: 20, minStock: 3, discount: '15% ลด', image: '/api/placeholder/200/150' },
    { id: 8, name: 'มะเขือเทศ', categoryId: 4, price: 50, unit: 'กก.', stock: 15, minStock: 3, image: '/api/placeholder/200/150' },
    { id: 9, name: 'ไข่ไก่', categoryId: 5, price: 4, unit: 'ฟอง', stock: 300, minStock: 50, discount: 'ซื้อ 30 ฟรี 3', image: '/api/placeholder/200/150' },
    { id: 10, name: 'นมสด', categoryId: 5, price: 20, unit: 'กล่อง', stock: 50, minStock: 10, image: '/api/placeholder/200/150' }
  ];
  
  const orders = [
    { id: 1, userId: 'user1', orderNumber: 'ORD-2023-001', date: '22 ก.พ. 2568', status: 'delivered', itemCount: 10, total: 1250 },
    { id: 2, userId: 'user1', orderNumber: 'ORD-2023-002', date: '15 ก.พ. 2568', status: 'delivered', itemCount: 8, total: 950 },
    { id: 3, userId: 'user1', orderNumber: 'ORD-2023-003', date: '8 ก.พ. 2568', status: 'delivered', itemCount: 12, total: 1350 },
    { id: 4, userId: 'user1', orderNumber: 'ORD-2023-004', date: '1 ก.พ. 2568', status: 'delivered', itemCount: 6, total: 750 }
  ];
  
  // API Functions
  export const loginUser = async (credentials) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = users.find(u => u.email === credentials.email && u.password === credentials.password);
    
    if (user) {
      // Don't send the password to the client
      const { password, ...userWithoutPassword } = user;
      return { success: true, user: userWithoutPassword };
    }
    
    return { success: false, message: 'Invalid credentials' };
  };
  
  export const getInventory = async (userId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, filter by userId
    return inventoryData;
  };
  
  export const updateInventoryItem = async (updatedItem) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real app, update the item in the database
    return { success: true };
  };
  
  export const getCategories = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return categories;
  };
  
  export const getProducts = async () => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return products;
  };
  
  export const getLowStockItems = async (userId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return inventoryData
      .filter(item => item.currentStock < item.minLevel)
      .map(item => ({
        id: item.id,
        name: item.name,
        currentStock: item.currentStock,
        minLevel: item.minLevel,
        unit: item.unit
      }));
  };
  
  export const getRecentOrders = async (userId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Return the most recent orders first
    return orders
      .filter(order => order.userId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);
  };
  
  export const getNextDelivery = async (userId) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Simulate next delivery
    return {
      id: 'd1',
      date: '27 มีนาคม 2568',
      timeWindow: '10:00 - 12:00 น.',
      status: 'scheduled',
      items: 8
    };
  };
  
  export const createOrder = async (orderData) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, create the order in the database
    const newOrderId = `ORD-${Date.now()}`;
    
    return { success: true, orderId: newOrderId };
  };
  
  export const getOrderAnalytics = async (userId, timeRange) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate mock data based on timeRange
    let data = [];
    
    if (timeRange === 'week') {
      // Daily data for the last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        // services/apiService.js (continued)
      date.setDate(date.getDate() - i);
      const day = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
      
      data.push({
        date: day,
        orders: Math.floor(Math.random() * 3) + 1,
        totalSpent: Math.floor(Math.random() * 500) + 300,
        avgOrderValue: Math.floor(Math.random() * 200) + 100
      });
    }
  } else if (timeRange === 'month') {
    // Weekly data for the last 4 weeks
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - 6);
      const weekEnd = new Date();
      weekEnd.setDate(weekEnd.getDate() - (i * 7));
      
      const weekLabel = `${weekStart.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - ${weekEnd.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}`;
      
      data.push({
        date: weekLabel,
        orders: Math.floor(Math.random() * 10) + 5,
        totalSpent: Math.floor(Math.random() * 2000) + 1000,
        avgOrderValue: Math.floor(Math.random() * 200) + 100
      });
    }
  } else {
    // Monthly data for the last 12 months
    const months = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
    const currentMonth = new Date().getMonth();
    
    for (let i = 11; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      
      data.push({
        date: months[monthIndex],
        orders: Math.floor(Math.random() * 40) + 20,
        totalSpent: Math.floor(Math.random() * 8000) + 4000,
        avgOrderValue: Math.floor(Math.random() * 200) + 100
      });
    }
  }
  
  return data;
};

export const getCostSavingsData = async (userId, timeRange) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Mock data for cost savings comparison
  return [
    { category: 'ข้าวและแป้ง', marketPrice: 1800, sustainaBitePrice: 1620, savings: 180 },
    { category: 'น้ำมันและเครื่องปรุง', marketPrice: 1200, sustainaBitePrice: 1080, savings: 120 },
    { category: 'เนื้อสัตว์', marketPrice: 3500, sustainaBitePrice: 3150, savings: 350 },
    { category: 'ผักและผลไม้', marketPrice: 2200, sustainaBitePrice: 1870, savings: 330 },
    { category: 'ไข่และนม', marketPrice: 1500, sustainaBitePrice: 1350, savings: 150 }
  ];
};