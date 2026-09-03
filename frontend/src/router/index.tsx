import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

/* ---- Lazy page imports for Phase 1 ---- */
const LandingPage     = lazy(() => import('../features/landing/LandingPage'));
const SignInPage      = lazy(() => import('../features/auth/SignInPage'));
const OnboardingPage  = lazy(() => import('../features/onboarding/OnboardingPage'));
const ConnectFeedPage = lazy(() => import('../features/connect/ConnectFeedPage'));

/* ---- Fallback Spinner ---- */
const PageLoader = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#F8FAFC' }}>
    <div style={{ width: 36, height: 36, border: '3px solid #E2E8F0', borderTopColor: '#047857', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

/* ---- Router Config ---- */
const router = createBrowserRouter([
  /* =========== PUBLIC / AUTH =========== */
  {
    path: '/',
    element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense>,
  },
  {
    path: '/login',
    element: <Suspense fallback={<PageLoader />}><SignInPage /></Suspense>,
  },
  {
    path: '/onboarding',
    element: <Suspense fallback={<PageLoader />}><OnboardingPage /></Suspense>,
  },
  {
    path: '/connect',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },
  {
    path: '/feed',
    element: <Navigate to="/connect" replace />,
  },

  /* =========== PLACEHOLDERS FOR PHASE 2 & 3 =========== */
  {
    path: '/messages',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },
  {
    path: '/bookmarks',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },
  {
    path: '/timetable',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },
  {
    path: '/profile/:id',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },

  /* =========== 404 =========== */
  {
    path: '*',
    element: (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100vh', gap:16, fontFamily:'Inter, sans-serif', backgroundColor: '#F8FAFC' }}>
        <div style={{ fontSize: 64, fontWeight: 800, color: '#047857' }}>404</div>
        <div style={{ fontSize: 18, color: '#64748B' }}>Page not found</div>
        <a href="/" style={{ color: '#047857', fontWeight: 600 }}>← Back to Home</a>
      </div>
    ),
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
