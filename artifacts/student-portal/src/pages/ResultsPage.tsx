import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatusBadge from "../components/StatusBadge";
import {
  sem1ExamSchedule, sem2MidtermResults, sem1IA1, sem1IA2,
  sem1TheoryResults, sem1PracticalResults, sem1ResultSummary,
  sem2TheoryResults, sem2PracticalResults, sem2ResultSummary,
  sem3Subjects, sem4Subjects, sem3IASchedule, sem4IASchedule,
  sem3Project, sem4Dissertation,
  student
} from "../data/studentData";
import {
  NAVY, BLUE, GREEN, AMBER, PURPLE, SLATE, WHITE, BORDER, TEXT_DARK,
  BG_LIGHT, BG_TABLE, PURPLE_LIGHT, PURPLE_BORDER, SUCCESS_BG, SLATE_LIGHT,
} from "../constants";
import { generateMarksheet } from "../utils/generateMarksheet";

function getGrade(score: number) {
  if (score >= 90) return "O";
  if (score >= 80) return "A+";
  if (score >= 70) return "A";
  if (score >= 60) return "B+";
  if (score >= 50) return "B";
  return "F";
}

function getIAGrade(score: number, max: number) {
  const pct = (score / max) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 75) return "A";
  if (pct >= 60) return "B+";
  return "B";
}

const sem2Avg  = Math.round(sem2MidtermResults.reduce((s, r) => s + r.score, 0) / sem2MidtermResults.length);
const sem2High = Math.max(...sem2MidtermResults.map((r) => r.score));
const sem2Low  = Math.min(...sem2MidtermResults.map((r) => r.score));

const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 13, fontWeight: 600,
  color: WHITE, backgroundColor: NAVY, border: `1px solid ${BORDER}`,
};

