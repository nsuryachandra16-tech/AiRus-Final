# Design Guidelines: AiRus - AI College Assistant

## Design Approach

**Selected Framework:** Hybrid approach combining productivity app patterns (Notion, Linear, Todoist) with the established dark glassmorphism aesthetic. The app prioritizes clarity and focus for students while maintaining visual appeal through glass effects and strategic accent usage.

**Core Design Principle:** Create a calm, focused environment that reduces cognitive load while providing quick access to essential academic tools.

---

## Color Palette

### Dark Mode (Primary)
- **Background Base:** 17 5% 6% (deep charcoal #111010)
- **Glass Cards:** rgba(10, 10, 10, 0.25) with 12px backdrop blur
- **Card Borders:** rgba(255, 255, 255, 0.05)

### Accent Colors
- **Primary Accent:** 45 98% 54% (warm yellow #facc15)
- **Accent Hover:** 45 98% 61% (lighter yellow #fde047)
- **Accent Glow:** rgba(250, 204, 21, 0.5) for subtle emphasis
- **CRITICAL:** Use yellow accent sparingly - only for primary CTAs, active states, and important indicators. Overuse will create visual fatigue.

### Text Hierarchy
- **Primary Text:** 0 0% 94% (near-white #f0f0f0)
- **Secondary Text:** 0 0% 64% (medium gray #a3a3a3)
- **Tertiary Text:** 0 0% 44% (darker gray for timestamps, metadata)

### Semantic Colors
- **Success:** 142 71% 45% (green for completed assignments)
- **Warning:** 38 92% 50% (orange for due soon)
- **Error/Urgent:** 0 84% 60% (red for overdue)
- **Info:** 217 91% 60% (blue for informational states)

---

## Typography

**Font Families:**
- Primary: System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial)
- Monospace: 'JetBrains Mono' or 'Fira Code' via Google Fonts for timer display

**Type Scale:**
- Hero/Page Title: text-4xl (36px) font-bold
- Section Headers: text-2xl (24px) font-semibold
- Card Titles: text-lg (18px) font-medium
- Body Text: text-base (16px) font-normal
- Small/Meta: text-sm (14px) font-normal
- Timer Display: text-6xl (60px) font-mono font-bold

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-8
- Section gaps: gap-6 to gap-8
- Vertical spacing: space-y-6 or space-y-8

**Container Strategy:**
- Dashboard: max-w-7xl mx-auto (1280px max)
- Single-column views (Timer, Chat): max-w-3xl mx-auto (768px max)
- Calendar: max-w-6xl mx-auto (1152px max)
- Consistent px-4 md:px-8 horizontal padding

**Grid Layouts:**
- Dashboard: 2-column on desktop (lg:grid-cols-2), single column mobile
- Assignment cards: Stack vertically with full width
- Study stats: 3-column on desktop (lg:grid-cols-3)

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Glass-card background fixed at top
- Logo/title on left with yellow accent glow
- Navigation items center-aligned: Dashboard, Assignments, Schedule, Study, AI Tutor
- Active state: yellow underline (border-b-2 border-accent)
- Mobile: Hamburger menu with slide-out drawer

### Cards (Primary Container)
**Glass Card Treatment:**
```
- Background: rgba(10, 10, 10, 0.25)
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Border radius: rounded-2xl (16px)
- Backdrop filter: blur(12px)
- Padding: p-6 md:p-8
- Hover: subtle border glow rgba(250, 204, 21, 0.2)
```

**Assignment Cards:**
- Course tag with colored dot indicator
- Title (text-lg font-medium)
- Due date with urgency color coding
- Progress indicator if applicable
- Action buttons (Edit, Delete) subtle on hover

**Schedule Event Cards:**
- Time range (font-mono for precision)
- Course name with color coding
- Location with subtle icon
- Click to expand for details

### Forms
**Input Fields:**
- Dark glass background: rgba(20, 20, 20, 0.5)
- Border: rgba(255, 255, 255, 0.1)
- Focus state: yellow accent border
- Placeholder: text-secondary-text
- Rounded-lg corners

**Buttons:**
- Primary: bg-accent text-gray-900 hover:bg-accent-hover
- Secondary: glass-card with border, text-primary-text
- Danger: bg-red-600 hover:bg-red-500
- Icon buttons: p-2 hover:bg-glass-light rounded-lg

### Study Timer
**Timer Display:**
- Centered, extra-large mono font (text-6xl to text-8xl)
- Circular progress ring with yellow accent
- Start/Pause button with pulse animation when active
- Session counter and break indicator below
- Glass card container with extra padding

### AI Tutor Chat
**Chat Interface:**
- Messages container: max-h-[600px] overflow-y-auto
- User messages: glass-card aligned right, max-w-[80%]
- AI messages: darker glass aligned left, max-w-[80%]
- Input: Fixed bottom with glass background
- Send button: Yellow accent circle with arrow icon

### Calendar Integration
**react-big-calendar Customization:**
- Dark theme overrides for all calendar elements
- Event backgrounds: glass-card with color-coded left border
- Selected date: yellow accent highlight
- Today indicator: subtle yellow dot
- Month/Week/Day view toggles with glass buttons

### Dashboard Widgets
**Quick Stats Cards:**
- Small glass cards in 3-column grid
- Icon + number + label format
- Yellow accent for active/important numbers
- Hover: subtle lift effect (transform: translateY(-2px))

**Upcoming Assignments List:**
- Compact card list, max 5 items
- "View All" link in yellow accent
- Due date countdown with color coding

---

## Data Display

**Lists:**
- Alternating subtle backgrounds for readability
- Hover state: slight background lightening
- Multi-line items with clear visual hierarchy

**Tables:**
- Glass-card container
- Header: slightly lighter background
- Borders: rgba(255, 255, 255, 0.05)
- Responsive: Stack on mobile

**Empty States:**
- Centered icon (large, subtle)
- Message in secondary text
- Call-to-action button in yellow accent

---

## Animations

**Use Sparingly:**
- Page transitions: Simple fade-in
- Card hover: Subtle border glow + 2px lift
- Button press: Scale down to 0.98
- Timer pulse: Gentle yellow glow when active
- Loading: Spinning yellow accent ring
- NO complex scroll animations or distracting motion

---

## Images

**Dashboard Hero Section:**
Not applicable - this is a utility app. Skip hero imagery in favor of immediate functionality.

**Icon Usage:**
- Use Heroicons via CDN for consistency
- 20px for inline icons, 24px for standalone
- Color: text-secondary-text, accent on active states

**Illustrations:**
- Empty states: Simple line illustrations in glass aesthetic
- AI tutor avatar: Minimal geometric design with yellow accent

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked navigation)
- Tablet: 768px - 1024px (2-column where appropriate)
- Desktop: > 1024px (full multi-column layouts)

**Mobile Considerations:**
- Bottom tab navigation for main sections
- Collapsible calendar to agenda view
- Timer takes full viewport when active
- Swipeable assignment cards

---

## Accessibility

- Maintain WCAG AA contrast ratios (yellow on dark = 7.4:1)
- Focus indicators: 2px yellow outline
- Keyboard navigation for all interactive elements
- Screen reader labels for icon buttons
- Dark mode is default; light mode not required for student focus app