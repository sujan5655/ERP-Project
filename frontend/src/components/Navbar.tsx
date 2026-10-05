import { Link, Outlet } from "react-router-dom";

import LogoutButton from "../features/auth/LogoutButton";
import NotificationBell from "../routes/NotificationBell";

export default function Navbar() {
  return (
    <>
      <nav className="flex items-center justify-between border-b bg-white px-6 py-3 shadow-sm">
        <div className="flex items-center gap-6">
          <Link to="/dashboard" className="font-bold text-gray-900">
            Retail ERP
          </Link>

          <Link
            to="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>

          <Link
            to="/notifications"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Notifications
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <NotificationBell />

          <LogoutButton />
        </div>
      </nav>

      <main>
        <Outlet />
      </main>
    </>
  );
}
