import {
  SUCCESS_BG, GREEN, WARN_BG, AMBER, ERROR_BORDER, RED,
  PURPLE_LIGHT, PURPLE, INFO_BG, BLUE, BG_TABLE, SLATE,
} from "../constants";

type BadgeStatus =
  | "Submitted" | "Published" | "Paid" | "Present"
  | "Pending" | "Overdue" | "Absent" | "Awaited"
  | "Active" | "Completed" | "Upcoming" | "Processing";

const badgeStyles: Record<BadgeStatus, { backgroundColor: string; color: string }> = {
  Submitted:  { backgroundColor: SUCCESS_BG,  color: GREEN  },
  Published:  { backgroundColor: SUCCESS_BG,  color: GREEN  },
  Paid:       { backgroundColor: SUCCESS_BG,  color: GREEN  },
  Present:    { backgroundColor: SUCCESS_BG,  color: GREEN  },
  Completed:  { backgroundColor: SUCCESS_BG,  color: GREEN  },
  Pending:    { backgroundColor: WARN_BG,     color: AMBER  },
  Upcoming:   { backgroundColor: WARN_BG,     color: AMBER  },
  Overdue:    { backgroundColor: ERROR_BORDER, color: RED   },
  Absent:     { backgroundColor: ERROR_BORDER, color: RED   },
  Awaited:    { backgroundColor: PURPLE_LIGHT, color: PURPLE },
  Processing: { backgroundColor: PURPLE_LIGHT, color: PURPLE },
  Active:     { backgroundColor: INFO_BG,      color: BLUE  },
};

const defaultStyle = { backgroundColor: BG_TABLE, color: SLATE };

export default function StatusBadge({ status }: { status: string }) {
  const style = badgeStyles[status as BadgeStatus] ?? defaultStyle;
  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 10px",
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 500,
        lineHeight: "20px",
        backgroundColor: style.backgroundColor,
        color: style.color,
      }}
    >
      {status}
    </span>
  );
}
