import { Route, Routes } from "react-router-dom";
import AppLayout from "./components/layout/AppLayout.jsx";
import AdminRoute from "./components/routes/AdminRoute.jsx";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import NoteDetailsPage from "./pages/NoteDetailsPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import UploadNotePage from "./pages/UploadNotePage.jsx";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage.jsx";
import AdminLoginPage from "./pages/admin/AdminLoginPage.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<LandingPage />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="admin/login" element={<AdminLoginPage />} />
      <Route path="register" element={<RegisterPage />} />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="notes/upload"
        element={
          <ProtectedRoute>
            <UploadNotePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="notes/:id"
        element={
          <ProtectedRoute>
            <NoteDetailsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="admin"
        element={
          <AdminRoute>
            <AdminDashboardPage />
          </AdminRoute>
        }
      />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
);

export default App;
