import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FavoritesProvider } from "@/lib/favorites";
import { FavoritesPage } from "@/pages/Favorites";
import { HomePage } from "@/pages/Home";
import { NotFoundPage } from "@/pages/NotFound";
import { PantryPage } from "@/pages/Pantry";
import { RecipePage } from "@/pages/Recipe";

function ScrollManager() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.slice(1);
      const frame = requestAnimationFrame(() => {
        const target = document.getElementById(id);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo(0, 0);
        }
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
    <FavoritesProvider>
      <ScrollManager />
      <div className="flex min-h-dvh flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/pantry" element={<PantryPage />} />
            <Route path="/recipe/:slug" element={<RecipePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </FavoritesProvider>
  );
}
