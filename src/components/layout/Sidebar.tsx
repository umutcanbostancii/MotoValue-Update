import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, History, HelpCircle, Settings, Shield } from 'lucide-react';

const navigation = [
  { name: 'Gösterge Paneli', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Fiyat Hesapla', href: '/dashboard/calculator', icon: Calculator },
  { name: 'Geçmiş', href: '/dashboard/history', icon: History },
  { name: 'Nasıl Hesaplanır?', href: '/dashboard/guide', icon: HelpCircle },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
  { name: 'Admin Paneli', href: '/dashboard/admin', icon: Shield },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <Calculator className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <span className="text-lg font-semibold text-gray-900 dark:text-white">MotoValue</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                isActive
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}