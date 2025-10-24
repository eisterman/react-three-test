import { createFileRoute, useRouter } from '@tanstack/react-router';
import ThreeCanvas from '@/components/ThreeCanvas.tsx';
import { Sidebar } from '@/components/Sidebar.tsx';
import { Activity, useState } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils.ts';
import { Button } from '@/components/ui/button.tsx';

export const Route = createFileRoute('/_auth/editor')({
  component: Index,
});

function Navbar() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { supabase } = Route.useRouteContext();

  async function logout() {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error !== null) throw error;
      toast.success('Logout completed.');
      router.invalidate();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className='navbar bg-base-100 shadow-lg flex flex-row justify-between'>
      <div className='navbar-start'>
        <a className='btn btn-ghost text-xl'>Visual Tosso</a>
      </div>
      <div className='navbar-end'>
        <Button onClick={logout}>
          <span
            className={cn('swap items-center justify-items-center', isLoading && 'swap-active')}
          >
            <span className='swap-off'>Logout</span>
            <span className='swap-on loading loading-spinner'></span>
          </span>
        </Button>
      </div>
    </div>
  );
}

function Index() {
  const [sidebarShow, setSidebarShow] = useState<boolean>(true);
  const sidebarMode = sidebarShow ? 'visible' : 'hidden';
  return (
    <div className={'flex flex-col h-full w-full'}>
      <Navbar></Navbar>
      <div className={'h-full w-full flex flex-row'}>
        <div className={cn('relative z-0', sidebarShow ? 'w-4/5' : 'w-full')}>
          <ThreeCanvas></ThreeCanvas>
        </div>
        <div className={cn('relative z-10', sidebarShow && 'w-1/5')}>
          <Activity mode={sidebarMode}>
            <Sidebar className='h-full'></Sidebar>
          </Activity>
          <button
            className={'btn btn-primary absolute -left-10 top-4 z-10'}
            onClick={() => setSidebarShow((p) => !p)}
          >
            S
          </button>
        </div>
      </div>
    </div>
  );
}
