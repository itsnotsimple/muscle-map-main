import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
// Импортираме новите страници
import BmiPage from "./pages/BmiPage";
import Bookmarks from "./pages/Bookmarks";
import MuscleDetail from "./pages/MuscleDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
     <BrowserRouter>
      <Routes>
          <Route path="/" element={<Index />} />
        
          {/* АУТЕНТИКАЦИЯ */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ДРУГИ СТРАНИЦИ */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/bmi" element={<BmiPage />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
          <Route path="/muscle/:muscleId" element={<MuscleDetail />} />
        
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;