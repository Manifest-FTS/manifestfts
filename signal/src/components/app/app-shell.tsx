'use client';
import * as React from 'react';
import { usePathname } from 'next/navigation';
import { Dialog } from 'radix-ui';
import { Menu, X } from 'lucide-react';
import { Sidebar, type ShellProps } from './sidebar';
import { CommandPalette } from './command-palette';
import { Notifications, type NotificationItem } from './notifications';
import { RunButton } from './run-button';
import { TooltipProvider } from '@/components/ui/tooltip';

interface AppShellProps extends ShellProps {
  workspaceId: string;
  notifications: NotificationItem[];
  activeRunId: string | null;
  canRun: boolean;
  sample: boolean;
  banners: React.ReactNode;
  children: React.ReactNode;
}

export function AppShell({ children, banners, notifications, workspaceId, activeRunId, canRun, sample, ...shell }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  // Close the drawer when the route changes (state adjusted during render, not in an effect).
  const pathname = usePathname();
  const [lastPath, setLastPath] = React.useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setMobileOpen(false);
  }

  return (
    <TooltipProvider>
      <div className="min-h-dvh bg-bg-subtle">
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-border bg-bg-subtle lg:block" aria-label="Sidebar">
          <Sidebar {...shell} />
        </aside>

        <Dialog.Root open={mobileOpen} onOpenChange={setMobileOpen}>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 bg-[#0a0d14]/40 data-[state=open]:animate-fade-in lg:hidden" />
            <Dialog.Content className="fixed inset-y-0 left-0 z-50 w-[280px] max-w-[85vw] border-r border-border bg-bg-subtle shadow-overlay outline-none lg:hidden" aria-describedby={undefined}>
              <Dialog.Title className="sr-only">Navigation</Dialog.Title>
              <Dialog.Close className="absolute right-3 top-4 z-10 grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-bg-muted" aria-label="Close navigation"><X className="size-4" /></Dialog.Close>
              <Sidebar {...shell} onNavigate={() => setMobileOpen(false)} />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="lg:pl-[248px]">
          <header className="sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-bg-subtle/85 px-4 backdrop-blur-xl sm:px-6">
            <button type="button" className="grid size-8 place-items-center rounded-lg text-fg-muted hover:bg-bg-muted lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen}>
              <Menu className="size-4" aria-hidden />
            </button>
            <span className="truncate text-[13.5px] font-semibold text-fg lg:hidden">{shell.workspace.name}</span>
            <div className="ml-auto flex items-center gap-2">
              <CommandPalette slug={shell.workspace.slug} workspaces={shell.workspaces} />
              <RunButton workspaceId={workspaceId} initialRunId={activeRunId} disabled={!canRun} sample={sample} />
              <Notifications items={notifications} slug={shell.workspace.slug} />
            </div>
          </header>
          {banners}
          <main id="main" className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </TooltipProvider>
  );
}
