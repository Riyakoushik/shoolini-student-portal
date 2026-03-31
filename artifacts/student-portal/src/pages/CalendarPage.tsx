import { useState, useRef } from "react";
import { calendarEvents, type CalendarEvent } from "../data/studentData";
import { RED, AMBER, BLUE, GREEN, NAVY, PORTAL_DATE, PORTAL_DATE_STR, SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE } from "../constants";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventColors: Record<CalendarEvent["type"], string> = {
  exam:       RED,
  assignment: AMBER,
  semester:   BLUE,
  holiday:    GREEN,
};

const eventTypeLabel: Record<CalendarEvent["type"], string> = {
  exam:       "Exam",
  assignment: "Assignment",
  semester:   "College Event",
  holiday:    "Holiday / Break",
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

type TooltipState = {
  events: CalendarEvent[];
  x: number;
  y: number;
} | null;

const TODAY = PORTAL_DATE;
const TODAY_STR = PORTAL_DATE_STR;

export default function CalendarPage() {
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState(2); // 0-indexed, 2 = March
  const [tooltip, setTooltip] = useState<TooltipState>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  // Build events map for current month
  const eventsByDate: Record<string, CalendarEvent[]> = {};
  calendarEvents.forEach((ev) => {
    const [y, m] = ev.date.split("-").map(Number);
    if (y === year && m - 1 === month) {
      const d = ev.date;
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push(ev);
    }
  });

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Build cells
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);

  const handleDotClick = (e: React.MouseEvent, evs: CalendarEvent[]) => {
    e.stopPropagation();
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (!containerRect) return;
    setTooltip({
      events: evs,
      x: rect.left - containerRect.left + rect.width / 2,
      y: rect.top - containerRect.top - 8,
    });
  };

  return (
    <div onClick={() => setTooltip(null)}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 16px 0" }}>Academic Calendar</h1>

      <div
        ref={containerRef}
        style={{
          backgroundColor: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          padding: 16,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
          position: "relative",
        }}
      >
        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
          <button
            onClick={prevMonth}
            style={{ padding: "6px 14px", border: `1px solid ${BORDER}`, borderRadius: 4, backgroundColor: WHITE, cursor: "pointer", fontSize: 16, color: TEXT_DARK }}
          >
            ‹
          </button>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>
            {MONTH_NAMES[month]} {year}
          </div>
          <button
            onClick={nextMonth}
            style={{ padding: "6px 14px", border: `1px solid ${BORDER}`, borderRadius: 4, backgroundColor: WHITE, cursor: "pointer", fontSize: 16, color: TEXT_DARK }}
          >
            ›
          </button>
        </div>

        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: `1px solid ${BORDER}`, marginBottom: 4 }}>
          {DAYS_OF_WEEK.map((d) => (
            <div key={d} style={{ padding: "6px 4px", textAlign: "center", fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1 }}>
          {cells.map((day, idx) => {
            if (!day) {
              return (
                <div key={idx} style={{ minHeight: 64, backgroundColor: BG_LIGHT, border: `1px solid ${BG_TABLE}` }} />
              );
            }
            const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;
            const dayEvents = eventsByDate[dateStr] ?? [];
            const isToday = dateStr === TODAY_STR;
            // Past = strictly before today
            const isPast = new Date(dateStr) < TODAY;

            return (
              <div
                key={idx}
                style={{
                  minHeight: 64,
                  border: `1px solid ${BORDER}`,
                  padding: "4px 6px",
                  backgroundColor: isToday ? BG_LIGHT : WHITE,
                  position: "relative",
                }}
              >
                {/* Day number */}
                <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 4 }}>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: isToday ? 700 : 400,
                      color: isToday ? "white" : TEXT_DARK,
                      backgroundColor: isToday ? NAVY : "transparent",
                      borderRadius: "50%",
                      width: 22,
                      height: 22,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {day}
                  </span>
                </div>

                {/* Event dots */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                  {dayEvents.map((ev, ei) => (
                    <span
                      key={ei}
                      onClick={(e) => handleDotClick(e, dayEvents)}
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        backgroundColor: eventColors[ev.type],
                        cursor: "pointer",
                        flexShrink: 0,
                        opacity: isPast ? 0.45 : 1,
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Click popup */}
        {tooltip && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute",
              left: Math.min(tooltip.x, (containerRef.current?.offsetWidth ?? 500) - 220),
              top: tooltip.y,
              transform: "translate(-50%, -100%)",
              backgroundColor: WHITE,
              color: TEXT_DARK,
              borderRadius: 4,
              padding: "10px 14px",
              fontSize: 12,
              zIndex: 200,
              minWidth: 210,
              maxWidth: 300,
              boxShadow: "0 4px 16px rgba(0,0,0,0.16)",
              border: `1px solid ${BORDER}`,
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8, gap: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {tooltip.events.length} Event{tooltip.events.length !== 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setTooltip(null)}
                style={{ background: "none", border: "none", cursor: "pointer", fontSize: 14, color: SLATE, padding: "0 2px", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            {tooltip.events.map((ev, i) => (
              <div key={i} style={{ marginBottom: i < tooltip.events.length - 1 ? 10 : 0, paddingBottom: i < tooltip.events.length - 1 ? 10 : 0, borderBottom: i < tooltip.events.length - 1 ? `1px solid ${BORDER}` : "none" }}>
                <div style={{ marginBottom: 4 }}>
                  <span style={{ display: "inline-block", fontSize: 10, padding: "1px 6px", borderRadius: 3, backgroundColor: eventColors[ev.type], color: "white", fontWeight: 700 }}>
                    {eventTypeLabel[ev.type]}
                  </span>
                </div>
                <div style={{ fontWeight: 600, fontSize: 12, color: TEXT_DARK, lineHeight: 1.5 }}>{ev.label}</div>
                <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>{ev.date}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Legend */}
      <div
        style={{
          backgroundColor: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 4,
          padding: "12px 16px",
          marginTop: 12,
          display: "flex",
          gap: 24,
          flexWrap: "wrap",
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", alignSelf: "center", marginRight: 4 }}>
          Legend:
        </div>
        {(Object.entries(eventColors) as [CalendarEvent["type"], string][]).map(([type, color]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: color, display: "inline-block" }} />
            <span style={{ fontSize: 12, color: SLATE }}>{eventTypeLabel[type]}</span>
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginLeft: 8, paddingLeft: 8, borderLeft: `1px solid ${BORDER}` }}>
          <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: SLATE_LIGHT, display: "inline-block", opacity: 0.45 }} />
          <span style={{ fontSize: 12, color: SLATE }}>Past events (muted)</span>
        </div>
      </div>
    </div>
  );
}
