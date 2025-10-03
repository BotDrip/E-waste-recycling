import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RoadmapBatch, RoadmapStage } from '@/types';
import { BatchCard } from '@/features/roadmap/BatchCard';
import { BatchDetailModal } from '@/features/roadmap/BatchDetailModal';
import { AddBatchForm } from '@/features/roadmap/AddBatchForm';
import { useToast } from '@/components/ui/use-toast';
import { Plus, TrendingUp, Package, Zap } from 'lucide-react';

const STAGES: { id: RoadmapStage; label: string }[] = [
  { id: 'incoming', label: 'Incoming' },
  { id: 'collected', label: 'Collected' },
  { id: 'sorting', label: 'Sorting & Triage' },
  { id: 'dismantling', label: 'Dismantling' },
  { id: 'recovery', label: 'Material Recovery' },
  { id: 'completed', label: 'Completed' },
];

export function RoadmapPage() {
  const [batches, setBatches] = React.useState<RoadmapBatch[]>([]);
  const [selectedBatch, setSelectedBatch] = React.useState<RoadmapBatch | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isAddFormOpen, setIsAddFormOpen] = React.useState(false);
  const [draggedBatchId, setDraggedBatchId] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { toast } = useToast();

  const fetchBatches = async () => {
    try {
      const response = await fetch('/api/roadmap', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setBatches(data);
      }
    } catch (error) {
      console.error('Failed to fetch batches:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchBatches();
  }, []);

  const handleDragStart = (e: React.DragEvent, batchId: number) => {
    setDraggedBatchId(batchId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetStage: RoadmapStage) => {
    e.preventDefault();
    if (!draggedBatchId) return;

    try {
      const response = await fetch(`/api/roadmap/${draggedBatchId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ stage: targetStage }),
      });

      if (response.ok) {
        await fetchBatches();
        toast({
          title: 'Success',
          description: 'Batch status updated',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update batch status',
        variant: 'destructive',
      });
    } finally {
      setDraggedBatchId(null);
    }
  };

  const handleBatchClick = async (batch: RoadmapBatch) => {
    try {
      const response = await fetch(`/api/roadmap/${batch.id}`, {
        credentials: 'include',
      });
      if (response.ok) {
        const detailedBatch = await response.json();
        setSelectedBatch(detailedBatch);
        setIsDetailModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch batch details:', error);
    }
  };

  const getBatchesByStage = (stage: RoadmapStage) => {
    return batches.filter((batch) => batch.stage === stage);
  };

  const calculateMetrics = () => {
    const inProgress = batches.filter((b) => b.stage !== 'completed').length;
    const totalWeight = batches
      .filter((b) => b.stage === 'completed' && new Date(b.updated_at).getMonth() === new Date().getMonth())
      .reduce((sum, b) => sum + b.total_weight, 0);

    return { inProgress, totalWeight };
  };

  const metrics = calculateMetrics();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Loading roadmap...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2 text-foreground">Processing Roadmap</h1>
            <p className="text-muted-foreground">
              Manage and track your e-waste batches through the recycling process
            </p>
          </div>
          <Button onClick={() => setIsAddFormOpen(true)} size="lg" className="font-semibold">
            <Plus className="mr-2 h-5 w-5" />
            Add New Batch
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Batches in Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.inProgress}</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Weight (This Month)
              </CardTitle>
              <Package className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{metrics.totalWeight.toFixed(1)} kg</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Batches
              </CardTitle>
              <Zap className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{batches.length}</div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:hidden space-y-6">
          {STAGES.map((stage) => (
            <div key={stage.id} className="bg-secondary rounded-lg p-4">
              <div className="mb-4">
                <h3 className="font-bold text-foreground mb-1">{stage.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {getBatchesByStage(stage.id).length} batches
                </p>
              </div>
              <div className="space-y-3">
                {getBatchesByStage(stage.id).map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onDragStart={handleDragStart}
                    onClick={() => handleBatchClick(batch)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {STAGES.map((stage) => (
            <div
              key={stage.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, stage.id)}
              className="bg-secondary rounded-lg p-4 min-h-[500px]"
            >
              <div className="mb-4">
                <h3 className="font-bold text-foreground mb-1">{stage.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {getBatchesByStage(stage.id).length} batches
                </p>
              </div>
              <div className="space-y-3">
                {getBatchesByStage(stage.id).map((batch) => (
                  <BatchCard
                    key={batch.id}
                    batch={batch}
                    onDragStart={handleDragStart}
                    onClick={() => handleBatchClick(batch)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <BatchDetailModal
        batch={selectedBatch}
        open={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />

      <AddBatchForm
        open={isAddFormOpen}
        onClose={() => setIsAddFormOpen(false)}
        onBatchAdded={fetchBatches}
      />
    </div>
  );
}
