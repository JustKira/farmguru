import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  FunctionComponent,
} from 'react';
import { LoadingSheet } from '~/components/LoadingSheet';

type LoadingContextType = {
  startLoading: (message?: string) => void;
  success: (message?: string, closingCode?: () => void) => void;
  error: (message?: string, closingCode?: () => void) => void;
  cancelLoading: () => void;
};

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

type LoadingProviderProps = {
  children: ReactNode;
};

export const LoadingProvider: FunctionComponent<LoadingProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string | undefined>(undefined);

  const startLoading = useCallback((msg?: string) => {
    setVisible(true);
    setStatus('loading');
    setMessage(msg);
  }, []);

  const success = useCallback((msg?: string, closingCode?: () => void) => {
    setStatus('success');
    setMessage(msg);
    setTimeout(() => {
      setVisible(false);
      setStatus('loading');
      setMessage(undefined);
      closingCode?.();
    }, 1000);
  }, []);

  const error = useCallback((msg?: string, closingCode?: () => void) => {
    setStatus('error');
    setMessage(msg);
    setTimeout(() => {
      setVisible(false);
      setStatus('loading');
      setMessage(undefined);
      closingCode?.();
    }, 3000);
  }, []);

  const cancelLoading = useCallback(() => {
    setVisible(false);
    setStatus('loading');
    setMessage(undefined);
  }, []);

  return (
    <LoadingContext.Provider value={{ startLoading, success, error, cancelLoading }}>
      {children}
      <LoadingSheet visible={visible} status={status} message={message} />
    </LoadingContext.Provider>
  );
};

export function useLoading() {
  const context = useContext(LoadingContext);

  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }

  return context;
}
