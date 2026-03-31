import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatusBadge from "../components/StatusBadge";
import {
  sem2MidtermResults, sem1Assignments, sem2Assignments, sem3Assignments, sem4Assignments, semesterTimeline,
  sem2TimetableDaily, sem3TimetableDaily, sem4TimetableDaily, sem2Attendance, student,
  sem3IASchedule, sem4IASchedule,
  type SemesterAttendance, type DailyClass,
} from "../data/studentData";
import { useIsMobile } from "../hooks/use-mobile";
import {
  PORTAL_DATE, NAVY, BLUE, GREEN, RED, AMBER,
  SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK,
  BG_LIGHT, BG_TABLE, LIVE_ICON, LIVE_SUB, DARK_GRAY, INFO_BG,
} from "../constants";

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

const semColors: Record<string, string> = {
  Completed: NAVY,
  Active:    BLUE,
  Upcoming:  SLATE_LIGHT,
};

const activeSem =
  PORTAL_DATE >= new Date("2027-01-05") ? 4 :
  PORTAL_DATE >= new Date("2026-07-06") ? 3 :
  PORTAL_DATE >= new Date("2026-01-19") ? 2 : 1;

const activeAssignments =
  activeSem === 4 ? sem4Assignments :
  activeSem === 3 ? sem3Assignments :
  activeSem === 2 ? sem2Assignments : sem1Assignments;

const upcomingAssignments = activeAssignments
  .filter((a) => a.dueDate != null && a.dueDate >= PORTAL_DATE)
  .sort((a, b) => (a.dueDate?.getTime() ?? 0) - (b.dueDate?.getTime() ?? 0))
  .slice(0, 5);

const chartData = activeSem === 2 ? sem2MidtermResults.map((r) => ({
  subject: r.subject
    .replace("Advanced ", "Adv. ")
    .replace("Natural Language Processing", "NLP")
    .replace("Computer Vision", "Comp. Vision"),
  score: r.score,
})) : [];

const TODAY_DISPLAY = PORTAL_DATE.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

const activeTimetable =
  activeSem === 4 ? sem4TimetableDaily :
  activeSem === 3 ? sem3TimetableDaily :
  activeSem === 2 ? sem2TimetableDaily : [];

const simDay = PORTAL_DATE.toLocaleDateString("en-US", { weekday: "long" });
const todaySchedule = activeTimetable.filter((c) => c.day.includes(simDay));

const upcomingExams = activeSem === 4 ? [
  { name: "Pre-final Exams", date: `${sem4IASchedule.preFinal.start} – ${sem4IASchedule.preFinal.end}`, status: "Upcoming" as const },
  { name: "Final Examinations", date: `${sem4IASchedule.theoryExams.start} – ${sem4IASchedule.theoryExams.end}`, status: "Upcoming" as const },
  { name: "Project Submission", date: sem4IASchedule.projectSubmission, status: "Upcoming" as const },
] : activeSem === 3 ? [
  { name: "Pre-final Exams", date: `${sem3IASchedule.preFinal.start} – ${sem3IASchedule.preFinal.end}`, status: "Upcoming" as const },
  { name: "Final Examinations", date: `${sem3IASchedule.theoryExams.start} – ${sem3IASchedule.theoryExams.end}`, status: "Upcoming" as const },
  { name: "Practical Exams", date: `${sem3IASchedule.practicalExams.start} – ${sem3IASchedule.practicalExams.end}`, status: "Upcoming" as const },
] : [
  { name: "Pre-final Exams", date: "April 21–29, 2026", status: "Upcoming" as const },
  { name: "Final Examinations", date: "May 11–19, 2026", status: "Upcoming" as const },
  { name: "Practical Exams", date: "May 25–28, 2026", status: "Upcoming" as const },
];

function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

type DaySchedule = DailyClass;

function toMin(t: string): number {
  const [h, m] = t.replace(/ (AM|PM)/, "").split(":").map(Number);
  const isPM = t.includes("PM");
  const hour = isPM && h !== 12 ? h + 12 : !isPM && h === 12 ? 0 : h;
  return hour * 60 + (m || 0);
}

