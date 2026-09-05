import {
  Navigate,
  Route,
  Routes,
} from "react-router";

import { AppLayout } from "./components/layout/AppLayout";

import {
  AdminRoute,
  ProtectedRoute,
  PublicOnlyRoute,
} from "./features/auth/components/ProtectedRoute";

import { LoginPage } from "./features/auth/pages/LoginPage";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { UploadDatasetPage } from "./features/datasets/pages/UploadDatasetPage";
import { TrafficAnalysisPage } from "./features/traffic/pages/TrafficAnalysisPage";
import { SecurityAlertsPage } from "./features/alerts/pages/SecurityAlertsPage";
import { InvestigationsPage } from "./features/investigations/pages/InvestigationsPage";
import { ReportsPage } from "./features/reports/pages/ReportsPage";
import { UserManagementPage } from "./features/admin/pages/UserManagementPage";

export function AppRouter() {
  return (
    <Routes>
      {/* Routes available only when logged out */}
      <Route element={<PublicOnlyRoute />}>
        <Route
          path="/login"
          element={<LoginPage />}
        />
      </Route>

      {/* Routes available to every authenticated user */}
      <Route element={<ProtectedRoute />}>
        {/* AppLayout provides the sidebar and header */}
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="/datasets/upload"
            element={<UploadDatasetPage />}
          />

          <Route
            path="/traffic"
            element={<TrafficAnalysisPage />}
          />

          <Route
            path="/alerts"
            element={<SecurityAlertsPage />}
          />

          <Route
            path="/investigations"
            element={<InvestigationsPage />}
          />

          <Route
            path="/reports"
            element={<ReportsPage />}
          />

          {/* Routes available only to administrators */}
          <Route element={<AdminRoute />}>
            <Route
              path="/admin/users"
              element={<UserManagementPage />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />
    </Routes>
  );
}