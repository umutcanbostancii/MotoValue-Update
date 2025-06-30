import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";
import { useTheme } from "../../contexts/ThemeContext";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { SignalRContext } from "../../SignalR/SignalRContext";
import { PrimeReactProvider } from "primereact/api";
import "./layout.css";

const SOCKET_API_URL = import.meta.env.VITE_SOCKET_API_URL;

export function Layout() {
  const { isDark } = useTheme();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentBg, setCurrentBg] = useState(0);

  const [connection, setConnection] = useState<HubConnection | null>(null);

  const backgrounds = [
    '/src/Assets/1.jpeg',
    '/src/Assets/2.jpeg', 
    '/src/Assets/3.jpeg',
    '/src/Assets/4.jpeg'
  ];

  // Background rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % backgrounds.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`${SOCKET_API_URL}extensionHub`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    newConnection
      .start()
      .then(() => {
        console.log("SignalR Connected!");
        setConnection(newConnection);
      })
      .catch((err) => console.error("Connection failed: ", err));

    return () => {
      newConnection.stop();
    };
  }, []);

  return (
    <PrimeReactProvider>
      <SignalRContext.Provider value={{ connection }}>
        <div className={`flex h-screen relative ${isDark ? "dark" : ""}`}>
          {/* Background Images with Animation */}
          <div className="absolute inset-0 z-0">
            {backgrounds.map((bg, index) => (
              <div
                key={index}
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out"
                style={{
                  backgroundImage: `url(${bg})`,
                  opacity: currentBg === index ? 1 : 0,
                }}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20 backdrop-blur-[2px]" />
          </div>

          {/* Mobile backdrop */}
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
          )}
          
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
          />
          
          <div className="flex-1 flex flex-col overflow-hidden relative z-10">
            <TopBar onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>

          {/* Background Indicators */}
          <div className="fixed bottom-8 right-8 flex space-x-2 z-20">
            {backgrounds.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentBg(index)}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  currentBg === index
                    ? 'bg-white/70 scale-110'
                    : 'bg-white/25 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </SignalRContext.Provider>
    </PrimeReactProvider>
  );
}
