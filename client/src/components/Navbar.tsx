import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/AuthContext';
import { Button } from '@/components/ui/button';
import { Recycle } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="bg-card border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary transition-colors">
          <Recycle className="h-6 w-6 text-primary" />
          E-Waste Recycler
        </Link>
        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <span className="hidden sm:inline text-muted-foreground">Welcome, {user.name}!</span>
              <span className="font-semibold text-primary">Points: {user.points}</span>
              <Link to="/dashboard">
                <Button variant="ghost" className="text-foreground hover:text-primary">Dashboard</Button>
              </Link>
              <Link to="/roadmap">
                <Button variant="ghost" className="text-foreground hover:text-primary">Roadmap</Button>
              </Link>
              <Link to="/ai-detection">
                <Button variant="ghost" className="text-foreground hover:text-primary">AI Detection</Button>
              </Link>
              <Button onClick={handleLogout} variant="default">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-foreground hover:text-primary">Login</Button>
              </Link>
              <Link to="/signup">
                <Button variant="default">Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
