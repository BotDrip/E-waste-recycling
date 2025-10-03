import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoadmapBatch } from '@/types';
import { format } from 'date-fns';

interface BatchCardProps {
  batch: RoadmapBatch;
  onDragStart: (e: React.DragEvent, batchId: number) => void;
  onClick: () => void;
}

export function BatchCard({ batch, onDragStart, onClick }: BatchCardProps) {
  const getUrgencyColor = (stage: string) => {
    if (stage === 'incoming') return 'bg-yellow-500';
    if (stage === 'completed') return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <Card
      draggable
      onDragStart={(e) => onDragStart(e, batch.id)}
      onClick={onClick}
      className="cursor-pointer hover:shadow-lg transition-all bg-card border-border hover:border-primary mb-3"
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${getUrgencyColor(batch.stage)}`} />
            <span className="font-bold text-foreground">{batch.batch_id}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {batch.item_count} items
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mb-1">
          From: {batch.source}
        </p>
        <p className="text-xs text-muted-foreground">
          Weight: {batch.total_weight} kg
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          Assigned: {format(new Date(batch.assigned_date), 'MMM d, yyyy')}
        </p>
      </CardContent>
    </Card>
  );
}
