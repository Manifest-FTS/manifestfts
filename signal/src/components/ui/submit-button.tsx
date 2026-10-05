'use client';
import { useFormStatus } from 'react-dom';
import { Button, type ButtonProps } from './button';

/** Submit button that shows a pending state while its parent form's action runs. */
export function SubmitButton({ children, pendingLabel, ...props }: ButtonProps & { pendingLabel?: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" loading={pending} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
