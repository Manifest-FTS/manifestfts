import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { trackEvent } from '../../lib/gtm';
import {
  RETAINER_DEFAULT_HOURS,
  clampRetainerHours,
  getRetainerSnapshot,
} from '../../util/retainer';

const RetainerContext = createContext(null);

export function RetainerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [purchaseState, setPurchaseState] = useState({
    source: 'site',
    hours: RETAINER_DEFAULT_HOURS,
  });

  const openRetainerPurchase = useCallback((options = {}) => {
    const source = options.source || 'site';
    const hours = clampRetainerHours(options.hours || RETAINER_DEFAULT_HOURS);

    setPurchaseState({ source, hours });
    setIsOpen(true);
    trackEvent('retainer_modal_open', { source, hours });
  }, []);

  const closeRetainerPurchase = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({
      isOpen,
      purchaseState,
      snapshot: getRetainerSnapshot(purchaseState.hours),
      openRetainerPurchase,
      closeRetainerPurchase,
    }),
    [closeRetainerPurchase, isOpen, openRetainerPurchase, purchaseState]
  );

  return <RetainerContext.Provider value={value}>{children}</RetainerContext.Provider>;
}

export function useRetainerPurchase() {
  const context = useContext(RetainerContext);
  if (!context) {
    throw new Error('useRetainerPurchase must be used within a RetainerProvider');
  }
  return context;
}