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
    <div className="mt-4 p-3 bg-white/8 backdrop-blur-2xl rounded-3xl border border-white/15 shadow-lg">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="w-3 h-3 text-blue-300" />
        <h3 className="text-xs font-semibold text-white/90">Database Performance</h3>
      </div>
      
      <div className="text-xs space-y-1 text-white/80">
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
          <div className="border-t border-white/20 pt-1 mt-1 text-center text-white/60">
            <div className="text-xs">Henüz sorgu yok</div>
            <div className="text-xs">Marka seçin! 🚀</div>
          </div>
        ) : (
          Object.entries(report.operationStats).map(([op, stats]) => (
            <div key={op} className="border-t border-white/20 pt-1 mt-1">
              <div className="font-medium text-xs truncate text-white/90" title={op}>{op}</div>
              <div className="text-white/60 text-xs">
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
        className={`mt-2 w-full text-xs px-2 py-1 rounded-2xl transition-all duration-200 ${
          report.totalOperations === 0 
            ? 'bg-white/15 text-white/40 cursor-not-allowed' 
            : 'bg-blue-500/70 hover:bg-blue-500/80 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {report.totalOperations === 0 ? 'Boş' : 'Temizle'}
      </button>
    </div>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();

  return (
    <div className={`flex flex-col w-64 bg-white/8 backdrop-blur-2xl border-r border-white/15 shadow-2xl
      fixed lg:relative z-50 lg:z-auto h-full transition-transform duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      
      <div className="flex items-center h-16 px-4 border-b border-white/15 bg-white/4 backdrop-blur-2xl">
        <Link to="/dashboard" className="flex items-center space-x-2 group">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-200">
            <Calculator className="h-6 w-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            MotorDegerle
          </span>
        </Link>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-500/70 to-purple-600/70 text-white shadow-lg backdrop-blur-2xl border border-white/25'
                  : 'text-white/80 hover:bg-white/8 hover:text-white hover:shadow-lg backdrop-blur-2xl border border-transparent hover:border-white/15'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-white/70'}`} />
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