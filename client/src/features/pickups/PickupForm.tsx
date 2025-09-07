import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

interface PickupFormProps {
  onPickupRequested: () => void;
}

export function PickupForm({ onPickupRequested }: PickupFormProps) {
  const { toast } = useToast();
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [itemsDescription, setItemsDescription] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/pickups', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          address,
          email,
          phone,
          items_description: itemsDescription,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit pickup request');
      }

      toast({
        title: 'Success!',
        description: 'Your pickup request has been submitted.',
      });

      // Clear form
      setName('');
      setAddress('');
      setEmail('');
      setPhone('');
      setItemsDescription('');
      
      onPickupRequested();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'There was a problem submitting your request.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address</Label>
              <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St, Anytown, USA" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john.doe@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(123) 456-7890" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="items">E-Waste Items</Label>
              <Textarea id="items" value={itemsDescription} onChange={(e) => setItemsDescription(e.target.value)} placeholder="e.g., 2 laptops, 1 old monitor" required />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Request Pickup'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