function getLiveClass(now: Date): DaySchedule | null {
  // Use PORTAL_DATE's day of week for deterministic simulation, live wall-clock time for hour/minute
  const hhmm = now.getHours() * 60 + now.getMinutes();
  return todaySchedule.find((cls) => {
    const [startStr, endStr] = cls.time.split("–").map((s: string) => s.trim());
    if (!startStr || !endStr) {
      if (cls.time === "Full Day") return hhmm >= 540 && hhmm <= 1020; // 9am - 5pm
      return false;
    }
    return hhmm >= toMin(startStr) && hhmm < toMin(endStr);
  }) ?? null;
}

export default function DashboardPage() {
  const greeting = getGreeting();
  const isMobile = useIsMobile();
  const width = useWindowWidth();

  const isNarrow = width < 900;
  const kpiCols    = isNarrow ? "1fr 1fr" : "repeat(4, 1fr)";
  const semCols    = isNarrow ? "1fr 1fr" : "repeat(4, 1fr)";
  const chartRow   = isNarrow ? "1fr" : "1fr 1fr";
  const assignRow  = isNarrow ? "1fr" : "1fr 1fr";
  const linkCols   = isNarrow ? "1fr 1fr" : "repeat(5, 1fr)";

  const [liveClass, setLiveClass] = useState(() => getLiveClass(new Date()));
  const [marked, setMarked] = useState(false);
  const [attendance, setAttendance] = useState<SemesterAttendance | null>(activeSem === 2 ? sem2Attendance : null);
  const [pendingCount, setPendingCount] = useState(() =>
    activeAssignments.filter((a) => a.status === "Pending").length
  );
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const id = setInterval(() => setLiveClass(getLiveClass(new Date())), 30000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setPendingCount(activeAssignments.filter((a) => a.status === "Pending").length);
  }, []);

  const attendancePct = (() => {
    if (!attendance) return "N/A";
    const total = attendance.totalDays;
    return total ? `${Math.round((attendance.present / total) * 100)}%` : "N/A";
  })();

  function handleMarkPresent() {
    if (marked || !liveClass || !attendance) return;
    setAttendance((prev) => {
      if (!prev) return prev;
      const liveSubjectNorm = liveClass.subject.trim().toLowerCase();
      const updatedSubjects = prev.subjects.map((s) => {
        const isMatch = s.name.trim().toLowerCase() === liveSubjectNorm;
        return isMatch
          ? { ...s, present: s.present + 1, total: s.total + 1 }
          : s;
      });
      const newTotalDays = prev.totalDays + 1;
      const newPresent = prev.present + 1;
      const newPct = Math.round((newPresent / newTotalDays) * 100);
      return {
        ...prev,
        present: newPresent,
        absent: prev.absent,
        totalDays: newTotalDays,
        percentage: newPct,
        subjects: updatedSubjects,
      };
    });
    setMarked(true);
    const ts = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    setToast(`Attendance marked for ${liveClass.subject} at ${ts}`);
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <div>
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1100,
          backgroundColor: GREEN, color: "white", padding: "12px 20px", borderRadius: 4,
          fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 360,
        }}>
          ✓ {toast}
        </div>
      )}

      <div style={{ marginBottom: 4 }}>
        <h1 style={{ fontSize: isMobile ? 17 : 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>
          {greeting}, {student.name}
        </h1>
        <p style={{ fontSize: 14, color: SLATE, margin: "4px 0 0 0" }}>Academic Dashboard</p>
        <p style={{ fontSize: 13, color: SLATE, margin: "2px 0 0 0" }}>MCA (AI/ML) — Semester {activeSem} &nbsp;|&nbsp; School of Computer Science &amp; Engineering</p>
        {!isMobile && (
          <p style={{ fontSize: 12, color: SLATE_LIGHT, margin: "2px 0 0 0" }}>Shoolini University, Solan, H.P. &nbsp;|&nbsp; Roll No: {student.rollNo}</p>
        )}
      </div>

      {/* Live Class Card — shown when wall-clock time is within a class window */}
      {liveClass && (
        <div style={{
          backgroundColor: NAVY,
          borderRadius: 4,
          padding: isMobile ? "14px 16px" : "16px 20px",
          marginTop: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
          border: `1px solid ${NAVY}`,
        }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: LIVE_ICON, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>
              ● LIVE NOW
            </div>
            <div style={{ fontSize: isMobile ? 15 : 17, fontWeight: 700, color: WHITE, marginBottom: 2 }}>
              Live Class: {liveClass.subject}
            </div>
            <div style={{ fontSize: 12, color: LIVE_SUB }}>
              {liveClass.time} &nbsp;·&nbsp; {liveClass.room}
              {liveClass.faculty ? ` · ${liveClass.faculty}` : ""}
            </div>
          </div>
          <button
            onClick={handleMarkPresent}
            disabled={marked}
            style={{
              backgroundColor: marked ? DARK_GRAY : GREEN,
              color: WHITE,
              border: "none",
              borderRadius: 4,
              padding: "9px 20px",
              fontSize: 13,
              fontWeight: 700,
              cursor: marked ? "not-allowed" : "pointer",
              letterSpacing: "0.02em",
              fontFamily: "inherit",
              flexShrink: 0,
            }}
          >
            {marked ? "Attendance Logged" : "Mark Present"}
          </button>
        </div>
      )}

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: kpiCols, gap: 12, marginTop: 16 }}>
        {[
          { label: "Current Semester", value: "2 of 4",        border: BLUE },
          { label: "Mid-term Average", value: "85 / 100",      border: GREEN },
          { label: "Attendance",       value: attendancePct,   border: AMBER },
          { label: "Pending Tasks",    value: String(pendingCount), border: RED },
        ].map((kpi) => (
          <div
            key={kpi.label}
            style={{
              backgroundColor: WHITE,
              border: `1px solid ${BORDER}`,
              borderLeft: `3px solid ${kpi.border}`,
              borderRadius: 4,
              padding: isMobile ? "12px 14px" : 16,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: isMobile ? 22 : 28, fontWeight: 700, color: TEXT_DARK }}>{kpi.value}</div>
            <div style={{ fontSize: 11, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Semester Timeline */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Semester Progress Timeline
        </div>
        <div style={{ display: "grid", gridTemplateColumns: semCols, gap: 8 }}>
          {semesterTimeline.map((s) => (
            <div
              key={s.sem}
              style={{
                backgroundColor: s.status === "Active" ? INFO_BG : s.status === "Completed" ? BG_TABLE : BG_LIGHT,
                border: `1px solid ${s.status === "Active" ? BLUE : BORDER}`,
                borderRadius: 4,
                padding: "10px 12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>Semester {s.sem}</span>
                <span style={{
                  fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 4,
                  color: WHITE, backgroundColor: semColors[s.status] ?? SLATE_LIGHT,
                }}>
                  {s.status.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 11, color: SLATE }}>{s.start}</div>
              <div style={{ fontSize: 11, color: SLATE }}>to {s.end}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Chart + Today's Schedule */}
      <div style={{ display: "grid", gridTemplateColumns: chartRow, gap: 14, marginTop: 14 }}>
        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Mid-term Performance — Semester {activeSem}
          </div>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
                <XAxis dataKey="subject" tick={{ fontSize: 11, fill: SLATE }} angle={-35} textAnchor="end" interval={0} />
                <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: SLATE }} />
                <Tooltip contentStyle={{ fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v) => [`${v}/100`, "Score"]} />
                <Bar dataKey="score" fill={BLUE} radius={0} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: 220, display: "flex", alignItems: "center", justifyContent: "center", color: SLATE, fontSize: 14, flexDirection: "column", gap: 12, backgroundColor: BG_LIGHT, borderRadius: 4, border: `1px dashed ${BORDER}` }}>
              <div style={{ fontSize: 24 }}>📊</div>
              <div style={{ fontWeight: 500 }}>Mid-term exams pending for Semester {activeSem}</div>
            </div>
          )}
        </div>

        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>
            Today's Schedule
          </div>
          <div style={{ fontSize: 13, color: TEXT_DARK, marginBottom: 12 }}>{TODAY_DISPLAY}</div>
          {todaySchedule.length === 0 ? (
            <div style={{ color: SLATE, fontSize: 13 }}>No classes scheduled today.</div>
          ) : (
            todaySchedule.map((cls, i) => (
              <div
                key={i}
                style={{
                  borderLeft: `3px solid ${BLUE}`,
                  backgroundColor: BG_LIGHT,
                  borderRadius: 2,
                  padding: "8px 8px 8px 10px",
                  marginBottom: 10,
                }}
              >
                <div style={{ fontSize: 12, color: SLATE, marginBottom: 2 }}>{cls.time}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{cls.subject}</div>
                <div style={{ fontSize: 12, color: SLATE }}>{cls.room} · {cls.faculty}</div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Row 4: Upcoming Assignments + Upcoming Exams */}
      <div style={{ display: "grid", gridTemplateColumns: assignRow, gap: 14, marginTop: 14 }}>
        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Upcoming Assignment Deadlines
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: BG_TABLE }}>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>Subject</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>Due</th>
                <th style={{ textAlign: "left", padding: "8px 10px", fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {upcomingAssignments.map((a, i) => {
                const daysLeft = Math.ceil(((a.dueDate?.getTime() ?? 0) - PORTAL_DATE.getTime()) / 86400000);
                return (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>
                      {a.subject.replace("Natural Language Processing", "NLP").replace("Advanced Machine Learning", "Adv. ML")}
                    </td>
                    <td style={{ padding: "8px 10px", fontSize: 12, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>
                      <div>{a.due}</div>
                      <div style={{ fontSize: 11, fontWeight: 600, color: daysLeft <= 5 ? RED : AMBER, marginTop: 2 }}>
                        in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                      </div>
                    </td>
                    <td style={{ padding: "8px 10px", border: `1px solid ${BORDER}` }}>
                      <StatusBadge status="Pending" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
            Upcoming Examinations
          </div>
          {upcomingExams.map((exam, i) => (
            <div
              key={i}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "10px 0", borderBottom: i < 2 ? `1px solid ${BORDER}` : "none",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{exam.name}</div>
                <div style={{ fontSize: 12, color: SLATE }}>{exam.date}</div>
              </div>
              <StatusBadge status={exam.status} />
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginTop: 14 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Official Links
        </div>
        <div style={{ display: "grid", gridTemplateColumns: linkCols, gap: 8 }}>
          {[
            { label: "University Website", url: "https://shooliniuniversity.com" },
            { label: "Student Portal",     url: "https://my.shooliniuniversity.com" },
            { label: "Alumni Portal",      url: "https://alumni.shooliniuniversity.com" },
            { label: "UGC-NAD Portal",     url: "https://shooliniuniversity.com/national-academic-depository" },
            { label: "NAAC Certificate",   url: "https://shooliniuniversity.com" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: NAVY, fontWeight: 500, textDecoration: "none", padding: "8px 10px", border: `1px solid ${BORDER}`, borderRadius: 4, backgroundColor: BG_LIGHT }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "underline"; (e.currentTarget as HTMLElement).style.backgroundColor = BG_TABLE; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.textDecoration = "none"; (e.currentTarget as HTMLElement).style.backgroundColor = BG_LIGHT; }}
            >
              <span>→</span>
              <span>{link.label}</span>
            </a>
          ))}
        </div>
        <div style={{ fontSize: 11, color: SLATE_LIGHT, marginTop: 8 }}>Official Shoolini University digital resources</div>
      </div>
    </div>
  );
}
