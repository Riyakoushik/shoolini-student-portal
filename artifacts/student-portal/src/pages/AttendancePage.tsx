import { useState, useEffect, useRef } from "react";
import {
  sem1Attendance, sem2Attendance, sem1DailyLog, sem2DailyLog,
  sem3Subjects, sem4Subjects, semesterTimeline,
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
const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const MONTH_SHORT = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
                }}>
                  {day}
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

export default function AttendancePage() {
  const [sem, setSem] = useState(2);
  const [pdfLoading, setPdfLoading] = useState(false);

  const data = sem === 1 ? sem1Attendance : sem2Attendance;
  const dailyLog = sem === 1 ? sem1DailyLog : sem2DailyLog;

  const months = getMonthsInRange(dailyLog);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(months.length - 1);
  const selectedMonth = months[selectedMonthIdx] ?? months[0];

  useEffect(() => {
    const m = getMonthsInRange(sem === 1 ? sem1DailyLog : sem2DailyLog);
    setSelectedMonthIdx(m.length - 1);
  }, [sem]);

  const lowAttendance = (sem <= 2) ? data.subjects.filter((s) => pct(s.present, s.total) < 75) : [];

  async function handleDownloadReport() {
    setPdfLoading(true);
    try { await generateAttendancePDF(data, sem); }
    finally { setPdfLoading(false); }
  }

  const semTabs = [
    { val: 1, label: "Semester 1 — 99.07%", tag: "" },
    { val: 2, label: "Semester 2 — 90.6%",  tag: "" },
    { val: 3, label: "Semester 3",           tag: "Upcoming" },
    { val: 4, label: "Semester 4",           tag: "Upcoming" },
  ];

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>Attendance Record</h1>
        {sem <= 2 && (
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
        ✅ Attendance is automatically recorded for each working day. Last updated: <strong>March 31, 2026</strong>
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
          </button>
        ))}
      </div>

      {/* Upcoming semester notice */}
      {(sem === 3 || sem === 4) && (
        <div style={{
          backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8,
          padding: 32, textAlign: "center", marginBottom: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK, marginBottom: 8 }}>
            Semester {sem} begins {sem === 3 ? "July 6, 2026" : "January 5, 2027"}
          </div>
          <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>
            Attendance tracking will begin automatically from {sem === 3 ? "July 6, 2026" : "January 5, 2027"}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>≥ 85%</div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>TARGET ATTENDANCE</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>
                {sem === 3 ? sem3Subjects.length : sem4Subjects.length}
              </div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>SUBJECTS ENROLLED</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: NAVY }}>
                {sem === 3 ? (semesterTimeline.find(s => s.sem === 3)?.credits ?? 24) : (semesterTimeline.find(s => s.sem === 4)?.credits ?? 26)}
              </div>
              <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>TOTAL CREDITS</div>
            </div>
          </div>
        </div>
      )}

      {/* Active semester content */}
      {sem <= 2 && (
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
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
            {[
              { label: "Classes Present", value: String(data.present), border: GREEN },
              { label: "Classes Absent",  value: String(data.absent),  border: RED },
              { label: "Attendance %",    value: `${data.percentage}%`, border: AMBER },
            ].map((k) => (
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
                <div style={{ fontSize: 28, fontWeight: 700, color: TEXT_DARK }}>{k.value}</div>
                <div style={{ fontSize: 12, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Notice */}
          {sem === 2 && (
            <div
              style={{
                backgroundColor: WARN_BG,
                border: `1px solid ${WARN_BORDER}`,
                borderLeft: `3px solid ${AMBER}`,
                borderRadius: 4,
                padding: "12px 16px",
                marginBottom: 16,
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600, color: WARN_TEXT, marginBottom: 2 }}>
                Semester 2 is in progress. Attendance records are being updated.
              </div>
              <div style={{ fontSize: 13, color: WARN_TEXT2 }}>
                Data shown reflects records up to March 31, 2026.
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
                  const p      = pct(s.present, s.total);
                  const isLow  = p < 75;
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
            <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>
              📅 Daily Attendance Log
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

            {/* Calendar */}
            <div style={{
              backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4,
              padding: 14, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: TEXT_DARK, marginBottom: 10 }}>
                {selectedMonth ? `${MONTH_NAMES[selectedMonth.month]} ${selectedMonth.year}` : ""}
              </div>
              {selectedMonth && <CalendarGrid log={dailyLog} selectedMonth={selectedMonth} />}
            </div>

            {/* Legend */}
            <div style={{
              display: "flex", gap: 16, flexWrap: "wrap", marginTop: 10,
              fontSize: 11, color: SLATE,
            }}>
              {[
                { color: GREEN, label: "Present" },
                { color: RED, label: "Absent" },
                { color: AMBER, label: "Holiday" },
                { color: "#cbd5e1", label: "Sunday / No Class" },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
