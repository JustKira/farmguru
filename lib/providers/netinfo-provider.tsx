import NetInfo from '@react-native-community/netinfo';
import React, { PropsWithChildren, useContext, useEffect, useState } from 'react';
type ContextType = {
  checking: boolean;
  isConnected: boolean;
};

export const NetInfoContext = React.createContext<ContextType>({
  checking: true,
  isConnected: false,
});

export const useNetInfo = () => useContext(NetInfoContext);

export function NetInfoProvider({ children }: PropsWithChildren) {
  const [checking, setChecking] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? false);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetInfoContext.Provider value={{ checking, isConnected }}>{children}</NetInfoContext.Provider>
  );
}
