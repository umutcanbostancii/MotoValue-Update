import { Bell, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface Notification {
  message: string;
  date: string;
}

interface TopBarProps {
  onToggleSidebar: () => void;
}

export function TopBar({ onToggleSidebar }: TopBarProps) {
  const [notifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    navigate('/');
  };

  return (
    <header className="bg-white/8 backdrop-blur-2xl border-b border-white/15 shadow-lg">
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Hamburger Menu - Mobile Only */}
          <button
            onClick={onToggleSidebar}
            className="p-2 rounded-2xl text-white/80 hover:bg-white/10 lg:hidden transition-all duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            MotorDegerle
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative group">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-white/80 hover:text-white relative transition-all duration-200 hover:bg-white/10 rounded-2xl"
            >
              <Bell className="h-6 w-6" />
              {notifications.length > 0 && (
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/20 z-50">
                <div className="p-4">
                  <h3 className="text-lg font-medium text-white mb-2">
                    Bildirimler
                  </h3>
                  {notifications.length === 0 ? (
                    <p className="text-white/70">
                      Yeni bildirim bulunmuyor
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((notification, index) => (
                        <div
                          key={index}
                          className="p-2 hover:bg-white/10 rounded-2xl transition-all duration-200"
                        >
                          <p className="text-sm text-white">
                            {notification.message}
                          </p>
                          <p className="text-xs text-white/70">
                            {notification.date}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="relative group">
            <button className="flex items-center space-x-3 p-2 rounded-2xl hover:bg-white/10 transition-all duration-200">
              <User className="h-6 w-6 text-white/80" />
              <span className="text-sm font-medium text-white/90">
                Test Kullanıcı
              </span>
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-white/10 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/20 hidden group-hover:block z-50">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-400 hover:bg-white/10 rounded-3xl transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Çıkış Yap</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}