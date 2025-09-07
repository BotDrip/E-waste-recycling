import * as React from 'react';
import { LoginForm } from '@/features/auth/LoginForm';

export function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
      <LoginForm />
    </div>
  );
}
