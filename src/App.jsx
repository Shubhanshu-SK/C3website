import React, { useEffect, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';

import { ThemeProvider } from './context/ThemeContext';
import Loader from './components/Loader';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import MouseTrail from './components/MouseTrail';
import AuroraBg from './components/AuroraBg';

// Pages
import LandingPage from './pages/LandingPage';
import EventsPage from './pages/EventsPage';
import EventDetailPage from './pages/EventDetailPage';
import DomainsPage from './pages/DomainsPage';
import DomainDetailPage from './pages/DomainDetailPage';
import TeamPage from './pages/TeamPage';
import ProjectsPage from './pages/ProjectsPage';
import AdminPage from './pages/AdminPage';
import AdminEventFormPage from './pages/AdminEventFormPage';
import AdminProjectFormPage from './pages/AdminProjectFormPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import MemberDetailPage from './pages/MemberDetailPage';
import MobileBottomNav from './components/MobileBottomNav';

function App() {
  const [loaded, setLoaded] = useState(false);
  const location = useLocation();

  /* ── Lenis smooth scroll ─────────────────────────────────── */
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    window.lenisInstance = lenis;

    let raf;
    const tick = (time) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Global listener for local anchors
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length < 2) return;
      
      const el = document.querySelector(href);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el, { offset: -80 });
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.lenisInstance = null;
      document.removeEventListener('click', onClick);
    };
  }, []);

  /* ── Scroll Manager on Route Change ──────────────────────── */
  useEffect(() => {
    // Scroll to top on standard navigation
    if (!location.hash) {
      window.scrollTo(0, 0);
      if (window.lenisInstance) {
        window.lenisInstance.scrollTo(0, { immediate: true });
      }
    } else {
      // If there is an anchor hash in the URL, wait and scroll to it
      setTimeout(() => {
        const el = document.querySelector(location.hash);
        if (el && window.lenisInstance) {
          window.lenisInstance.scrollTo(el, { offset: -80 });
        } else if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [location.pathname, location.hash]);

  return (
    <ThemeProvider>
      <div data-testid="app-root" className="relative" style={{ overflowX: 'hidden' }}>
        {/* Aurora mesh gradient — behind everything */}
        <AuroraBg />

        {/* Spotlight mouse trail */}
        <MouseTrail />

        {/* Preloader */}
        <AnimatePresence>
          {!loaded && <Loader key="loader" onDone={() => setLoaded(true)} />}
        </AnimatePresence>

        {loaded && (
          <>
            <Navbar />
            <main className="relative z-10 pb-20 md:pb-0">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/events/:id" element={<EventDetailPage />} />
                <Route path="/domains" element={<DomainsPage />} />
                <Route path="/domains/:domain" element={<DomainDetailPage />} />
                <Route path="/team" element={<TeamPage />} />
                <Route path="/team/:id" element={<MemberDetailPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/admin/registrations" element={<AdminPage />} />
                <Route path="/admin/events/create" element={<AdminEventFormPage />} />
                <Route path="/admin/events/edit/:id" element={<AdminEventFormPage />} />
                <Route path="/admin/projects/create" element={<AdminProjectFormPage />} />
                <Route path="/admin/projects/edit/:id" element={<AdminProjectFormPage />} />
              </Routes>
            </main>
            <MobileBottomNav />
            <Footer />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
