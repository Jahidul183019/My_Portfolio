# Portfolio

A modern single-page developer portfolio built with React, TypeScript, Vite, and Tailwind CSS.

This project showcases:
- Hero intro with animated role text and social links
- About section with skill filtering and education timeline
- Featured projects with an interactive modal
- Contact section with client-side form validation
- Animated starfield background and custom cursor
- Responsive navigation with scroll spy and theme toggle

## Tech Stack

- React 18
- TypeScript
- Vite 5
- Tailwind CSS
- Framer Motion
- Wouter (lightweight routing)
- React Hook Form + Zod (form validation)
- TanStack Query (provider setup)
- Radix UI primitives

## Project Structure

```text
src/
  components/
    CustomCursor.tsx
    Navbar.tsx
    Starfield.tsx
    ui/
  hooks/
    use-mobile.tsx
    use-toast.ts
  lib/
    utils.ts
  pages/
    Home.tsx
    not-found.tsx
  sections/
    About.tsx
    Contact.tsx
    Hero.tsx
    Projects.tsx
  App.tsx
  index.css
  main.tsx
public/
  images/
  Resume.pdf
```

## Getting Started

### Prerequisites

- Node.js 18+ (recommended)
- pnpm

### Install

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

The app runs by default at:
- http://localhost:5173

### Type Check

```bash
pnpm typecheck
```

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Notes

- The contact form currently uses a mock async function in `src/sections/Contact.tsx`.
- To use real email or backend submission, replace `sendMessageAPI` with your API call.
- The resume link in the hero section points to `public/Resume.pdf`.

## Customization

- Personal info and social links: `src/sections/Hero.tsx`
- Skills and education data: `src/sections/About.tsx`
- Project cards and modal data: `src/sections/Projects.tsx`
- Contact details and form logic: `src/sections/Contact.tsx`
- Theme variables and global styling: `src/index.css`

## License

This project is open source and available under the MIT License.
