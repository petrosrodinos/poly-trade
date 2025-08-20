import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";
import { useState } from "react";
import { useGetInMemoryBots } from "@/features/bot/hooks/use-bot";

interface InMemoryBotsModalProps {
  className?: string;
}

export const InMemoryBotsModal = ({ className }: InMemoryBotsModalProps) => {
  const { mutate: getInMemoryBots, data: inMemoryBots, isPending } = useGetInMemoryBots();
  const [showInMemoryModal, setShowInMemoryModal] = useState(false);

  const handleOpenModal = () => {
    setShowInMemoryModal(true);
    getInMemoryBots();
  };

  return (
    <Dialog open={showInMemoryModal} onOpenChange={setShowInMemoryModal}>
      <DialogTrigger asChild>
        <Button className={`w-full bg-purple-600 hover:bg-purple-700 text-white ${className}`} size="sm" onClick={handleOpenModal}>
          <Database className="w-4 h-4 mr-2" />
          View In-Memory Bots
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Database className="w-5 h-5 mr-2" />
            In-Memory Bots Data
          </DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {isPending ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : inMemoryBots ? (
            <div className="bg-gray-900 rounded-lg p-4 overflow-auto max-h-[60vh]">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">{JSON.stringify(inMemoryBots, null, 2)}</pre>
            </div>
          ) : (
            <div className="text-center p-8 text-muted-foreground">No in-memory bots data available</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
