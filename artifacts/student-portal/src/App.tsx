import { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import LoginPage from "./pages/LoginPage";
import { BG_PAGE, SLATE } from "./constants";
import { useIsMobile } from "./hooks/use-mobile";

const DashboardPage    = lazy(() => import("./pages/DashboardPage"));
const ProfilePage      = lazy(() => import("./pages/ProfilePage"));
const TimetablePage    = lazy(() => import("./pages/TimetablePage"));
const AssignmentsPage  = lazy(() => import("./pages/AssignmentsPage"));
const ResultsPage      = lazy(() => import("./pages/ResultsPage"));
const AttendancePage   = lazy(() => import("./pages/AttendancePage"));
const FeesPage         = lazy(() => import("./pages/FeesPage"));
const CalendarPage     = lazy(() => import("./pages/CalendarPage"));
const LibraryPage      = lazy(() => import("./pages/LibraryPage"));

const pageTitleMap: Record<string, string> = {
  "/dashboard":    "Dashboard — Shoolini University",
  "/profile":      "My Profile — Shoolini University",
  "/timetable":    "Timetable — Shoolini University",
  "/assignments":  "Assignments — Shoolini University",
  "/results":      "Results — Shoolini University",
  "/attendance":   "Attendance — Shoolini University",
  "/fees":         "Fees & Payments — Shoolini University",
  "/calendar":     "Calendar — Shoolini University",
  "/library":      "Library Portal — Shoolini University",
};

const pageFallback = (
  <div style={{ padding: 24, color: SLATE, fontSize: 14 }}>Loading...</div>
);

function ProtectedLayout({
  isAuth,
  onLogout,
  children,
}: {
  isAuth: boolean;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  const [location] = useLocation();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.title = pageTitleMap[location] ?? "Shoolini University Portal";
  }, [location]);

  useEffect(() => {
    if (!isMobile) setSidebarOpen(false);
  }, [isMobile]);

  if (!isAuth) return <Redirect to="/" />;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: BG_PAGE, fontFamily: "Inter, system-ui, sans-serif" }}>
      <style>{`
        @media print {
          .sidebar-container { display: none !important; }
          .header-container  { display: none !important; }
          .main-content      { margin-left: 0 !important; padding: 16px !important; }
          body { background: white; }
        }
      `}</style>

      {isMobile && sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex: 99,
          }}
        />
      )}

      <Sidebar
        onLogout={onLogout}
        isOpen={sidebarOpen}
        isMobile={isMobile}
        onClose={() => setSidebarOpen(false)}
      />

      <div
        className="main-content"
        style={{
          marginLeft: isMobile ? 0 : 240,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header
          path={location}
          isMobile={isMobile}
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
        />
        <main style={{ padding: isMobile ? 12 : 24, flex: 1 }}>
          <Suspense fallback={pageFallback}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}

function AppRouter({ isAuth, onLogin, onLogout }: { isAuth: boolean; onLogin: () => void; onLogout: () => void }) {
  return (
    <Switch>
      <Route path="/">
        {isAuth ? <Redirect to="/dashboard" /> : <LoginPage onLogin={onLogin} />}
      </Route>
      <Route path="/dashboard">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <DashboardPage />
        </ProtectedLayout>
      </Route>
      <Route path="/profile">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <ProfilePage />
        </ProtectedLayout>
      </Route>
      <Route path="/timetable">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <TimetablePage />
        </ProtectedLayout>
      </Route>
      <Route path="/assignments">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <AssignmentsPage />
        </ProtectedLayout>
      </Route>
      <Route path="/results">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <ResultsPage />
        </ProtectedLayout>
      </Route>
      <Route path="/attendance">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <AttendancePage />
        </ProtectedLayout>
      </Route>
      <Route path="/fees">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <FeesPage />
        </ProtectedLayout>
      </Route>
      <Route path="/calendar">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <CalendarPage />
        </ProtectedLayout>
      </Route>
      <Route path="/library">
        <ProtectedLayout isAuth={isAuth} onLogout={onLogout}>
          <LibraryPage />
        </ProtectedLayout>
      </Route>
      <Route>
        {isAuth ? <Redirect to="/dashboard" /> : <Redirect to="/" />}
      </Route>
    </Switch>
  );
}


/**
 * Main application component for the Shoolini Student Portal.
 * Handles authentication, routing, and mobile sidebar navigation.
 */
export default function App() {
  const [isAuth, setIsAuth] = useState(false);

  return (
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <AppRouter
        isAuth={isAuth}
        onLogin={() => setIsAuth(true)}
        onLogout={() => setIsAuth(false)}
      />
    </WouterRouter>
  );
}
