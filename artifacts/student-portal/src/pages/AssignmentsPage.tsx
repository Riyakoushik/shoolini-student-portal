import { useState, useEffect } from "react";
import StatusBadge from "../components/StatusBadge";
import { sem1Assignments, sem2Assignments, sem3Assignments, sem4Assignments, sem3Project, sem4Dissertation, type Assignment } from "../data/studentData";
import { assignmentDetails, type AssignmentDetail, type RubricRow, type AssignmentReference, type AssignmentQuestion } from "../data/assignmentDetails";
import { downloadAssignmentPDF } from "../utils/generateAssignmentPDF";
import {
  PORTAL_DATE, NAVY, RED, AMBER, GREEN, DARK_BLUE, SLATE, WHITE, BORDER, TEXT_DARK,
  BG_LIGHT, BG_TABLE, ERROR_LIGHT, INFO_BG, ERROR_BORDER, WARN_BG, WARN_TEXT, SUCCESS_BG,
} from "../constants";

type Filter = "All" | "Submitted" | "Pending" | "Overdue";
type Sem2Assignment = Assignment & { no: number; type: string; dueDate: Date; computedStatus: "Submitted" | "Pending" | "Overdue" };

const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600,
  color: SLATE, textTransform: "uppercase" as const, letterSpacing: "0.06em", border: `1px solid ${BORDER}`,
};
const td: React.CSSProperties = {
  padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}`,
};

/* ─── toast ─────────────────────────────────────────────────────── */
function Toast({ msg, onHide }: { msg: string; onHide: () => void }) {
  useEffect(() => {
    const id = setTimeout(onHide, 3500);
    return () => clearTimeout(id);
  }, [onHide]);
  return (
    <div style={{
      position: "fixed", top: 20, right: 20, zIndex: 1100,
      backgroundColor: GREEN, color: WHITE, padding: "12px 20px", borderRadius: 4,
      fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.15)", maxWidth: 360,
    }}>
      {msg}
    </div>
  );
}

/* ─── confirm dialog ────────────────────────────────────────────── */
function ConfirmDialog({
  assignmentTitle,
  onConfirm,
  onCancel,
}: {
  assignmentTitle: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ backgroundColor: WHITE, borderRadius: 8, padding: 24, maxWidth: 420, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.18)" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK, marginBottom: 10 }}>Submit Assignment</div>
        <div style={{ fontSize: 14, color: SLATE, marginBottom: 20, lineHeight: 1.6 }}>
          Are you sure you want to submit <strong style={{ color: TEXT_DARK }}>"{assignmentTitle}"</strong>? This action cannot be undone.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{ flex: 1, padding: "9px 0", backgroundColor: WHITE, color: SLATE, border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{ flex: 2, padding: "9px 0", backgroundColor: GREEN, color: WHITE, border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── submitting overlay ────────────────────────────────────────── */
function SubmittingOverlay() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 400);
    return () => clearInterval(id);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ backgroundColor: WHITE, borderRadius: 8, padding: 32, textAlign: "center", minWidth: 240 }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>Submitting<span style={{ fontFamily: "monospace", letterSpacing: 2 }}>{dots}</span></div>
        <div style={{ fontSize: 13, color: SLATE, marginTop: 6 }}>Uploading to university portal</div>
      </div>
    </div>
  );
}

export default function AssignmentsPage() {
  const [sem, setSem] = useState(2);
  const [filter, setFilter] = useState<Filter>("All");
  const [selectedNo, setSelectedNo] = useState<number | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [confirmFor, setConfirmFor] = useState<Sem2Assignment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [submitTimestamps, setSubmitTimestamps] = useState<Record<number, string>>({});

  const [sem2Items, setSem2Items] = useState<Sem2Assignment[]>(() =>
    sem2Assignments.map((a) => ({
      ...a,
      no: a.no ?? 0,
      type: a.type ?? "Assignment",
      dueDate: a.dueDate ?? new Date(),
      computedStatus: a.status as "Submitted" | "Pending" | "Overdue",
    }))
  );

  useEffect(() => {
    setSem2Items((prev) =>
      prev.map((a) => {
        if (a.computedStatus === "Pending" && a.dueDate < PORTAL_DATE) {
          return { ...a, computedStatus: "Overdue" as const };
        }
        return a;
      })
    );
  }, []);

  const sem2Sorted = [
    ...sem2Items.filter((a) => a.computedStatus === "Pending"),
    ...sem2Items.filter((a) => a.computedStatus === "Overdue"),
    ...sem2Items.filter((a) => a.computedStatus === "Submitted"),
  ];

  const submittedCount = sem2Items.filter((a) => a.computedStatus === "Submitted").length;
  const pendingCount   = sem2Items.filter((a) => a.computedStatus === "Pending").length;
  const overdueCount   = sem2Items.filter((a) => a.computedStatus === "Overdue").length;

  const filteredSem2 =
    filter === "All"       ? sem2Sorted :
    filter === "Submitted" ? sem2Sorted.filter((a) => a.computedStatus === "Submitted") :
    filter === "Pending"   ? sem2Sorted.filter((a) => a.computedStatus === "Pending") :
    filter === "Overdue"   ? sem2Sorted.filter((a) => a.computedStatus === "Overdue") :
    [];

  function toggleDetail(no: number) {
    setSelectedNo((prev) => (prev === no ? null : no));
  }

  async function handleDownloadPDF(a: Sem2Assignment) {
    const detail = assignmentDetails[a.no];
    if (!detail) return;
    setPdfLoading(true);
    try {
      await downloadAssignmentPDF(detail, a.title, a.subject, a.due, a.computedStatus);
    } finally {
      setPdfLoading(false);
    }
  }

  function handleSubmitClick(a: Sem2Assignment) {
    setConfirmFor(a);
  }

  function doSubmit() {
    if (!confirmFor) return;
    setConfirmFor(null);
    setSubmitting(true);
    setTimeout(() => {
      const subId = `SUB-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
      const now = new Date();
      const ts = now.toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
      setSem2Items((prev) =>
        prev.map((a) =>
          a.no === confirmFor.no
            ? { ...a, computedStatus: "Submitted" as const }
            : a
        )
      );
      setSubmitTimestamps((prev) => ({ ...prev, [confirmFor.no]: ts }));
      setSubmitting(false);
      setToast(`Assignment submitted! ID: ${subId}`);
    }, 1500);
  }

  const selectedAssignment = selectedNo !== null ? sem2Items.find((a) => a.no === selectedNo) ?? null : null;
  const selectedDetail = selectedNo !== null ? assignmentDetails[selectedNo] ?? null : null;

  return (
    <div>
      {toast && <Toast msg={toast} onHide={() => setToast(null)} />}
      {confirmFor && <ConfirmDialog assignmentTitle={confirmFor.title} onConfirm={doSubmit} onCancel={() => setConfirmFor(null)} />}
      {submitting && <SubmittingOverlay />}

      <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 16px 0" }}>Assignments</h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 16, borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
        {[
          { label: "Semester 1 — Completed", val: 1, tag: "" },
          { label: "Semester 2 — Active",    val: 2, tag: "" },
          { label: "Semester 3",             val: 3, tag: "Upcoming" },
          { label: "Semester 4",             val: 4, tag: "Upcoming" },
        ].map((t) => (
          <button
            key={t.val}
            onClick={() => { setSem(t.val); setFilter("All"); setSelectedNo(null); }}
            style={{
              padding: "8px 16px", fontSize: 13, fontWeight: 600, border: "none",
              borderBottom: sem === t.val ? `2px solid ${NAVY}` : "2px solid transparent",
              backgroundColor: sem === t.val ? BG_TABLE : "transparent",
              color: sem === t.val ? NAVY : SLATE,
              cursor: "pointer", borderRadius: "4px 4px 0 0",
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

      {sem === 1 ? (
        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
          <div style={{ display: "flex", gap: 24, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ 8 Submitted</span>
            <span style={{ fontSize: 13, color: SLATE }}>0 Pending</span>
            <span style={{ fontSize: 13, color: SLATE }}>0 Overdue</span>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
            <thead>
              <tr style={{ backgroundColor: BG_TABLE }}>
                {["Subject", "Assignment Title", "Due Date", "Marks", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}
              </tr>
            </thead>
            <tbody>
              {sem1Assignments.map((a, i) => (
                <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                  <td style={{ ...td, fontWeight: 500 }}>{a.subject}</td>
                  <td style={td}>{a.title}</td>
                  <td style={td}>{a.due}</td>
                  <td style={{ ...td, fontWeight: 600 }}>{a.marks}</td>
                  <td style={td}><StatusBadge status={a.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : sem === 2 ? (
        <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
          {/* Summary */}
          <div style={{ display: "flex", gap: 24, padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT, flexWrap: "wrap" }}>
            <span style={{ fontSize: 13, color: GREEN, fontWeight: 600 }}>✓ {submittedCount} Submitted</span>
            <span style={{ fontSize: 13, color: AMBER, fontWeight: 600 }}>⏳ {pendingCount} Pending</span>
            <span style={{ fontSize: 13, color: RED, fontWeight: 600 }}>⚠ {overdueCount} Overdue</span>
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: 8, padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, flexWrap: "wrap" }}>
            {([
              { label: "All",       count: sem2Items.length },
              { label: "Submitted", count: submittedCount },
              { label: "Pending",   count: pendingCount },
              { label: "Overdue",   count: overdueCount },
            ] as const).map(({ label, count }) => (
              <button
                key={label}
                onClick={() => { setFilter(label as Filter); setSelectedNo(null); }}
                style={{
                  padding: "5px 14px", fontSize: 12, fontWeight: 600,
                  border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer",
                  backgroundColor: filter === label ? NAVY : WHITE,
                  color: filter === label ? "white" : TEXT_DARK, fontFamily: "inherit",
                }}
              >
                {label} ({count})
              </button>
            ))}
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["#", "Subject", "Assignment Title", "Due Date", "Type", "Status", ""].map((h) => (
                    <th key={h} style={{ ...th, ...(h === "" ? { width: 60 } : {}) }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredSem2.map((a, i) => {
                  const daysLeft = a.computedStatus === "Pending"
                    ? Math.ceil((a.dueDate.getTime() - PORTAL_DATE.getTime()) / 86400000)
                    : null;
                  const isSelected = selectedNo === a.no;
                  return (
                    <>
                      <tr
                        key={`row-${a.no}`}
                        onClick={() => toggleDetail(a.no)}
                        style={{
                          backgroundColor: isSelected ? "#e8eef4" : a.computedStatus === "Overdue" ? ERROR_LIGHT : i % 2 === 0 ? WHITE : BG_LIGHT,
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = BG_TABLE; }}
                        onMouseLeave={(e) => { if (!isSelected) (e.currentTarget as HTMLElement).style.backgroundColor = a.computedStatus === "Overdue" ? ERROR_LIGHT : i % 2 === 0 ? WHITE : BG_LIGHT; }}
                      >
                        <td style={{ ...td, color: SLATE }}>{a.no}</td>
                        <td style={{ ...td, fontWeight: 500 }}>{a.subject}</td>
                        <td style={td}>{a.title}</td>
                        <td style={{ ...td, color: a.computedStatus === "Pending" ? AMBER : a.computedStatus === "Overdue" ? RED : TEXT_DARK, fontWeight: a.computedStatus !== "Submitted" ? 600 : 400 }}>
                          {a.due}
                        </td>
                        <td style={td}>
                          <span style={{ padding: "2px 8px", backgroundColor: a.type === "Lab" ? BG_TABLE : INFO_BG, color: a.type === "Lab" ? SLATE : DARK_BLUE, borderRadius: 4, fontSize: 11, fontWeight: 600 }}>
                            {a.type}
                          </span>
                        </td>
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                            <StatusBadge status={a.computedStatus} />
                            {daysLeft !== null && (
                              <span style={{ fontSize: 11, fontWeight: 600, padding: "1px 7px", borderRadius: 4, backgroundColor: daysLeft <= 5 ? ERROR_BORDER : WARN_BG, color: daysLeft <= 5 ? RED : WARN_TEXT }}>
                                Due in {daysLeft} day{daysLeft !== 1 ? "s" : ""}
                              </span>
                            )}
                          </div>
                        </td>
                        <td style={{ ...td, textAlign: "center", color: isSelected ? NAVY : SLATE, fontWeight: 700, fontSize: 16 }}>
                          {isSelected ? "▲" : "▼"}
                        </td>
                      </tr>

                      {isSelected && selectedDetail && selectedAssignment && (
                        <tr key={`detail-${a.no}`}>
                          <td colSpan={7} style={{ padding: 0, border: `1px solid ${BORDER}` }}>
                            <DetailPanel
                              assignment={selectedAssignment}
                              detail={selectedDetail}
                              onSubmit={() => handleSubmitClick(selectedAssignment)}
                              onDownload={() => handleDownloadPDF(selectedAssignment)}
                              pdfLoading={pdfLoading}
                              submitTimestamp={submitTimestamps[a.no]}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : sem === 3 ? (
        <div>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 32, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Semester 3 Assignments</div>
            <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>Semester 3 begins <strong>July 6, 2026</strong>. {sem3Assignments.length} assignments are planned.</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem3Assignments.length}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>TOTAL ASSIGNMENTS</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem3Assignments.filter(a => a.type === "Lab").length}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>LAB WORK</div>
              </div>
            </div>
          </div>

          {/* Mini Project preview */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>🔬 Mini Project — {sem3Project.projectTitle}</div>
              <span style={{ fontSize: 10, padding: "2px 8px", backgroundColor: "#fef3c7", color: "#b45309", borderRadius: 3, fontWeight: 700 }}>UPCOMING</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT_DARK, marginBottom: 8 }}>{sem3Project.description}</div>
            <div style={{ fontSize: 12, color: SLATE }}>Guide: {sem3Project.guide} | Credits: {sem3Project.credits} | Submission: {sem3Project.submissionDate}</div>
          </div>

          {/* Assignment preview table */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <div style={{ padding: "10px 16px", backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 600, color: SLATE }}>UPCOMING ASSIGNMENT SCHEDULE</div>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["#", "Subject", "Assignment Title", "Due Date", "Type"].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem3Assignments.map((a, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, color: SLATE }}>{a.no}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{a.subject}</td>
                    <td style={td}>{a.title}</td>
                    <td style={{ ...td, color: AMBER, fontWeight: 600 }}>{a.due}</td>
                    <td style={td}>
                      <span style={{ padding: "2px 8px", backgroundColor: a.type === "Lab" ? BG_TABLE : INFO_BG, color: a.type === "Lab" ? SLATE : DARK_BLUE, borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{a.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 32, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Semester 4 Assignments & Dissertation</div>
            <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>Semester 4 begins <strong>January 5, 2027</strong>. Dissertation-focused semester.</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem4Assignments.length}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>TOTAL ASSIGNMENTS</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>12</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>DISSERTATION CREDITS</div>
              </div>
            </div>
          </div>

          {/* Dissertation preview */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>📖 Dissertation — {sem4Dissertation.projectTitle}</div>
              <span style={{ fontSize: 10, padding: "2px 8px", backgroundColor: "#fef3c7", color: "#b45309", borderRadius: 3, fontWeight: 700 }}>UPCOMING</span>
            </div>
            <div style={{ fontSize: 13, color: TEXT_DARK, marginBottom: 8 }}>{sem4Dissertation.description}</div>
            <div style={{ fontSize: 12, color: SLATE, marginBottom: 4 }}>Guide: {sem4Dissertation.guide} | Credits: {sem4Dissertation.credits}</div>
            <div style={{ fontSize: 12, color: SLATE }}>Target Publication: {sem4Dissertation.targetPublication}</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Milestones</div>
              {sem4Dissertation.milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: SLATE }}>
                  <span>{m.title}</span>
                  <span>{m.due}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Assignment preview table */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <div style={{ padding: "10px 16px", backgroundColor: BG_LIGHT, borderBottom: `1px solid ${BORDER}`, fontSize: 12, fontWeight: 600, color: SLATE }}>UPCOMING ASSIGNMENT SCHEDULE</div>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["#", "Subject", "Assignment Title", "Due Date", "Type"].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem4Assignments.map((a, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, color: SLATE }}>{a.no}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{a.subject}</td>
                    <td style={td}>{a.title}</td>
                    <td style={{ ...td, color: AMBER, fontWeight: 600 }}>{a.due}</td>
                    <td style={td}>
                      <span style={{ padding: "2px 8px", backgroundColor: a.type === "Lab" ? BG_TABLE : a.type === "Project" ? SUCCESS_BG : INFO_BG, color: a.type === "Lab" ? SLATE : a.type === "Project" ? GREEN : DARK_BLUE, borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{a.type}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailPanel({
  assignment, detail, onSubmit, onDownload, pdfLoading, submitTimestamp,
}: {
  assignment: Sem2Assignment;
  detail: AssignmentDetail;
  onSubmit: () => void;
  onDownload: () => void;
  pdfLoading: boolean;
  submitTimestamp?: string;
}) {
  return (
    <div style={{ backgroundColor: "#f8faff", borderTop: `3px solid ${NAVY}` }}>
      {/* Header */}
      <div style={{ backgroundColor: NAVY, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: "white", marginBottom: 4 }}>{assignment.title}</div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
            {assignment.subject} · {assignment.type} · Due: {assignment.due}
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <StatusBadge status={assignment.computedStatus} />
          {assignment.marks && (
            <span style={{ fontSize: 12, fontWeight: 700, color: "white", backgroundColor: "rgba(255,255,255,0.15)", padding: "4px 10px", borderRadius: 4 }}>
              {assignment.marks}
            </span>
          )}
        </div>
      </div>

      <div style={{ padding: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 20 }}>
          {/* Left column */}
          <div>
            {detail.labObjective && (
              <Section title="Lab Objective">
                <p style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.7, margin: 0 }}>{detail.labObjective}</p>
              </Section>
            )}
            {detail.labRequirements && (
              <Section title="Requirements & Tools">
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {detail.labRequirements.map((r: string, i: number) => <li key={i} style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.8 }}>{r}</li>)}
                </ul>
              </Section>
            )}
            {detail.labSteps && (
              <Section title="Step-by-Step Procedure">
                <ol style={{ margin: 0, paddingLeft: 20 }}>
                  {detail.labSteps.map((s: string, i: number) => <li key={i} style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.7, marginBottom: 6 }}>{s}</li>)}
                </ol>
              </Section>
            )}
            {detail.labExpectedOutput && (
              <Section title="Expected Output">
                <p style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.7, margin: 0 }}>{detail.labExpectedOutput}</p>
              </Section>
            )}
            {detail.viva && (
              <Section title="Viva Questions">
                {detail.viva.map((q: string, i: number) => (
                  <div key={i} style={{ marginBottom: 8, display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, flexShrink: 0 }}>Q{i + 1}.</span>
                    <span style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.6 }}>{q}</span>
                  </div>
                ))}
              </Section>
            )}
            {detail.questions && (
              <Section title="Questions">
                {detail.questions.map((q: AssignmentQuestion, i: number) => (
                  <div key={i} style={{ marginBottom: 12, padding: "10px 14px", backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 700, color: NAVY }}>Q{i + 1}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "white", backgroundColor: NAVY, padding: "2px 8px", borderRadius: 4, flexShrink: 0 }}>
                        {q.marks} mark{q.marks !== 1 ? "s" : ""}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13, color: TEXT_DARK, lineHeight: 1.7 }}>{q.q}</p>
                  </div>
                ))}
              </Section>
            )}
          </div>

          {/* Right column */}
          <div>
            <Section title="Marks Rubric">
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ backgroundColor: BG_TABLE }}>
                      {["Criteria", "Marks", "Description"].map((h) => (
                        <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase" as const, letterSpacing: "0.05em", border: `1px solid ${BORDER}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {detail.rubric.map((r: RubricRow, i: number) => (
                      <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                        <td style={{ padding: "8px 12px", fontWeight: 600, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{r.criteria}</td>
                        <td style={{ padding: "8px 12px", fontWeight: 700, color: NAVY, border: `1px solid ${BORDER}`, textAlign: "center" }}>{r.maxMarks}</td>
                        <td style={{ padding: "8px 12px", color: SLATE, border: `1px solid ${BORDER}` }}>{r.description}</td>
                      </tr>
                    ))}
                    <tr style={{ backgroundColor: NAVY }}>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "white", border: `1px solid ${BORDER}` }}>Total</td>
                      <td style={{ padding: "8px 12px", fontWeight: 700, color: "white", border: `1px solid ${BORDER}`, textAlign: "center" }}>{detail.rubric.reduce((s: number, r: RubricRow) => s + r.maxMarks, 0)}</td>
                      <td style={{ border: `1px solid ${BORDER}` }}></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Section>

            <Section title="References">
              {detail.references.map((ref: AssignmentReference, i: number) => (
                <div key={i} style={{ marginBottom: 10, padding: "10px 14px", backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, borderLeft: `3px solid ${NAVY}` }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: DARK_BLUE, marginBottom: 3 }}>{ref.label}</div>
                  <div style={{ fontSize: 12, color: SLATE }}>{ref.detail}</div>
                </div>
              ))}
            </Section>

            <Section title="Actions">
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
                {assignment.computedStatus === "Submitted" ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: GREEN }}>✓ Submitted</span>
                    {submitTimestamp && (
                      <span style={{ fontSize: 11, color: SLATE }}>Submitted on {submitTimestamp}</span>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={onSubmit}
                    style={{ backgroundColor: GREEN, color: "white", border: "none", borderRadius: 4, padding: "9px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
                  >
                    ✓ Submit Assignment
                  </button>
                )}
                <button
                  onClick={onDownload}
                  disabled={pdfLoading}
                  style={{
                    backgroundColor: pdfLoading ? BG_TABLE : NAVY, color: pdfLoading ? SLATE : "white",
                    border: "none", borderRadius: 4, padding: "9px 20px", fontSize: 13, fontWeight: 600,
                    cursor: pdfLoading ? "not-allowed" : "pointer", fontFamily: "inherit",
                  }}
                >
                  {pdfLoading ? "Generating…" : "↓ Download Assignment PDF"}
                </button>
              </div>
            </Section>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: NAVY, textTransform: "uppercase" as const, letterSpacing: "0.08em", borderBottom: `2px solid ${NAVY}`, paddingBottom: 4, marginBottom: 12 }}>
        {title}
      </div>
      {children}
    </div>
  );
}
