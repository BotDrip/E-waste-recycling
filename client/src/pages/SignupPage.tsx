import * as React from 'react';
import { SignupForm } from '@/features/auth/SignupForm';

export function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-md">
      <h2 className="text-3xl font-bold mb-4 text-center">Create an Account</h2>
      <SignupForm />
    </div>
  );
}
