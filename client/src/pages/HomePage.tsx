import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Recycle, TrendingUp, Shield } from 'lucide-react';

export function HomePage() {
  return (
    <div className="min-h-[calc(100vh-80px)]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl font-bold mb-6 text-foreground">
            Transform E-Waste into Impact
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            Schedule pickups for your e-waste, track processing in real-time, earn rewards, and help create a sustainable future.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/signup">
              <Button size="lg" className="font-semibold">Get Started</Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="font-semibold">
                Login
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-card border-border hover:border-primary transition-all">
            <CardContent className="pt-6 text-center">
              <Recycle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Easy Recycling</h3>
              <p className="text-muted-foreground">
                Schedule pickups and track your e-waste from collection to final processing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary transition-all">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Earn Rewards</h3>
              <p className="text-muted-foreground">
                Get points for every pickup and unlock exclusive benefits as you recycle more
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border hover:border-primary transition-all">
            <CardContent className="pt-6 text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Secure Processing</h3>
              <p className="text-muted-foreground">
                Complete transparency with certified recycling and detailed processing roadmaps
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
