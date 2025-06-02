import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calculator, History, HelpCircle, Settings, Shield, Timer } from 'lucide-react';
import { useState, useEffect } from 'react';
import { performanceMonitor } from '../../utils/performanceMonitor';

const navigation = [
  { name: 'Gösterge Paneli', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Fiyat Hesapla', href: '/dashboard/calculator', icon: Calculator },
  { name: 'Geçmiş', href: '/dashboard/history', icon: History },
  { name: 'Nasıl Hesaplanır?', href: '/dashboard/guide', icon: HelpCircle },
  { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings },
  { name: 'Admin Paneli', href: '/dashboard/admin', icon: Shield },
];

// Performance Dashboard component - sidebar'da görünecek
const PerformanceDashboard = () => {
  const [report, setReport] = useState(performanceMonitor.getReport());
  
  useEffect(() => {
    const interval = setInterval(() => {
      setReport(performanceMonitor.getReport());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  if (!import.meta.env.DEV) return null;

  return (
    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="w-3 h-3 text-blue-600 dark:text-blue-400" />
        <h3 className="text-xs font-semibold text-gray-800 dark:text-gray-200">Database Performance</h3>
      </div>
      
      <div className="text-xs space-y-1 text-gray-700 dark:text-gray-300">
        <div className="flex justify-between">
          <span>Toplam Sorgu:</span>
          <span className="font-medium">{report.totalOperations}</span>
        </div>
        <div className="flex justify-between">
          <span>Ortalama:</span>
          <span className="font-medium">
            {report.totalOperations > 0 ? `${report.averageDuration.toFixed(2)}ms` : '0ms'}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Başarı:</span>
          <span className="font-medium">
            {report.totalOperations > 0 ? `${report.successRate.toFixed(1)}%` : '100%'}
          </span>
        </div>
        
        {report.totalOperations === 0 ? (
          <div className="border-t border-gray-300 dark:border-gray-600 pt-1 mt-1 text-center text-gray-500 dark:text-gray-400">
            <div className="text-xs">Henüz sorgu yok</div>
            <div className="text-xs">Marka seçin! 🚀</div>
          </div>
        ) : (
          Object.entries(report.operationStats).map(([op, stats]) => (
            <div key={op} className="border-t border-gray-300 dark:border-gray-600 pt-1 mt-1">
              <div className="font-medium text-xs truncate" title={op}>{op}</div>
              <div className="text-gray-500 dark:text-gray-400 text-xs">
                {stats.count} kez • {stats.avgDuration.toFixed(2)}ms
                {stats.avgDuration < 100 ? ' 🚀' : stats.avgDuration < 300 ? ' ⚡' : ' 🐌'}
              </div>
            </div>
          ))
        )}
      </div>
      
      <button 
        onClick={() => performanceMonitor.clearMetrics()}
        disabled={report.totalOperations === 0}
        className={`mt-2 w-full text-xs px-2 py-1 rounded transition-colors ${
          report.totalOperations === 0 
            ? 'bg-gray-400 dark:bg-gray-600 text-gray-200 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 text-white'
        }`}
      >
        {report.totalOperations === 0 ? 'Boş' : 'Temizle'}
      </button>
    </div>
  );
};

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
      
      {/* Performance Dashboard - Admin Paneli'nin altında */}
      <div className="p-4">
        <PerformanceDashboard />
      </div>
    </div>
  );
}