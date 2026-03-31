# Shoolini University Student Academic Portal
## Project Report

---

## 1. Project Overview

The **Shoolini University Student Academic Portal** is a fully client-side, single-page web application (SPA) built for student **Koushik Thalari** (MCA — Artificial Intelligence & Machine Learning, Batch 2025–2027). It replicates a real university academic management portal with 8 functional pages covering all aspects of student academic life — from login and dashboard to results, attendance, fees, assignments, timetable, and an academic calendar.

The portal is designed with a professional, institutional aesthetic using flat design principles — no gradients, no glassmorphism, no CSS animations — only clean solid colors and inline styles throughout.

---

## 2. Student Profile

| Field | Details |
|---|---|
| **Name** | Koushik Thalari |
| **Father's Name** | Thalari Jayaraju |
| **Mother's Name** | Thalari Shanthi |
| **Roll Number** | 2520MCA0087 |
| **Program** | Master of Computer Applications (MCA) |
| **Specialization** | Artificial Intelligence & Machine Learning |
| **Department** | School of Computer Science & Engineering (SCSE) |
| **University** | Shoolini University of Biotechnology and Management Sciences |
| **Campus** | Kasauli Hills, Solan, Himachal Pradesh — 173229 |
| **Batch** | 2025 – 2027 |
| **Current Semester** | 2 (Active) |
| **Total Semesters** | 4 |
| **Academic Advisor** | Dr. Priya Sharma |
| **University Email** | koushik.thalari@shooliniuniversity.com |
| **Offer Letter No** | SU/MCA/2025/OL/00487 |
| **DBA Reference** | DBA/SU/2025/MCA/09871 |
| **DigiLocker Consent ID** | DGL2025KT00487 |
| **Login Password** | Emet44 |

---

## 3. Technology Stack

| Layer | Technology |
|---|---|
| **UI Framework** | React 18 (with Hooks) |
| **Language** | TypeScript |
| **Build Tool** | Vite 7 |
| **Routing** | Wouter v3 |
| **Charts** | Recharts v2 (BarChart — horizontal & vertical) |
| **PDF Generation** | jsPDF v2.5.1 (fee receipts + offer letter) |
| **Styling** | 100% inline styles (no Tailwind classes used in components) |
| **Font** | Inter (Google Fonts — 400, 500, 600, 700) |
| **Code Splitting** | React.lazy + Suspense (all 8 pages lazy-loaded) |
| **Monorepo** | pnpm workspaces |
| **Package** | `@workspace/student-portal` |

---

## 4. Design System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `NAVY` | `#1a3a5c` | Primary brand — sidebar, header strip, buttons, PDF headers |
| `GOLD` | `#c8a84b` | Accent — logo text, sidebar highlights, PDF separator lines |
| `BLUE` | `#2563eb` | Active states, info badges, chart bars |
| `GREEN` | `#16a34a` | Success — submitted, paid, present, DigiLocker Verified |
| `RED` | `#dc2626` | Danger — overdue, absent, fees due |
| `AMBER` | `#d97706` | Warning — pending, upcoming |
| `PURPLE` | `#7c3aed` | Awaited results |
| `SLATE` | `#64748b` | Secondary text, table headers |
| `TEXT_DARK` | `#1e2a3a` | Primary text |
| `BG_PAGE` | `#f4f6f8` | Page background |
| `BORDER` | `#dde1e7` | All card/table borders |

### Design Rules

- Max shadow: `0 1px 3px rgba(0,0,0,0.06)`
- Border radius: `4px` for all cards, `50%` for avatars
- No CSS animations or transitions
- All spacing via inline `padding`/`margin` props
- Responsive layout via `useIsMobile()` hook (breakpoint: 768px)
- Print-safe: sidebar and header hidden on `@media print`
- `.no-print` CSS class hides download buttons when printing

---

## 5. Application Architecture

