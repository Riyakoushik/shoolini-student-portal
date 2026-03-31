import { useState, useEffect, useRef } from "react";
import StatusBadge from "./StatusBadge";
import { NAVY, GOLD, AMBER, SLATE, WHITE, BORDER, TEXT_DARK, BG_TABLE, NAVY_LIGHT, WARN_BG } from "../constants";

const pageTitles: Record<string, string> = {
  "/dashboard":    "Dashboard",
  "/profile":      "My Profile",
  "/timetable":    "Timetable",
  "/assignments":  "Assignments",
  "/results":      "Results",
  "/attendance":   "Attendance",
  "/library":      "Library Portal",
  "/fees":         "Fees & Payments",
  "/study-planner":"Study Planner",
  "/calendar":     "Calendar",
};

export default function Header({
  path,
  isMobile,
  onToggleSidebar,
}: {
  path: string;
  isMobile: boolean;
  onToggleSidebar: () => void;
}) {
  const title   = pageTitles[path] ?? "Dashboard";
  const dateStr = "Wednesday, 26 March 2026";
  const isDashboard = path === "/dashboard";

  const [showNotification, setShowNotification] = useState(false);
  const hasDismissed = useRef(false);
  const hasShown = useRef(false);

  useEffect(() => {
    if (!isDashboard) {
      setShowNotification(false);
      return;
    }
    if (hasShown.current || hasDismissed.current) return;
    const timer = setTimeout(() => {
      if (!hasDismissed.current) {
        hasShown.current = true;
        setShowNotification(true);
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [isDashboard]);

  function dismiss() {
    hasDismissed.current = true;
    setShowNotification(false);
  }

  return (
    <div
      className="header-container"
      style={{
        height: 56,
        backgroundColor: WHITE,
        borderBottom: `1px solid ${BORDER}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        position: "sticky",
        top: 0,
        zIndex: 98,
        gap: 10,
      }}
    >
      {/* Left — hamburger (mobile) + breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {isMobile && (
          <button
            onClick={onToggleSidebar}
            aria-label="Toggle navigation"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "4px 6px",
              fontSize: 20,
              lineHeight: 1,
              color: TEXT_DARK,
              flexShrink: 0,
            }}
          >
            ☰
          </button>
        )}
        <div style={{ fontSize: 13, color: SLATE }}>
          <span style={{ color: TEXT_DARK, fontWeight: 500 }}>Home</span>
          <span style={{ margin: "0 6px" }}>/</span>
          <span>{title}</span>
        </div>
      </div>

      {/* Center — institutional trust badges (hidden on mobile) */}
      {!isMobile && (
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            border: `1px solid ${GOLD}`, borderRadius: 4,
            color: GOLD, letterSpacing: "0.04em", backgroundColor: WARN_BG,
          }}>
            NAAC B+
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: "3px 8px",
            border: `1px solid ${NAVY}`, borderRadius: 4,
            color: NAVY, letterSpacing: "0.04em", backgroundColor: NAVY_LIGHT,
          }}>
            UGC Certified
          </span>
        </div>
      )}

      {/* Right — date, semester, bell, avatar */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, position: "relative" }}>
        {!isMobile && (
          <>
            <span style={{ fontSize: 12, color: SLATE }}>{dateStr}</span>
            <StatusBadge status="Active" />
            <span style={{ fontSize: 11, color: SLATE }}>Semester 2</span>
          </>
        )}

        {/* Notification bell + one-shot popup */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              width: 32, height: 32, borderRadius: "50%",
              backgroundColor: showNotification ? WARN_BG : BG_TABLE,
              border: showNotification ? `1px solid ${AMBER}` : `1px solid ${BORDER}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 15, flexShrink: 0,
            }}
          >
            🔔
          </div>

          {showNotification && (
            <div
              onClick={dismiss}
              style={{
                position: "absolute",
                top: 38,
                right: 0,
                width: 280,
                backgroundColor: WHITE,
                border: `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "12px 14px",
                zIndex: 200,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                cursor: "pointer",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 12, color: TEXT_DARK, lineHeight: 1.5 }}>
                  Reminder: You have pending assignments due soon.
                </div>
                <span style={{ fontSize: 16, color: SLATE, lineHeight: 1, flexShrink: 0 }}>×</span>
              </div>
            </div>
          )}
        </div>

        {/* Profile avatar */}
        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, backgroundColor: NAVY }}>
          <img src="/koushik-photo.png" alt="KT" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
        </div>
      </div>
    </div>
  );
}
