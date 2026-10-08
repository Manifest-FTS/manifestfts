'use client';
import * as React from 'react';
import { toast } from 'sonner';

/** Shows a toast for the result of a server action, once per new state. */
export function useActionToast(state: { ok?: boolean; error?: string; message?: string }, onSuccess?: () => void) {
  const last = React.useRef(state);
  React.useEffect(() => {
    if (state === last.current) return;
    last.current = state;
    if (state.error) toast.error(state.error);
    else if (state.ok) {
      if (state.message) toast.success(state.message);
      onSuccess?.();
    }
  }, [state, onSuccess]);
}

export function toastResult(result: { ok?: boolean; error?: string; message?: string }) {
  if (result.error) toast.error(result.error);
  else if (result.message) toast.success(result.message);
}
