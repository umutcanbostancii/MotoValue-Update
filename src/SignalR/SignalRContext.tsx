import { createContext, useContext } from "react";
import { HubConnection } from "@microsoft/signalr";

interface SignalRContextType {
  connection: HubConnection | null;
}

export const SignalRContext = createContext<SignalRContextType>({
  connection: null,
});

export const useSignalR = () => useContext(SignalRContext);
