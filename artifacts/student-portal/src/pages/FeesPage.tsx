import { useState, useEffect, useRef } from "react";
import { feesData } from "../data/studentData";
import type { FeeRecord } from "../data/studentData";
import {
  NAVY, GREEN, RED, AMBER, DARK_BLUE, SLATE, WHITE, BORDER, TEXT_DARK,
  BG_LIGHT, BG_TABLE, ERROR_BG, ERROR_LIGHT, ERROR_BORDER, ERROR_LIGHT2, SUCCESS_BG, WARN_BG, INFO_BG,
} from "../constants";
import { downloadReceipt } from "../utils/generateReceipt";

/* ─── style helpers ─────────────────────────────────────────────── */
function Badge({ label, color, bg }: { label: string; color: string; bg: string }) {
  return (
    <span style={{ display: "inline-block", padding: "2px 10px", backgroundColor: bg, color, borderRadius: 4, fontSize: 12, fontWeight: 600 }}>
      {label}
    </span>
  );
}

const th: React.CSSProperties = {
  textAlign: "left", padding: "10px 14px", fontSize: 12, fontWeight: 600,
  color: SLATE, textTransform: "uppercase", letterSpacing: "0.06em", border: `1px solid ${BORDER}`,
};
const td: React.CSSProperties = { padding: "10px 14px", fontSize: 13, color: TEXT_DARK, border: `1px solid ${BORDER}` };

/* ─── random helpers ─────────────────────────────────────────────── */
function rnd(n: number) { return Math.floor(Math.random() * n); }
function rndDigits(n: number) { let s = ""; for (let i = 0; i < n; i++) s += rnd(10); return s; }

function makeUPI() {
  const suffixes = ["@okaxis", "@ybl", "@paytm", "@okicici", "@okhdfcbank"];
  return `koushik.thalari${rndDigits(4)}${suffixes[rnd(suffixes.length)]}`;
}
function makeBank() {
  const banks = [
    { name: "HDFC Bank",  prefix: "HDFC" },
    { name: "SBI",        prefix: "SBIN" },
    { name: "ICICI Bank", prefix: "ICIC" },
    { name: "Axis Bank",  prefix: "UTIB" },
    { name: "Kotak Bank", prefix: "KKBK" },
  ];
  return banks[rnd(banks.length)];
}
function makeIfsc(prefix: string) { return `${prefix}0${rndDigits(6)}`; }
function makeAccountMasked() { return `XXXX XXXX ${rndDigits(4)}`; }
function makeCard() {
  const last4 = rndDigits(4);
  const months = ["01","02","03","04","05","06","07","08","09","10","11","12"];
  const expiry = `${months[rnd(12)]}/2${7 + rnd(2)}`;
  return { masked: `**** **** **** ${last4}`, expiry, last4 };
}
function makeTxnId() { return `TXN${Date.now()}${rndDigits(4)}`; }
function makeRefNo()  { return `SU/FEE/25MCA/${rndDigits(6)}`; }
function makeReceiptNo() { return `SU-PAY-25MCA-${rndDigits(3)}`; }

type PayMethod = "UPI" | "NetBanking" | "Card" | "NEFT";
type Step = "method" | "details" | "processing" | "success";

interface PendingDue { desc: string; amount: string; amountNum: number; due: string; }

interface SessionPayment {
  id: string;
  receiptNo: string;
  desc: string;
  amount: string;
  date: string;
  paymentMode: string;
  txnId: string;
  status: "Paid";
}

/* ─── animated dots loader ───────────────────────────────────────── */
function DotsLoader() {
  const [dots, setDots] = useState(".");
  useEffect(() => {
    const id = setInterval(() => setDots((d) => (d.length >= 3 ? "." : d + ".")), 400);
    return () => clearInterval(id);
  }, []);
  return <span style={{ fontFamily: "monospace", letterSpacing: 2 }}>{dots}</span>;
}

