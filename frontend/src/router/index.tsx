import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

/* ---- Phase 1 Lazy Imports ---- */
const LandingPage     = lazy(() => import('../features/landing/LandingPage'));
const SignInPage      = lazy(() => import('../features/auth/SignInPage'));
const OnboardingPage  = lazy(() => import('../features/onboarding/OnboardingPage'));
const ConnectFeedPage = lazy(() => import('../features/connect/ConnectFeedPage'));

/* ---- Phase 2 Lazy Imports ---- */
const SearchResultsPage = lazy(() => import('../features/search/SearchResultsPage'));
const FiltersPage       = lazy(() => import('../features/filters/FiltersPage'));
const ProfileDetailPage = lazy(() => import('../features/profile/ProfileDetailPage'));
const MessagesPage      = lazy(() => import('../features/messages/MessagesPage'));

/* ---- Phase 3 Lazy Imports ---- */
const BookmarksPage = lazy(() => import('../features/bookmarks/BookmarksPage'));
const TimetablePage = lazy(() => import('../features/timetable/TimetablePage'));
const MyProfilePage = lazy(() => import('../features/profile/MyProfilePage'));

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

  /* =========== CORE APP (PHASE 1, 2, 3) =========== */
  {
    path: '/connect',
    element: <Suspense fallback={<PageLoader />}><ConnectFeedPage /></Suspense>,
  },
  {
    path: '/feed',
    element: <Navigate to="/connect" replace />,
  },
  {
    path: '/search',
    element: <Suspense fallback={<PageLoader />}><SearchResultsPage /></Suspense>,
  },
  {
    path: '/filters',
    element: <Suspense fallback={<PageLoader />}><FiltersPage /></Suspense>,
  },
  {
    path: '/profile/:id',
    element: <Suspense fallback={<PageLoader />}><ProfileDetailPage /></Suspense>,
  },
  {
    path: '/messages',
    element: <Suspense fallback={<PageLoader />}><MessagesPage /></Suspense>,
  },
  {
    path: '/bookmarks',
    element: <Suspense fallback={<PageLoader />}><BookmarksPage /></Suspense>,
  },
  {
    path: '/timetable',
    element: <Suspense fallback={<PageLoader />}><TimetablePage /></Suspense>,
  },
  {
    path: '/profile/me',
    element: <Suspense fallback={<PageLoader />}><MyProfilePage /></Suspense>,
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
