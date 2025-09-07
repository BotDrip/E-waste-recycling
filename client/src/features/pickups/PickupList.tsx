import * as React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Pickup } from '@/types';

export function PickupList() {
  const [pickups, setPickups] = React.useState<Pickup[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchPickups = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/pickups');
        if (!response.ok) {
          throw new Error('Failed to fetch pickups');
        }
        const data = await response.json();
        setPickups(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPickups();
  }, []);

  if (isLoading) {
    return <p>Loading pickups...</p>;
  }

  if (error) {
    return <p className="text-destructive">Error: {error}</p>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pickup Schedule</CardTitle>
        <CardDescription>
          Here are the currently scheduled e-waste pickups.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {pickups.length === 0 ? (
          <p className="text-muted-foreground">No pickups scheduled yet.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pickups.map((pickup) => (
                <TableRow key={pickup.id}>
                  <TableCell>{pickup.name}</TableCell>
                  <TableCell>{pickup.address}</TableCell>
                  <TableCell>{pickup.items_description}</TableCell>
                  <TableCell>
                    <Badge variant={pickup.status === 'completed' ? 'default' : 'secondary'}>
                      {pickup.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
