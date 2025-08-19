import AppRoutes from "./routes";
import { BrowserRouter } from "react-router-dom";
import QueryProvider from "./components/providers/query-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

function App() {
  return (
    <div className="h-full">
      <BrowserRouter>
        <QueryProvider>
          <AppRoutes />
          <Toaster />
        </QueryProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
