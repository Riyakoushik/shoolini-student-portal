import { NAVY, GOLD } from "../constants";

export default function UniversityLogo({
  size = 80,
  variant = "color",
}: {
  size?: number;
  variant?: "color" | "white";
}) {
  const navyFill = variant === "color" ? NAVY : "transparent";
  const goldColor = variant === "color" ? GOLD : "white";
  const whiteColor = "white";
  const bookFill = variant === "color" ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.25)";
  const lineColor = variant === "color" ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.7)";
  const textColor = variant === "color" ? GOLD : "white";
  const topTextColor = variant === "color" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)";
  const ringStroke = variant === "color" ? "rgba(200,168,75,0.4)" : "rgba(255,255,255,0.3)";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: "block" }}
    >
      <defs>
        <path id="bottomArc" d="M 10,58 A 32,32 0 0,0 70,58" />
        <path id="topArc" d="M 16,28 A 27,27 0 0,1 64,28" />
      </defs>

      {/* Outer ring */}
      <circle cx="40" cy="40" r="38" fill={navyFill} stroke={goldColor} strokeWidth="2.5" />

      {/* Inner decorative ring */}
      <circle cx="40" cy="40" r="33" fill="none" stroke={ringStroke} strokeWidth="1" />

      {/* Torch handle */}
      <rect x="39" y="27" width="2" height="4" fill={goldColor} />

      {/* Flame outer */}
      <ellipse cx="40" cy="23" rx="3" ry="5" fill={goldColor} />

      {/* Flame inner */}
      <ellipse cx="40" cy="24" rx="1.5" ry="3" fill={whiteColor} opacity="0.6" />

      {/* Open book — left page */}
      <path
        d="M 40,30 C 35,30 22,33 22,34 L 22,48 L 40,48 Z"
        fill={bookFill}
        stroke={whiteColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Open book — right page */}
      <path
        d="M 40,30 C 45,30 58,33 58,34 L 58,48 L 40,48 Z"
        fill={bookFill}
        stroke={whiteColor}
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Book spine */}
      <line x1="40" y1="30" x2="40" y2="48" stroke={whiteColor} strokeWidth="1.5" />

      {/* Left page lines */}
      <line x1="25" y1="37" x2="38" y2="37" stroke={lineColor} strokeWidth="0.8" />
      <line x1="25" y1="40" x2="38" y2="40" stroke={lineColor} strokeWidth="0.8" />
      <line x1="25" y1="43" x2="38" y2="43" stroke={lineColor} strokeWidth="0.8" />

      {/* Right page lines */}
      <line x1="42" y1="37" x2="55" y2="37" stroke={lineColor} strokeWidth="0.8" />
      <line x1="42" y1="40" x2="55" y2="40" stroke={lineColor} strokeWidth="0.8" />
      <line x1="42" y1="43" x2="55" y2="43" stroke={lineColor} strokeWidth="0.8" />

      {/* Top arc text: EST. 1993 */}
      <text fontSize="4.8" fill={topTextColor} letterSpacing="1.2" textAnchor="middle">
        <textPath href="#topArc" startOffset="50%">EST. 1993</textPath>
      </text>

      {/* Bottom arc text: SHOOLINI UNIVERSITY */}
      <text fontSize="5" fill={textColor} letterSpacing="0.3" textAnchor="middle">
        <textPath href="#bottomArc" startOffset="50%">SHOOLINI UNIVERSITY</textPath>
      </text>
    </svg>
  );
}
