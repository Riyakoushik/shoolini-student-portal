import { useState, useEffect, useRef } from "react";
import {
  sem1Attendance, sem2Attendance, sem3Attendance, sem1DailyLog, sem2DailyLog, sem3DailyLog,
  sem3Subjects, sem4Subjects, semesterTimeline,
  sem1TimetableDaily, sem2TimetableDaily, sem3TimetableDaily,
  type DailyAttendanceRecord,
} from "../data/studentData";
import { NAVY, GREEN, RED, AMBER, SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE, ERROR_BG, ERROR_LIGHT, ERROR_BORDER, WARN_BG, WARN_TEXT, WARN_TEXT2, WARN_BORDER, ERROR_LIGHT2 } from "../constants";
import { generateAttendancePDF } from "../utils/generateAttendancePDF";

function pct(p: number, t: number) {
  return t === 0 ? 0 : Math.round((p / t) * 10000) / 100;
}

function AnimatedBar({ value, color }: { value: number; color: string }) {
  const [width, setWidth] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const duration = 800;
    const raf = (now: number) => {
      const elapsed = Math.min(now - start, duration);
      const progress = elapsed / duration;
      const ease = 1 - Math.pow(1 - progress, 3);
      setWidth(value * ease);
      if (elapsed < duration) requestAnimationFrame(raf);
      else setWidth(value);
    };
    requestAnimationFrame(raf);
  }, [value]);

  return (
    <div style={{ width: "100%", height: 6, backgroundColor: "#e2e8f0", borderRadius: 3, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${width}%`, backgroundColor: color, borderRadius: 3 }} />
    </div>
  );
}

// Month helpers
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function getMonthsInRange(log: DailyAttendanceRecord[]): { year: number; month: number; label: string }[] {
  const set = new Set<string>();
  const result: { year: number; month: number; label: string }[] = [];
  log.forEach((r) => {
    const [y, m] = r.date.split("-").map(Number);
    const key = `${y}-${m}`;
    if (!set.has(key)) {
      set.add(key);
      result.push({ year: y, month: m - 1, label: `${MONTH_SHORT[m - 1]} ${y}` });
    }
  });
  return result;
}

function CalendarGrid({ log, selectedMonth }: { log: DailyAttendanceRecord[]; selectedMonth: { year: number; month: number } }) {
  const { year, month } = selectedMonth;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const filtered = log.filter((r) => {
    const [y, m] = r.date.split("-").map(Number);
    return y === year && m - 1 === month;
  });
  const dateMap: Record<number, DailyAttendanceRecord> = {};
  filtered.forEach((r) => {
    const day = parseInt(r.date.split("-")[2], 10);
    dateMap[day] = r;
  });

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  // Stats
  let present = 0, absent = 0, holidays = 0, working = 0;
  filtered.forEach((r) => {
    if (r.status === "Present") { present++; working++; }
    else if (r.status === "Absent") { absent++; working++; }
    else if (r.status === "Holiday") { holidays++; }
  });
  const monthPct = working > 0 ? Math.round((present / working) * 10000) / 100 : 0;
  const pctColor = monthPct >= 85 ? GREEN : monthPct >= 75 ? AMBER : RED;

  const statusColor: Record<string, string> = {
    Present: GREEN,
    Absent: RED,
    Holiday: AMBER,
    Sunday: "#cbd5e1",
  };

  return (
    <div>
      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 10, fontWeight: 600, color: SLATE, textTransform: "uppercase", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>
      {/* Calendar cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={idx} style={{ minHeight: 38, backgroundColor: BG_LIGHT, borderRadius: 3 }} />;
          }
          const rec = dateMap[day];
          const bg = rec ? statusColor[rec.status] || "#e2e8f0" : "#f1f5f9";
          const isActive = rec && (rec.status === "Present" || rec.status === "Absent" || rec.status === "Holiday");
          return (
            <div
              key={idx}
              title={rec?.holidayName || rec?.status || ""}
              style={{
                minHeight: 38,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 3,
                position: "relative",
                cursor: rec?.holidayName ? "help" : "default",
              }}
            >
              {isActive ? (
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  backgroundColor: bg,
                  color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 700,
                  position: "relative",
                  boxShadow: rec?.status === "Holiday" ? "0 0 0 2px #fde68a" : "none",
                }}>
                  {day}
                  {rec?.status === "Holiday" && (
                    <span style={{ position: "absolute", top: -5, right: -5, fontSize: 9 }}>🪔</span>
                  )}
                </div>
              ) : (
                <span style={{ fontSize: 11, color: "#94a3b8" }}>{day}</span>
              )}
            </div>
          );
        })}
      </div>
      {/* Monthly summary */}
      <div style={{
        marginTop: 10, padding: "8px 12px", borderRadius: 4,
        backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`,
        fontSize: 12, color: TEXT_DARK, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
        <span>Present: <strong style={{ color: GREEN }}>{present}</strong></span>
        <span>Absent: <strong style={{ color: RED }}>{absent}</strong></span>
        <span>Holidays: <strong style={{ color: AMBER }}>{holidays}</strong></span>
        <span>Working Days: <strong>{working}</strong></span>
        <span>Monthly %: <strong style={{ color: pctColor }}>{monthPct.toFixed(1)}%</strong></span>
      </div>
    </div>
  );
}

const semesterHolidays: Record<number, { date: string; name: string; icon: string; day: string }[]> = {
  1: [
    { date: "2025-08-15", day: "Friday", name: "Independence Day", icon: "🇮🇳" },
    { date: "2025-10-02", day: "Thursday", name: "Mahatma Gandhi Jayanti", icon: "🕊️" },
    { date: "2025-10-20", day: "Monday", name: "Dussehra", icon: "🏹" },
    { date: "2025-11-01", day: "Saturday", name: "Diwali (Deepavali)", icon: "🪔" },
    { date: "2025-11-02", day: "Sunday", name: "Govardhan Puja", icon: "🪔" },
    { date: "2025-12-25", day: "Thursday", name: "Christmas Day", icon: "🎄" },
    { date: "2026-01-26", day: "Monday", name: "Republic Day", icon: "🇮🇳" },
  ],
  2: [
    { date: "2026-03-10", day: "Tuesday", name: "Holi", icon: "🎨" },
    { date: "2026-03-25", day: "Wednesday", name: "Holi 2nd Day (HP)", icon: "🎨" },
    { date: "2026-04-14", day: "Tuesday", name: "Dr. Ambedkar Jayanti", icon: "📚" },
    { date: "2026-04-18", day: "Saturday", name: "Good Friday", icon: "✝️" },
    { date: "2026-05-01", day: "Friday", name: "Labour Day", icon: "🛠️" },
    { date: "2026-05-12", day: "Tuesday", name: "Buddha Purnima", icon: "☸️" },
    { date: "2026-06-05", day: "Friday", name: "Bakrid (Eid-al-Adha)", icon: "🌙" },
  ],
  3: [
    { date: "2026-08-15", day: "Saturday", name: "Independence Day", icon: "🇮🇳" },
    { date: "2026-08-27", day: "Thursday", name: "Janmashtami", icon: "🪔" },
    { date: "2026-09-04", day: "Friday", name: "Milad-un-Nabi (Id-e-Milad)", icon: "🌙" },
    { date: "2026-10-02", day: "Friday", name: "Mahatma Gandhi Jayanti", icon: "🕊️" },
    { date: "2026-10-11", day: "Sunday", name: "Loknayak Jayaprakash Narayan Jayanti", icon: "🇮🇳" },
    { date: "2026-10-17", day: "Saturday", name: "Maha Saptami / Durga Puja Festival", icon: "🪔" },
    { date: "2026-10-18", day: "Sunday", name: "Maha Ashtami / Durga Ashtami Festival", icon: "🌺" },
    { date: "2026-10-19", day: "Monday", name: "Maha Navami / Ayudha Puja Festival", icon: "🔱" },
    { date: "2026-10-20", day: "Tuesday", name: "Dussehra (Vijayadashami Festival)", icon: "🏹" },
    { date: "2026-10-26", day: "Monday", name: "Maharishi Valmiki Jayanti & Cycle Freeze", icon: "📜" },
    { date: "2026-10-29", day: "Thursday", name: "Karwa Chauth Festival (HP State Gazetted)", icon: "🌕" },
    { date: "2026-10-31", day: "Saturday", name: "Naraka Chaturdashi (Choti Diwali)", icon: "🪔" },
    { date: "2026-11-01", day: "Sunday", name: "Diwali (Deepavali)", icon: "✨" },
    { date: "2026-11-02", day: "Monday", name: "Govardhan Puja", icon: "🪔" },
    { date: "2026-11-03", day: "Tuesday", name: "Bhai Dooj", icon: "🎁" },
    { date: "2026-11-24", day: "Tuesday", name: "Guru Nanak Jayanti", icon: "ੴ" },
    { date: "2026-12-25", day: "Friday", name: "Christmas Day", icon: "🎄" },
  ],
};

function DailyListView({
  log,
  selectedMonth,
  sem,
}: {
  log: DailyAttendanceRecord[];
  selectedMonth: { year: number; month: number };
  sem: number;
}) {
  const [filter, setFilter] = useState<"All" | "Present" | "Absent" | "Holiday">("All");
  const { year, month } = selectedMonth;
  const filtered = log.filter((r) => {
    const [y, m] = r.date.split("-").map(Number);
    return y === year && m - 1 === month;
  });

  const timetable = sem === 1 ? sem1TimetableDaily : sem === 2 ? sem2TimetableDaily : sem3TimetableDaily;

  let present = 0, absent = 0, holidays = 0, working = 0;
  filtered.forEach((r) => {
    if (r.status === "Present") { present++; working++; }
    else if (r.status === "Absent") { absent++; working++; }
    else if (r.status === "Holiday") { holidays++; }
  });
  const monthPct = working > 0 ? Math.round((present / working) * 10000) / 100 : 0;
  const pctColor = monthPct >= 85 ? GREEN : monthPct >= 75 ? AMBER : RED;

  const records = filtered.filter((r) => {
    if (filter === "All") return true;
    if (filter === "Present") return r.status === "Present";
    if (filter === "Absent") return r.status === "Absent";
    if (filter === "Holiday") return r.status === "Holiday";
    return true;
  });

  return (
    <div>
      {/* Quick filter badges & counts */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ display: "flex", gap: 6, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: SLATE }}>Filter:</span>
          {(["All", "Present", "Absent", "Holiday"] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              style={{
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                borderRadius: 4,
                border: `1px solid ${filter === st ? NAVY : BORDER}`,
                backgroundColor: filter === st ? NAVY : WHITE,
                color: filter === st ? "white" : TEXT_DARK,
                cursor: "pointer",
              }}
            >
              {st === "Holiday" ? "Holidays & Festivals" : st}
            </button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: SLATE }}>
          Showing <strong>{records.length}</strong> of {filtered.length} days
        </div>
      </div>

      <div style={{ overflowX: "auto", border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 640, fontSize: 13 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Date", "Day", "Subject / Activity", "Schedule / Faculty", "Status"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "9px 12px",
                    fontSize: 11,
                    fontWeight: 600,
                    color: SLATE,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    border: `1px solid ${BORDER}`,
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((r, i) => {
              const dayClasses = timetable.filter((c) => c.day === r.dayName);
              const subjectText = r.holidayName
                ? `🎉 ${r.holidayName}`
                : r.status === "Sunday"
                ? "Sunday — Weekend"
                : dayClasses.map((c) => c.subject).join(" + ") || "Self Study / Project Work";

              const facultyText = r.holidayName
                ? "Gazetted Festival Holiday"
                : r.status === "Sunday"
                ? "University Closed"
                : dayClasses.map((c) => (c.faculty ? `${c.faculty} (${c.room})` : c.room)).join("; ") || "Department Lab";

              return (
                <tr key={r.date} style={{ backgroundColor: r.status === "Absent" ? ERROR_LIGHT : r.status === "Holiday" ? "#fefce8" : i % 2 === 0 ? WHITE : BG_LIGHT }}>
                  <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, fontWeight: 600, color: TEXT_DARK, whiteSpace: "nowrap" }}>
                    {r.displayDate}
                  </td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, color: SLATE, whiteSpace: "nowrap" }}>
                    {r.dayName}
                  </td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, fontWeight: r.status === "Holiday" ? 700 : 500, color: r.status === "Holiday" ? AMBER : TEXT_DARK }}>
                    {subjectText}
                  </td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, fontSize: 12, color: SLATE }}>
                    {facultyText}
                  </td>
                  <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>
                    {r.status === "Present" && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#dcfce7", color: GREEN }}>
                        ✓ Present
                      </span>
                    )}
                    {r.status === "Absent" && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: ERROR_BORDER, color: RED }}>
                        ✗ Absent
                      </span>
                    )}
                    {r.status === "Holiday" && (
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4, backgroundColor: "#fef3c7", color: "#b45309" }}>
                        🪔 Holiday
                      </span>
                    )}
                    {r.status === "Sunday" && (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 4, backgroundColor: BG_TABLE, color: SLATE }}>
                        Sunday
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Monthly summary */}
      <div style={{
        marginTop: 10, padding: "8px 12px", borderRadius: 4,
        backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`,
        fontSize: 12, color: TEXT_DARK, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center",
      }}>
        <span>Present: <strong style={{ color: GREEN }}>{present}</strong></span>
        <span>Absent: <strong style={{ color: RED }}>{absent}</strong></span>
        <span>Holidays: <strong style={{ color: AMBER }}>{holidays}</strong></span>
        <span>Working Days: <strong>{working}</strong></span>
        <span>Monthly %: <strong style={{ color: pctColor }}>{monthPct.toFixed(1)}%</strong></span>
      </div>
    </div>
  );
}

function HolidaysAndFestivalsCard({ sem }: { sem: number }) {
  const holidays = semesterHolidays[sem] || [];
  const today = new Date().toISOString().split("T")[0];

  if (holidays.length === 0) return null;

  return (
    <div style={{
      marginTop: 20,
      backgroundColor: WHITE,
      border: `1px solid ${BORDER}`,
      borderRadius: 4,
      padding: 16,
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: NAVY, display: "flex", alignItems: "center", gap: 6 }}>
          <span>🎉</span> Public Holidays & Festivals (Semester {sem})
        </div>
        <span style={{ fontSize: 11, color: SLATE }}>{holidays.length} Gazetted Holidays</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 10 }}>
        {holidays.map((h) => {
          const isPast = h.date <= today;
          return (
            <div
              key={h.date}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "9px 12px",
                borderRadius: 4,
                border: `1px solid ${isPast ? BORDER : "#fde68a"}`,
                backgroundColor: isPast ? BG_LIGHT : "#fffbeb",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 18 }}>{h.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{h.name}</div>
                  <div style={{ fontSize: 11, color: SLATE }}>{h.date} · {h.day}</div>
                </div>
              </div>
              <span style={{
                fontSize: 10,
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: 3,
                backgroundColor: isPast ? BG_TABLE : "#fef3c7",
                color: isPast ? SLATE : "#b45309",
              }}>
                {isPast ? "COMPLETED" : "UPCOMING"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function AttendancePage() {
  const [sem, setSem] = useState(3);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  const data = sem === 1 ? sem1Attendance : sem === 3 ? sem3Attendance : sem === 2 ? sem2Attendance : sem2Attendance;
  const dailyLog = sem === 1 ? sem1DailyLog : sem === 3 ? sem3DailyLog : sem2DailyLog;

  const months = getMonthsInRange(dailyLog);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(months.length - 1);
  const selectedMonth = months[selectedMonthIdx] ?? months[0];

  useEffect(() => {
    const m = getMonthsInRange(sem === 1 ? sem1DailyLog : sem === 3 ? sem3DailyLog : sem2DailyLog);
    setSelectedMonthIdx(m.length - 1);
  }, [sem]);

  const lowAttendance = (sem <= 3) ? data.subjects.filter((s) => pct(s.present, s.total) < 75) : [];

  async function handleDownloadReport() {
    setPdfLoading(true);
    try { await generateAttendancePDF(data, sem); }
    finally { setPdfLoading(false); }
  }

  const semTabs = [
    { val: 1, label: "Semester 1 — 99.07%", tag: "Completed" },
    { val: 2, label: "Semester 2 — 86%",    tag: "Completed" },
    { val: 3, label: "Semester 3 — 86.67%", tag: "Active" },
    { val: 4, label: "Semester 4",          tag: "Upcoming" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>Attendance Record</h1>
        {sem <= 3 && (
          <button
            onClick={handleDownloadReport}
            disabled={pdfLoading}
            style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "7px 16px", backgroundColor: pdfLoading ? BG_TABLE : NAVY,
              color: pdfLoading ? SLATE : "white", border: "none", borderRadius: 4,
              fontSize: 12, fontWeight: 600, cursor: pdfLoading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {pdfLoading ? "Generating…" : "↓ Download Attendance Report"}
          </button>
        )}
      </div>

      {/* Auto-sync notice */}
      <div style={{
        backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0",
        borderRadius: 4, padding: "8px 14px", marginBottom: 12,
        fontSize: 12, color: "#166534",
      }}>
        ✅ Attendance is automatically recorded for each working day. Last updated: <strong>October 24, 2026</strong>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
        {semTabs.map((t) => (
          <button
            key={t.val}
            onClick={() => setSem(t.val)}
            style={{
              padding: "8px 16px",
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              borderBottom: sem === t.val ? `2px solid ${NAVY}` : "2px solid transparent",
              backgroundColor: sem === t.val ? BG_TABLE : "transparent",
              color: sem === t.val ? NAVY : SLATE,
              cursor: "pointer",
              borderRadius: "4px 4px 0 0",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {t.label}
            {t.tag === "Upcoming" && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, backgroundColor: AMBER, color: "white" }}>
                UPCOMING
              </span>
            )}
            {t.tag === "Active" && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, backgroundColor: "#16a34a", color: "white" }}>
                ACTIVE
              </span>
            )}
            {t.tag === "Completed" && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, backgroundColor: NAVY, color: "white" }}>
                DONE
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Upcoming semester 4 notice */}
      {sem === 4 && (
        <div style={{
          backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
          padding: 32, textAlign: "center", marginBottom: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>
            Semester 4 begins January 5, 2027
          </div>
          <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>
            Attendance tracking will begin automatically from January 5, 2027
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>≥ 85%</div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>TARGET ATTENDANCE</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>{sem4Subjects.length}</div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>SUBJECTS ENROLLED</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>
                {semesterTimeline.find(s => s.sem === 4)?.credits ?? 26}
              </div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>TOTAL CREDITS</div>
            </div>
          </div>
        </div>
      )}

      {/* Active semester content — Sem 1, 2, 3 */}
      {sem <= 3 && (
        <>
          {/* Warning banner for subjects below 75% */}
          {lowAttendance.length > 0 && (
            <div
              style={{
                backgroundColor: ERROR_BG,
                border: `1px solid ${ERROR_LIGHT2}`,
                borderLeft: `3px solid ${RED}`,
                borderRadius: 4,
                padding: "12px 16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 700, color: RED, marginBottom: 4 }}>
                ⚠ Attendance Below Required 75% Threshold
              </div>
              <div style={{ fontSize: 13, color: RED }}>
                {lowAttendance.map((s) => s.name).join(", ")} — attendance is critically low. You may be barred from examinations if attendance falls below 75%.
              </div>
            </div>
          )}

          {/* KPI Strip */}
          <div style={{ display: "grid", gridTemplateColumns: sem === 3 ? "repeat(4, 1fr)" : "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            {(sem === 3 ? [
              { label: "Classes Present (This Month)", value: "26", border: GREEN },
              { label: "Classes Absent (This Month)", value: "4", border: RED },
              { label: "Total Classes (This Month)", value: "30", border: NAVY },
              { label: "This Month Attendance %", value: "86.67%", border: GREEN },
            ] : [
              { label: "Classes Present", value: String(data.present), border: GREEN },
              { label: "Classes Absent", value: String(data.absent), border: RED },
              { label: "Attendance %", value: `${data.percentage}%`, border: AMBER },
            ]).map((k) => (
              <div
                key={k.label}
                style={{
                  backgroundColor: WHITE,
                  border: `1px solid ${BORDER}`,
                  borderLeft: `3px solid ${k.border}`,
                  borderRadius: 4,
                  padding: 16,
                  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: TEXT_DARK }}>{k.value}</div>
                <div style={{ fontSize: 11, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Notice */}
          {sem === 2 && (
            <div
              style={{
                backgroundColor: "#f0fdf4",
                border: `1px solid #bbf7d0`,
                borderLeft: `3px solid ${GREEN}`,
                borderRadius: 4,
                padding: "12px 16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: "#166534", marginBottom: 2 }}>
                Semester 2 Completed. Results Awaited.
              </div>
              <div style={{ fontSize: 13, color: "#14532d" }}>
                Practical exams concluded July 7, 2026. Final attendance: 86%. Results expected Feb 2027.
              </div>
            </div>
          )}

          {sem === 3 && (
            <div style={{ marginBottom: 16 }}>
              <div
                style={{
                  backgroundColor: "#eff6ff",
                  border: `1px solid #bfdbfe`,
                  borderLeft: `3px solid #2563eb`,
                  borderRadius: 4,
                  padding: "12px 16px",
                  marginBottom: 12,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e40af" }}>
                      Semester 3 Active • Regular Classes Scheduled Till November 12, 2026
                    </div>
                    <div style={{ fontSize: 12, color: "#1e3a8a", marginTop: 2 }}>
                      This month (October 2026): <strong>26 Classes Present</strong>, <strong>4 Days Absent</strong> (30 Total Classes = <strong>86.67%</strong>, satisfying university requirement ≥ 85%). Pre-final exams commence November 16, 2026.
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: "#dcfce7", color: GREEN, padding: "3px 8px", borderRadius: 4, border: "1px solid #bbf7d0" }}>
                    ✓ 86.67% (Eligible ≥ 85%)
                  </span>
                </div>
              </div>

              {/* Monthly Cycle Cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                {[
                  { cycle: "July Cycle", period: "Jul 21 – Jul 26", working: 5, present: 5, absent: 0, pct: "100.0%", status: "Concluded Jul 26" },
                  { cycle: "August Cycle", period: "Jul 27 – Aug 26", working: 26, present: 25, absent: 1, pct: "96.15%", status: "Concluded Aug 26" },
                  { cycle: "September Cycle", period: "Aug 27 – Sep 26", working: 25, present: 24, absent: 1, pct: "96.00%", status: "Concluded Sep 26" },
                  { cycle: "October (This Month)", period: "Oct 1 – Oct 31", working: 30, present: 26, absent: 4, pct: "86.67%", status: "Active (Cutoff Oct 26)" },
                ].map((c) => (
                  <div key={c.cycle} style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderTop: `3px solid ${NAVY}`, borderRadius: 4, padding: "10px 14px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: TEXT_DARK }}>{c.cycle}</span>
                      <span style={{ fontSize: 10, fontWeight: 600, color: SLATE, backgroundColor: BG_LIGHT, padding: "1px 5px", borderRadius: 3 }}>{c.status}</span>
                    </div>
                    <div style={{ fontSize: 11, color: SLATE, marginBottom: 6 }}>{c.period}</div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: GREEN }}>{c.pct}</span>
                      <span style={{ fontSize: 11, color: SLATE }}>{c.present}/{c.working} present • <strong style={{ color: c.absent > 0 ? RED : GREEN }}>{c.absent} abs</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Per-subject table */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Subject", "Present", "Absent", "Total", "Percentage", "Progress"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.subjects.map((s, i) => {
                  const p = pct(s.present, s.total);
                  const isLow = p < 75;
                  const isAbsent = s.total - s.present > 0;
                  return (
                    <tr key={i} style={{ backgroundColor: isLow ? ERROR_LIGHT : i % 2 === 0 ? WHITE : BG_LIGHT }}>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}`, fontWeight: 500 }}>
                        {s.name}
                        {isLow && (
                          <span style={{ marginLeft: 8, fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 4, backgroundColor: ERROR_BORDER, color: RED }}>
                            LOW
                          </span>
                        )}
                      </td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: GREEN, fontWeight: 600, border: `1px solid ${BORDER}` }}>{s.present}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: isAbsent ? RED : SLATE, fontWeight: isAbsent ? 600 : 400, border: `1px solid ${BORDER}` }}>{s.total - s.present}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{s.total}</td>
                      <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: p >= 75 ? GREEN : RED, border: `1px solid ${BORDER}` }}>{p.toFixed(2)}%</td>
                      <td style={{ padding: "10px 14px", border: `1px solid ${BORDER}`, width: 140 }}>
                        <AnimatedBar value={p} color={p >= 75 ? GREEN : RED} />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {sem === 1 && (
            <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: BG_TABLE, borderRadius: 4, fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>
              Semester 1 completed. Final attendance recorded. Total days tracked: {data.totalDays} | Present: {data.present} | Absent: {data.absent}
            </div>
          )}
          {sem === 2 && (
            <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: BG_TABLE, borderRadius: 4, fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>
              {data.absent} absent day(s) recorded. Full semester attendance will be finalized after Jun 30, 2026.
            </div>
          )}

          {/* Daily Attendance Log */}
          <div style={{ marginTop: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 10 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>
                📅 Daily Attendance Log
              </div>

              {/* View mode toggle */}
              <div style={{ display: "inline-flex", borderRadius: 4, overflow: "hidden", border: `1px solid ${BORDER}` }}>
                <button
                  onClick={() => setViewMode("calendar")}
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    backgroundColor: viewMode === "calendar" ? NAVY : WHITE,
                    color: viewMode === "calendar" ? "white" : TEXT_DARK,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  📅 Calendar Grid
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  style={{
                    padding: "6px 14px",
                    fontSize: 12,
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    borderLeft: `1px solid ${BORDER}`,
                    backgroundColor: viewMode === "list" ? NAVY : WHITE,
                    color: viewMode === "list" ? "white" : TEXT_DARK,
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                >
                  📋 Daily List Table
                </button>
              </div>
            </div>

            {/* Month filter buttons */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginBottom: 12 }}>
              {months.map((m, idx) => (
                <button
                  key={m.label}
                  onClick={() => setSelectedMonthIdx(idx)}
                  style={{
                    padding: "5px 12px", fontSize: 11, fontWeight: selectedMonthIdx === idx ? 700 : 500,
                    border: `1px solid ${selectedMonthIdx === idx ? NAVY : BORDER}`,
                    backgroundColor: selectedMonthIdx === idx ? NAVY : WHITE,
                    color: selectedMonthIdx === idx ? "white" : SLATE,
                    borderRadius: 4, cursor: "pointer",
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>

            {/* Main View: Calendar or Daily List */}
            {viewMode === "calendar" ? (
              <div style={{
                backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4,
                padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, marginBottom: 10 }}>
                  {selectedMonth ? `${MONTH_NAMES[selectedMonth.month]} ${selectedMonth.year}` : ""}
                </div>
                {selectedMonth && <CalendarGrid log={dailyLog} selectedMonth={selectedMonth} />}

                {/* Legend */}
                <div style={{
                  display: "flex", gap: 16, flexWrap: "wrap", marginTop: 14,
                  fontSize: 11, color: SLATE, paddingTop: 10, borderTop: `1px solid ${BORDER}`,
                }}>
                  {[
                    { color: GREEN, label: "Present" },
                    { color: RED, label: "Absent" },
                    { color: AMBER, label: "Holiday / Festival 🪔" },
                    { color: "#cbd5e1", label: "Sunday / No Class" },
                  ].map((l) => (
                    <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: l.color }} />
                      {l.label}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4,
                padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, marginBottom: 10 }}>
                  {selectedMonth ? `${MONTH_NAMES[selectedMonth.month]} ${selectedMonth.year} — Daily Attendance List` : ""}
                </div>
                {selectedMonth && <DailyListView log={dailyLog} selectedMonth={selectedMonth} sem={sem} />}
              </div>
            )}

            {/* Festivals & Public Holidays Card */}
            <HolidaysAndFestivalsCard sem={sem} />
          </div>
        </>
      )}
    </div>
  );
}
