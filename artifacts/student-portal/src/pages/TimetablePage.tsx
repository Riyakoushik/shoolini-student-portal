import { useState } from "react";
import { sem1TimetableDaily, sem2TimetableDaily, sem3TimetableDaily, sem4TimetableDaily } from "../data/studentData";
import { NAVY, AMBER, DARK_BLUE, SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE, INFO_BG, WARN_BG, WARN_TEXT, WARN_BORDER } from "../constants";
import { generateTimetablePDF } from "../utils/generateTimetablePDF";

const timetableMap: Record<number, typeof sem1TimetableDaily> = {
  1: sem1TimetableDaily,
  2: sem2TimetableDaily,
  3: sem3TimetableDaily,
  4: sem4TimetableDaily,
};

const semTabs = [
  { val: 1, label: "Semester 1", tag: "Completed" },
  { val: 2, label: "Semester 2", tag: "Active" },
  { val: 3, label: "Semester 3", tag: "Upcoming" },
  { val: 4, label: "Semester 4", tag: "Upcoming" },
];

export default function TimetablePage() {
  const [sem, setSem] = useState(2);
  const [pdfLoading, setPdfLoading] = useState(false);
  const rows = timetableMap[sem] ?? sem2TimetableDaily;
  const showFaculty = sem >= 2;

  async function handleExportPDF() {
    setPdfLoading(true);
    try { await generateTimetablePDF(rows, sem); }
    finally { setPdfLoading(false); }
  }

  const tdStyle: React.CSSProperties = {
    padding: "11px 14px",
    fontSize: 13,
    color: TEXT_DARK,
    border: `1px solid ${BORDER}`,
    verticalAlign: "middle",
  };

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 10 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: 0 }}>Weekly Timetable</h1>
        <button
          onClick={handleExportPDF}
          disabled={pdfLoading || sem > 2}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "7px 16px", backgroundColor: pdfLoading || sem > 2 ? BG_TABLE : NAVY,
            color: pdfLoading || sem > 2 ? SLATE : "white", border: "none", borderRadius: 4,
            fontSize: 12, fontWeight: 600, cursor: pdfLoading || sem > 2 ? "not-allowed" : "pointer",
            fontFamily: "inherit",
          }}
        >
          {pdfLoading ? "Generating…" : "↓ Export Timetable PDF"}
        </button>
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

      {/* Upcoming Notice */}
      {sem === 3 && (
        <div style={{ backgroundColor: INFO_BG, border: `1px solid #bfdbfe`, borderLeft: `3px solid #2563eb`, borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
          <strong>📅 Semester 3 begins July 6, 2026.</strong> This is the upcoming timetable — subject to changes before the semester starts.
        </div>
      )}
      {sem === 4 && (
        <div style={{ backgroundColor: INFO_BG, border: `1px solid #bfdbfe`, borderLeft: `3px solid #2563eb`, borderRadius: 4, padding: "10px 14px", fontSize: 13, color: "#1e40af", marginBottom: 16 }}>
          <strong>📅 Semester 4 begins January 5, 2027.</strong> Thursday & Friday are full-day Dissertation/Major Project slots.
        </div>
      )}

      {/* Timetable Table */}
      <div
        style={{
          backgroundColor: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          overflow: "auto",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          marginBottom: 12,
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Day", "Subject", ...(showFaculty ? ["Faculty"] : []), "Time", "Room", "Duration"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 14px",
                    fontSize: 12,
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
            {rows.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                {/* Day */}
                <td style={{ ...tdStyle, fontWeight: 600, width: 110 }}>{row.day}</td>

                {/* Subject with color bar */}
                <td style={{ ...tdStyle, padding: 0 }}>
                  <div
                    style={{
                      borderLeft: `3px solid ${row.color}`,
                      padding: "11px 14px",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK }}>{row.subject}</div>
                    {row.note && (
                      <div style={{ fontSize: 11, color: AMBER, marginTop: 3 }}>ℹ {row.note}</div>
                    )}
                  </div>
                </td>

                {/* Faculty */}
                {showFaculty && (
                  <td style={{ ...tdStyle, color: SLATE }}>{row.faculty ?? "—"}</td>
                )}

                {/* Time */}
                <td style={{ ...tdStyle, fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>
                  {row.time}
                </td>

                {/* Room */}
                <td style={{ ...tdStyle }}>{row.room}</td>

                {/* Duration */}
                <td style={{ ...tdStyle }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      backgroundColor: INFO_BG,
                      color: DARK_BLUE,
                      borderRadius: 4,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {row.duration}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Alternate-week notice */}
      <div
        style={{
          backgroundColor: WARN_BG,
          border: `1px solid ${WARN_BORDER}`,
          borderLeft: `3px solid ${AMBER}`,
          borderRadius: 4,
          padding: "10px 14px",
          fontSize: 13,
          color: WARN_TEXT,
          marginBottom: 16,
        }}
      >
        <strong>Note:</strong> Some subjects rotate on alternate weeks. Check the college notice board for weekly schedule updates.
      </div>

      {/* Subject Legend */}
      <div
        style={{
          backgroundColor: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
          Subject Legend
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {rows.map((r) => (
            <div key={r.subject} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 12, height: 12, backgroundColor: r.color, borderRadius: 2 }} />
              <span style={{ fontSize: 12, color: TEXT_DARK }}>{r.subject}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
