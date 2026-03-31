import { useState, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatusBadge from "../components/StatusBadge";
import { student, semesterTimeline, sem2MidtermResults, offerLetterData } from "../data/studentData";
import { useIsMobile } from "../hooks/use-mobile";
import { NAVY, GOLD, BLUE, GREEN, AMBER, DARK_BLUE, SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE, INFO_BG } from "../constants";
import { downloadOfferLetter } from "../utils/generateOfferLetter";

const RED = "#dc2626";

const Card = ({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) => (
  <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", ...style }}>
    {children}
  </div>
);

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${BORDER}` }}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div style={{ fontSize: 16, fontWeight: 600, color: TEXT_DARK, borderBottom: `1px solid ${BORDER}`, paddingBottom: 12, marginBottom: 16 }}>
    {children}
  </div>
);

const Row = ({ label, value, i }: { label: string; value: string; i: number }) => (
  <tr style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
    <td style={{ padding: "8px 10px", fontSize: 11, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}`, width: "42%", whiteSpace: "nowrap" }}>
      {label}
    </td>
    <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>
      {value}
    </td>
  </tr>
);

const TechChip = ({ label }: { label: string }) => (
  <span style={{ display: "inline-block", backgroundColor: "#fffbeb", color: "#d97706", border: "1px solid #d97706", borderRadius: 12, fontSize: 12, padding: "2px 10px", marginRight: 6, marginBottom: 6 }}>
    {label}
  </span>
);

const Chip = ({ label, color = BG_TABLE, textColor = TEXT_DARK, border = BORDER }: { label: string; color?: string; textColor?: string; border?: string }) => (
  <span style={{ display: "inline-block", backgroundColor: color, border: `1px solid ${border}`, color: textColor, borderRadius: 4, fontSize: 12, padding: "5px 12px", margin: "3px 4px 3px 0" }}>
    {label}
  </span>
);

const chartData = sem2MidtermResults.map((r) => ({
  name: r.subject.replace("Advanced ", "Adv. ").replace("Natural Language Processing", "NLP").replace("Computer Vision", "CV"),
  score: r.score,
}));

const SKILL_TABS = [
  { key: "pm",      label: "Product Management" },
  { key: "ux",      label: "User Research" },
  { key: "tools",   label: "Analytics & Tools" },
  { key: "aiml",    label: "AI/ML" },
] as const;

type SkillTab = typeof SKILL_TABS[number]["key"];