```
artifacts/student-portal/
├── src/
│   ├── App.tsx                  # Root: WouterRouter, Auth state, ProtectedLayout
│   ├── main.tsx                 # React DOM createRoot entry
│   ├── index.css                # Inter font import + base reset + .no-print rule
│   ├── constants.ts             # All color tokens, auth credentials, PORTAL_DATE
│   ├── assets/
│   │   └── shoolini-logo.png    # Official Shoolini University logo
│   ├── data/
│   │   └── studentData.ts       # All hardcoded student data + TypeScript interfaces
│   ├── hooks/
│   │   └── use-mobile.tsx       # useIsMobile() — window.matchMedia breakpoint hook
│   ├── components/
│   │   ├── Sidebar.tsx          # Fixed 240px navy sidebar with nav + user strip
│   │   ├── Header.tsx           # Sticky 56px white header + breadcrumb + bell
│   │   ├── StatusBadge.tsx      # Reusable colored badge for statuses
│   │   ├── ProgressBar.tsx      # Thin flat progress bar for attendance
│   │   └── UniversityLogo.tsx   # SVG university crest (fallback/alternate logo)
│   ├── utils/
│   │   ├── generateReceipt.ts   # jsPDF fee payment receipt generator
│   │   └── generateOfferLetter.ts # jsPDF offer letter PDF generator
│   └── pages/
│       ├── LoginPage.tsx        # Login form with credentials validation
│       ├── DashboardPage.tsx    # Overview with KPIs, chart, schedule, assignments
│       ├── ProfilePage.tsx      # Full student profile + offer letter sections
│       ├── TimetablePage.tsx    # Weekly schedule table (Sem 1 & 2)
│       ├── AssignmentsPage.tsx  # Assignment tracker with filters and deadlines
│       ├── ResultsPage.tsx      # IA results, midterm scores, exam schedule
│       ├── AttendancePage.tsx   # Per-subject attendance with progress bars
│       ├── FeesPage.tsx         # Fee structure, payment history + receipt download
│       └── CalendarPage.tsx     # Interactive monthly calendar with event dots
├── package.json                 # @workspace/student-portal (includes jspdf)
└── vite.config.ts               # PORT + BASE_PATH env, allowedHosts: true
```

---

## 6. Pages & Features

### 6.1 Login Page
- Official Shoolini University logo displayed in white (CSS filter invert)
- University tagline, NAAC B+ and UGC Certified labels
- Roll Number and Password fields with emoji icons
- Show/hide password toggle
- Credentials validation against hardcoded constants (`LOGIN_ROLL`, `LOGIN_PASSWORD`)
- Red error banner on invalid login attempt
- Footer with registrar and IT support contact details

