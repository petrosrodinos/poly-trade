import { AlertTriangle } from "lucide-react";
import { Button } from "./button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export const ConfirmationDialog = ({ isOpen, onClose, onConfirm, title, description, confirmText = "Confirm", cancelText = "Cancel", variant = "default", isLoading = false }: ConfirmationDialogProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${variant === "destructive" ? "bg-red-100 dark:bg-red-900/20" : "bg-orange-100 dark:bg-orange-900/20"}`}>
              <AlertTriangle className={`h-5 w-5 ${variant === "destructive" ? "text-red-600 dark:text-red-400" : "text-orange-600 dark:text-orange-400"}`} />
            </div>
            <DialogTitle className="text-left">{title}</DialogTitle>
          </div>
        </DialogHeader>
        <DialogDescription className="text-left mt-2">{description}</DialogDescription>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button variant={variant} onClick={handleConfirm} disabled={isLoading} className="w-full sm:w-auto">
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