const td: React.CSSProperties = {
  padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}`,
};

/* ── UI Components ───────────────────────────────────────────────────────── */

function SectionHeader({ title, subtitle, status }: { title: string; subtitle?: string; status?: string }) {
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      borderBottom: `2px solid ${NAVY}`, borderLeft: `4px solid ${NAVY}`,
      padding: "12px 16px", marginBottom: 16, backgroundColor: WHITE
    }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NAVY }}>{title}</div>
        {subtitle && <div style={{ fontSize: 12, color: SLATE, marginTop: 2 }}>{subtitle}</div>}
      </div>
      {status && (
        <div style={{
          padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700,
          backgroundColor: (status === "Completed" || status === "Appeared") ? "#dcfce7" : "#ede9fe",
          color: (status === "Completed" || status === "Appeared") ? GREEN : PURPLE,
          textTransform: "uppercase", letterSpacing: "0.04em"
        }}>
          {status}
        </div>
      )}
    </div>
  );
}

function SectionCard({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4,
      padding: 20, marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      ...style
    }}>
      {children}
    </div>
  );
}

function IAAverageKPI({ score, max }: { score: number; max: number }) {
  return (
    <div style={{
      backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 4,
      padding: "8px 16px", display: "inline-block", marginBottom: 12
    }}>
      <div style={{ fontSize: 11, color: SLATE, textTransform: "uppercase", letterSpacing: "0.04em" }}>Average</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: NAVY }}>{score} / {max}</div>
    </div>
  );
}



const sem1TheorySubjects = sem1ExamSchedule.filter((e) => e.type === "Theory");
const sem1PracticalSubjects = sem1ExamSchedule.filter((e) => e.type === "Practical");

const sem2PreFinalSchedule = [
  { subject: "Advanced Machine Learning",   date: "Apr 21, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-101", invigilatorCode: "INV-A01" },
  { subject: "Deep Learning",               date: "Apr 22, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-102", invigilatorCode: "INV-A02" },
  { subject: "Natural Language Processing", date: "Apr 23, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-103", invigilatorCode: "INV-A03" },
  { subject: "Computer Vision",             date: "Apr 24, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-104", invigilatorCode: "INV-A04" },
  { subject: "Data Analytics",              date: "Apr 27, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-105", invigilatorCode: "INV-A05" },
  { subject: "Cloud Computing",             date: "Apr 28, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-106", invigilatorCode: "INV-A06" },
  { subject: "Advanced Algorithms",         date: "Apr 29, 2026", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall A-107", invigilatorCode: "INV-A07" },
];

const sem1PreFinalSchedule = [
  { subject: "Data Structures",             date: "Nov 17, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-201", invigilatorCode: "INV-B01" },
  { subject: "Computer Networks",           date: "Nov 18, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-202", invigilatorCode: "INV-B02" },
  { subject: "Database Mgmt Systems",       date: "Nov 19, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-203", invigilatorCode: "INV-B03" },
  { subject: "Operating Systems",           date: "Nov 20, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-204", invigilatorCode: "INV-B04" },
  { subject: "Software Engineering",        date: "Nov 21, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-205", invigilatorCode: "INV-B05" },
  { subject: "Web Technologies",            date: "Nov 24, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-206", invigilatorCode: "INV-B06" },
  { subject: "Python Programming",          date: "Nov 25, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-207", invigilatorCode: "INV-B07" },
  { subject: "Mathematics for Computing",   date: "Nov 26, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Hall B-208", invigilatorCode: "INV-B08" },
];

const sem1FinalSchedule = [
  { subject: "Data Structures",             date: "Dec 9, 2025",  time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-301", invigilatorCode: "INV-C01" },
  { subject: "Computer Networks",           date: "Dec 10, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-302", invigilatorCode: "INV-C02" },
  { subject: "Database Mgmt Systems",       date: "Dec 11, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-303", invigilatorCode: "INV-C03" },
  { subject: "Operating Systems",           date: "Dec 12, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-304", invigilatorCode: "INV-C04" },
  { subject: "Software Engineering",        date: "Dec 13, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-305", invigilatorCode: "INV-C05" },
  { subject: "Web Technologies",            date: "Dec 16, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-306", invigilatorCode: "INV-C06" },
  { subject: "Python Programming",          date: "Dec 17, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-307", invigilatorCode: "INV-C07" },
  { subject: "Mathematics for Computing",   date: "Dec 18, 2025", time: "9:00 AM – 12:00 PM", duration: "3 Hours", room: "Exam Hall C-308", invigilatorCode: "INV-C08" },
];

const sem2PracticalSchedule = [
  { subject: "Deep Learning",               date: "May 25, 2026", time: "9:00 AM – 1:00 PM", duration: "4 Hours", room: "Lab 5" },
  { subject: "Computer Vision",             date: "May 26, 2026", time: "9:00 AM – 1:00 PM", duration: "4 Hours", room: "Lab 5" },
  { subject: "Cloud Computing",             date: "May 27, 2026", time: "9:00 AM – 1:00 PM", duration: "4 Hours", room: "Lab 4" },
  { subject: "Data Analytics",              date: "May 28, 2026", time: "9:00 AM – 1:00 PM", duration: "4 Hours", room: "Lab 4" },
];

const gradeScale80  = "80–100 = A+ | 70–79 = A | 60–69 = B+ | 50–59 = B | <50 = F";
const gradeScaleIA  = "90–100% = A+ | 75–89% = A | 60–74% = B+ | <60% = B";

function ResultSheet({ semNumber }: { semNumber: number }) {
  const theoryResults = semNumber === 1 ? sem1TheoryResults : sem2TheoryResults;
  const practicalResults = semNumber === 1 ? sem1PracticalResults : sem2PracticalResults;
  const summary = semNumber === 1 ? sem1ResultSummary : sem2ResultSummary;
  
  const headers = [
    "Sl.No.", "Course Code", "Course Name", "Max Marks", "Min Marks",
    "SEE Marks", "IA Marks", "Marks Scored", "Credits", "Grade",
    "Credit Points", "Letter Grade", "Status"
  ];

  const headerCellStyle: React.CSSProperties = {
    backgroundColor: NAVY, color: WHITE, padding: "10px 8px", fontSize: "12px",
    fontWeight: "bold", border: `1px solid ${BORDER}`, textAlign: "center"
  };
  
  const dataCellStyle: React.CSSProperties = {
    padding: "10px 8px", fontSize: "13px", border: `1px solid ${BORDER}`,
    textAlign: "center", color: TEXT_DARK
  };

  const nameCellStyle: React.CSSProperties = {
    ...dataCellStyle, textAlign: "left", fontWeight: 500, minWidth: "180px"
  };

  const awaitedCellStyle: React.CSSProperties = {
    ...dataCellStyle, color: "#94a3b8", fontStyle: "italic"
  };

  const getIAAvg = (subjectName: string) => {
    if (semNumber !== 1) return 0;
    const s1 = sem1IA1.subjects.find(s => s.name === subjectName)?.score || 0;
    const s2 = sem1IA2.subjects.find(s => s.name === subjectName)?.score || 0;
    return ((s1 + s2) / 2).toFixed(1);
  };

  const getLetterGradeColor = (grade: string) => {
    if (grade.startsWith("A+")) return GREEN;
    if (grade.startsWith("A")) return BLUE;
    if (grade.startsWith("B+")) return AMBER;
    return SLATE;
  };

  return (
    <div style={{ marginBottom: 24 }}>
      {/* SECTION HEADER */}
      <div style={{
        backgroundColor: NAVY, color: WHITE, padding: "10px 16px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        borderRadius: "4px 4px 0 0"
      }}>
        <div style={{ fontWeight: "bold", fontSize: "15px" }}>SEMESTER RESULT SHEET</div>
        <div style={{
          backgroundColor: BLUE, padding: "4px 10px", borderRadius: "4px",
          fontSize: "12px", fontWeight: "bold"
        }}>
          Semester {semNumber} — 2025-26
        </div>
      </div>

      {/* META INFO ROW */}
      <div style={{ backgroundColor: "#f8fafc", borderBottom: `1px solid ${BORDER}`, padding: "12px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "12px" }}>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Exam Month:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>
              {semNumber === 1 ? "January 2026" : "June 2026"}
            </div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Exam Type:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>Regular Exam</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Program Level:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>PG</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Program Name:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>Master of Computer Applications</div>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Student Reg No:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>{student.rollNo}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Student Name:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>{student.name}</div>
          </div>
          <div>
            <div style={{ fontSize: "11px", color: SLATE }}>Specialization:</div>
            <div style={{ fontSize: "13px", fontWeight: "bold", color: TEXT_DARK }}>AI / ML</div>
          </div>
          <div />
        </div>
      </div>

      <div style={{ padding: "16px", backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderTop: "none" }}>
        {/* THEORY TABLE */}
        <div style={{ fontSize: "13px", fontWeight: "bold", color: NAVY, marginBottom: "8px" }}>Theory Subjects</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: "50px" }}>Sl.No.</th>
                <th style={{ ...headerCellStyle, width: "100px" }}>Course Code</th>
                <th style={{ ...headerCellStyle, textAlign: "left" }}>Course Name</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Max Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Min Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>SEE Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>IA Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Marks Scored</th>
                <th style={{ ...headerCellStyle, width: "60px" }}>Credits</th>
                <th style={{ ...headerCellStyle, width: "60px" }}>Grade</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Credit Points</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Letter Grade</th>
                <th style={{ ...headerCellStyle, width: "90px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {theoryResults.map((r, i) => (
                <tr key={r.slNo} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                  <td style={dataCellStyle}>{r.slNo}</td>
                  <td style={dataCellStyle}>{r.courseCode}</td>
                  <td style={nameCellStyle}>{r.courseName}</td>
                  <td style={dataCellStyle}>{r.maxMarks}</td>
                  <td style={dataCellStyle}>{r.minMarks}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.seeMarks}</td>
                  <td style={dataCellStyle}>{semNumber === 1 ? getIAAvg(r.courseName) : r.iaMarks}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.marksScored}</td>
                  <td style={dataCellStyle}>{r.credits}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.grade}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.creditPoints}</td>
                  <td style={{ ...(r.status === "Awaited" ? awaitedCellStyle : dataCellStyle), fontWeight: "bold", color: r.status === "Awaited" ? "#94a3b8" : getLetterGradeColor(r.letterGrade) }}>{r.letterGrade}</td>
                  <td style={dataCellStyle}>
                    <span style={{
                      backgroundColor: r.status === "Awaited" ? "#ede9fe" : "#dcfce7",
                      color: r.status === "Awaited" ? "#7c3aed" : "#16a34a",
                      padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold"
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* PRACTICAL TABLE */}
        <div style={{ fontSize: "13px", fontWeight: "bold", color: NAVY, marginTop: "24px", marginBottom: "8px" }}>Practical / Lab Subjects</div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "900px" }}>
            <thead>
              <tr>
                <th style={{ ...headerCellStyle, width: "50px" }}>Sl.No.</th>
                <th style={{ ...headerCellStyle, width: "100px" }}>Course Code</th>
                <th style={{ ...headerCellStyle, textAlign: "left" }}>Course Name</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Max Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Min Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>SEE Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>IA Marks</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Marks Scored</th>
                <th style={{ ...headerCellStyle, width: "60px" }}>Credits</th>
                <th style={{ ...headerCellStyle, width: "60px" }}>Grade</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Credit Points</th>
                <th style={{ ...headerCellStyle, width: "80px" }}>Letter Grade</th>
                <th style={{ ...headerCellStyle, width: "90px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {practicalResults.map((r, i) => (
                <tr key={r.slNo} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                  <td style={dataCellStyle}>{r.slNo}</td>
                  <td style={dataCellStyle}>{r.courseCode}</td>
                  <td style={nameCellStyle}>{r.courseName}</td>
                  <td style={dataCellStyle}>{r.maxMarks}</td>
                  <td style={dataCellStyle}>{r.minMarks}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.seeMarks}</td>
                  <td style={dataCellStyle}>{r.isPractical ? "—" : r.iaMarks}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.marksScored}</td>
                  <td style={dataCellStyle}>{r.credits}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.grade}</td>
                  <td style={r.status === "Awaited" ? awaitedCellStyle : dataCellStyle}>{r.status === "Awaited" ? "—" : r.creditPoints}</td>
                  <td style={{ ...(r.status === "Awaited" ? awaitedCellStyle : dataCellStyle), fontWeight: "bold", color: r.status === "Awaited" ? "#94a3b8" : getLetterGradeColor(r.letterGrade) }}>{r.letterGrade}</td>
                  <td style={dataCellStyle}>
                    <span style={{
                      backgroundColor: r.status === "Awaited" ? "#ede9fe" : "#dcfce7",
                      color: r.status === "Awaited" ? "#7c3aed" : "#16a34a",
                      padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold"
                    }}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUMMARY FOOTER */}
      {summary.result === "Awaited" || summary.result === "In Progress" ? (
        <div style={{
          backgroundColor: "#ede9fe", border: `1px solid #7c3aed`,
          borderLeft: `4px solid #7c3aed`, borderRadius: "0 0 4px 4px",
          padding: "14px 18px", display: "flex", flexDirection: "column", gap: "4px",
          marginTop: 8
        }}>
          <div style={{ fontWeight: "bold", color: "#7c3aed", fontSize: "14px" }}>
            ⏳ Result Status: {summary.result.toUpperCase()}
          </div>
          <div style={{ fontSize: "13px", color: "#4c1d95" }}>
            Final examination results will be published after {semNumber === 1 ? "April 2026" : "June 2026"}
          </div>
        </div>
      ) : (
        <div style={{
          backgroundColor: '#1a3a5c', color: 'white',
          padding: '12px 20px', borderRadius: '0 0 4px 4px',
          display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap',
          gap: '12px', marginTop: 8
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Result</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{summary.result}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>SGPA</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#c8a84b' }}>{summary.sgpa}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>CGPA</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold', color: '#c8a84b' }}>{summary.cgpa}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Credits</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{summary.totalCredits}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Credit Points</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{summary.totalCreditPoints}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Term Grade</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{summary.termGrade?.split(' ')[0]}</span>
          </div>
          <div style={{ width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Class</span>
            <span style={{ fontSize: '15px', fontWeight: 'bold' }}>{summary.class}</span>
          </div>
        </div>
      )}

      {/* FOOTNOTE */}
      <div style={{ textAlign: "center", color: SLATE, fontSize: "11px", marginTop: "12px", lineHeight: '1.6' }}>
        <div>Theory: 90-100=A+(10pts) | 80-89=A(9pts) | 70-79=B+(8pts) | 60-69=B(7pts)</div>
        <div>Practical: 45-50=A+(10pts) | 40-44=A(9pts) | 35-39=B+(8pts)</div>
        <div style={{ marginTop: 4, opacity: 0.8 }}>
          SEE = Semester End Exam (max 60 theory / 50 practical) | IA = Internal Assessment (max 40)
        </div>
      </div>
    </div>
  );
}

export default function ResultsPage() {
  const [sem, setSem] = useState(2);


  return (
    <div style={{ padding: "0 16px" }}>
      <h1 style={{
        fontSize: 22, fontWeight: 700, color: NAVY, margin: "0 0 20px 0",
        borderBottom: `2px solid ${AMBER}`, paddingBottom: 8
      }}>
        Examination Results
      </h1>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 24, flexWrap: "wrap" }}>
        {[
          { val: 1, label: "Semester 1", tag: "SGPA 9.11" },
          { val: 2, label: "Semester 2", tag: "In Progress" },
          { val: 3, label: "Semester 3", tag: "Upcoming" },
          { val: 4, label: "Semester 4", tag: "Upcoming" },
        ].map((s) => (
          <button
            key={s.val}
            onClick={() => setSem(s.val)}
            style={{
              padding: "8px 16px", fontSize: 14, fontWeight: 600,
              backgroundColor: sem === s.val ? NAVY : WHITE,
              color: sem === s.val ? WHITE : NAVY,
              border: sem === s.val ? "none" : `1px solid ${NAVY}`,
              cursor: "pointer", borderRadius: 4, marginRight: 8, marginBottom: 4,
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {s.label}
            {s.tag === "Upcoming" && (
              <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 3, backgroundColor: sem === s.val ? AMBER : "#fef3c7", color: sem === s.val ? "white" : "#b45309" }}>
                UPCOMING
              </span>
            )}
          </button>
        ))}
      </div>

      {sem === 1 ? (
        <div>
          {/* Download Report */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
            <button
              className="no-print"
              onClick={() => generateMarksheet(1)}
              style={{
                background: NAVY, color: WHITE, border: 'none',
                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600
              }}
            >
              ↓ Download Sem 1 Academic Report (PDF)
            </button>
          </div>

          <SectionCard>
            <SectionHeader
              title="Internal Assessment 1"
              subtitle={`Period: ${sem1IA1.period} | Max Marks: ${sem1IA1.maxMarks}`}
              status="Completed"
            />
            <IAAverageKPI score={sem1IA1.average} max={sem1IA1.maxMarks} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                <thead>
                  <tr>
                    <th style={{ ...th, width: "45%" }}>Subject</th>
                    <th style={{ ...th, width: "20%", textAlign: "center" }}>Score</th>
                    <th style={{ ...th, width: "20%", textAlign: "center" }}>Out of</th>
                    <th style={{ ...th, width: "15%", textAlign: "center" }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem1IA1.subjects.map((s, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                      <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                      <td style={{ ...td, fontWeight: 700, textAlign: "center" }}>{s.score}</td>
                      <td style={{ ...td, color: SLATE, textAlign: "center" }}>{sem1IA1.maxMarks}</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{
                          color: getIAGrade(s.score, sem1IA1.maxMarks) === "A+" ? GREEN :
                                 getIAGrade(s.score, sem1IA1.maxMarks) === "A"  ? BLUE : AMBER,
                          fontWeight: 700
                        }}>
                          {getIAGrade(s.score, sem1IA1.maxMarks)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Internal Assessment 2"
              subtitle={`Period: ${sem1IA2.period} | Max Marks: ${sem1IA2.maxMarks}`}
              status="Completed"
            />
            <IAAverageKPI score={sem1IA2.average} max={sem1IA2.maxMarks} />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "500px" }}>
                <thead>
                  <tr>
                    <th style={{ ...th, width: "45%" }}>Subject</th>
                    <th style={{ ...th, width: "20%", textAlign: "center" }}>Score</th>
                    <th style={{ ...th, width: "20%", textAlign: "center" }}>Out of</th>
                    <th style={{ ...th, width: "15%", textAlign: "center" }}>Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {sem1IA2.subjects.map((s, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                      <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                      <td style={{ ...td, fontWeight: 700, textAlign: "center" }}>{s.score}</td>
                      <td style={{ ...td, color: SLATE, textAlign: "center" }}>{sem1IA2.maxMarks}</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{
                          color: (getIAGrade(s.score, sem1IA2.maxMarks) === "A+" || ["A+", "A"].includes(getIAGrade(s.score, sem1IA2.maxMarks))) ?
                                 (getIAGrade(s.score, sem1IA2.maxMarks) === "A+" ? GREEN : BLUE) : AMBER,
                          fontWeight: 700
                        }}>
                          {getIAGrade(s.score, sem1IA2.maxMarks)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <ResultSheet semNumber={1} />

          <SectionCard>
            <SectionHeader title="Admit Cards" subtitle="Exams Conducted" status="Appeared" />
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Theory Examinations"
              subtitle="Dec 9–18, 2025 | Max Marks: 100"
              status="Appeared"
            />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={th}>Subject</th>
                    <th style={{ ...th, width: "120px", textAlign: "center" }}>Exam Date</th>
                    <th style={{ ...th, width: "140px", textAlign: "center" }}>Time</th>
                    <th style={{ ...th, width: "80px", textAlign: "center" }}>Room</th>
                    <th style={{ ...th, width: "90px", textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sem1ExamSchedule.filter(e => e.type === "Theory").map((e, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                      <td style={{ ...td, fontWeight: 500 }}>{e.subject}</td>
                      <td style={{ ...td, textAlign: "center" }}>{e.date}</td>
                      <td style={{ ...td, textAlign: "center" }}>{
                        e.subject === "Database Management Systems" ? "2:00 PM – 5:00 PM" : "10:00 AM – 1:00 PM"
                      }</td>
                      <td style={{ ...td, textAlign: "center" }}>{
                        ["Mathematics for Computing", "Database Management Systems"].includes(e.subject) ? "Hall C" :
                        ["Operating Systems", "Web Technologies"].includes(e.subject) ? "Hall B" : "Hall A"
                      }</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{ fontSize: 11, padding: "2px 8px", backgroundColor: "#dcfce7", color: GREEN, borderRadius: 4, fontWeight: 700 }}>Appeared</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <SectionCard>
            <SectionHeader
              title="Practical Examinations"
              subtitle="Jan 16–17, 2026"
              status="Appeared"
            />
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px" }}>
                <thead>
                  <tr>
                    <th style={th}>Subject</th>
                    <th style={{ ...th, width: "120px", textAlign: "center" }}>Exam Date</th>
                    <th style={{ ...th, width: "140px", textAlign: "center" }}>Time</th>
                    <th style={{ ...th, width: "80px", textAlign: "center" }}>Room</th>
                    <th style={{ ...th, width: "90px", textAlign: "center" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sem1ExamSchedule.filter(e => e.type === "Practical").map((e, i) => (
                    <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : "#f8fafc" }}>
                      <td style={{ ...td, fontWeight: 500 }}>{e.subject}</td>
                      <td style={{ ...td, textAlign: "center" }}>{e.date}</td>
                      <td style={{ ...td, textAlign: "center" }}>{
                        e.subject === "Web Technologies Lab" ? "2:00 PM – 5:00 PM" : "9:00 AM – 12:00 PM"
                      }</td>
                      <td style={{ ...td, textAlign: "center" }}>{
                        e.subject === "Python Programming Lab" ? "Lab 3" :
                        e.subject === "Web Technologies Lab" ? "Lab 2" : "Lab 1"
                      }</td>
                      <td style={{ ...td, textAlign: "center" }}>
                        <span style={{ fontSize: 11, padding: "2px 8px", backgroundColor: "#dcfce7", color: GREEN, borderRadius: 4, fontWeight: 700 }}>Appeared</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          <div style={{ backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "12px 16px", fontSize: 13, color: SLATE }}>
            ℹ Final Semester 1 result will be declared after all results are processed.
          </div>
        </div>
      ) : sem === 2 ? (
        /* ── SEMESTER 2 ──────────────────────────────────────────────── */
        <div>
          {/* Download Report */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
            <button
              className="no-print"
              onClick={() => generateMarksheet(2)}
              style={{
                background: '#1a3a5c', color: '#fff', border: 'none',
                padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600
              }}
            >
              ↓ Download Sem 2 Academic Report (PDF)
            </button>
          </div>

          {/* Mid-term Results */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK }}>Mid-term Examination Results</div>
                <div style={{ fontSize: 12, color: SLATE, marginTop: 2 }}>Conducted: March 17–25, 2026</div>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <StatusBadge status="Published" />
              </div>
            </div>

            {/* Summary KPIs */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
              {[
                { label: "Average Score", value: `${sem2Avg}/100`, border: GREEN },
                { label: "Highest Score", value: `${sem2High}/100`, border: BLUE },
                { label: "Lowest Score",  value: `${sem2Low}/100`,  border: AMBER },
              ].map((k) => (
                <div key={k.label} style={{ padding: 12, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${k.border}`, borderRadius: 4 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK }}>{k.value}</div>
                  <div style={{ fontSize: 11, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{k.label}</div>
                </div>
              ))}
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Subject", "Faculty", "Exam Date", "Score (/100)", "Grade"].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem2MidtermResults.map((r, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, fontWeight: 500 }}>{r.subject}</td>
                    <td style={{ ...td, color: SLATE }}>{r.faculty}</td>
                    <td style={td}>{r.date}</td>
                    <td style={{ ...td, fontWeight: 700 }}>{r.score}</td>
                    <td style={td}><span style={{ padding: "2px 10px", backgroundColor: SUCCESS_BG, color: GREEN, borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{getGrade(r.score)}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Score Distribution</div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={sem2MidtermResults.map((r) => ({
                  name: r.subject.replace("Advanced ", "Adv. ").replace("Natural Language Processing", "NLP").replace("Computer Vision", "Comp. Vision"),
                  score: r.score,
                }))}
                layout="vertical"
                margin={{ top: 0, right: 20, left: 100, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={BORDER} horizontal={false} />
                <XAxis type="number" domain={[70, 100]} tick={{ fontSize: 11, fill: SLATE }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: SLATE }} width={100} />
                <Tooltip formatter={(v) => [`${v}/100`, "Score"]} contentStyle={{ fontSize: 12 }} />
                <Bar dataKey="score" fill={BLUE} radius={0} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ marginTop: 10, fontSize: 11, color: SLATE }}>
              Grade Scale: 90–100 = O | 80–89 = A+ | 70–79 = A | 60–69 = B+ | 50–59 = B | &lt;50 = F
            </div>
          </div>

          {/* GPA notice */}
          <div style={{ backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: SLATE }}>
            ℹ Final GPA will be calculated after all exams are completed.
          </div>

          <ResultSheet semNumber={2} />

          {/* Admit Cards */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK, marginBottom: 12 }}>Admit Cards</div>
            <div style={{ color: SLATE, fontSize: 13 }}>Upcoming Exams</div>
          </div>

          {/* Pre-final */}
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK }}>Pre-final Examinations</div>
                <div style={{ fontSize: 13, color: SLATE, marginTop: 4 }}>Scheduled: April 21–29, 2026</div>
              </div>
              <StatusBadge status="Upcoming" />
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Subject", "Scheduled Date", "Score"].map((h) => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem2PreFinalSchedule.map(({ subject, date }, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, fontWeight: 500 }}>{subject}</td>
                    <td style={td}>{date}</td>
                    <td style={td}><span style={{ fontSize: 12, color: SLATE }}>—</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Final + Practical */}
          {[
            { title: "Final Examinations", date: "May 11–19, 2026" },
            { title: "Practical Examinations", date: "May 25–28, 2026" },
          ].map((section) => (
            <div key={section.title} style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: TEXT_DARK }}>{section.title}</div>
                  <div style={{ fontSize: 13, color: SLATE, marginTop: 4 }}>Scheduled: {section.date}</div>
                </div>
                <span style={{ fontSize: 12, padding: "4px 10px", backgroundColor: BG_TABLE, color: SLATE, borderRadius: 4, fontWeight: 600 }}>Not Yet Conducted</span>
              </div>
            </div>
          ))}
        </div>
      ) : sem === 3 ? (
        <div>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 32, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Semester 3 Results</div>
            <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>Semester 3 begins <strong>July 6, 2026</strong>. Results will be available after exams.</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem3Subjects.length}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>SUBJECTS</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem3Subjects.reduce((s, c) => s + c.credits, 0)}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>CREDITS</div>
              </div>
            </div>
          </div>

          {/* Exam schedule preview */}
          <SectionCard>
            <SectionHeader title="Examination Schedule (Tentative)" subtitle="Semester 3" status="Upcoming" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
              {[
                { label: "IA 1", period: `${sem3IASchedule.ia1.start} – ${sem3IASchedule.ia1.end}` },
                { label: "IA 2", period: `${sem3IASchedule.ia2.start} – ${sem3IASchedule.ia2.end}` },
                { label: "Pre-Final", period: `${sem3IASchedule.preFinal.start} – ${sem3IASchedule.preFinal.end}` },
                { label: "Theory Exams", period: `${sem3IASchedule.theoryExams.start} – ${sem3IASchedule.theoryExams.end}` },
                { label: "Practical Exams", period: `${sem3IASchedule.practicalExams.start} – ${sem3IASchedule.practicalExams.end}` },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: BG_LIGHT, padding: "10px 14px", borderRadius: 4, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: SLATE, marginTop: 4 }}>{item.period}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Mini Project */}
          <SectionCard>
            <SectionHeader title="Mini Project — MCAC399" subtitle={sem3Project.projectTitle} status="Upcoming" />
            <div style={{ fontSize: 13, color: TEXT_DARK, marginBottom: 8 }}>{sem3Project.description}</div>
            <div style={{ fontSize: 12, color: SLATE }}>
              Guide: <strong>{sem3Project.guide}</strong>{sem3Project.coGuide ? ` | Co-Guide: ${sem3Project.coGuide}` : ""} | Credits: {sem3Project.credits}
            </div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Milestones</div>
              {sem3Project.milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: SLATE }}>
                  <span>{m.title}</span>
                  <span>{m.due}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Subject list */}
          <SectionCard>
            <SectionHeader title="Enrolled Subjects" subtitle="Semester 3" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Code", "Subject", "Faculty", "Credits", "Type"].map(h => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem3Subjects.map((s, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{s.code}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ ...td, color: SLATE }}>{s.faculty}</td>
                    <td style={{ ...td, textAlign: "center" }}>{s.credits}</td>
                    <td style={td}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3, backgroundColor: s.type === "Theory" ? "#dbeafe" : "#dcfce7", color: s.type === "Theory" ? "#1e40af" : "#166534" }}>
                        {s.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>
      ) : (
        <div>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 8, padding: 32, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: NAVY, marginBottom: 8 }}>Semester 4 — Final Semester</div>
            <div style={{ fontSize: 14, color: SLATE, marginBottom: 16 }}>Semester 4 begins <strong>January 5, 2027</strong>. Dissertation-heavy semester.</div>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem4Subjects.length}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>SUBJECTS</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>{sem4Subjects.reduce((s, c) => s + c.credits, 0)}</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>CREDITS</div>
              </div>
              <div style={{ textAlign: "center", padding: "10px 20px", backgroundColor: WHITE, borderRadius: 4, border: `1px solid ${BORDER}` }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: NAVY }}>12</div>
                <div style={{ fontSize: 10, color: SLATE, marginTop: 2 }}>DISSERTATION CREDITS</div>
              </div>
            </div>
          </div>

          {/* Dissertation */}
          <SectionCard>
            <SectionHeader title="Dissertation / Major Project — MCAD499" subtitle={sem4Dissertation.projectTitle} status="Upcoming" />
            <div style={{ fontSize: 13, color: TEXT_DARK, marginBottom: 8 }}>{sem4Dissertation.description}</div>
            <div style={{ fontSize: 12, color: SLATE, marginBottom: 4 }}>Guide: <strong>{sem4Dissertation.guide}</strong> | Co-Guide: {sem4Dissertation.coGuide}</div>
            <div style={{ fontSize: 12, color: SLATE, marginBottom: 4 }}>Target Publication: <strong>{sem4Dissertation.targetPublication}</strong></div>
            <div style={{ fontSize: 12, color: SLATE }}>Credits: {sem4Dissertation.credits} | Viva: {sem4Dissertation.vivaDate}</div>
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: NAVY, marginBottom: 6 }}>Milestones</div>
              {sem4Dissertation.milestones.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 12, color: SLATE }}>
                  <span>{m.title}</span>
                  <span>{m.due}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Exam Schedule */}
          <SectionCard>
            <SectionHeader title="Examination Schedule (Tentative)" subtitle="Semester 4" status="Upcoming" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 12 }}>
              {[
                { label: "IA 1", period: `${sem4IASchedule.ia1.start} – ${sem4IASchedule.ia1.end}` },
                { label: "IA 2", period: `${sem4IASchedule.ia2.start} – ${sem4IASchedule.ia2.end}` },
                { label: "Theory Final Exams", period: `${sem4IASchedule.theoryExams.start} – ${sem4IASchedule.theoryExams.end}` },
                { label: "Practical Exams", period: `${sem4IASchedule.practicalExams.start} – ${sem4IASchedule.practicalExams.end}` },
                { label: "Dissertation Viva", period: `${sem4IASchedule.projectViva.start} – ${sem4IASchedule.projectViva.end}` },
              ].map((item) => (
                <div key={item.label} style={{ backgroundColor: BG_LIGHT, padding: "10px 14px", borderRadius: 4, border: `1px solid ${BORDER}` }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>{item.label}</div>
                  <div style={{ fontSize: 12, color: SLATE, marginTop: 4 }}>{item.period}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Subject list */}
          <SectionCard>
            <SectionHeader title="Enrolled Subjects" subtitle="Semester 4" />
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Code", "Subject", "Faculty", "Credits", "Type"].map(h => <th key={h} style={th}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {sem4Subjects.map((s, i) => (
                  <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, fontFamily: "monospace", fontSize: 12 }}>{s.code}</td>
                    <td style={{ ...td, fontWeight: 500 }}>{s.name}</td>
                    <td style={{ ...td, color: SLATE }}>{s.faculty}</td>
                    <td style={{ ...td, textAlign: "center" }}>{s.credits}</td>
                    <td style={td}>
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 6px", borderRadius: 3, backgroundColor: s.type === "Theory" ? "#dbeafe" : "#dcfce7", color: s.type === "Theory" ? "#1e40af" : "#166534" }}>
                        {s.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        </div>
      )}
    </div>
  );
}