### 6.2 Dashboard
- Time-of-day greeting ("Good morning/afternoon/evening, Koushik Thalari")
- **Live Class Card** — appears when wall-clock time falls within a scheduled class window; includes "Mark Present" button that updates attendance counters
- **4 KPI Cards** — Current Semester, Mid-term Average, Attendance %, Pending Tasks
- **Semester Progress Timeline** — dynamic view of all 4 semesters. Automatically highlights Active, Completed, or Upcoming based on the `PORTAL_DATE`.
- **Mid-term Bar Chart** — Recharts BarChart of subject scores (falls back to "Pending Exams" placeholder if mid-terms haven't occurred for the active semester).
- **Today's Schedule** — Automatically queries the active semester's daily timetable based on the `PORTAL_DATE`.
- **Upcoming Assignment Deadlines** — dynamic list pulling directly from the currently active semester's dataset.
- **Upcoming Examinations** — dynamically queries the internal assessment schedule (`IASchedule`) of the active semester.
- **Official Links** — 5 quick-links to Shoolini University web properties
- **Notification Bell** — delayed 3-second popup on Dashboard reminding about pending tasks

### 6.3 My Profile
- Avatar initials card (KT) with "Upload Photo" link and print/download buttons
- Personal Information table (name, DOB, gender, Aadhaar, contact, languages)
- Academic Information table (15 fields — program, dept, campus, advisor, etc.)
- Semester Overview table (all 4 semesters with status, result, attendance)
- Academic Performance summary KPIs + Recharts BarChart of Sem 2 midterm scores
- Skills section — Technical Skills, AI/ML Areas, Tools & Platforms (chip badges)
- Contact & Address cards (campus + permanent home)
- University info card (navy background) with NAAC, QS, UGC stats
- **Joining Offer Letter Summary** — Offer Letter No, Issue Date, Reporting Date, Orientation, Classes Begin, father/mother names, DBA Reference, DigiLocker Consent ID; green "DigiLocker Verified ✓" badge; "↓ Download Offer Letter PDF" button
- **Document Submission & Verification Status** — 14-document table (Bachelor's Degree, Mark Sheets, TC, Migration, Character, Medical Fitness, Aadhaar, Photographs, Anti-Ragging × 2, Income, Domicile, Gap Certificate, Category Certificate) — each showing Submitted Via (DigiLocker / DBA Portal) + green ✓ Verified badge; DigiLocker Partner ID, DBA Ref No, Verification Date noted below
- **Offer Letter Fee Structure** — Semester fee table (Sem 1–4 with Tuition/Exam/Lab/Library/Activity columns), Miscellaneous fees (7 items, ₹36,000 total), Grand Total ₹2,50,000, payment schedule, UPI/NEFT/DD payment mode info
- **DigiLocker & DBA Verification Steps** — 4 completed steps checklist with green checkmarks

### 6.4 Timetable
- Tab switcher: Semester 1 (Completed), Semester 2 (Active), Semester 3 (Upcoming), Semester 4 (Upcoming)
- Full weekly schedules generated for all 4 semesters: Monday–Saturday, mapping exact times and durations.
- **Semester 3 & 4** tabs display a warning notice pointing to the future start date (e.g., July 6, 2026).
- Alternate-week notice banner
- Subject legend with color swatches

### 6.5 Assignments
- 4-semester Tab switcher.
- **Sem 1**: 8 submitted assignments with marks out of 10
- **Sem 2**: 18 assignments with real-time status computation (Pending/Overdue based on PORTAL_DATE)
- **Sem 3 (Upcoming)**: Highlights the upcoming "AI-Powered Personalized Learning System" Mini Project, assignment counts, and a table of future assignments.
- **Sem 4 (Upcoming)**: Highlights the 12-credit "Multimodal AI System" Dissertation milestones, project guide details, and future assignment table.
- Filter buttons for active semesters: All / Submitted / Pending / Overdue (with count badges).

### 6.6 Results
- 4-semester Tab switcher.
- **Sem 1**: Internal Assessment 1 (avg 25.5/30) + IA2 (avg 26.5/30) with grade tables; Theory + Practical exam schedule with "Awaited" status.
- **Sem 2**: Mid-term results table (7 subjects, Mar 17–25, 2026) with scores and A+ grades; 3 KPI cards (avg 85, high 88, low 82); vertical Recharts BarChart.
- **Sem 3 & 4**: Comprehensive placeholders outlining future subjects, credits, faculty details, and specific project rubrics to manage student expectations.

### 6.7 Attendance Record
- 4-semester Tab switcher.
- **Automated Algorithm**: Daily attendance logs are programmatically generated using `generateDailyAttendance()` which evaluates public holidays, weekends, and past dates against a randomized weighting matrix.
- **Daily Log View**: Interactive month toggle (e.g., Jan, Feb, Mar) that prints an actual visual calendar grid showing precise dates marked as Present (Green P), Absent (Red A), Holiday (Gray H), or Off (Gray Off).
- Warning banner for any subject below 75% threshold.
- Per-subject table with present/absent/total counts, percentage, progress bar.
- **Sem 3 & 4**: Present clean, dynamic empty-state cards establishing targets for the upcoming terms.

### 6.8 Fees & Payments
- 3 KPI cards: Total Paid (₹66,000), Outstanding Balance (₹57,000 — highlighted red), Next Due Date
- Complete fee structure table across all 4 semesters (Tuition, Exam, Lab, Library, Activity fees)
- Program total row: ₹2,46,000
- **Payment History** — 7-column table: Receipt No, Payment ID, Description, Amount, Date, Status, Receipt
  - Each paid row shows a "↓ Download Receipt" navy button (only rendered when `status === "Paid"`)
  - Clicking downloads an A4 PDF receipt (see Section 11 — PDF Generation)
  - Receipt column and header carry `.no-print` class — hidden on browser print
- **Pending/Overdue dues** section with red border-left alert: Sem 1 balance ₹20,500 + Sem 2 balance ₹36,500 = ₹57,000 outstanding
- Warning message: "Please clear your outstanding dues to avoid examination restrictions"
- Upcoming dues table: Sem 3 (₹62,500 / Jul 2026), Sem 4 (₹60,500 / Jan 2027)

### 6.9 Academic Calendar
- Interactive monthly calendar (starts on March 2026)
- Previous/Next month navigation
- Color-coded event dots per day: Red = Exam, Amber = Assignment, Blue = College Event, Green = Holiday
- Hover tooltip shows event type badge + event label
- Past events rendered at 45% opacity
- Today's date highlighted with navy circle
- Event legend strip below calendar
- Full event dataset covering Aug 2025 – Jun 2026 (Sem 1 + Sem 2 events)

---

## 7. Data Model

All data is defined in `src/data/studentData.ts` as TypeScript interfaces and exported constants.

### Core Data

| Export | Description |
|---|---|
| `student` | Student profile object |
| `semesterTimeline` | 4 semester status/date records |
| `sem1Subjects` — `sem4Subjects` | Subject lists for all 4 semesters |
| `sem1TimetableDaily` — `sem4TimetableDaily` | Daily class schedule objects for all 4 semesters |
| `sem1Attendance` / `sem2Attendance` | Attendance totals, per-subject breakdown, and auto-generated daily logs |
| `sem1Assignments` — `sem4Assignments` | Assignments across the full academic life cycle |
| `sem3Project` / `sem4Dissertation` | Extended metadata for major academic milestones |
| `sem2MidtermResults` | 7 subject midterm scores (Mar 2026) |
| `sem1IA1` / `sem1IA2` | Internal Assessment results for Sem 1 |
| `sem1IASchedule` — `sem4IASchedule` | Internal Assessment and Examination timetables |
| `feesData` | Fee structure, payment history (enriched), dues |
| `calendarEvents` | ~60 calendar events across both semesters |
| `offerLetterData` | Joining offer letter details, doc verification, fee structure, DigiLocker steps |
| `PUBLIC_HOLIDAYS` | Array of constant dates used by the attendance generator |

### FeeRecord Interface (enriched)

The `FeeRecord` interface was extended to support PDF receipt generation:

| Field | Type | Description |
|---|---|---|
| `id` | `string?` | Payment ID (e.g. SU-2025-001) |
| `desc` | `string` | Payment description |
| `amount` | `string` | Display amount (with ₹ symbol) |
| `date` | `string?` | Payment date |
| `status` | `string?` | "Paid" / "Overdue" / etc. |
| `receiptNo` | `string?` | Official receipt number (e.g. PAY-2025-001) |
| `paymentMode` | `string?` | UPI / NEFT / RTGS |
| `txnId` | `string?` | UPI transaction ID |
| `semester` | `string?` | Descriptive semester/installment label |
| `feeItems` | `FeeItem[]?` | Per-line fee breakdown for receipt |

### OfferLetterData Interface

| Field | Type | Description |
|---|---|---|
| `joining` | object | Offer letter no, dates, parent names, DBA/DigiLocker refs |
| `documents` | `OfferLetterDocument[]` | 14-item verification list (doc, via, status) |
| `semesterFees` | `OfferLetterSemesterFee[]` | 4-semester fee breakdown |
| `miscFees` | `OfferLetterMiscFee[]` | 7 one-time miscellaneous fees |
| `paymentSchedule` | `OfferLetterPaymentSchedule[]` | 4 installment rows |
| `digiLockerSteps` | `OfferLetterDigiLockerStep[]` | 4 completed verification steps |

---

## 8. Routing Structure

The app uses **Wouter** with `base={import.meta.env.BASE_URL}` for path-based proxy routing.

| Route | Component | Protection |
|---|---|---|
| `/` | LoginPage | Public — redirects to `/dashboard` if authenticated |
| `/dashboard` | DashboardPage | Protected |
| `/profile` | ProfilePage | Protected |
| `/timetable` | TimetablePage | Protected |
| `/assignments` | AssignmentsPage | Protected |
| `/results` | ResultsPage | Protected |
| `/attendance` | AttendancePage | Protected |
| `/fees` | FeesPage | Protected |
| `/calendar` | CalendarPage | Protected |
| `*` | Redirect | → `/dashboard` if auth, → `/` if not |

All protected pages are wrapped in `ProtectedLayout` which renders the Sidebar + Header shell and redirects unauthenticated users to `/`.

---

## 9. Reusable Components

### `StatusBadge`
Renders a color-coded inline badge for any status string.

| Status | Background | Color |
|---|---|---|
| Submitted / Paid / Completed / Present | `#dcfce7` | `#16a34a` (Green) |
| Pending / Upcoming | `#fffbeb` | `#d97706` (Amber) |
| Overdue / Absent | `#fee2e2` | `#dc2626` (Red) |
| Awaited / Processing | `#ede9fe` | `#7c3aed` (Purple) |
| Active | `#dbeafe` | `#2563eb` (Blue) |

### `ProgressBar`
A flat, thin (6px) progress bar. Accepts `value` (0–100) and optional `color` prop.

### `Sidebar`
- Fixed 240px left sidebar (navy background)
- Logo + "Office of Academic Affairs" tagline
- 8 nav items with emoji icons, active highlight (gold left border), hover effect
- Badges: Assignments (5, amber) and Fees (!, red)
- User strip at bottom: KT avatar, name, roll, Sem 2 Active badge, Logout button
- Mobile: slide-in with translateX, close button, backdrop overlay

### `Header`
- Sticky 56px white header
- Mobile: hamburger ☰ button
- Breadcrumb: Home / {current page title}
- Desktop: NAAC B+ and UGC Certified trust badges
- Right side: date, Semester 2 Active badge, notification bell, KT avatar
- Bell notification: 3-second delayed popup on Dashboard (one-shot, dismissible)

### `UniversityLogo`
SVG crest with torch, open book, and "SHOOLINI UNIVERSITY / EST. 1993" arc text. Supports `color` and `white` variants.

---

## 10. Academic Data Summary

### Semester 1 (Aug 11, 2025 – Jan 17, 2026) — Completed

**Subjects**: Data Structures, Computer Networks, Operating Systems, Software Engineering, Web Technologies, Python Programming, Mathematics for Computing, Database Management Systems

| IA | Period | Average |
|---|---|---|
| IA 1 | Sep 1 – Oct 1, 2025 | 25.5 / 30 |
| IA 2 | Nov 15 – Nov 30, 2025 | 26.5 / 30 |

**Theory Exams**: Dec 9–18, 2025 | **Practical Exams**: Jan 16–17, 2026 | **Results**: Awaited

**Attendance**: 107/108 classes = **99.07%**

**Assignments**: 8/8 submitted — avg marks 9/10

---

### Semester 2 (Jan 19, 2026 – Jun 30, 2026) — Active

**Subjects**: Advanced Machine Learning, Deep Learning, Cloud Computing, Advanced Algorithms, Computer Vision, Data Analytics, Natural Language Processing

**Mid-term Results** (Mar 17–25, 2026):

| Subject | Faculty | Score | Grade |
|---|---|---|---|
| Advanced Machine Learning | Dr. Priya Sharma | 85 | A+ |
| Deep Learning | Dr. Rajesh Kumar | 88 | A+ |
| Natural Language Processing | Dr. Anita Desai | 82 | A+ |
| Computer Vision | Prof. Vikram Mehta | 86 | A+ |
| Data Analytics | Dr. Suresh Patel | 84 | A+ |
| Cloud Computing | Prof. Meera Iyer | 83 | A+ |
| Advanced Algorithms | Dr. Arjun Reddy | 87 | A+ |

**Average**: 85/100 | **Highest**: 88 | **Lowest**: 82

**Attendance**: 46/47 classes = **97.87%**

**Assignments**: 13 submitted, 5 pending (due Mar 30 – Apr 10, 2026)

---

### Fees Summary

| Category | Amount |
|---|---|
| Total Program Fees | ₹2,46,000 |
| Total Paid (3 installments) | ₹66,000 |
| Outstanding Balance | ₹57,000 (Overdue) |
| Next Due | Semester 3 — July 2026 |

### Offer Letter Fee Structure (from Admission Offer)

| Semester | Total |
|---|---|
| Semester 1 | ₹55,000 |
| Semester 2 | ₹55,000 |
| Semester 3 | ₹53,000 |
| Semester 4 | ₹51,000 |
| Miscellaneous (one-time) | ₹36,000 |
| **Grand Total** | **₹2,50,000** |

---

## 11. Key Implementation Details

### PORTAL_DATE & Dynamic Application State
The portal uses a global `PORTAL_DATE = new Date("2026-03-31")` instead of `new Date()`. This guarantees:
- Assignment overdue computation is deterministic.
- Calendar "today" highlights are consistent.
- **Dashboard Global State**: The active semester (`activeSem`) is natively calculated mathematically by iterating over `semesterTimeline` and comparing `PORTAL_DATE` against semester start boundaries. This forces every list (assignments, schedule, exams) to seamlessly adapt to the simulated active semester dynamically.

### Attendance Algorithmic Automation
Instead of rigidly hardcoding hundreds of dates, the platform implements a `generateDailyAttendance()` function:
- Skips Sundays and a predefined list of 16 North Indian public holidays (`PUBLIC_HOLIDAYS`).
- Seeds randomized probability curves for attendance.
- Accumulates detailed subject-specific logs until `PORTAL_DATE` is reached.
- Provides realistic, dynamically shifting tracking arrays consumed cleanly by the new Attendance Calendar UI.

### Live Class Detection
The `getLiveClass()` function uses PORTAL_DATE's day-of-week (Wednesday) to look up the timetable, but reads the actual system clock (`new Date()`) for hours/minutes. This means the "LIVE NOW" banner appears if you browse the portal during 9:00 AM–1:00 PM on any day (matching Wednesday's Advanced Algorithms slot).

### Auth State
Authentication is held in React state (`useState(false)` in the root `App` component). Logging out resets it to false. State is not persisted — refreshing the page returns to login.

### Responsive Design
- Sidebar: transforms off-screen on mobile (`translateX(-240px)`); toggled by hamburger button
- Grid layouts adapt: 4-col KPIs → 2-col, 2-col panels → 1-col
- Main content `marginLeft` switches from 240px (desktop) to 0 (mobile)
- `useIsMobile()` hook watches `window.matchMedia("(max-width: 768px)")`

### Code Splitting
All 8 page components are loaded via `React.lazy()` and wrapped in `<Suspense fallback={<div>Loading...</div>}>`, reducing the initial bundle size.

### PDF Generation (jsPDF)

Two PDF generators live in `src/utils/`:

**`generateReceipt.ts`** — Fee Payment Receipt
- Called from `FeesPage.tsx` per paid payment row
- A4 portrait, single page
- Layout: navy header strip + white logo + "FEE PAYMENT RECEIPT" title → gold separator → receipt meta strip → two-column info block (student left / payment details right) → fee breakdown table with alternating rows → bold navy total row → green "PAYMENT CONFIRMED" badge → UPI TXN ID → gold divider → footer → bottom navy bar
- Filename: `Receipt_{receiptNo}_KoushikThalari.pdf`

**`generateOfferLetter.ts`** — University Joining Offer Letter
- Called from `ProfilePage.tsx` via "↓ Download Offer Letter PDF" button
- A4 portrait, multi-page
- Layout: navy header + white logo + "JOINING OFFER LETTER" title → gold separator → Ref No / Date strip → formal prose paragraphs → admission details table → 14-document verification table → semester fee table → miscellaneous fees → grand total → payment schedule → DigiLocker steps → signature block → footer
- Filename: `OfferLetter_SU-MCA-2025-OL-00487_KoushikThalari.pdf`

**Shared technique for both generators:**
- Logo is white-inverted at runtime via canvas pixel manipulation (replicates `filter: brightness(0) invert(1)`)
- Helvetica (built-in jsPDF font) used throughout; `₹` replaced with `Rs.` (font limitation)
- Both exports are `async` functions that call `doc.save(filename)` on completion

### Print Safety
- `@media print { .no-print { display: none !important; } }` in `index.css`
- Download-action columns in Fees table carry `className="no-print"` — disappear on print
- Sidebar and header carry `className="sidebar-container"` / `className="header-container"` — hidden via inline `<style>` tag in `ProtectedLayout`

---

## 12. File Summary

| File | Purpose |
|---|---|
| `src/App.tsx` | Root app, routing, ProtectedLayout shell |
| `src/constants.ts` | All design tokens + auth constants |
| `src/data/studentData.ts` | All student data + TypeScript interfaces (incl. enriched FeeRecord + OfferLetterData) |
| `src/utils/generateReceipt.ts` | jsPDF fee payment receipt generator |
| `src/utils/generateOfferLetter.ts` | jsPDF offer letter PDF generator |
| `src/pages/LoginPage.tsx` | Login form UI |
| `src/pages/DashboardPage.tsx` | Main dashboard |
| `src/pages/ProfilePage.tsx` | Student profile + 4 offer letter sections + download button |
| `src/pages/TimetablePage.tsx` | Weekly timetable |
| `src/pages/AssignmentsPage.tsx` | Assignment tracker |
| `src/pages/ResultsPage.tsx` | Exam results |
| `src/pages/AttendancePage.tsx` | Attendance record |
| `src/pages/FeesPage.tsx` | Fees & payments + receipt download buttons |
| `src/pages/CalendarPage.tsx` | Academic calendar |
| `src/components/Sidebar.tsx` | Navigation sidebar |
| `src/components/Header.tsx` | Top header bar |
| `src/components/StatusBadge.tsx` | Status badge component |
| `src/components/ProgressBar.tsx` | Progress bar component |
| `src/components/UniversityLogo.tsx` | SVG university crest |
| `src/hooks/use-mobile.tsx` | Mobile breakpoint hook |
| `src/index.css` | Font import, base reset, `.no-print` media rule |

---

## 13. How to Run

```bash
# Install dependencies (from workspace root)
pnpm install

# Start the student portal dev server
pnpm --filter @workspace/student-portal run dev

# Or restart the workflow in Replit:
# Workflow: "artifacts/student-portal: web"
```

**Login**: Roll Number `2520MCA0087` / Password `Emet44`

---

## 14. University Information

| Field | Details |
|---|---|
| **University** | Shoolini University of Biotechnology and Management Sciences |
| **Location** | Kasauli Hills, Solan, Himachal Pradesh — 173229 |
| **Established** | 2009 (Est. 1993 as institute) |
| **NAAC Grade** | B+ |
| **UGC Status** | Certified |
| **AICTE** | Approved |
| **NIRF** | Ranked |
| **ISO** | 9001:2015 Certified |
| **Website** | shooliniuniversity.com |
| **Phone** | +91 7018007000 |
| **Admissions Email** | admissions@shooliniuniversity.com |
| **Registrar Email** | registrar@shooliniuniversity.com |
| **IT Support** | itsupport@shooliniuniversity.com |
| **UPI ID** | shooliniuniversity@hdfcbank |

---

## 15. Changelog

### v1.0 — Initial Release
- Complete portal with 8 pages: Login, Dashboard, My Profile, Timetable, Assignments, Results, Attendance, Fees & Payments, Calendar
- All academic data hardcoded for Koushik Thalari (MCA AI/ML, Batch 2025–2027)

### v1.1 — Fee Receipt PDF Download
- Installed jsPDF as a production dependency
- Extended `FeeRecord` interface with `receiptNo`, `paymentMode`, `txnId`, `semester`, `feeItems`
- Enriched all 3 payment records with per-line fee breakdowns and UPI transaction IDs
- Created `src/utils/generateReceipt.ts` — professional A4 PDF receipt generator
- Updated Fees page: added Receipt No column + "↓ Download Receipt" button per paid row
- Added `.no-print` global CSS rule to hide download buttons on browser print
- Download button explicitly gated on `status === "Paid"`

### v1.2 — Offer Letter in My Profile
- Added `OfferLetterData` interface and `offerLetterData` constant to `studentData.ts`
- Created `src/utils/generateOfferLetter.ts` — multi-page A4 offer letter PDF generator
- Appended 4 new sections to `ProfilePage.tsx` (below University Info card):
  - **Section A**: Joining Offer Letter Summary with green DigiLocker Verified badge + Download PDF button
  - **Section B**: 14-document verification status table (DigiLocker + DBA Portal sources)
  - **Section C**: Offer letter fee structure (semester table + misc fees + grand total ₹2,50,000 + payment schedule)
  - **Section D**: DigiLocker & DBA verification steps checklist

### v2.0 — Fully Integrated 4-Semester Experience
- **Dynamic Logic Framework:** Completely modernized the app's architectural logic to adapt on the fly to `PORTAL_DATE`. The entire experience (Dashboard, active classes, assignments, exams) transitions flawlessly as time moves forward into Sem 3 and Sem 4 boundaries.
- **Roll Number Migration:** Auth credential standard updated to `2520MCA0087`.
- **Complete Syllabus Coverage:** Embedded the entirety of Sem 3 (AI integration, NLP, Projects) and Sem 4 (Dissertation focus, Medical diagnostic AI) into `studentData.ts`.
- **Attendance Calendar & Auto-Generator:** Deployed `generateDailyAttendance()`, eliminating heavy static data structures in favor of programmatic calendar generation (factoring in public holidays and weekends constraint).
- **Sem 3 & 4 Extended UI:** Re-architected `AssignmentsPage.tsx`, `ResultsPage.tsx`, `AttendancePage.tsx`, and `TimetablePage.tsx` to handle 4-semester tabbed modes, adding incredibly rich upcoming aesthetic states highlighting capstone dissertation goals, future assignment volumes, and expected subject credits.
- **Comprehensive Verifications:** Entire architecture fully vetted via subagent headless browser tests across all major UI permutations.

---

*Report last updated: 31 March 2026*
*Student: Koushik Thalari | Roll: 2520MCA0087 | MCA AI/ML | Batch 2025–2027*
