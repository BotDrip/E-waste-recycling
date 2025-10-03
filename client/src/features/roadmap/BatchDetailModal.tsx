import * as React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RoadmapBatch } from '@/types';
import { format } from 'date-fns';
import { Download, Package, Scale } from 'lucide-react';

interface BatchDetailModalProps {
  batch: RoadmapBatch | null;
  open: boolean;
  onClose: () => void;
}

export function BatchDetailModal({ batch, open, onClose }: BatchDetailModalProps) {
  if (!batch) return null;

  const canDownloadCertificate = batch.stage === 'completed';

  const handleDownloadCertificate = () => {
    alert('Certificate download feature coming soon!');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            Batch Details: {batch.batch_id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Source</p>
              <p className="font-semibold text-foreground">{batch.source}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge className="mt-1">{batch.stage.toUpperCase()}</Badge>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Weight</p>
              <div className="flex items-center gap-2 mt-1">
                <Scale className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{batch.total_weight} kg</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Item Count</p>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-4 w-4 text-primary" />
                <span className="font-semibold text-foreground">{batch.item_count}</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Assigned Date</p>
              <p className="font-semibold text-foreground">
                {format(new Date(batch.assigned_date), 'MMM d, yyyy')}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Last Updated</p>
              <p className="font-semibold text-foreground">
                {format(new Date(batch.updated_at), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
          </div>

          {batch.items && batch.items.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-foreground">Items in Batch</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {batch.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center p-3 bg-secondary rounded-lg"
                  >
                    <div>
                      <p className="font-semibold text-foreground">{item.item_type}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <Badge variant="outline">{item.condition}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {batch.history && batch.history.length > 0 && (
            <div>
              <h3 className="font-bold text-lg mb-3 text-foreground">Processing History</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {batch.history.map((entry) => (
                  <div key={entry.id} className="p-3 bg-secondary rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-semibold text-foreground">
                        {entry.from_stage} → {entry.to_stage}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(entry.changed_at), 'MMM d, HH:mm')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">By: {entry.changed_by}</p>
                    {entry.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{entry.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {batch.notes && (
            <div>
              <h3 className="font-bold text-lg mb-2 text-foreground">Notes</h3>
              <p className="text-muted-foreground bg-secondary p-3 rounded-lg">{batch.notes}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-border">
            <Button
              onClick={handleDownloadCertificate}
              disabled={!canDownloadCertificate}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Certificate
            </Button>
            <Button onClick={onClose} variant="outline">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
