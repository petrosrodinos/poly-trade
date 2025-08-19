import { Button } from "@/components/ui/button";
import { LayoutGrid, Table as TableIcon } from "lucide-react";

interface ViewToggleProps {
  currentView: "card" | "table";
  onViewChange: (view: "card" | "table") => void;
}

export const ViewToggle = ({ currentView, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
      <Button variant={currentView === "card" ? "default" : "ghost"} size="sm" onClick={() => onViewChange("card")} className="h-9 px-3">
        <LayoutGrid className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Card View</span>
        <span className="sm:hidden">Cards</span>
      </Button>
      <Button variant={currentView === "table" ? "default" : "ghost"} size="sm" onClick={() => onViewChange("table")} className="h-9 px-3">
        <TableIcon className="h-4 w-4 mr-2" />
        <span className="hidden sm:inline">Table View</span>
        <span className="sm:hidden">Table</span>
      </Button>
    </div>
  );
};
