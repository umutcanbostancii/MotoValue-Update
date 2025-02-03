import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calculator, 
  History, 
  HelpCircle, 
  Settings, 
  ShieldCheck,
  Bike
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Gösterge Paneli' },
  { path: '/calculator', icon: Calculator, label: 'Fiyat Hesapla' },
  { path: '/history', icon: History, label: 'Geçmiş' },
  { path: '/guide', icon: HelpCircle, label: 'Nasıl Hesaplanır?' },
  { path: '/settings', icon: Settings, label: 'Ayarlar' },
  { path: '/admin', icon: ShieldCheck, label: 'Admin Paneli' },
];

export function Sidebar() {
  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <Bike className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
          <span className="text-xl font-bold text-gray-900 dark:text-white">MotoValue</span>
        </div>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <item.icon className="h-5 w-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}