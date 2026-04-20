import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { AuthProvider } from "../auth/AuthContext";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />

        {/* Global Toast System */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 2000,
          }}
        />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;