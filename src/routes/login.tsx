import type { FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import useAuthStore from '@/stores/useAuthStore.ts';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import z from 'zod';

export const Route = createFileRoute('/login')({
  validateSearch: z.object({
    redirect: z.string().optional().catch(''),
  }),
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const search = Route.useSearch();
  const login = useAuthStore((state) => state.login);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    login();
    navigate({ to: search.redirect || '/' }).then();
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
              <form onSubmit={onSubmit}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor='email'>Email</FieldLabel>
                    <Input
                      id='email'
                      type='email'
                      name='email'
                      placeholder='rodolfo@example.com'
                      required
                    />
                  </Field>
                  <Field>
                    <div className='flex items-center'>
                      <FieldLabel htmlFor='password'>Password</FieldLabel>
                      {/*<a*/}
                      {/*  href='#'*/}
                      {/*  className='ml-auto inline-block text-sm underline-offset-4 hover:underline'*/}
                      {/*>*/}
                      {/*  Forgot your password?*/}
                      {/*</a>*/}
                    </div>
                    <Input id='password' type='password' name='password' required />
                  </Field>
                  <Field>
                    <Button type='submit'>Login</Button>
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
