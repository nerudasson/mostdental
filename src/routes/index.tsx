import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from '@/components/layout';
import { AuthProvider } from '@/components/auth/auth-provider';
import { LoginPage } from '@/pages/auth/login';
import { RegisterPage } from '@/pages/auth/register';
import { useAuth } from '@/hooks/use-auth';

// Dentist Pages
import { DentistDashboard } from '@/pages/dentist/dashboard';
import { PatientsPage } from '@/pages/dentist/patients';
import { EstimatesPage } from '@/pages/dentist/estimates';
import { EstimateDetailPage } from '@/pages/dentist/estimates/[id]';
import { OrdersPage } from '@/pages/dentist/orders';
import { OrderDetailPage } from '@/pages/orders/[id]';
import { ProductSelectionPage } from '@/pages/product-selection';
import { DentistInvoicesPage } from '@/pages/dentist/invoices';

// Lab Pages
import { LabDashboard } from '@/pages/lab/dashboard';
import { LabEstimatesPage } from '@/pages/lab/estimates';
import { LabEstimateDetailPage } from '@/pages/lab/estimates/[id]';
import { LabOrdersPage } from '@/pages/lab/orders';
import { LabOrderDetailPage } from '@/pages/lab/orders/[id]';
import { LabInvoicesPage } from '@/pages/lab/invoices';
import { SecureInboxPage } from '@/pages/lab/secure-inbox';
import { ScanProcessingPage } from '@/pages/scan-processing';
import { LabPickupsPage } from '@/pages/lab/pickups';

// Shared Pages
import { ProfileSettingsPage } from '@/pages/settings/profile';
import { SettingsPage } from '@/pages/settings';
import { MessagesPage } from '@/pages/messages';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: 'dentist' | 'lab' }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'lab' ? '/lab' : '/'} replace />;
  }
  
  return <>{children}</>;
}

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to={user.role === 'lab' ? '/lab' : '/'} replace />;
  }
  
  return <>{children}</>;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute><div /></PublicRoute>}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected Routes */}
        <Route element={<Layout />}>
          {/* Dentist Routes */}
          <Route path="/" element={
            <ProtectedRoute allowedRole="dentist">
              <DentistDashboard />
            </ProtectedRoute>
          } />
          <Route path="/patients" element={
            <ProtectedRoute allowedRole="dentist">
              <PatientsPage />
            </ProtectedRoute>
          } />
          <Route path="/estimates" element={
            <ProtectedRoute allowedRole="dentist">
              <EstimatesPage />
            </ProtectedRoute>
          } />
          <Route path="/estimates/:id" element={
            <ProtectedRoute allowedRole="dentist">
              <EstimateDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/product-selection" element={
            <ProtectedRoute allowedRole="dentist">
              <ProductSelectionPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute allowedRole="dentist">
              <OrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/orders/:id" element={
            <ProtectedRoute allowedRole="dentist">
              <OrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/invoices" element={
            <ProtectedRoute allowedRole="dentist">
              <DentistInvoicesPage />
            </ProtectedRoute>
          } />

          {/* Lab Routes */}
          <Route path="/lab" element={
            <ProtectedRoute allowedRole="lab">
              <LabDashboard />
            </ProtectedRoute>
          } />
          <Route path="/lab/estimates" element={
            <ProtectedRoute allowedRole="lab">
              <LabEstimatesPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/estimates/:id" element={
            <ProtectedRoute allowedRole="lab">
              <LabEstimateDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/orders" element={
            <ProtectedRoute allowedRole="lab">
              <LabOrdersPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/orders/:id" element={
            <ProtectedRoute allowedRole="lab">
              <LabOrderDetailPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/invoices" element={
            <ProtectedRoute allowedRole="lab">
              <LabInvoicesPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/secure-inbox" element={
            <ProtectedRoute allowedRole="lab">
              <SecureInboxPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/scan-processing" element={
            <ProtectedRoute allowedRole="lab">
              <ScanProcessingPage />
            </ProtectedRoute>
          } />
          <Route path="/lab/pickups" element={
            <ProtectedRoute allowedRole="lab">
              <LabPickupsPage />
            </ProtectedRoute>
          } />

          {/* Shared Routes */}
          <Route path="/messages" element={
            <AuthenticatedRoute>
              <MessagesPage />
            </AuthenticatedRoute>
          } />
          <Route path="/profile" element={
            <AuthenticatedRoute>
              <ProfileSettingsPage />
            </AuthenticatedRoute>
          } />
          <Route path="/settings" element={
            <AuthenticatedRoute>
              <SettingsPage />
            </AuthenticatedRoute>
          } />
        </Route>

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}