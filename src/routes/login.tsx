import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useForm, Controller } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils.ts';
import { toast } from 'sonner';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  beforeLoad: async ({ context, search }) => {
    const session = await context.supabase.auth.getSession();
    if (session.data.session !== null) throw redirect({ to: search.redirect || '/' });
  },
  component: RouteComponent,
});

const formSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(1),
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const { supabase } = Route.useRouteContext();
  const form = useForm({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    // Needed to respect React Hook controller component rules
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const { error } = await supabase.auth.signInWithPassword(data);
      if (error) throw error;
      toast.success(`Successfully logged in.`);
      navigate({ to: search.redirect || '/' }).then();
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      console.error(e);
    }
  }

  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Enter your email below to login to your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  <Controller
                    name='email'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                        <Input
                          {...field}
                          id={field.name}
                          type='email'
                          aria-invalid={fieldState.invalid}
                          placeholder='rodolfo@example.com'
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Controller
                    name='password'
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        {/*<div className='flex items-center'>*/}
                        <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                        {/*<a*/}
                        {/*  href='#'*/}
                        {/*  className='ml-auto inline-block text-sm underline-offset-4 hover:underline'*/}
                        {/*>*/}
                        {/*  Forgot your password?*/}
                        {/*</a>*/}
                        {/*</div>*/}
                        <Input
                          {...field}
                          id={field.name}
                          type='password'
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                  <Field>
                    <Button type='submit'>
                      <label className={cn('swap', form.formState.isSubmitting && 'swap-active')}>
                        <span className='swap-off'>Login</span>
                        <span className='swap-on loading loading-spinner'></span>
                      </label>
                    </Button>
                    {/*<Button variant='outline' type='button'>*/}
                    {/*  Login with Google*/}
                    {/*</Button>*/}
                    {/*<FieldDescription className='text-center'>*/}
                    {/*  Don&apos;t have an account? <a href='#'>Sign up</a>*/}
                    {/*</FieldDescription>*/}
                  </Field>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
