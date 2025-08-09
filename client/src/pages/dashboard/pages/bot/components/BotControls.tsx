import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface BotControlsProps {
  isRunning: boolean;
  onStartStop: () => void;
  onDelete: () => void;
  symbol: string;
}

export const BotControls = ({ isRunning, onStartStop, onDelete, symbol }: BotControlsProps) => {
  return (
    <Card className="p-4 bg-gradient-to-r from-slate-50 to-gray-50 border shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 lg:gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full flex items-center justify-center ${isRunning ? "bg-green-500 shadow-green-500/50 shadow-lg animate-pulse" : "bg-gray-400"}`}>{isRunning && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>}</div>
            <Badge variant={isRunning ? "default" : "secondary"} className={`text-sm px-3 py-1 font-medium ${isRunning ? "bg-green-100 text-green-800 border-green-200" : "bg-gray-100 text-gray-600 border-gray-200"}`}>
              {isRunning ? "Bot Active" : "Bot Stopped"}
            </Badge>
          </div>

          <Separator orientation="vertical" className="h-6 hidden sm:block" />

          <div className="text-sm text-gray-600">
            Symbol: <span className={`font-medium ${isRunning ? "text-green-700" : "text-gray-500"}`}>{symbol}</span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0">
          <Button variant={isRunning ? "destructive" : "default"} size="sm" onClick={onStartStop} className={`w-full sm:w-auto sm:min-w-[100px] font-medium transition-all duration-200 ${isRunning ? "bg-red-500 hover:bg-red-600 shadow-red-500/20 shadow-lg" : "bg-green-500 hover:bg-green-600 text-white shadow-green-500/20 shadow-lg"}`}>
            <div className="flex items-center justify-center gap-2 min-w-0">
              {isRunning ? (
                <>
                  <div className="w-2 h-2 bg-white rounded-sm flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Stop Bot</span>
                  <span className="sm:hidden truncate">Stop</span>
                </>
              ) : (
                <>
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent flex-shrink-0"></div>
                  <span className="hidden sm:inline truncate">Start Bot</span>
                  <span className="sm:hidden truncate">Start</span>
                </>
              )}
            </div>
          </Button>

          <Button variant="outline" size="sm" onClick={onDelete} className="w-full sm:w-auto sm:min-w-[100px] border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200">
            <div className="flex items-center justify-center gap-2 min-w-0">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="hidden sm:inline truncate">Delete Bot</span>
              <span className="sm:hidden truncate">Delete</span>
            </div>
          </Button>
        </div>
      </div>
    </Card>
  );
};
