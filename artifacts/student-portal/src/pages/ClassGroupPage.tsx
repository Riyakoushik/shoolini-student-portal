import { useState } from "react";
import { initialClassResources, type ClassResource } from "../data/classGroupData";
import {
  NAVY, GOLD, GREEN, RED, AMBER, BLUE, PURPLE, SLATE, WHITE, BORDER, TEXT_DARK,
  BG_LIGHT, BG_TABLE, INFO_BG,
} from "../constants";

type ResourceFilter = "All" | "HackerRank" | "Lab & Coding Test" | "OpenSource PDF" | "Recording" | "Discussion";

export default function ClassGroupPage() {
  const [resources, setResources] = useState<ClassResource[]>(initialClassResources);
  const [filterType, setFilterType] = useState<ResourceFilter>("All");
  const [selectedSubject, setSelectedSubject] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showForm, setShowForm] = useState<boolean>(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form State
  const [formType, setFormType] = useState<"HackerRank" | "Lab & Coding Test" | "OpenSource PDF" | "Recording" | "Discussion">("HackerRank");
  const [formSubject, setFormSubject] = useState<string>("Reinforcement Learning");
  const [formTitle, setFormTitle] = useState<string>("");
  const [formUrl, setFormUrl] = useState<string>("");
  const [formDesc, setFormDesc] = useState<string>("");
  const [formPlatform, setFormPlatform] = useState<"HackerRank" | "LeetCode" | "Google Colab" | "GitHub" | "Kaggle" | "OpenSource">("HackerRank");

  const subjects = [
    "All",
    "Reinforcement Learning",
    "Reinforcement Learning Lab",
    "Big Data Analytics",
    "Big Data Lab",
    "Generative AI & LLMs",
    "Cloud Architecture & DevOps",
    "Cybersecurity & AI",
    "Research Methodology & Technical Writing",
  ];

  function handleCreateResource(e: React.FormEvent) {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newRes: ClassResource = {
      id: `RES-${Date.now()}`,
      type: formType,
      subject: formSubject,
      title: formTitle.trim(),
      author: "Koushik Thalari (You)",
      date: new Date().toLocaleDateString("en-IN", { month: "short", day: "2-digit", year: "numeric" }),
      url: formUrl.trim() || "#",
      description: formDesc.trim() || "Shared by student with class group.",
      platform: formType === "HackerRank" ? "HackerRank" : formType === "Lab & Coding Test" ? formPlatform : formType === "OpenSource PDF" ? "OpenSource" : formType === "Recording" ? "Drive" : undefined,
      fileSize: formType === "OpenSource PDF" ? "Task PDF" : undefined,
    };

    setResources([newRes, ...resources]);
    setShowForm(false);
    setFormTitle("");
    setFormUrl("");
    setFormDesc("");
    setToast(`Resource shared to Class Hub: "${newRes.title}"`);
    setTimeout(() => setToast(null), 4000);
  }

  const filteredResources = resources.filter((r) => {
    const matchesType = filterType === "All" || r.type === filterType;
    const matchesSubject = selectedSubject === "All" || r.subject === selectedSubject;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.subject.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.author.toLowerCase().includes(q);
    return matchesType && matchesSubject && matchesSearch;
  });

  const counts = {
    All: resources.length,
    HackerRank: resources.filter((r) => r.type === "HackerRank").length,
    "Lab & Coding Test": resources.filter((r) => r.type === "Lab & Coding Test").length,
    "OpenSource PDF": resources.filter((r) => r.type === "OpenSource PDF").length,
    Recording: resources.filter((r) => r.type === "Recording").length,
    Discussion: resources.filter((r) => r.type === "Discussion").length,
  };

  return (
    <div>
      {/* Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 1100,
          backgroundColor: GREEN, color: WHITE, padding: "12px 20px", borderRadius: 4,
          fontSize: 13, fontWeight: 600, boxShadow: "0 2px 8px rgba(0,0,0,0.18)", maxWidth: 380,
        }}>
          ✓ {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 4px 0" }}>
            Class Group & Coding Lab Hub
          </h1>
          <div style={{ fontSize: 13, color: SLATE }}>
            MCA (AI/ML) — Semester 3 Labs · HackerRank Practice, Coding Environments & Open-Source Task PDFs
          </div>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 18px", backgroundColor: showForm ? SLATE : NAVY, color: WHITE,
            border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}
        >
          {showForm ? "✕ Close Form" : "＋ Share Lab / Coding Link / PDF"}
        </button>
      </div>

      {/* Share / Post Form Card */}
      {showForm && (
        <div style={{
          backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderLeft: `4px solid ${NAVY}`,
          borderRadius: 4, padding: 20, marginBottom: 20, boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 14 }}>
            Share Coding Task, HackerRank Challenge or Open-Source PDF
          </div>
          <form onSubmit={handleCreateResource}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16, marginBottom: 16 }}>
              {/* Resource Type */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                  Resource Category
                </label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value as any)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit" }}
                >
                  <option value="HackerRank">🏆 HackerRank Challenge / Problem Set</option>
                  <option value="Lab & Coding Test">💻 Coding Lab Test / Colab / GitHub</option>
                  <option value="OpenSource PDF">📄 Open-Source Lab Task PDF</option>
                  <option value="Recording">🎥 Lab Walkthrough Recording</option>
                  <option value="Discussion">💬 Discussion & Solutions</option>
                </select>
              </div>

              {/* Subject */}
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                  Course Subject
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit" }}
                >
                  {subjects.filter(s => s !== "All").map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Platform */}
              {(formType === "HackerRank" || formType === "Lab & Coding Test") && (
                <div>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                    Platform / Sandbox
                  </label>
                  <select
                    value={formPlatform}
                    onChange={(e) => setFormPlatform(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit" }}
                  >
                    <option value="HackerRank">HackerRank</option>
                    <option value="Google Colab">Google Colab</option>
                    <option value="GitHub">GitHub Open-Source</option>
                    <option value="LeetCode">LeetCode</option>
                    <option value="Kaggle">Kaggle</option>
                  </select>
                </div>
              )}
            </div>

            {/* Title */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                Task / Test Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. HackerRank: Dynamic Programming Bellman Equation Practice Set"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>

            {/* URL / Link */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                URL Link (HackerRank, Colab, GitHub, or Open-Source PDF link)
              </label>
              <input
                type="url"
                required
                placeholder="https://www.hackerrank.com/... or https://colab.research.google.com/..."
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>

            {/* Description */}
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: SLATE, marginBottom: 6 }}>
                Description & Task Instructions
              </label>
              <textarea
                rows={3}
                placeholder="Outline the lab requirements, expected outputs, or test cases..."
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                style={{ width: "100%", padding: "9px 12px", borderRadius: 4, border: `1px solid ${BORDER}`, fontSize: 13, fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                style={{ padding: "8px 16px", backgroundColor: WHITE, color: SLATE, border: `1px solid ${BORDER}`, borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ padding: "8px 22px", backgroundColor: GREEN, color: WHITE, border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700, cursor: "pointer" }}
              >
                ✓ Share with Class
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filter Tabs by Resource Type */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap", alignItems: "center" }}>
        {(["All", "HackerRank", "Lab & Coding Test", "OpenSource PDF", "Recording", "Discussion"] as const).map((t) => {
          const isSelected = filterType === t;
          const label =
            t === "All" ? `All (${counts.All})` :
            t === "HackerRank" ? `🏆 HackerRank Tests (${counts.HackerRank})` :
            t === "Lab & Coding Test" ? `💻 Coding Labs & Colab (${counts["Lab & Coding Test"]})` :
            t === "OpenSource PDF" ? `📄 Open-Source Task PDFs (${counts["OpenSource PDF"]})` :
            t === "Recording" ? `🎥 Lab Walkthroughs (${counts.Recording})` :
            `💬 Discussions (${counts.Discussion})`;

          return (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              style={{
                padding: "6px 14px", fontSize: 12, fontWeight: isSelected ? 700 : 500,
                border: `1px solid ${isSelected ? NAVY : BORDER}`,
                backgroundColor: isSelected ? NAVY : WHITE,
                color: isSelected ? "white" : TEXT_DARK,
                borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Subject Filter Pills & Search */}
      <div style={{
        backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "12px 16px",
        marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        {/* Subject Pills */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: SLATE, marginRight: 4 }}>Subject:</span>
          {subjects.map((s) => (
            <button
              key={s}
              onClick={() => setSelectedSubject(s)}
              style={{
                padding: "4px 10px", fontSize: 11, fontWeight: selectedSubject === s ? 700 : 500,
                border: `1px solid ${selectedSubject === s ? BLUE : BORDER}`,
                backgroundColor: selectedSubject === s ? INFO_BG : BG_TABLE,
                color: selectedSubject === s ? BLUE : SLATE,
                borderRadius: 12, cursor: "pointer",
              }}
            >
              {s === "Research Methodology & Technical Writing" ? "Research Methodology" : s}
            </button>
          ))}
        </div>

        {/* Search */}
        <div style={{ minWidth: 220 }}>
          <input
            type="text"
            placeholder="🔍 Search labs, tests, PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "6px 12px", fontSize: 12, border: `1px solid ${BORDER}`, borderRadius: 4, boxSizing: "border-box" }}
          />
        </div>
      </div>

      {/* Feed Card List */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 12 }}>
        {filteredResources.map((item) => {
          const typeBadgeStyle =
            item.type === "HackerRank" ? { bg: "#fef3c7", color: "#b45309", icon: "🏆" } :
            item.type === "Lab & Coding Test" ? { bg: "#dbeafe", color: BLUE, icon: "💻" } :
            item.type === "OpenSource PDF" ? { bg: "#dcfce7", color: GREEN, icon: "📄" } :
            item.type === "Recording" ? { bg: "#f3e8ff", color: PURPLE, icon: "🎥" } :
            { bg: "#f1f5f9", color: SLATE, icon: "💬" };

          return (
            <div
              key={item.id}
              style={{
                backgroundColor: WHITE,
                border: `1px solid ${BORDER}`,
                borderLeft: item.pinned ? `4px solid ${GOLD}` : `1px solid ${BORDER}`,
                borderRadius: 4,
                padding: "16px 20px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 280 }}>
                {/* Meta tags */}
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6, flexWrap: "wrap" }}>
                  <span style={{
                    padding: "2px 8px", backgroundColor: typeBadgeStyle.bg, color: typeBadgeStyle.color,
                    borderRadius: 4, fontSize: 11, fontWeight: 700, display: "inline-flex", alignItems: "center", gap: 4,
                  }}>
                    <span>{typeBadgeStyle.icon}</span> {item.type}
                  </span>

                  <span style={{ fontSize: 12, fontWeight: 600, color: NAVY }}>
                    {item.subject}
                  </span>

                  {item.pinned && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 6px", borderRadius: 3, backgroundColor: "#fef3c7", color: AMBER }}>
                      📌 PINNED
                    </span>
                  )}

                  {item.platform && (
                    <span style={{ fontSize: 11, color: SLATE, backgroundColor: BG_TABLE, padding: "2px 6px", borderRadius: 3, fontWeight: 600 }}>
                      {item.platform}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div style={{ fontSize: 15, fontWeight: 700, color: TEXT_DARK, marginBottom: 6 }}>
                  {item.title}
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: SLATE, margin: "0 0 10px 0", lineHeight: 1.6 }}>
                  {item.description}
                </p>

                {/* Info row */}
                <div style={{ display: "flex", gap: 16, fontSize: 11, color: SLATE, flexWrap: "wrap" }}>
                  <span>Assigned / Shared by: <strong style={{ color: TEXT_DARK }}>{item.author}</strong></span>
                  <span>Date: {item.date}</span>
                  {item.duration && <span>Duration: <strong>{item.duration}</strong></span>}
                  {item.fileSize && <span>File: <strong>{item.fileSize}</strong></span>}
                </div>
              </div>

              {/* Action Button */}
              <div style={{ display: "flex", alignItems: "center" }}>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 16px",
                    borderRadius: 4,
                    fontSize: 12,
                    fontWeight: 600,
                    textDecoration: "none",
                    backgroundColor:
                      item.type === "HackerRank" ? "#0f172a" :
                      item.type === "Lab & Coding Test" ? BLUE :
                      item.type === "OpenSource PDF" ? GREEN :
                      item.type === "Recording" ? PURPLE : NAVY,
                    color: WHITE,
                  }}
                >
                  {item.type === "HackerRank" && "Solve on HackerRank 🏆"}
                  {item.type === "Lab & Coding Test" && "Open Coding Lab 💻"}
                  {item.type === "OpenSource PDF" && "Open Task PDF 📄"}
                  {item.type === "Recording" && "Watch Walkthrough 🎥"}
                  {item.type === "Discussion" && "View Discussion 💬"}
                </a>
              </div>
            </div>
          );
        })}

        {filteredResources.length === 0 && (
          <div style={{ padding: 40, textAlign: "center", backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, color: SLATE }}>
            No lab tasks or coding links found matching your current filters.
          </div>
        )}
      </div>
    </div>
  );
}
