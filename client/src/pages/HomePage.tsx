import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to E-Waste Recycler</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Schedule pickups for your e-waste, earn rewards, and help the environment.
      </p>
      <div className="space-x-4">
        <Link to="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
        <Link to="/login">
          <Button size="lg" variant="outline">
            Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