export default function ProfilePage() {
  const isMobile   = useIsMobile();
  const twoCol     = isMobile ? "1fr" : "1fr 1fr";
  const fourStat   = isMobile ? "1fr 1fr" : "repeat(4, 1fr)";
  const [photoSrc, setPhotoSrc] = useState<string>("/koushik-photo.png");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [skillTab, setSkillTab] = useState<SkillTab>("pm");

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const result = ev.target?.result;
      if (typeof result === "string") setPhotoSrc(result);
    };
    reader.readAsDataURL(file);
  }

  const skillMap: Record<SkillTab, string[]> = {
    pm:    student.competencies.productManagement,
    ux:    student.competencies.userResearch,
    tools: student.competencies.analyticsTools,
    aiml:  student.competencies.aiml,
  };

  return (
    <div style={{ paddingBottom: 24 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 16px 0" }}>My Profile</h1>

      {/* ── SECTION 1 — Profile Header ─────────────────────────── */}
      <Card>
        <div style={{ display: "flex", alignItems: "flex-start", gap: isMobile ? 12 : 20, flexDirection: isMobile ? "column" : "row" }}>
          {/* Avatar */}
          <div style={{ flexShrink: 0, textAlign: "center" }}>
            <div style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: NAVY, overflow: "hidden", flexShrink: 0 }}>
              <img src={photoSrc} alt="Koushik Thalari" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top", display: "block" }} />
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhotoUpload} />
            <div onClick={() => fileInputRef.current?.click()} style={{ fontSize: 11, color: BLUE, marginTop: 6, cursor: "pointer", fontWeight: 600 }}>
              Change Photo
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 22, fontWeight: 700, color: TEXT_DARK, marginBottom: 4 }}>{student.name}</div>
            <div style={{ fontSize: 13, color: SLATE, marginBottom: 6 }}>Thalari Koushik &nbsp;|&nbsp; MCA AI/ML, Batch 2025–2027</div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
              <span style={{ backgroundColor: INFO_BG, color: DARK_BLUE, fontSize: 12, fontWeight: 600, padding: "3px 10px", borderRadius: 4 }}>MCA — AI/ML Specialization</span>
              <StatusBadge status="Active" />
              <span style={{ backgroundColor: "#fef9ee", color: GOLD, border: `1px solid ${GOLD}`, fontSize: 12, fontWeight: 600, padding: "2px 10px", borderRadius: 4 }}>Aspiring Product Manager &amp; AI Specialist</span>
            </div>
            <div style={{ fontSize: 13, color: SLATE, marginBottom: 2 }}>Roll: <strong style={{ color: TEXT_DARK }}>{student.rollNo}</strong> &nbsp;|&nbsp; {student.phone} &nbsp;|&nbsp; {student.location}</div>
            <div style={{ fontSize: 13, color: SLATE }}>Shoolini University of Biotechnology and Management Sciences, Solan H.P.</div>
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0, flexWrap: "wrap" }}>
            <button onClick={() => window.print()} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${NAVY}`, borderRadius: 4, backgroundColor: "white", color: NAVY, cursor: "pointer", fontFamily: "inherit" }}>
              ⬇ Download ID Card
            </button>
            <button onClick={() => window.print()} style={{ padding: "7px 14px", fontSize: 12, fontWeight: 600, border: `1px solid ${BORDER}`, borderRadius: 4, backgroundColor: "white", color: SLATE, cursor: "pointer", fontFamily: "inherit" }}>
              🖨 Print Profile
            </button>
          </div>
        </div>
      </Card>

      {/* ── SECTION 1b — About Me / Objective ──────────────────── */}
      <Card style={{ marginTop: 16, borderLeft: `4px solid ${NAVY}`, paddingLeft: 16 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 10 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK }}>About Me</div>
          <span style={{ backgroundColor: "#fef9ee", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 4, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>
            Aspiring Product Manager &amp; AI Specialist
          </span>
        </div>
        <div style={{ fontSize: 14, color: TEXT_DARK, lineHeight: 1.75, fontStyle: "italic" }}>
          "{student.objective}"
        </div>
        <div style={{ marginTop: 10 }}>
          <span style={{ display: "inline-block", backgroundColor: "#dcfce7", color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 4, fontSize: 12, fontWeight: 600, padding: "3px 10px" }}>
            ✓ {student.availability}
          </span>
        </div>
      </Card>

      {/* ── SECTION 1c — Social & Links ─────────────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>Social &amp; Links</CardHeader>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {[
            { icon: "🔗", label: "LinkedIn",  href: student.linkedin },
            { icon: "💻", label: "GitHub",    href: student.github },
            { icon: "🌐", label: "Website",   href: student.website },
            { icon: "✉️", label: "Email",     href: `mailto:${student.personalEmail}` },
          ].map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 6, border: `1px solid ${NAVY}`, color: NAVY, borderRadius: 4, padding: "6px 14px", fontSize: 13, cursor: "pointer", backgroundColor: WHITE, textDecoration: "none", fontWeight: 500 }}
            >
              {l.icon} {l.label}
            </a>
          ))}
          <div style={{ alignSelf: "center", fontSize: 12, color: SLATE, marginLeft: 4 }}>
            {student.personalEmail} &nbsp;|&nbsp; {student.phone}
          </div>
        </div>
      </Card>

      {/* ── SECTION 2 — Personal + Academic Info ──────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: twoCol, gap: 16, marginTop: 16 }}>
        <Card>
          <SectionLabel>Personal Information</SectionLabel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Full Name",        "Koushik Thalari (Thalari Koushik)"],
                ["Gender",           "Male"],
                ["Nationality",      "Indian"],
                ["Blood Group",      "B+"],
                ["Phone",            student.phone],
                ["Personal Email",   student.personalEmail],
                ["University Email", student.email],
                ["Location",         "Kurnool, Andhra Pradesh, India"],
                ["Languages",        student.languages.map((l) => `${l.name} (${l.level})`).join(", ")],
                ["Availability",     student.availability],
              ].map(([label, value], i) => <Row key={i} label={label} value={value} i={i} />)}
            </tbody>
          </table>
        </Card>

        <Card>
          <SectionLabel>Academic Information</SectionLabel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["Roll Number",      student.rollNo],
                ["Program",          "Master of Computer Applications (MCA)"],
                ["Specialization",   "Artificial Intelligence & Machine Learning"],
                ["Department",       "School of Computer Science & Engineering (SCSE)"],
                ["University",       "Shoolini University of Biotechnology and Management Sciences"],
                ["Campus",           "Kasauli Hills, Solan, Himachal Pradesh — 173229"],
                ["Batch",            "2025 – 2027"],
                ["Admission Year",   "2025"],
                ["Current Semester", "2 (Active)"],
                ["Total Semesters",  "4"],
                ["Program Duration", "2 Years"],
                ["Academic Year",    "2025 – 2026"],
                ["Academic Advisor", "Dr. Priya Sharma"],
                ["Admission Type",   "Regular"],
                ["Study Mode",       "Full Time — On Campus"],
              ].map(([label, value], i) => <Row key={i} label={label} value={value} i={i} />)}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ── SECTION 2b — Prior Education ────────────────────────── */}
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <CardHeader>Prior Education</CardHeader>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Institution", "Degree / Level", "Period", "Score / CGPA", "Location"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {student.educationHistory.map((e, i) => (
              <tr key={i} style={{ backgroundColor: i === 0 ? "#f8fafc" : i % 2 === 0 ? WHITE : BG_LIGHT, borderLeft: i === 0 ? `3px solid ${NAVY}` : "none" }}>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: i === 0 ? 700 : 400, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{e.institution}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{e.degree}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}`, whiteSpace: "nowrap" }}>{e.period}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, fontWeight: 600, color: GREEN, border: `1px solid ${BORDER}` }}>{e.score}</td>
                <td style={{ padding: "10px 12px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>{e.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ── SECTION 2c — Training & Programs ────────────────────── */}
      {student.training.map((t, ti) => (
        <Card key={ti} style={{ marginTop: 16 }}>
          <CardHeader>Training &amp; Programs</CardHeader>
          <div style={{ backgroundColor: NAVY, borderRadius: 4, padding: "14px 18px", marginBottom: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: GOLD, marginBottom: 2 }}>{t.company}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.85)", fontWeight: 600 }}>{t.program}</div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr 1fr", gap: 10, marginBottom: 14 }}>
            {[
              { label: "Period", value: t.period },
              { label: "Track", value: t.track },
              { label: "Mode", value: t.mode },
            ].map((item) => (
              <div key={item.label} style={{ padding: "10px 14px", border: `1px solid ${BORDER}`, borderRadius: 4 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: TEXT_DARK, fontWeight: 500 }}>{item.value}</div>
              </div>
            ))}
          </div>
          <div>
            {t.highlights.map((h, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                <span style={{ color: GREEN, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <span style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.6 }}>{h}</span>
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* ── SECTION 3 — Semester Overview ─────────────────────── */}
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <SectionLabel>Semester Overview</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Semester", "Period", "Subjects", "Status", "Result", "Attendance"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { sem: 1, period: "Aug 2025 – Jan 2026", subjects: "8 subjects", status: "Completed", result: "Awaited",     attendance: "99.07%" },
              { sem: 2, period: "Jan 2026 – Jun 2026", subjects: "7 subjects", status: "Active",    result: "In Progress", attendance: "97.9%" },
              { sem: 3, period: "Jul 2026 – Dec 2026", subjects: "TBD",        status: "Upcoming",  result: "—",           attendance: "—" },
              { sem: 4, period: "Jan 2027 – Jun 2027", subjects: "TBD",        status: "Upcoming",  result: "—",           attendance: "—" },
            ].map((s, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ padding: "9px 12px", fontSize: 13, fontWeight: 600, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>Semester {s.sem}</td>
                <td style={{ padding: "9px 12px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{s.period}</td>
                <td style={{ padding: "9px 12px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>{s.subjects}</td>
                <td style={{ padding: "9px 12px", border: `1px solid ${BORDER}` }}><StatusBadge status={s.status} /></td>
                <td style={{ padding: "9px 12px", border: `1px solid ${BORDER}` }}>
                  {s.result === "Awaited" ? <StatusBadge status="Awaited" /> :
                   s.result === "In Progress" ? <span style={{ fontSize: 12, color: BLUE, fontWeight: 600 }}>In Progress</span> :
                   <span style={{ fontSize: 13, color: SLATE_LIGHT }}>—</span>}
                </td>
                <td style={{ padding: "9px 12px", fontSize: 13, color: s.attendance === "—" ? SLATE_LIGHT : GREEN, fontWeight: s.attendance !== "—" ? 600 : 400, border: `1px solid ${BORDER}` }}>{s.attendance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* ── SECTION 4 — Academic Performance ─────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <SectionLabel>Academic Performance Summary</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: 12, marginBottom: 16 }}>
          {[
            { label: "Overall Attendance", value: "99.07%",   sub: "Semester 1", border: GREEN },
            { label: "Mid-term Average",   value: "85 / 100", sub: "Semester 2", border: BLUE },
            { label: "Assignments Done",   value: "21 of 26", sub: "Both semesters", border: AMBER },
          ].map((k) => (
            <div key={k.label} style={{ padding: "12px 16px", border: `1px solid ${BORDER}`, borderLeft: `3px solid ${k.border}`, borderRadius: 4 }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: TEXT_DARK }}>{k.value}</div>
              <div style={{ fontSize: 11, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{k.label}</div>
              <div style={{ fontSize: 11, color: SLATE_LIGHT, marginTop: 2 }}>{k.sub}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Mid-term Scores — Semester 2</div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -10, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={BORDER} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: SLATE }} angle={-30} textAnchor="end" interval={0} />
            <YAxis domain={[70, 100]} tick={{ fontSize: 11, fill: SLATE }} />
            <Tooltip contentStyle={{ fontSize: 12, border: `1px solid ${BORDER}` }} formatter={(v) => [`${v}/100`, "Score"]} />
            <Bar dataKey="score" fill={BLUE} radius={0} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* ── SECTION 4b — Personal Projects ──────────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>Personal Projects</CardHeader>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {student.projects.map((p, i) => (
            <div key={i} style={{ border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, borderLeft: `3px solid ${p.status === "Active" ? GREEN : SLATE}` }}>
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK }}>{p.title}</div>
                <div style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: SLATE, backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "2px 8px" }}>{p.period}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: p.status === "Active" ? "#dcfce7" : BG_TABLE, color: p.status === "Active" ? GREEN : SLATE, border: `1px solid ${p.status === "Active" ? GREEN : BORDER}`, borderRadius: 4, padding: "2px 8px" }}>
                    {p.status}
                  </span>
                </div>
              </div>
              <div style={{ fontSize: 13, color: SLATE, lineHeight: 1.7, marginBottom: 10 }}>{p.description}</div>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {p.techStack.map((t) => <TechChip key={t} label={t} />)}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── SECTION 5 — Skills (Tabbed) ───────────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>Skills &amp; Competencies</CardHeader>
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${BORDER}`, marginBottom: 16, flexWrap: "wrap" }}>
          {SKILL_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSkillTab(tab.key)}
              style={{
                padding: "8px 14px", fontSize: 12, fontWeight: 600, border: "none", borderBottom: skillTab === tab.key ? `2px solid ${NAVY}` : "2px solid transparent",
                backgroundColor: "transparent", color: skillTab === tab.key ? NAVY : SLATE, cursor: "pointer", fontFamily: "inherit", marginBottom: -1,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          {skillMap[skillTab].map((s) => <Chip key={s} label={s} />)}
        </div>
      </Card>

      {/* ── SECTION 5b — Certifications ──────────────────────────── */}
      <Card style={{ marginTop: 16 }}>
        <CardHeader>Certifications</CardHeader>
        <div style={{ display: "grid", gridTemplateColumns: twoCol, gap: 14 }}>
          {student.certifications.map((c, i) => (
            <div key={i} style={{ border: `1px solid ${i === 0 ? GOLD : BLUE}`, borderRadius: 4, padding: 16, borderLeft: `3px solid ${i === 0 ? GOLD : BLUE}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: TEXT_DARK, marginBottom: 6 }}>{c.name}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 6 }}>
                <span style={{ fontSize: 11, backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`, color: SLATE, borderRadius: 4, padding: "2px 8px" }}>{c.issuer}</span>
                <span style={{ fontSize: 11, backgroundColor: BG_TABLE, border: `1px solid ${BORDER}`, color: SLATE, borderRadius: 4, padding: "2px 8px" }}>{c.year}</span>
              </div>
              <div style={{ fontSize: 12, color: SLATE }}>{c.type}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* ── SECTION 6 — Contact & Address ─────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: twoCol, gap: 16, marginTop: 16 }}>
        <Card>
          <SectionLabel>Contact Information</SectionLabel>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {[
                ["University Email", student.email],
                ["Personal Email",   student.personalEmail],
                ["Phone",            student.phone],
                ["LinkedIn",         "linkedin.com/in/tkoushik"],
                ["GitHub",           "github.com/Riyakoushik"],
                ["Website",          "thalarikoushik.in"],
                ["University Phone", "+91 7018007000"],
              ].map(([label, value], i) => <Row key={i} label={label} value={value} i={i} />)}
            </tbody>
          </table>
          <div style={{ marginTop: 12 }}>
            <span style={{ display: "inline-block", backgroundColor: "#dcfce7", color: GREEN, border: `1px solid ${GREEN}`, borderRadius: 4, fontSize: 12, fontWeight: 600, padding: "4px 12px" }}>
              ✓ {student.availability}
            </span>
          </div>
        </Card>

        <Card>
          <SectionLabel>Address</SectionLabel>
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Current (Campus)</div>
            <div style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.7 }}>
              Shoolini University Campus<br />
              Kasauli Hills, Solan<br />
              Himachal Pradesh — 173229
            </div>
          </div>
          <div style={{ height: 1, backgroundColor: BORDER, marginBottom: 14 }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Permanent (Home)</div>
            <div style={{ fontSize: 13, color: TEXT_DARK, lineHeight: 1.7 }}>
              Kurnool, Andhra Pradesh<br />
              India — 518001
            </div>
          </div>
        </Card>
      </div>

      {/* ── SECTION 7 — University Info Card ──────────────────── */}
      <div style={{ backgroundColor: NAVY, borderRadius: 4, padding: 24, marginTop: 16 }}>
        <div style={{ color: "white", fontSize: 16, fontWeight: 700, letterSpacing: "0.06em", marginBottom: 4 }}>SHOOLINI UNIVERSITY</div>
        <div style={{ color: GOLD, fontSize: 13, marginBottom: 16 }}>Shoolini University of Biotechnology and Management Sciences</div>

        <div style={{ display: "grid", gridTemplateColumns: fourStat, gap: 10, marginBottom: 16 }}>
          {[
            { label: "NAAC Grade",    value: "B+" },
            { label: "Established",   value: "2009" },
            { label: "QS Ranked",     value: "Top Private Univ. India" },
            { label: "UGC Certified", value: "Yes" },
          ].map((b) => (
            <div key={b.label} style={{ backgroundColor: "white", borderRadius: 4, padding: "12px 14px" }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: TEXT_DARK }}>{b.value}</div>
              <div style={{ fontSize: 10, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 2 }}>{b.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.6)", textAlign: "center" }}>
          Kasauli Hills, Solan, H.P. 173229 &nbsp;|&nbsp; +91 7018007000 &nbsp;|&nbsp; shooliniuniversity.com
        </div>
      </div>

      {/* ── SECTION A — Joining Offer Letter Summary ───────────── */}
      <Card style={{ marginTop: 16, borderLeft: `4px solid ${NAVY}` }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: TEXT_DARK, marginBottom: 6 }}>University Joining Offer Letter</div>
            <span style={{ display: "inline-block", backgroundColor: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 4 }}>
              DigiLocker Verified ✓
            </span>
          </div>
          <button
            onClick={() => downloadOfferLetter()}
            style={{ padding: "8px 16px", fontSize: 12, fontWeight: 700, border: "none", borderRadius: 4, backgroundColor: NAVY, color: "white", cursor: "pointer", fontFamily: "inherit", flexShrink: 0 }}
          >
            ↓ Download Offer Letter PDF
          </button>
        </div>
        <SectionLabel>Joining Offer Letter Summary</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <tbody>
            {[
              ["Offer Letter No",       offerLetterData.offerLetterNo],
              ["Issue Date",            offerLetterData.issueDate],
              ["Reporting Date",        `${offerLetterData.reportingDate} (9:00 AM — Admin Block)`],
              ["Orientation Date",      offerLetterData.orientationDate],
              ["Classes Begin",         offerLetterData.classesBegin],
              ["Father's Name",         offerLetterData.fatherName],
              ["Mother's Name",         offerLetterData.motherName],
              ["DBA Reference",         offerLetterData.dbaReference],
              ["DigiLocker Consent ID", offerLetterData.digiLockerConsentId],
              ["Academic Advisor",      offerLetterData.academicAdvisor],
            ].map(([label, value], i) => <Row key={i} label={label} value={value} i={i} />)}
          </tbody>
        </table>
      </Card>

      {/* ── SECTION B — Document Submission & Verification Status ── */}
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <SectionLabel>Document Submission &amp; Verification Status</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 480 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Document", "Submitted Via", "Status"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {offerLetterData.documents.map((d, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ padding: "8px 12px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{d.doc}</td>
                <td style={{ padding: "8px 12px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>{d.via}</td>
                <td style={{ padding: "8px 12px", border: `1px solid ${BORDER}` }}>
                  <span style={{ display: "inline-block", backgroundColor: "#dcfce7", color: "#16a34a", fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 4 }}>✓ Verified</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 11, color: SLATE, lineHeight: 1.7 }}>
          <div><strong>DigiLocker Partner ID:</strong> {offerLetterData.digiLockerPartnerId}</div>
          <div><strong>DBA Ref No:</strong> {offerLetterData.dbaRefNo}</div>
          <div><strong>Verification Date:</strong> {offerLetterData.verificationDate}</div>
          <div style={{ marginTop: 6, fontStyle: "italic" }}>Physical originals to be presented on the reporting day (11 August 2025).</div>
        </div>
      </Card>

      {/* ── SECTION C — Offer Letter Fee Structure ─────────────── */}
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          <SectionLabel>Program Fee Structure — MCA AI/ML (Batch 2025–2027)</SectionLabel>
          <span style={{ fontSize: 13, fontWeight: 700, color: NAVY, marginBottom: 14 }}>Grand Total: ₹2,50,000</span>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 560, marginBottom: 16 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Semester", "Tuition", "Exam", "Lab", "Library", "Activity", "Total"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 10px", fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {offerLetterData.semesterFees.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 600, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{row.sem}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>₹{row.tuition.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>₹{row.exam.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>₹{row.lab.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>₹{row.library.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>₹{row.activity.toLocaleString("en-IN")}</td>
                <td style={{ padding: "8px 10px", fontSize: 13, fontWeight: 700, color: NAVY, border: `1px solid ${BORDER}` }}>₹{row.total.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ fontSize: 11, color: SLATE, marginBottom: 8, fontWeight: 600 }}>Miscellaneous Fees</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {offerLetterData.miscFees.map((m, i) => (
            <div key={i} style={{ padding: "8px 12px", border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 12, color: TEXT_DARK, backgroundColor: BG_LIGHT }}>
              <span style={{ color: SLATE, fontSize: 11 }}>{m.label}:</span> <strong>₹{m.amount.toLocaleString("en-IN")}</strong>
            </div>
          ))}
        </div>
      </Card>

      {/* ── SECTION D — Payment Schedule ───────────────────────── */}
      <Card style={{ marginTop: 16, overflowX: "auto" }}>
        <SectionLabel>Payment Schedule</SectionLabel>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 420 }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Installment", "Due Date", "Amount", "Description"].map((h) => (
                <th key={h} style={{ textAlign: "left", padding: "9px 12px", fontSize: 11, fontWeight: 700, color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}` }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {offerLetterData.paymentSchedule.map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 600, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{p.installment}</td>
                <td style={{ padding: "8px 12px", fontSize: 13, color: SLATE, border: `1px solid ${BORDER}` }}>{p.dueDate}</td>
                <td style={{ padding: "8px 12px", fontSize: 13, fontWeight: 700, color: NAVY, border: `1px solid ${BORDER}` }}>{p.amount}</td>
                <td style={{ padding: "8px 12px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` }}>{p.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12, fontSize: 11, color: SLATE }}>
          <strong>UPI:</strong> {offerLetterData.upiId} &nbsp;|&nbsp; <strong>DD Favour Of:</strong> {offerLetterData.ddFavorOf}
        </div>
      </Card>
    </div>
  );
}
