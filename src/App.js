import { BrowserRouter, Routes, Route, Navigate }
 from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
