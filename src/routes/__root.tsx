import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import 'leaflet/dist/leaflet.css';
import { Toaster } from '@/components/ui/sonner.tsx';
import { SupabaseClient } from '@supabase/supabase-js';

interface MyRouterContext {
  supabase: SupabaseClient;
}

const RootLayout = () => (
  <>
    <Outlet />
    <Toaster />
    <TanStackRouterDevtools />
  </>
);

export const Route = createRootRouteWithContext<MyRouterContext>()({ component: RootLayout });
