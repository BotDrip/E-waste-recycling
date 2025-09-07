import * as React from 'react';
import { PickupList } from '@/features/pickups/PickupList';
import { PickupForm } from '@/features/pickups/PickupForm';
import { Toaster } from '@/components/ui/toaster';

function App() {
  const [refreshKey, setRefreshKey] = React.useState(0);

  const handlePickupRequested = () => {
    setRefreshKey(prevKey => prevKey + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">E-Waste Recycler</h1>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold mb-4">Schedule a Pickup</h2>
            <p className="text-muted-foreground mb-6">
              Fill out the form below to schedule a pickup for your electronic waste.
            </p>
            <PickupForm onPickupRequested={handlePickupRequested} />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Current Pickups</h2>
            <PickupList key={refreshKey} />
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
