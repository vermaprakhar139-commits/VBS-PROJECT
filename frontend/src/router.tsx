import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load all pages for code splitting
const HomePage = lazy(() => import("./pages/HomePage"));
const SearchResultsPage = lazy(() => import("./pages/SearchResultsPage"));
const SeatSelectionPage = lazy(() => import("./pages/SeatSelectionPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const BookingSuccessPage = lazy(() => import("./pages/BookingSuccessPage"));
const BookingFailurePage = lazy(() => import("./pages/BookingFailurePage"));
const MyBookingsPage = lazy(() => import("./pages/MyBookingsPage"));
const LoginPage = lazy(() => import("./pages/Auth/LoginPage"));
const RegisterPage = lazy(() => import("./pages/Auth/RegisterPage"));
const ForgotPasswordPage = lazy(() => import("./pages/Auth/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/Auth/ResetPasswordPage"));
const VerifyEmailPage = lazy(() => import("./pages/Auth/VerifyEmailPage"));
const AdminDashboardPage = lazy(() => import("./pages/Admin/AdminDashboardPage"));
const AdminBusesPage = lazy(() => import("./pages/Admin/AdminBusesPage"));
const AdminSchedulesPage = lazy(() => import("./pages/Admin/AdminSchedulesPage"));
const AdminBookingsPage = lazy(() => import("./pages/Admin/AdminBookingsPage"));
const AdminPromosPage = lazy(() => import("./pages/Admin/AdminPromosPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/Admin/AdminAnalyticsPage"));

// Professional loading component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-accent-50 dark:from-gray-900 dark:to-gray-800">
    <div className="text-center">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-primary-200 dark:border-primary-800 border-t-primary-600 rounded-full animate-spin mx-auto"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl">🚌</span>
        </div>
      </div>
      <p className="mt-4 text-gray-600 dark:text-gray-400 font-medium">Loading...</p>
    </div>
  </div>
);

// Wrap all routes with Suspense
const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <Suspense fallback={<PageLoader />}>
        <HomePage />
      </Suspense>
    ),
  },
  {
    path: "/search",
    element: (
      <Suspense fallback={<PageLoader />}>
        <SearchResultsPage />
      </Suspense>
    ),
  },
  {
    path: "/seat-selection/:scheduleId",
    element: (
      <Suspense fallback={<PageLoader />}>
        <SeatSelectionPage />
      </Suspense>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Suspense fallback={<PageLoader />}>
        <CheckoutPage />
      </Suspense>
    ),
  },
  {
    path: "/checkout/success",
    element: (
      <Suspense fallback={<PageLoader />}>
        <BookingSuccessPage />
      </Suspense>
    ),
  },
  {
    path: "/checkout/failure",
    element: (
      <Suspense fallback={<PageLoader />}>
        <BookingFailurePage />
      </Suspense>
    ),
  },
  {
    path: "/my-bookings",
    element: (
      <Suspense fallback={<PageLoader />}>
        <MyBookingsPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <Suspense fallback={<PageLoader />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/forgot-password",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ForgotPasswordPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/reset-password/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: "/auth/verify-email/:token",
    element: (
      <Suspense fallback={<PageLoader />}>
        <VerifyEmailPage />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminDashboardPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/buses",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminBusesPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/schedules",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminSchedulesPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/bookings",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminBookingsPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/promos",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminPromosPage />
      </Suspense>
    ),
  },
  {
    path: "/admin/analytics",
    element: (
      <Suspense fallback={<PageLoader />}>
        <AdminAnalyticsPage />
      </Suspense>
    ),
  },
];

export default routes;