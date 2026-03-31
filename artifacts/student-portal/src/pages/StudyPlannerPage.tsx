import { useState } from "react";
import ProgressBar from "../components/ProgressBar";
import { studyWeek, subjectSummaries, weeklyGoalHours } from "../data/studyData";
import {
  NAVY, GREEN, AMBER, SLATE, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE,
  SUCCESS_BG, INFO_BG, DARK_BLUE
} from "../constants";
import { useIsMobile } from "../hooks/use-mobile";

export default function StudyPlannerPage() {
  const isMobile = useIsMobile();
  const [week, setWeek] = useState(() => studyWeek.map((d) => ({ ...d, tasks: d.tasks.map((t) => ({ ...t })) })));

  function toggleTask(dayIdx: number, taskIdx: number) {
    setWeek((prev) => prev.map((d, di) => {
      if (di !== dayIdx) return d;
      return {
        ...d,
        tasks: d.tasks.map((t, ti) => {
          if (ti !== taskIdx) return t;
          const done = !t.done;
          return { ...t, done, progress: done ? 100 : (d.isPast ? 80 : 0) };
        }),
      };
    }));
  }

  const completedHours = week.reduce((sum, day) =>
    sum + day.tasks.reduce((s, t) => s + (t.done ? t.goalHours : t.progress > 0 ? t.goalHours * t.progress / 100 : 0), 0), 0
  );
  const completionPct = Math.round((completedHours / weeklyGoalHours) * 100);

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 4px 0" }}>Study Planner</h1>
        <p style={{ fontSize: 13, color: SLATE, margin: 0 }}>Weekly study goals — Week of Mar 23–28, 2026 (Semester 2)</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Weekly Goal", value: `${weeklyGoalHours} hrs`, color: NAVY },
          { label: "Completed", value: `${completedHours.toFixed(1)} hrs`, color: completedHours >= weeklyGoalHours ? GREEN : AMBER },
          { label: "Completion", value: `${completionPct}%`, color: completionPct >= 80 ? GREEN : completionPct >= 50 ? AMBER : "#dc2626" },
        ].map((k) => (
          <div key={k.label} style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 8 }}>{k.label}</div>
            <div style={{ fontSize: 28, fontWeight: 700, color: k.color, marginBottom: 8 }}>{k.value}</div>
            {k.label === "Completion" && (
              <ProgressBar value={completionPct} color={k.color} />
            )}
          </div>
        ))}
      </div>

      {/* Weekly Grid */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", marginBottom: 24, overflowX: "auto" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_TABLE }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Weekly Study Grid — Mar 23–28, 2026</span>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: `repeat(${isMobile ? 2 : 6}, 1fr)`, gap: 0, minWidth: isMobile ? undefined : 900 }}>
          {week.map((day, di) => (
            <div
              key={day.day}
              style={{
                borderRight: di < 5 ? `1px solid ${BORDER}` : "none",
                borderLeft: day.isToday ? `4px solid ${NAVY}` : undefined,
                backgroundColor: day.isToday ? "#f0f4f8" : day.isPast ? BG_LIGHT : WHITE,
              }}
            >
              {/* Day header */}
              <div style={{
                padding: "10px 14px", borderBottom: `1px solid ${BORDER}`,
                backgroundColor: day.isToday ? NAVY : BG_TABLE,
              }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: day.isToday ? "white" : TEXT_DARK }}>{day.day}</div>
                <div style={{ fontSize: 11, color: day.isToday ? "rgba(255,255,255,0.7)" : SLATE }}>{day.date}</div>
                {day.isToday && (
                  <span style={{ display: "inline-block", marginTop: 4, fontSize: 9, fontWeight: 700, color: "white", backgroundColor: "rgba(255,255,255,0.2)", padding: "2px 6px", borderRadius: 4 }}>
                    TODAY
                  </span>
                )}
                {day.isPast && !day.isToday && (
                  <span style={{ display: "inline-block", marginTop: 4, fontSize: 9, fontWeight: 700, color: SLATE, backgroundColor: BG_TABLE, padding: "2px 6px", borderRadius: 4 }}>
                    PAST
                  </span>
                )}
              </div>

              {/* Tasks */}
              {day.tasks.map((task, ti) => (
                <div
                  key={task.abbr}
                  style={{
                    padding: "10px 14px",
                    borderBottom: ti < day.tasks.length - 1 ? `1px solid ${BORDER}` : "none",
                    backgroundColor: task.done ? SUCCESS_BG : undefined,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginBottom: 4 }}>
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(di, ti)}
                      style={{ marginTop: 2, cursor: "pointer", accentColor: NAVY, flexShrink: 0 }}
                    />
                    <div>
                      <span style={{
                        fontSize: 10, fontWeight: 700, color: "white",
                        backgroundColor: subjectSummaries.find((s) => s.abbr === task.abbr)?.color ?? NAVY,
                        padding: "1px 5px", borderRadius: 3, marginBottom: 3, display: "inline-block",
                      }}>
                        {task.abbr}
                      </span>
                      <div style={{ fontSize: 10, color: SLATE, fontWeight: 500, lineHeight: 1.3, marginTop: 2 }}>
                        {task.goalHours} hr{task.goalHours > 1 ? "s" : ""}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: task.done ? GREEN : TEXT_DARK, fontWeight: task.done ? 600 : 400, lineHeight: 1.4, marginBottom: 6 }}>
                    {task.topic}
                  </div>
                  <ProgressBar value={task.progress} color={task.done ? GREEN : task.progress > 0 ? AMBER : "#cbd5e1"} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Subject Summary */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_TABLE }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>Subject-wise Study Summary</span>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ backgroundColor: BG_TABLE }}>
                {["Subject", "Target", "Studied", "Progress", "Completion"].map((h) => (
                  <th key={h} style={{
                    textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600,
                    color: SLATE, textTransform: "uppercase" as const, letterSpacing: "0.06em",
                    border: `1px solid ${BORDER}`,
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subjectSummaries.map((s, i) => {
                const pct = Math.round((s.studiedHours / s.targetHours) * 100);
                return (
                  <tr key={s.abbr} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ padding: "10px 14px", fontSize: 13, border: `1px solid ${BORDER}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{
                          display: "inline-block", width: 10, height: 10, borderRadius: "50%",
                          backgroundColor: s.color, flexShrink: 0,
                        }} />
                        <span style={{ fontWeight: 600, color: TEXT_DARK }}>{s.subject}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, color: "white",
                          backgroundColor: s.color, padding: "1px 5px", borderRadius: 3,
                        }}>
                          {s.abbr}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>{s.targetHours} hrs</td>
                    <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: s.studiedHours >= s.targetHours ? GREEN : AMBER, border: `1px solid ${BORDER}` }}>
                      {s.studiedHours} hrs
                    </td>
                    <td style={{ padding: "10px 14px", border: `1px solid ${BORDER}`, minWidth: 120 }}>
                      <ProgressBar value={pct} color={pct >= 100 ? GREEN : pct >= 60 ? AMBER : "#dc2626"} />
                    </td>
                    <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: pct >= 100 ? GREEN : pct >= 60 ? AMBER : "#dc2626", border: `1px solid ${BORDER}` }}>
                      {pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
