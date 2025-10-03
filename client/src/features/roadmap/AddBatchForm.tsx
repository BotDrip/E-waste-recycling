import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Trash } from 'lucide-react';

interface BatchItem {
  item_type: string;
  quantity: number;
  condition: string;
}

interface AddBatchFormProps {
  open: boolean;
  onClose: () => void;
  onBatchAdded: () => void;
}

export function AddBatchForm({ open, onClose, onBatchAdded }: AddBatchFormProps) {
  const { toast } = useToast();
  const [source, setSource] = React.useState('');
  const [totalWeight, setTotalWeight] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [items, setItems] = React.useState<BatchItem[]>([
    { item_type: '', quantity: 1, condition: 'Good' }
  ]);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleAddItem = () => {
    setItems([...items, { item_type: '', quantity: 1, condition: 'Good' }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, field: keyof BatchItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const validItems = items.filter(item => item.item_type.trim() !== '');

      if (validItems.length === 0) {
        toast({
          title: 'Error',
          description: 'Please add at least one item',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      const response = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          source,
          total_weight: parseFloat(totalWeight) || 0,
          notes,
          items: validItems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create batch');
      }

      toast({
        title: 'Success',
        description: 'Batch created successfully',
      });

      setSource('');
      setTotalWeight('');
      setNotes('');
      setItems([{ item_type: '', quantity: 1, condition: 'Good' }]);
      onBatchAdded();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create batch',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Add New Batch</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="source">Source</Label>
            <Input
              id="source"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="e.g., GreenTech Corp, Residential Pickup"
              required
              className="bg-background"
            />
          </div>

          <div>
            <Label htmlFor="weight">Total Weight (kg)</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              value={totalWeight}
              onChange={(e) => setTotalWeight(e.target.value)}
              placeholder="e.g., 25.5"
              required
              className="bg-background"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Items</Label>
              <Button type="button" onClick={handleAddItem} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-start p-3 bg-secondary rounded-lg">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={item.item_type}
                      onChange={(e) => handleItemChange(index, 'item_type', e.target.value)}
                      placeholder="Item type (e.g., Laptop, Phone)"
                      required
                      className="bg-background"
                    />
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                        placeholder="Qty"
                        className="w-20 bg-background"
                      />
                      <Input
                        value={item.condition}
                        onChange={(e) => handleItemChange(index, 'condition', e.target.value)}
                        placeholder="Condition"
                        className="flex-1 bg-background"
                      />
                    </div>
                  </div>
                  {items.length > 1 && (
                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      variant="ghost"
                      size="sm"
                      className="text-destructive"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes about this batch"
              rows={3}
              className="bg-background"
            />
          </div>

          <div className="flex gap-3">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Batch'}
            </Button>
            <Button type="button" onClick={onClose} variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
