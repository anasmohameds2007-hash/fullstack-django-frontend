import { BrowserRouter, Routes, Route, Navigate }
 from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import Login from "./pages/Login";
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import ShopPage from './pages/ShopPage';
import DealsPage from './pages/DealsPage';
import CategoriesPage from './pages/CategoriesPage';
import GoogleAuthCallback from './pages/GoogleAuthCallback';
import StaticPage from './pages/StaticPage';
import ComingSoonPage from './pages/ComingSoonPage';
import CursorBubble from './components/CursorBubble';

export default function App() {
  return (
    <BrowserRouter>
      {/* Global cursor bubble effect - appears on all pages */}
      <CursorBubble />
      
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/callback" element={<GoogleAuthCallback />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/shop-categories" element={<StaticPage type="shop" />} />
        <Route path="/support" element={<StaticPage type="support" />} />
        <Route path="/company" element={<StaticPage type="company" />} />
        <Route path="/careers" element={<ComingSoonPage type="careers" />} />
        <Route path="/blog" element={<ComingSoonPage type="blog" />} />
        <Route path="/press" element={<ComingSoonPage type="press" />} />
        <Route path="/partners" element={<ComingSoonPage type="partners" />} />
        <Route path="/stores" element={<ComingSoonPage type="stores" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
