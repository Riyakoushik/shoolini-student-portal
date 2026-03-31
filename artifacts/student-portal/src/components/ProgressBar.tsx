import { GREEN, SLATE_BORDER } from "../constants";

export default function ProgressBar({
  value,
  color = GREEN,
}: {
  value: number;
  color?: string;
}) {
  return (
    <div style={{ width: "100%", backgroundColor: SLATE_BORDER, height: 6, borderRadius: 0 }}>
      <div
        style={{
          width: `${Math.min(100, value)}%`,
          height: 6,
          backgroundColor: color,
          borderRadius: 0,
        }}
      />
    </div>
  );
}
