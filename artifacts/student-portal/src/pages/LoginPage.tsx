import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import shooliniLogo from "@/assets/shoolini-logo.png";
import { NAVY, GOLD, BLUE, RED, LOGIN_ROLL, SYSTEM_PASSWORD, SLATE, SLATE_LIGHT, WHITE, BORDER, TEXT_DARK, BG_LIGHT, ERROR_BG, ERROR_BORDER, ERROR_LIGHT2 } from "../constants";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    document.title = "Sign In — Shoolini University";
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === LOGIN_ROLL && password === SYSTEM_PASSWORD) {
      setError(false);
      onLogin();
      setLocation("/dashboard");
    } else {
      setError(true);
    }
  };

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%",
    height: 42,
    paddingLeft: 38,
    paddingRight: 12,
    border: `1px solid ${hasError ? ERROR_BORDER : BORDER}`,
    borderRadius: 4,
    fontSize: 14,
    color: TEXT_DARK,
    outline: "none",
    boxSizing: "border-box" as const,
    backgroundColor: WHITE,
    fontFamily: "Inter, system-ui, sans-serif",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: BG_LIGHT,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, system-ui, sans-serif",
        padding: "24px 16px",
      }}
    >
      {/* Main card */}
      <div
        style={{
          width: 460,
          maxWidth: "100%",
          backgroundColor: WHITE,
          border: `1px solid ${BORDER}`,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        {/* TOP SECTION — navy */}
        <div
          style={{
            backgroundColor: NAVY,
            padding: "32px 24px",
            textAlign: "center",
          }}
        >
          {/* Real university logo */}
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
            <img
              src={shooliniLogo}
              alt="Shoolini University"
              style={{ width: 220, height: "auto", display: "block", filter: "brightness(0) invert(1)" }}
            />
          </div>

          {/* Tagline */}
          <div style={{ color: GOLD, fontSize: 12, letterSpacing: "0.04em", marginBottom: 4 }}>
            Shoolini University of Biotechnology and Management Sciences
          </div>
          <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, letterSpacing: "0.03em", marginBottom: 14 }}>
            Kasauli Hills, Solan, Himachal Pradesh &mdash; NAAC B+ &nbsp;|&nbsp; UGC Certified
          </div>

          {/* Divider */}
          <div
            style={{
              height: 1,
              backgroundColor: "rgba(255,255,255,0.2)",
              marginBottom: 14,
            }}
          />

          {/* Portal label */}
          <div
            style={{
              color: "white",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Student Academic Portal
          </div>
        </div>

        {/* MIDDLE SECTION — form */}
        <div style={{ padding: "32px 28px" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: SLATE,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 20,
            }}
          >
            Sign In to Your Account
          </div>

          <form onSubmit={handleSubmit}>
            {/* Roll Number */}
            <div style={{ marginBottom: 16 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: TEXT_DARK,
                  marginBottom: 6,
                }}
              >
                Roll Number / Username
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 15,
                    color: SLATE_LIGHT,
                    pointerEvents: "none",
                    lineHeight: 1,
                  }}
                >
                  👤
                </span>
                <input
                  type="text"
                  placeholder="Enter your 12-digit roll number"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(false); }}
                  style={inputStyle(error)}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: error ? 12 : 20 }}>
              <label
                style={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 500,
                  color: TEXT_DARK,
                  marginBottom: 6,
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    left: 11,
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: 15,
                    color: SLATE_LIGHT,
                    pointerEvents: "none",
                    lineHeight: 1,
                  }}
                >
                  🔒
                </span>
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false); }}
                  style={{ ...inputStyle(error), paddingRight: 40 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: SLATE_LIGHT,
                    fontSize: 14,
                    padding: 0,
                    lineHeight: 1,
                  }}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div
                style={{
                  backgroundColor: ERROR_BG,
                  border: `1px solid ${ERROR_LIGHT2}`,
                  borderRadius: 4,
                  padding: "10px 14px",
                  marginBottom: 16,
                  fontSize: 13,
                  color: RED,
                  fontWeight: 500,
                }}
              >
                ⚠ Invalid Roll Number or Password. Please try again.
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: 44,
                backgroundColor: NAVY,
                color: "white",
                border: "none",
                borderRadius: 4,
                fontSize: 14,
                fontWeight: 600,
                letterSpacing: "0.05em",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = NAVY; }}
            >
              LOGIN TO PORTAL →
            </button>
          </form>
        </div>

        {/* BOTTOM SECTION */}
        <div
          style={{
            backgroundColor: BG_LIGHT,
            borderTop: `1px solid ${BORDER}`,
            padding: "16px 28px",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div>
            <div style={{ fontSize: 11, color: SLATE, marginBottom: 2 }}>For login issues contact:</div>
            <a href="mailto:registrar@shooliniuniversity.com" style={{ fontSize: 11, color: BLUE, textDecoration: "none" }}>
              registrar@shooliniuniversity.com
            </a>
            <span style={{ fontSize: 11, color: SLATE }}> &nbsp;|&nbsp; +91 7018007000</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: SLATE, marginBottom: 2 }}>IT Support</div>
            <a href="mailto:itsupport@shooliniuniversity.com" style={{ fontSize: 11, color: BLUE, textDecoration: "none" }}>
              itsupport@shooliniuniversity.com
            </a>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <div
        style={{
          marginTop: 20,
          fontSize: 12,
          color: SLATE,
          textAlign: "center",
        }}
      >
        Shoolini University of Biotechnology and Management Sciences<br />
        Kasauli Hills, Solan, Himachal Pradesh — 173229<br />
        UGC Certified &nbsp;|&nbsp; NAAC B+ Accredited &nbsp;|&nbsp; Estd. 2009
      </div>
    </div>
  );
}
