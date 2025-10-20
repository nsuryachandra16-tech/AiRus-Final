# Design Guidelines: AiRus - AI College Assistant

## Design Approach

**Selected Framework:** Hybrid approach combining productivity app patterns (Notion, Linear, Todoist) with dark glassmorphism aesthetic. Prioritizes clarity and focus for students while maintaining visual appeal through glass effects and strategic accent usage.

**Core Principle:** Create a calm, focused environment that reduces cognitive load while providing quick access to essential academic tools.

---

## Color Palette

### Dark Mode (Primary)
- **Background Base:** 17 5% 6%
- **Glass Cards:** rgba(10, 10, 10, 0.25) with 12px backdrop blur
- **Card Borders:** rgba(255, 255, 255, 0.05)

### Accent Colors
- **Primary Accent:** 45 98% 54% (warm yellow)
- **Accent Hover:** 45 98% 61%
- **Accent Glow:** rgba(250, 204, 21, 0.5)
- **CRITICAL:** Use yellow accent sparingly - only for primary CTAs, active states, and important indicators

### Text Hierarchy
- **Primary Text:** 0 0% 94%
- **Secondary Text:** 0 0% 64%
- **Tertiary Text:** 0 0% 44%

### Semantic Colors
- **Success:** 142 71% 45%
- **Warning:** 38 92% 50%
- **Error/Urgent:** 0 84% 60%
- **Info:** 217 91% 60%

---

## Typography

**Font Families:**
- Primary: System font stack (-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto)
- Monospace: JetBrains Mono for timer display

**Type Scale:**
- Hero/Page Title: text-4xl font-bold
- Section Headers: text-2xl font-semibold
- Card Titles: text-lg font-medium
- Body Text: text-base font-normal
- Timer Display: text-6xl font-mono font-bold

---

## Layout System

**Spacing Primitives:** Tailwind units of 2, 4, 6, 8, 12, 16, 20

**Container Strategy:**
- Dashboard: max-w-7xl mx-auto
- Single-column views: max-w-3xl mx-auto
- Calendar: max-w-6xl mx-auto
- Horizontal padding: px-4 md:px-8

**Grid Layouts:**
- Dashboard: 2-column desktop (lg:grid-cols-2), single column mobile
- Study stats: 3-column desktop (lg:grid-cols-3)

---

## Component Library

### Navigation
**Top Navigation Bar:**
- Glass-card background fixed at top
- Logo/title left with yellow accent glow
- Navigation items center-aligned
- Active state: yellow underline (border-b-2)
- Mobile: Hamburger menu with slide-out drawer

### Cards (Primary Container)
```
- Background: rgba(10, 10, 10, 0.25)
- Border: 1px solid rgba(255, 255, 255, 0.05)
- Border radius: rounded-2xl (16px)
- Backdrop filter: blur(12px)
- Padding: p-6 md:p-8
- Hover: subtle yellow border glow
```

### Forms
**Input Fields:**
- Dark glass background: rgba(20, 20, 20, 0.5)
- Border: rgba(255, 255, 255, 0.1)
- Focus: yellow accent border
- Rounded-lg corners

**Buttons:**
- Primary: bg-accent with dark text, hover state lighter
- Secondary: glass-card with border
- Icon buttons: p-2 hover:bg-glass-light rounded-lg

### Study Timer
- Centered extra-large mono font (text-6xl to text-8xl)
- Circular progress ring with yellow accent
- Start/Pause with pulse animation when active
- Glass card container with extra padding

### AI Tutor Chat
- Messages container: max-h-[600px] overflow-y-auto
- User messages: glass-card right-aligned, max-w-[80%]
- AI messages: darker glass left-aligned, max-w-[80%]
- Input: Fixed bottom with glass background
- Send button: Yellow accent circle

### Dashboard Widgets
- Small glass cards in 3-column grid
- Icon + number + label format
- Hover: subtle lift effect (transform: translateY(-2px))

---

## Animations

**Use Sparingly:**
- Page transitions: Simple fade-in
- Card hover: Subtle border glow + 2px lift
- Button press: Scale to 0.98
- Timer pulse: Gentle yellow glow when active
- NO complex scroll animations

---

## Images & Icons

**Icons:**
- Heroicons via CDN
- 20px inline, 24px standalone
- Color: secondary text, accent on active states

**No Hero Images:** This is a utility app - skip hero imagery in favor of immediate functionality

---

## Responsive Behavior

**Breakpoints:**
- Mobile: < 768px (single column, stacked nav)
- Tablet: 768px - 1024px (2-column where appropriate)
- Desktop: > 1024px (full multi-column)

**Mobile:**
- Bottom tab navigation
- Collapsible calendar to agenda view
- Timer takes full viewport when active

---

## Accessibility

- WCAG AA contrast ratios
- Focus indicators: 2px yellow outline
- Keyboard navigation for all interactive elements
- Dark mode default (light mode not required)