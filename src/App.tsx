import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import { StagingBanner } from './components/StagingBanner';
import { LoadingScreen } from './components/LoadingScreen';
import { AppLayout } from './components/AppLayout';
import Landing from './pages/Landing';
import Invite from './pages/Invite';
import PaymentResult from './pages/PaymentResult';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import NotFound from './pages/NotFound';
import AppHome from './pages/app/AppHome';
import Overview from './pages/app/academy/Overview';
import Revenue from './pages/app/academy/Revenue';
import Sessions from './pages/app/academy/Sessions';
import Settings from './pages/app/academy/Settings';
import Team from './pages/app/academy/Team';
import Payouts from './pages/app/academy/Payouts';

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) return <Navigate to="/app" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StagingBanner />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/invite/:code" element={<Invite />} />
          <Route path="/payment-result" element={<PaymentResult />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          {/* Password-reset emails link here (PASSWORD_RESET_URL_BASE) */}
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/login"
            element={
              <RedirectIfAuthenticated>
                <Login />
              </RedirectIfAuthenticated>
            }
          />

          {/* Post-login resolver — no shell, may redirect or render its own layout */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppHome />
              </RequireAuth>
            }
          />

          {/* Owner dashboard — wrapped in AppLayout with sidebar + switcher */}
          <Route
            path="/app/a/:academyId/*"
            element={
              <RequireAuth>
                <AppLayout>
                  <Routes>
                    <Route index element={<Navigate to="overview" replace />} />
                    <Route path="overview" element={<Overview />} />
                    <Route path="revenue" element={<Revenue />} />
                    <Route path="sessions" element={<Sessions />} />
                    <Route path="settings" element={<Settings />} />
                    <Route path="settings/team" element={<Team />} />
                    <Route path="settings/payouts" element={<Payouts />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </AppLayout>
              </RequireAuth>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
