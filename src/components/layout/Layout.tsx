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

  const [connection, setConnection] = useState<HubConnection | null>(null);

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
        <div className={`flex h-screen ${isDark ? "dark" : ""}`}>
          <Sidebar />
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-gray-900">
            <TopBar />
            <main className="flex-1 overflow-y-auto">
              <Outlet />
            </main>
          </div>
        </div>
      </SignalRContext.Provider>
    </PrimeReactProvider>
  );
}
