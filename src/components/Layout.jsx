// Layout.jsx - Main layout for the application (with Prediction menu added)
import React, { useState, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Activity, ShoppingCart, Package, BarChart2, Menu, X, User, Bell, LogOut, Settings, TrendingUp } from 'lucide-react';
import AuthContext from '../contexts/AuthContext';
import NotificationContext from '../contexts/NotificationContext';
import CartContext from '../contexts/CartContext';

const Layout = ({ children }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const { notifications } = useContext(NotificationContext);
  const { cart } = useContext(CartContext);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getActiveTab = () => {
    if (location.pathname === '/') return 'dashboard';
    if (location.pathname === '/order') return 'order';
    if (location.pathname === '/inventory') return 'inventory';
    if (location.pathname === '/analytics') return 'analytics';
    if (location.pathname === '/prediction') return 'prediction';
    return 'dashboard';
  };

  const activeTab = getActiveTab();

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Top Navigation */}
      <div className="bg-green-800 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button onClick={toggleMenu} className="mr-3">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <h1 className="text-xl font-bold">SustainaBite</h1>
        </div>
        <div className="flex items-center">
          <Link to="/order" className="mr-3 relative">
            <ShoppingCart size={20} />
            {cart && cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </Link>
          <button className="mr-3 relative">
            <Bell size={20} />
            {notifications && notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>
          <div className="relative group">
            <button className="flex items-center">
              <User size={20} />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
              <p className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                {user?.storeName || 'ร้านค้า'}
              </p>
              <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">โปรไฟล์</Link>
              <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ตั้งค่า</Link>
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">ออกจากระบบ</button>
            </div>
          </div>
        </div>
      </div>

      {/* Slide-in Menu */}
      {menuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleMenu}>
          <div className="bg-white h-full w-64 p-4" onClick={e => e.stopPropagation()}>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-green-800">{user?.storeName || 'ร้านอาหาร'}</h2>
              <p className="text-sm text-gray-500">ID: {user?.id || 'ST-000'}</p>
            </div>
            <nav className="space-y-1">
              <Link to="/" onClick={toggleMenu}>
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'dashboard' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>
                  <div className="mr-3"><Activity size={20} /></div>
                  <span className="font-medium">แดชบอร์ด</span>
                </div>
              </Link>
              <Link to="/order" onClick={toggleMenu}>
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'order' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>
                  <div className="mr-3"><ShoppingCart size={20} /></div>
                  <span className="font-medium">สั่งวัตถุดิบ</span>
                </div>
              </Link>
              <Link to="/inventory" onClick={toggleMenu}>
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'inventory' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>
                  <div className="mr-3"><Package size={20} /></div>
                  <span className="font-medium">สินค้าคงคลัง</span>
                </div>
              </Link>
              <Link to="/analytics" onClick={toggleMenu}>
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'analytics' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>
                  <div className="mr-3"><BarChart2 size={20} /></div>
                  <span className="font-medium">วิเคราะห์ข้อมูล</span>
                </div>
              </Link>
              {/* New Prediction Menu Item */}
              <Link to="/prediction" onClick={toggleMenu}>
                <div className={`flex items-center px-4 py-3 rounded-lg cursor-pointer ${activeTab === 'prediction' ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'}`}>
                  <div className="mr-3"><TrendingUp size={20} /></div>
                  <span className="font-medium">คาดการณ์</span>
                </div>
              </Link>
            </nav>
            <div className="absolute bottom-8 w-full left-0 border-t border-gray-200 p-4">
              <div className="flex items-center px-4 py-3 rounded-lg cursor-pointer hover:bg-gray-100" onClick={handleLogout}>
                <div className="mr-3"><LogOut size={20} /></div>
                <span className="font-medium">ออกจากระบบ</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 flex justify-around items-center p-2 md:hidden">
        <Link to="/">
          <div className={`flex flex-col items-center py-1 px-2 ${activeTab === 'dashboard' ? 'text-green-800' : 'text-gray-500'}`}>
            <Activity size={20} />
            <span className="text-xs mt-1">แดชบอร์ด</span>
          </div>
        </Link>
        <Link to="/order">
          <div className={`flex flex-col items-center py-1 px-2 ${activeTab === 'order' ? 'text-green-800' : 'text-gray-500'}`}>
            <ShoppingCart size={20} />
            <span className="text-xs mt-1">สั่งซื้อ</span>
          </div>
        </Link>
        <Link to="/inventory">
          <div className={`flex flex-col items-center py-1 px-2 ${activeTab === 'inventory' ? 'text-green-800' : 'text-gray-500'}`}>
            <Package size={20} />
            <span className="text-xs mt-1">คลัง</span>
          </div>
        </Link>
        <Link to="/analytics">
          <div className={`flex flex-col items-center py-1 px-2 ${activeTab === 'analytics' ? 'text-green-800' : 'text-gray-500'}`}>
            <BarChart2 size={20} />
            <span className="text-xs mt-1">วิเคราะห์</span>
          </div>
        </Link>
        {/* Add Prediction to bottom navigation */}
        <Link to="/prediction">
          <div className={`flex flex-col items-center py-1 px-2 ${activeTab === 'prediction' ? 'text-green-800' : 'text-gray-500'}`}>
            <TrendingUp size={20} />
            <span className="text-xs mt-1">คาดการณ์</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Layout;