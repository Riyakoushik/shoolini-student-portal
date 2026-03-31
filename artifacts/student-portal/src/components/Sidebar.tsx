import { useLocation, Link } from "wouter";
import shooliniLogo from "@/assets/shoolini-logo.png";
import { NAVY, GOLD, AMBER, RED, BLUE } from "../constants";
import { student } from "../data/studentData";

const navItems = [
  { icon: "🏠", label: "Dashboard",      path: "/dashboard" },
  { icon: "👤", label: "My Profile",     path: "/profile" },
  { icon: "📅", label: "Timetable",      path: "/timetable" },
  { icon: "📝", label: "Assignments",    path: "/assignments", badge: "5",  badgeColor: AMBER },
  { icon: "🏆", label: "Results",        path: "/results" },
  { icon: "📊", label: "Attendance",     path: "/attendance" },
  { icon: "📚", label: "Library",        path: "/library",    badge: "!",  badgeColor: RED },
  { icon: "💳", label: "Fees & Payments",path: "/fees",       badge: "!",  badgeColor: RED },
  { icon: "🗒️", label: "Study Planner", path: "/study-planner" },
  { icon: "🗓️", label: "Calendar",      path: "/calendar" },
];

export default function Sidebar({
  onLogout,
  isOpen,
  isMobile,
  onClose,
}: {
  onLogout: () => void;
  isOpen: boolean;
  isMobile: boolean;
  onClose: () => void;
}) {
  const [location] = useLocation();

  const sidebarStyle: React.CSSProperties = {
    width: 240,
    minWidth: 240,
    height: "100vh",
    backgroundColor: NAVY,
    position: "fixed",
    top: 0,
    left: 0,
    zIndex: 100,
    display: "flex",
    flexDirection: "column",
    transform: isMobile && !isOpen ? "translateX(-240px)" : "translateX(0)",
  };

  return (
    <div className="sidebar-container" style={sidebarStyle}>
      {/* ── TOP SECTION ────────────────────────────────────────── */}
      <div style={{ padding: "14px 16px 0 16px", flexShrink: 0 }}>
        {isMobile && (
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
            <button
              onClick={onClose}
              style={{
                background: "none", border: "none", cursor: "pointer",
                color: "rgba(255,255,255,0.7)", fontSize: 18, padding: "2px 4px",
              }}
              aria-label="Close navigation"
            >
              ✕
            </button>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <img
            src={shooliniLogo}
            alt="Shoolini University"
            style={{ width: 148, height: "auto", display: "block", filter: "brightness(0) invert(1)" }}
          />
        </div>
        <div style={{ fontSize: 10, color: GOLD, textAlign: "center", letterSpacing: "0.05em", marginBottom: 10 }}>
          Office of Academic Affairs
        </div>
        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 8 }} />
      </div>

      {/* ── MIDDLE SECTION (scrollable nav) ───────────────────── */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.2) transparent",
        } as React.CSSProperties}
      >
        <style>{`
          .sidebar-container::-webkit-scrollbar { width: 4px; }
          .sidebar-container::-webkit-scrollbar-track { background: transparent; }
          .sidebar-container::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 4px; }
          .sidebar-container::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.35); }
        `}</style>

        <div style={{
          padding: "8px 16px 6px",
          fontSize: 10, fontWeight: 600,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          Main Menu
        </div>

        {navItems.map((item) => {
          const isActive = location === item.path || location.startsWith(item.path + "/");
          return (
            <Link key={item.path} href={item.path} onClick={isMobile ? onClose : undefined}>
              <div
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  height: 42, padding: "0 16px", cursor: "pointer",
                  backgroundColor: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                  borderLeft: isActive ? `3px solid ${GOLD}` : "3px solid transparent",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
                }}
              >
                <span style={{ fontSize: 16, color: isActive ? "white" : "rgba(255,255,255,0.7)", width: 20, textAlign: "center", flexShrink: 0 }}>
                  {item.icon}
                </span>
                <span style={{ fontSize: 13, color: isActive ? "white" : "rgba(255,255,255,0.85)", flex: 1 }}>
                  {item.label}
                </span>
                {item.badge && (
                  <span style={{
                    backgroundColor: item.badgeColor, color: "white",
                    fontSize: 10, fontWeight: 700,
                    padding: "1px 6px", borderRadius: 10, lineHeight: 1.6, flexShrink: 0,
                  }}>
                    {item.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── BOTTOM SECTION ────────────────────────────────────── */}
      <div style={{ flexShrink: 0, padding: "12px 16px" }}>
        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)", marginBottom: 12 }} />

        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, backgroundColor: "rgba(255,255,255,0.1)" }}>
            <img src="/koushik-photo.png" alt="KT" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "white", fontSize: 12, fontWeight: 600, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {student.name}
            </div>
            <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 10, lineHeight: 1.3 }}>
              Roll: {student.rollNo}
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 8 }}>
          <span style={{
            display: "inline-block", backgroundColor: BLUE, color: "white",
            fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4,
          }}>
            Sem 2 — Active
          </span>
        </div>

        <button
          onClick={onLogout}
          style={{
            width: "100%", padding: "7px 12px",
            backgroundColor: "rgba(220,38,38,0.15)",
            border: "1px solid rgba(220,38,38,0.3)",
            borderRadius: 4, color: "rgba(255,255,255,0.8)",
            fontSize: 13, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(220,38,38,0.25)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(220,38,38,0.15)"; }}
        >
          <span>→</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
