import { useState } from "react";
import StatusBadge from "../components/StatusBadge";
import { borrowedBooks, catalogBooks, borrowHistory, fineRecords, computeFine } from "../data/libraryData";
import {
  NAVY, GREEN, RED, AMBER, SLATE, WHITE, BORDER, TEXT_DARK, BG_LIGHT, BG_TABLE,
  ERROR_LIGHT, WARN_BG, SUCCESS_BG, INFO_BG, DARK_BLUE
} from "../constants";

const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600,
  color: SLATE, textTransform: "uppercase" as const, letterSpacing: "0.06em",
  border: `1px solid ${BORDER}`,
};
const td: React.CSSProperties = {
  padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}`,
};

type Tab = "borrowed" | "catalog" | "history" | "fines";
type CatalogFilter = "All" | "Available" | "Reserved";

export default function LibraryPage() {
  const [tab, setTab] = useState<Tab>("borrowed");
  const [catalogFilter, setCatalogFilter] = useState<CatalogFilter>("All");
  const [search, setSearch] = useState("");
  const [renewedIds, setRenewedIds] = useState<Set<string>>(new Set());

  const overdue = borrowedBooks.filter((b) => b.status === "Overdue");
  const totalFine = borrowedBooks.reduce((sum, b) => sum + computeFine(b), 0);
  const outstandingFine = fineRecords.filter((f) => f.status === "Outstanding").reduce((s, f) => s + f.fineAmount, 0);
  const paidFine = fineRecords.filter((f) => f.status === "Paid").reduce((s, f) => s + f.fineAmount, 0);

  const tabs: { label: string; val: Tab }[] = [
    { label: "Currently Borrowed", val: "borrowed" },
    { label: "Search Catalog", val: "catalog" },
    { label: "Borrowing History", val: "history" },
    { label: "Fines & Payment", val: "fines" },
  ];

  const filteredCatalog = catalogBooks.filter((b) => {
    const matchSearch = search === "" ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = catalogFilter === "All" || b.status === catalogFilter;
    return matchSearch && matchFilter;
  });

  function handleRenew(id: string) {
    setRenewedIds((prev) => new Set([...prev, id]));
    alert("Book renewed successfully! New due date extended by 14 days.");
  }

  function handlePayFine() {
    alert("Fine payment initiated. You will be redirected to the university payment gateway.");
  }

  return (
    <div>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 4px 0" }}>Library Portal</h1>
        <p style={{ fontSize: 13, color: SLATE, margin: 0 }}>Shoolini University Central Library — MCA AI/ML Reading Resources</p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 0, marginBottom: 20, borderBottom: `1px solid ${BORDER}`, overflowX: "auto" }}>
        {tabs.map((t) => (
          <button
            key={t.val}
            onClick={() => setTab(t.val)}
            style={{
              padding: "8px 20px", fontSize: 13, fontWeight: 600, border: "none", whiteSpace: "nowrap",
              borderBottom: tab === t.val ? `2px solid ${NAVY}` : "2px solid transparent",
              backgroundColor: tab === t.val ? BG_TABLE : "transparent",
              color: tab === t.val ? NAVY : SLATE,
              cursor: "pointer", borderRadius: "4px 4px 0 0",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB 1: BORROWED ─────────────────────────────────────────────── */}
      {tab === "borrowed" && (
        <div>
          {/* KPI cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Books Borrowed", value: borrowedBooks.length, color: NAVY, bg: INFO_BG },
              { label: "Overdue", value: overdue.length, color: RED, bg: "#fee2e2" },
              { label: "Total Fine Due", value: `Rs. ${totalFine}`, color: totalFine > 0 ? RED : GREEN, bg: totalFine > 0 ? "#fee2e2" : SUCCESS_BG },
            ].map((k) => (
              <div key={k.label} style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {overdue.length > 0 && (
            <div style={{ backgroundColor: "#fff5f5", border: `1px solid #fecaca`, borderLeft: `4px solid ${RED}`, borderRadius: 4, padding: "10px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: RED, fontWeight: 600 }}>
                ⚠ You have {overdue.length} overdue book{overdue.length > 1 ? "s" : ""}. A fine of Rs. 2/day is being charged. Please return or renew immediately.
              </span>
            </div>
          )}

          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 800 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Book Title & Author", "Issue Date", "Due Date", "Days Left", "Status", "Fine", "Action"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {borrowedBooks.map((b, i) => {
                  const fine = computeFine(b);
                  const daysLeft = Math.ceil((b.dueDate.getTime() - Date.now()) / 86400000);
                  const realDaysLeft = Math.ceil((b.dueDate.getTime() - new Date("2026-03-26").getTime()) / 86400000);
                  const rowBg = b.status === "Overdue" ? ERROR_LIGHT : b.status === "Due Soon" ? WARN_BG : i % 2 === 0 ? WHITE : BG_LIGHT;
                  const renewed = renewedIds.has(b.id);
                  return (
                    <tr key={b.id} style={{ backgroundColor: rowBg }}>
                      <td style={{ ...td, maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, color: TEXT_DARK, fontSize: 13 }}>{b.title}</div>
                        <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>{b.author}</div>
                        <div style={{ fontSize: 10, color: SLATE, marginTop: 1 }}>ISBN: {b.isbn}</div>
                      </td>
                      <td style={td}>{b.issueDate}</td>
                      <td style={{ ...td, color: b.status === "Overdue" ? RED : b.status === "Due Soon" ? AMBER : TEXT_DARK, fontWeight: b.status !== "Borrowed" ? 600 : 400 }}>
                        {b.dueDateStr}
                      </td>
                      <td style={{ ...td, fontWeight: 600, color: b.status === "Overdue" ? RED : b.status === "Due Soon" ? AMBER : GREEN }}>
                        {b.status === "Overdue" ? `${Math.abs(realDaysLeft)} days ago` : `${realDaysLeft} days`}
                      </td>
                      <td style={td}>
                        <StatusBadge status={b.status === "Borrowed" ? "Active" : b.status === "Due Soon" ? "Pending" : "Overdue"} />
                      </td>
                      <td style={{ ...td, fontWeight: 600, color: fine > 0 ? RED : GREEN }}>
                        {fine > 0 ? `Rs. ${fine}` : "—"}
                      </td>
                      <td style={td}>
                        {renewed ? (
                          <span style={{ fontSize: 11, color: GREEN, fontWeight: 600 }}>✓ Renewed</span>
                        ) : (
                          <button
                            onClick={() => handleRenew(b.id)}
                            disabled={b.renewalsUsed >= b.maxRenewals}
                            style={{
                              backgroundColor: b.renewalsUsed >= b.maxRenewals ? BG_TABLE : NAVY,
                              color: b.renewalsUsed >= b.maxRenewals ? SLATE : "white",
                              border: "none", borderRadius: 4, padding: "5px 12px", fontSize: 12,
                              cursor: b.renewalsUsed >= b.maxRenewals ? "not-allowed" : "pointer", fontFamily: "inherit",
                            }}
                          >
                            {b.renewalsUsed >= b.maxRenewals ? "Max Renewals" : `Renew (${b.maxRenewals - b.renewalsUsed} left)`}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: CATALOG ──────────────────────────────────────────────── */}
      {tab === "catalog" && (
        <div>
          <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
            <input
              type="text"
              placeholder="Search by title, author or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1, minWidth: 220, padding: "8px 14px", fontSize: 13, border: `1px solid ${BORDER}`,
                borderRadius: 4, outline: "none", fontFamily: "inherit", color: TEXT_DARK,
              }}
            />
            <div style={{ display: "flex", gap: 8 }}>
              {(["All", "Available", "Reserved"] as CatalogFilter[]).map((f) => (
                <button
                  key={f}
                  onClick={() => setCatalogFilter(f)}
                  style={{
                    padding: "7px 14px", fontSize: 12, fontWeight: 600,
                    border: `1px solid ${BORDER}`, borderRadius: 4, cursor: "pointer", fontFamily: "inherit",
                    backgroundColor: catalogFilter === f ? NAVY : WHITE,
                    color: catalogFilter === f ? "white" : TEXT_DARK,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Book Title & Author", "Category", "Accession No", "Available / Total", "Status", "Action"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredCatalog.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ ...td, textAlign: "center", color: SLATE, padding: "28px 14px" }}>No books match your search.</td>
                  </tr>
                ) : (
                  filteredCatalog.map((b, i) => (
                    <tr key={b.id} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                      <td style={{ ...td, maxWidth: 220 }}>
                        <div style={{ fontWeight: 600, color: TEXT_DARK }}>{b.title}</div>
                        <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>{b.author}</div>
                      </td>
                      <td style={{ ...td, color: SLATE }}>{b.category}</td>
                      <td style={{ ...td, fontSize: 12, color: SLATE }}>{b.accessionNo}</td>
                      <td style={{ ...td, fontWeight: 600, color: b.availableCopies > 0 ? GREEN : RED }}>
                        {b.availableCopies} / {b.totalCopies}
                      </td>
                      <td style={td}>
                        <span style={{
                          display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                          backgroundColor: b.status === "Available" ? SUCCESS_BG : b.status === "Reserved" ? WARN_BG : "#fee2e2",
                          color: b.status === "Available" ? GREEN : b.status === "Reserved" ? AMBER : RED,
                        }}>
                          {b.status}
                        </span>
                      </td>
                      <td style={td}>
                        {b.status === "Available" ? (
                          <button
                            onClick={() => alert(`Reservation placed for: ${b.title}`)}
                            style={{ backgroundColor: NAVY, color: "white", border: "none", borderRadius: 4, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            Reserve
                          </button>
                        ) : (
                          <button
                            onClick={() => alert(`You will be notified when "${b.title}" becomes available.`)}
                            style={{ backgroundColor: BG_TABLE, color: SLATE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "5px 12px", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
                          >
                            Notify Me
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 3: HISTORY ──────────────────────────────────────────────── */}
      {tab === "history" && (
        <div>
          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <div style={{ padding: "12px 16px", borderBottom: `1px solid ${BORDER}`, backgroundColor: BG_LIGHT }}>
              <span style={{ fontSize: 13, color: TEXT_DARK, fontWeight: 600 }}>{borrowHistory.length} books borrowed historically</span>
            </div>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 680 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Book Title & Author", "Issue Date", "Return Date", "Status", "Fine Paid"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {borrowHistory.map((b, i) => (
                  <tr key={b.id} style={{ backgroundColor: b.status === "Returned Late" ? WARN_BG : i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, maxWidth: 220 }}>
                      <div style={{ fontWeight: 600 }}>{b.title}</div>
                      <div style={{ fontSize: 11, color: SLATE, marginTop: 2 }}>{b.author}</div>
                    </td>
                    <td style={td}>{b.issueDate}</td>
                    <td style={td}>{b.returnDate}</td>
                    <td style={td}>
                      <span style={{
                        display: "inline-block", padding: "3px 10px", borderRadius: 4, fontSize: 11, fontWeight: 700,
                        backgroundColor: b.status === "Returned" ? SUCCESS_BG : WARN_BG,
                        color: b.status === "Returned" ? GREEN : AMBER,
                      }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ ...td, fontWeight: 600, color: b.fine === "₹0" ? GREEN : RED }}>
                      {b.fine} {b.finePaid ? <span style={{ fontSize: 11, color: GREEN }}>(Paid)</span> : <span style={{ fontSize: 11, color: RED }}>(Unpaid)</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 4: FINES ────────────────────────────────────────────────── */}
      {tab === "fines" && (
        <div>
          {/* Summary cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 20 }}>
            {[
              { label: "Total Fine", value: `Rs. ${totalFine + paidFine}`, color: TEXT_DARK, bg: BG_TABLE },
              { label: "Paid", value: `Rs. ${paidFine}`, color: GREEN, bg: SUCCESS_BG },
              { label: "Outstanding", value: `Rs. ${outstandingFine}`, color: outstandingFine > 0 ? RED : GREEN, bg: outstandingFine > 0 ? "#fee2e2" : SUCCESS_BG },
            ].map((k) => (
              <div key={k.label} style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "16px 20px", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: 12, color: SLATE, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          {outstandingFine > 0 && (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#fff5f5", border: `1px solid #fecaca`, borderLeft: `4px solid ${RED}`, borderRadius: 4, padding: "12px 16px", marginBottom: 16 }}>
              <span style={{ fontSize: 13, color: RED, fontWeight: 600 }}>
                Outstanding fine of Rs. {outstandingFine} must be cleared to borrow new books.
              </span>
              <button
                onClick={handlePayFine}
                style={{ backgroundColor: NAVY, color: "white", border: "none", borderRadius: 4, padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", flexShrink: 0, marginLeft: 16 }}
              >
                Pay Fine
              </button>
            </div>
          )}

          <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, boxShadow: "0 1px 3px rgba(0,0,0,0.06)", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 600 }}>
              <thead>
                <tr style={{ backgroundColor: BG_TABLE }}>
                  {["Fine ID", "Book Title", "Days Overdue", "Fine Amount", "Status", "Date"].map((h) => (
                    <th key={h} style={th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {fineRecords.map((f, i) => (
                  <tr key={f.id} style={{ backgroundColor: f.status === "Outstanding" ? "#fff5f5" : i % 2 === 0 ? WHITE : BG_LIGHT }}>
                    <td style={{ ...td, fontSize: 12, color: SLATE }}>{f.id}</td>
                    <td style={{ ...td, fontWeight: 600 }}>{f.bookTitle}</td>
                    <td style={{ ...td, color: RED, fontWeight: 600 }}>{f.daysOverdue} days</td>
                    <td style={{ ...td, fontWeight: 700, color: f.status === "Outstanding" ? RED : GREEN }}>Rs. {f.fineAmount}</td>
                    <td style={td}>
                      <StatusBadge status={f.status === "Paid" ? "Submitted" : "Overdue"} />
                    </td>
                    <td style={td}>{f.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 16, backgroundColor: BG_LIGHT, border: `1px solid ${BORDER}`, borderRadius: 4, padding: "14px 16px" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: TEXT_DARK, marginBottom: 6 }}>Fine Policy</div>
            <div style={{ fontSize: 12, color: SLATE, lineHeight: 1.6 }}>
              • Late return fine: Rs. 2 per book per day overdue.<br />
              • Maximum fine per book: Rs. 100 (book replacement cost thereafter).<br />
              • Books cannot be borrowed if any outstanding fine exists.<br />
              • Fines may be paid at the library counter or via the online payment portal.<br />
              • Lost or damaged books are charged at full replacement cost + 20% processing fee.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
