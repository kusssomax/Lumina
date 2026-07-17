---
name: tailwind-shadcn-standards
description: Enforces Tailwind CSS, shadcn/ui, and lucide-react rules for React frontend development. Use when the user asks to create, modify, or design UI components, edit styles, or refactor/migrate existing code to Tailwind CSS.
---

# Frontend UI Standards: Tailwind & shadcn/ui

## Instructions

### Step 1: Styling with Tailwind CSS
- **ALWAYS** use Tailwind CSS utility classes for styling components.
- **CSS Variables First:** Strictly use semantic color variables defined in `index.css` or `global.css` (e.g., `bg-background`, `text-foreground`, `border-border`).
- **No Hardcoding:** Do NOT hardcode HEX/RGB values (e.g., `bg-[#ffffff]`) unless it is a highly specific, one-off exception that cannot be mapped to a theme variable.
- **Design Consistency:** Maintain the existing design system and visual flow of the project.

### Step 2: Component Architecture (shadcn/ui)
- Replace plain HTML elements (like `<button>`, `<input>`) or legacy framework components with **shadcn/ui** components.
- **Dynamic Installation:** Before creating a custom UI element, check if a standard `shadcn/ui` component fits the requirement. If it exists in the shadcn ecosystem but is missing from the local codebase, install it immediately via the terminal:
  `npx shadcn@latest add <component>`
- **UI Simplicity & Layout:** Keep the interface clean and straightforward. 
  - Do not implement "Bulk Edit" functionalities unless explicitly requested.
  - Ensure status badges (e.g., "official", "enabled") are placed within the main content area, keeping headers clean and uncluttered.

### Step 3: Iconography
- Exclusively use `lucide-react` for all icons.
- Do not import icons from other libraries or use raw SVGs unless there is no appropriate equivalent in Lucide.

### Troubleshooting
- **Error:** The required shadcn component is not rendering properly after installation.
- **Solution:** Verify that the component's dependencies (like Radix UI primitives) were correctly installed by the CLI and that `tailwind.config.js` includes the necessary paths.