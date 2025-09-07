import * as React from 'react';
import { PickupList } from '@/features/pickups/PickupList';
import { PickupForm } from '@/features/pickups/PickupForm';
import { useAuth } from '@/features/auth/AuthContext';

export function DashboardPage() {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const { user } = useAuth();

  const handlePickupRequested = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name}!</h1>
      <p className="text-xl text-muted-foreground mb-6">You have <span className="font-bold text-primary">{user?.points}</span> reward points.</p>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-bold mb-4">Schedule a Pickup</h2>
          <p className="text-muted-foreground mb-6">
            Fill out the form below to schedule a pickup for your electronic waste. You'll earn 10 points for each pickup!
          </p>
          <PickupForm onPickupRequested={handlePickupRequested} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Your Pickups</h2>
          <PickupList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
