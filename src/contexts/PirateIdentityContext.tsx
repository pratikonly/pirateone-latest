import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getGuestIdentity, regenerateIdentity as regenerateFromAPI, type PirateIdentity } from '@/lib/pirateIdentity';

interface PirateIdentityContextType {
  identity: PirateIdentity | null;
  isLoading: boolean;
  isRegenerating: boolean;
  regenerateIdentity: () => Promise<void>;
}

const PirateIdentityContext = createContext<PirateIdentityContextType | undefined>(undefined);

export function PirateIdentityProvider({ children }: { children: ReactNode }) {
  const [identity, setIdentity] = useState<PirateIdentity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    const loadIdentity = async () => {
      try {
        const pirateIdentity = await getGuestIdentity();
        setIdentity(pirateIdentity);
      } catch (error) {
        console.error('Failed to load pirate identity:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadIdentity();
  }, []);

  const regenerateIdentity = useCallback(async () => {
    setIsRegenerating(true);
    try {
      const newIdentity = await regenerateFromAPI();
      setIdentity(newIdentity);
    } catch (error) {
      console.error('Failed to regenerate identity:', error);
      throw error;
    } finally {
      setIsRegenerating(false);
    }
  }, []);

  return (
    <PirateIdentityContext.Provider value={{ identity, isLoading, isRegenerating, regenerateIdentity }}>
      {children}
    </PirateIdentityContext.Provider>
  );
}

export function usePirateIdentity() {
  const context = useContext(PirateIdentityContext);
  if (context === undefined) {
    throw new Error('usePirateIdentity must be used within a PirateIdentityProvider');
  }
  return context;
}