/* ─── green checkmark SVG ────────────────────────────────────────── */
function GreenCheck() {
  return (
    <svg width={56} height={56} viewBox="0 0 56 56" fill="none">
      <circle cx={28} cy={28} r={28} fill="#dcfce7" />
      <circle cx={28} cy={28} r={22} fill="#16a34a" />
      <polyline points="16,28 24,36 40,20" stroke="white" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ─── payment modal ──────────────────────────────────────────────── */
function PaymentModal({
  due,
  onClose,
  onSuccess,
}: {
  due: PendingDue;
  onClose: () => void;
  onSuccess: (payment: SessionPayment) => void;
}) {
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<PayMethod>("UPI");

  // Random data generated once on modal open
  const upiId     = useRef(makeUPI());
  const bank      = useRef(makeBank());
  const ifscNet   = useRef(makeIfsc(bank.current.prefix));
  const accNet    = useRef(makeAccountMasked());
  const card      = useRef(makeCard());
  const cvv       = useRef({ val: "" });
  const neftRef   = useRef(makeRefNo());
  const neftAcc   = useRef(rndDigits(12));
  const txnId     = useRef("");
  const receiptNo = useRef("");

  const [cvvVal, setCvvVal] = useState("");
  const [successData, setSuccessData] = useState<SessionPayment | null>(null);

  function handlePay() {
    setStep("processing");
    txnId.current = makeTxnId();
    receiptNo.current = makeReceiptNo();
    setTimeout(() => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
      const timeStr = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      const payment: SessionPayment = {
        id: txnId.current,
        receiptNo: receiptNo.current,
        desc: due.desc,
        amount: due.amount,
        date: `${dateStr}, ${timeStr}`,
        paymentMode: method,
        txnId: txnId.current,
        status: "Paid",
      };
      setSuccessData(payment);
      setStep("success");
      onSuccess(payment);
    }, 2000);
  }

  async function handleDownloadReceipt() {
    if (!successData) return;
    const feeRecord: FeeRecord = {
      id: successData.id,
      receiptNo: successData.receiptNo,
      desc: successData.desc,
      amount: successData.amount,
      date: successData.date,
      paymentMode: successData.paymentMode,
      txnId: successData.txnId,
      status: "Paid",
      semester: "Semester 2",
      feeItems: [{ label: due.desc, amount: due.amount, amountNum: due.amountNum }],
    };
    await downloadReceipt(feeRecord);
  }

  const overlay: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
  };
  const card2: React.CSSProperties = {
    backgroundColor: WHITE, borderRadius: 8, padding: 24,
    maxWidth: 480, width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.18)",
    maxHeight: "90vh", overflowY: "auto",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", border: `1px solid ${BORDER}`, borderRadius: 4,
    fontSize: 13, fontFamily: "inherit", color: TEXT_DARK, backgroundColor: "#f8fafc",
    boxSizing: "border-box",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em",
    display: "block", marginBottom: 4,
  };
  const rowGap: React.CSSProperties = { marginBottom: 14 };

  const payBtn: React.CSSProperties = {
    width: "100%", padding: "11px 0", backgroundColor: NAVY, color: WHITE, border: "none",
    borderRadius: 4, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
    marginTop: 8,
  };

  /* ── Step 1: method ── */
  if (step === "method") {
    const methods: { key: PayMethod; label: string; desc: string }[] = [
      { key: "UPI",        label: "UPI",              desc: "Pay via UPI app" },
      { key: "NetBanking", label: "Net Banking",       desc: "Pay via internet banking" },
      { key: "Card",       label: "Credit / Debit Card", desc: "Pay via card" },
      { key: "NEFT",       label: "NEFT / RTGS",       desc: "Bank transfer" },
    ];
    return (
      <div style={overlay} onClick={onClose}>
        <div style={card2} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>Select Payment Method</div>
              <div style={{ fontSize: 13, color: SLATE, marginTop: 2 }}>{due.desc} — <strong style={{ color: NAVY }}>{due.amount}</strong></div>
            </div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: SLATE, padding: "0 4px" }}>×</button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {methods.map((m) => (
              <div
                key={m.key}
                onClick={() => setMethod(m.key)}
                style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                  border: `2px solid ${method === m.key ? NAVY : BORDER}`, borderRadius: 6, cursor: "pointer",
                  backgroundColor: method === m.key ? "#f0f4f8" : WHITE,
                }}
              >
                <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${method === m.key ? NAVY : SLATE}`, backgroundColor: method === m.key ? NAVY : "transparent", flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: TEXT_DARK }}>{m.label}</div>
                  <div style={{ fontSize: 11, color: SLATE }}>{m.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setStep("details")} style={payBtn}>Continue →</button>
        </div>
      </div>
    );
  }

  /* ── Step 2: details ── */
  if (step === "details") {
    return (
      <div style={overlay}>
        <div style={card2}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>Payment Details</div>
            <button onClick={onClose} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: SLATE, padding: "0 4px" }}>×</button>
          </div>
          <div style={{ fontSize: 12, color: SLATE, marginBottom: 16 }}>
            {method} — {due.desc} — <strong style={{ color: NAVY }}>{due.amount}</strong>
          </div>

          {method === "UPI" && (
            <div>
              {/* QR placeholder */}
              <div style={{ width: 140, height: 140, backgroundColor: NAVY, borderRadius: 6, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", gap: 6 }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 12px)", gap: 3 }}>
                  {Array.from({ length: 25 }).map((_, i) => (
                    <div key={i} style={{ width: 12, height: 12, backgroundColor: Math.random() > 0.5 ? WHITE : "transparent", borderRadius: 1 }} />
                  ))}
                </div>
                <div style={{ fontSize: 10, color: WHITE, fontWeight: 600, letterSpacing: 1 }}>SCAN QR</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>UPI ID</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8", display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{upiId.current}</span>
                </div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Amount</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{due.amount}</div>
              </div>
            </div>
          )}

          {method === "NetBanking" && (
            <div>
              <div style={rowGap}>
                <span style={labelStyle}>Bank</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{bank.current.name}</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Account Number</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{accNet.current}</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>IFSC Code</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{ifscNet.current}</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Account Holder</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>Thalari Jayaraju</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Branch</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>Hyderabad Main Branch</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Amount</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{due.amount}</div>
              </div>
            </div>
          )}

          {method === "Card" && (
            <div>
              <div style={rowGap}>
                <span style={labelStyle}>Card Number</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{card.current.masked}</div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
                <div>
                  <span style={labelStyle}>Expiry</span>
                  <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{card.current.expiry}</div>
                </div>
                <div>
                  <span style={labelStyle}>CVV</span>
                  <input
                    type="password"
                    maxLength={3}
                    value={cvvVal}
                    onChange={(e) => { setCvvVal(e.target.value); cvv.current.val = e.target.value; }}
                    placeholder="•••"
                    style={{ ...inputStyle }}
                  />
                </div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Cardholder Name</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>KOUSHIK THALARI</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Amount</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{due.amount}</div>
              </div>
            </div>
          )}

          {method === "NEFT" && (
            <div>
              <div style={rowGap}>
                <span style={labelStyle}>Beneficiary Name</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8", fontSize: 12 }}>Shoolini University of Biotechnology and Management Sciences</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Account Number</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{neftAcc.current}</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>IFSC Code</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>HDFC0001234</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Bank</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>HDFC Bank, Solan Branch</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Reference Number</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{neftRef.current}</div>
              </div>
              <div style={rowGap}>
                <span style={labelStyle}>Amount</span>
                <div style={{ ...inputStyle, backgroundColor: "#f0f4f8" }}>{due.amount}</div>
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
            <button
              onClick={() => setStep("method")}
              style={{ flex: 1, padding: "10px 0", backgroundColor: WHITE, color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              ← Back
            </button>
            <button
              onClick={handlePay}
              style={{ flex: 2, ...payBtn, marginTop: 0 }}
            >
              Pay {due.amount}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Step 3: processing ── */
  if (step === "processing") {
    return (
      <div style={overlay}>
        <div style={{ ...card2, textAlign: "center", padding: 40 }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>
            <span style={{ display: "inline-block", width: 56, height: 56, borderRadius: "50%", border: `4px solid ${NAVY}`, borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
          </div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <div style={{ fontSize: 16, fontWeight: 700, color: TEXT_DARK }}>Processing Payment<DotsLoader /></div>
          <div style={{ fontSize: 13, color: SLATE, marginTop: 8 }}>{due.amount} via {method}</div>
          <div style={{ fontSize: 12, color: SLATE, marginTop: 6 }}>Please do not close this window</div>
        </div>
      </div>
    );
  }

  /* ── Step 4: success ── */
  if (step === "success" && successData) {
    return (
      <div style={overlay}>
        <div style={{ ...card2, textAlign: "center" }}>
          <div style={{ marginBottom: 16 }}><GreenCheck /></div>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#16a34a", marginBottom: 6 }}>Payment Successful!</div>
          <div style={{ fontSize: 13, color: SLATE, marginBottom: 20 }}>Your fee payment has been processed.</div>

          <div style={{ backgroundColor: "#f8fafc", border: `1px solid ${BORDER}`, borderRadius: 6, padding: 16, textAlign: "left", marginBottom: 20 }}>
            {[
              ["Transaction ID", successData.id],
              ["Receipt No", successData.receiptNo],
              ["Amount Paid", successData.amount],
              ["Date & Time", successData.date],
              ["Payment Method", method],
              ["Description", successData.desc],
            ].map(([lbl, val]) => (
              <div key={lbl} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `1px solid ${BORDER}`, fontSize: 13 }}>
                <span style={{ color: SLATE, fontWeight: 500 }}>{lbl}</span>
                <span style={{ color: TEXT_DARK, fontWeight: 600, textAlign: "right", maxWidth: "60%" }}>{val}</span>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleDownloadReceipt}
              style={{ flex: 1, padding: "10px 0", backgroundColor: NAVY, color: WHITE, border: "none", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              ↓ Download Receipt
            </button>
            <button
              onClick={onClose}
              style={{ flex: 1, padding: "10px 0", backgroundColor: WHITE, color: NAVY, border: `1px solid ${NAVY}`, borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Download Receipt button ────────────────────────────────────── */
function DownloadReceiptBtn({ payment }: { payment: FeeRecord }) {
  const [loading, setLoading] = useState(false);
  const handleDownload = async () => {
    setLoading(true);
    try { await downloadReceipt(payment); } finally { setLoading(false); }
  };
  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      style={{
        display: "inline-flex", alignItems: "center", gap: 5, padding: "5px 11px",
        backgroundColor: loading ? "#64748b" : NAVY, color: "#fff", border: "none", borderRadius: 4,
        fontSize: 12, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", whiteSpace: "nowrap",
      }}
    >
      {loading ? "Generating…" : "↓ Download Receipt"}
    </button>
  );
}

/* ─── main page ──────────────────────────────────────────────────── */
export default function FeesPage() {
  const { feeStructure, feeStructureTotals, payments, pendingDues, upcomingDues } = feesData;

  // Session state
  const [paidIds, setPaidIds] = useState<Set<string>>(new Set());
  const [sessionPayments, setSessionPayments] = useState<SessionPayment[]>([]);
  const [activeDue, setActiveDue] = useState<PendingDue | null>(null);

  // Parse amount string to number
  function parseAmount(s: string): number {
    return parseInt(s.replace(/[₹,\s]/g, ""), 10) || 0;
  }

  // Dynamic KPIs
  const basePaid = 66000;
  const baseOutstanding = 57000;
  const totalSessionPaid = sessionPayments.reduce((s, p) => s + parseAmount(p.amount), 0);
  const dynamicPaid = basePaid + totalSessionPaid;
  const dynamicOutstanding = Math.max(0, baseOutstanding - totalSessionPaid);

  function formatRs(n: number) {
    return "₹" + n.toLocaleString("en-IN");
  }

  function handlePaySuccess(payment: SessionPayment) {
    setSessionPayments((prev) => [...prev, payment]);
    if (activeDue) {
      setPaidIds((prev) => new Set([...prev, activeDue.desc]));
    }
  }

  const allPendingDues: PendingDue[] = pendingDues.map((d) => ({
    desc: d.desc,
    amount: d.amount,
    amountNum: parseAmount(d.amount),
    due: d.due ?? "",
  }));

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, color: TEXT_DARK, margin: "0 0 16px 0" }}>Fees & Payments</h1>

      {/* Payment modal */}
      {activeDue && (
        <PaymentModal
          due={activeDue}
          onClose={() => setActiveDue(null)}
          onSuccess={(p) => { handlePaySuccess(p); setActiveDue(null); }}
        />
      )}

      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 16 }}>
        {[
          { label: "Total Fees Paid", value: formatRs(dynamicPaid), border: GREEN, valueColor: undefined as string | undefined },
          { label: "Outstanding Balance", value: formatRs(dynamicOutstanding), border: dynamicOutstanding > 0 ? RED : GREEN, valueColor: (dynamicOutstanding > 0 ? RED : GREEN) as string | undefined },
          { label: "Next Due Date", value: "July 2026 (Sem 3)", border: AMBER, valueColor: undefined as string | undefined },
        ].map((k) => (
          <div
            key={k.label}
            style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${k.border}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}
          >
            <div style={{ fontSize: 24, fontWeight: 700, color: k.valueColor ?? TEXT_DARK }}>{k.value}</div>
            <div style={{ fontSize: 12, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>{k.label}</div>
          </div>
        ))}
      </div>

      {/* Fee Structure */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Fee Structure — All Semesters
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Fee Type", "Semester 1", "Semester 2", "Semester 3", "Semester 4"].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {feeStructure.map((row, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ ...td, fontWeight: 500 }}>{row.type}</td>
                <td style={td}>{row.sem1}</td>
                <td style={td}>{row.sem2}</td>
                <td style={td}>{row.sem3}</td>
                <td style={td}>{row.sem4}</td>
              </tr>
            ))}
            <tr style={{ backgroundColor: BG_TABLE }}>
              <td style={{ ...td, fontWeight: 700, color: NAVY }}>TOTAL</td>
              {[feeStructureTotals.sem1, feeStructureTotals.sem2, feeStructureTotals.sem3, feeStructureTotals.sem4].map((t, i) => (
                <td key={i} style={{ ...td, fontWeight: 700, color: NAVY }}>{t}</td>
              ))}
            </tr>
            <tr style={{ backgroundColor: INFO_BG }}>
              <td style={{ ...td, fontWeight: 700, color: DARK_BLUE }}>Program Total</td>
              <td colSpan={4} style={{ ...td, fontWeight: 700, color: DARK_BLUE }}>{feeStructureTotals.program} (approx. ₹2,50,000)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Payment History */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Payment History
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Receipt No", "Payment ID", "Description", "Amount", "Date", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}
              <th style={th}>Receipt</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ ...td, fontFamily: "monospace", fontSize: 12, color: NAVY, fontWeight: 600 }}>{p.receiptNo ?? "—"}</td>
                <td style={{ ...td, fontFamily: "monospace", fontSize: 12, color: SLATE }}>{p.id}</td>
                <td style={td}>{p.desc}</td>
                <td style={{ ...td, fontWeight: 600 }}>{p.amount}</td>
                <td style={td}>{p.date}</td>
                <td style={td}><Badge label="Paid" color={GREEN} bg={SUCCESS_BG} /></td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  {p.status === "Paid" && <DownloadReceiptBtn payment={p} />}
                </td>
              </tr>
            ))}
            {/* Session payments */}
            {sessionPayments.map((p, i) => (
              <tr key={`sess-${i}`} style={{ backgroundColor: SUCCESS_BG }}>
                <td style={{ ...td, fontFamily: "monospace", fontSize: 12, color: NAVY, fontWeight: 600 }}>{p.receiptNo}</td>
                <td style={{ ...td, fontFamily: "monospace", fontSize: 12, color: SLATE }}>{p.id}</td>
                <td style={td}>{p.desc}</td>
                <td style={{ ...td, fontWeight: 600 }}>{p.amount}</td>
                <td style={td}>{p.date}</td>
                <td style={td}><Badge label="Paid" color={GREEN} bg={SUCCESS_BG} /></td>
                <td style={{ ...td, whiteSpace: "nowrap" }}>
                  <DownloadReceiptBtn payment={{
                    id: p.id, desc: p.desc, amount: p.amount, date: p.date,
                    paymentMode: p.paymentMode, txnId: p.txnId, status: "Paid",
                    receiptNo: p.receiptNo, semester: "Semester 2",
                    feeItems: [{ label: p.desc, amount: p.amount, amountNum: 0 }],
                  }} />
                </td>
              </tr>
            ))}
            <tr style={{ backgroundColor: SUCCESS_BG }}>
              <td colSpan={3} style={{ ...td, fontWeight: 700, color: NAVY }}>TOTAL PAID</td>
              <td style={{ ...td, fontWeight: 700, color: GREEN }}>{formatRs(dynamicPaid)}</td>
              <td colSpan={3} style={td}></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Pending Dues */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${RED}`, borderRadius: 4, padding: 16, marginBottom: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: RED, marginBottom: 4 }}>
          Outstanding Balance — Action Required
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10 }}>
          <thead>
            <tr style={{ backgroundColor: ERROR_BG }}>
              {["Description", "Amount", "Due Date", "Status", "Action"].map((h) => (
                <th key={h} style={{ ...th, color: RED }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {allPendingDues.map((d, i) => {
              const isPaid = paidIds.has(d.desc);
              return (
                <tr key={i} style={{ backgroundColor: isPaid ? SUCCESS_BG : i % 2 === 0 ? WHITE : ERROR_LIGHT }}>
                  <td style={{ ...td, fontWeight: 500 }}>{d.desc}</td>
                  <td style={{ ...td, fontWeight: 700, color: isPaid ? GREEN : RED }}>{d.amount}</td>
                  <td style={td}>{d.due}</td>
                  <td style={td}>
                    {isPaid
                      ? <Badge label="Paid" color={GREEN} bg={SUCCESS_BG} />
                      : <Badge label="Overdue" color={RED} bg={ERROR_BORDER} />}
                  </td>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>
                    {isPaid ? (
                      <span style={{ fontSize: 12, fontWeight: 700, color: GREEN }}>✓ Paid</span>
                    ) : (
                      <button
                        onClick={() => setActiveDue(d)}
                        style={{ padding: "5px 14px", backgroundColor: RED, color: WHITE, border: "none", borderRadius: 4, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            <tr style={{ backgroundColor: dynamicOutstanding > 0 ? ERROR_BG : SUCCESS_BG }}>
              <td style={{ ...td, fontWeight: 700, color: dynamicOutstanding > 0 ? RED : GREEN }}>TOTAL OUTSTANDING</td>
              <td style={{ ...td, fontWeight: 700, color: dynamicOutstanding > 0 ? RED : GREEN, fontSize: 15 }}>{formatRs(dynamicOutstanding)}</td>
              <td colSpan={3} style={td}></td>
            </tr>
          </tbody>
        </table>
        {dynamicOutstanding > 0 && (
          <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: ERROR_BG, border: `1px solid ${ERROR_LIGHT2}`, borderRadius: 4, fontSize: 13, color: RED, fontWeight: 500 }}>
            ⚠ Please clear your outstanding dues to avoid examination restrictions.
          </div>
        )}
        {dynamicOutstanding === 0 && (
          <div style={{ marginTop: 12, padding: "8px 12px", backgroundColor: SUCCESS_BG, border: `1px solid #86efac`, borderRadius: 4, fontSize: 13, color: GREEN, fontWeight: 600 }}>
            ✓ All outstanding dues have been cleared. You are eligible for all examinations.
          </div>
        )}
      </div>

      {/* Upcoming Dues */}
      <div style={{ backgroundColor: WHITE, border: `1px solid ${BORDER}`, borderRadius: 4, padding: 16, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: SLATE, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
          Upcoming Dues
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: BG_TABLE }}>
              {["Description", "Estimated Amount", "Estimated Due Date", "Status"].map((h) => <th key={h} style={th}>{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {upcomingDues.map((d, i) => (
              <tr key={i} style={{ backgroundColor: i % 2 === 0 ? WHITE : BG_LIGHT }}>
                <td style={{ ...td, fontWeight: 500 }}>{d.desc}</td>
                <td style={{ ...td, fontWeight: 600 }}>{d.amount}</td>
                <td style={td}>{d.due}</td>
                <td style={td}><Badge label="Upcoming" color={AMBER} bg={WARN_BG} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
