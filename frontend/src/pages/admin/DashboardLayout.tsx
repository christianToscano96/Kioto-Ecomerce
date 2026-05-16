import { Outlet, Navigate } from "react-router-dom";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { HeaderAdmin } from "@/components/layout/HeaderAdmin";
import { useIsAuthenticated } from "@/store/auth";

export function DashboardLayout() {
  const isAuthenticated = useIsAuthenticated();

  // In a real app, we'd also check for admin role
  // For now, just check authentication
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AdminSidebar />
      <div className="flex-1 ml-5 pt-16">
        <HeaderAdmin />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
