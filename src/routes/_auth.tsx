import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/_auth')({
  beforeLoad: async ({ context }) => {
    const session = await context.supabase.auth.getSession();
    if (session.data.session === null) {
      throw redirect({
        to: '/login',
        search: {
          // For some reason href break the URL (it became http:/path missing a /)
          // So we use pathname even if this forgets searchParams and hash, but right now we are
          // not using them if not for this specific login redirect.
          redirect: location.pathname,
        },
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Outlet />;
}
