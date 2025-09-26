import { Route, Routes } from "react-router-dom";
import { Register } from "./pages/register/Register";
import { DashboardLayouts } from "./layouts/DashboardLayouts";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { Login } from "./pages/login/Login";
import { Settings } from "./pages/Dashboard/Settings";
import Onboarding from "./pages/Onboarding";

export function Router() {
  return (
    <Routes>
      {/* Rotas públicas */}
      <Route path="/" element={<Onboarding />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Rotas protegidas */}
      <Route path="/dashboard" element={<DashboardLayouts />}>
        <Route index element={<Dashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
