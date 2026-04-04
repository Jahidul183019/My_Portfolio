# Portfolio

A modern single-page developer portfolio built with React, TypeScript, Vite, and Tailwind CSS.

This project showcases:
- Hero intro with animated role text and social links
- About section with skill filtering and education timeline
- Featured projects with an interactive modal
- Contact section with client-side form validation
- Animated starfield background and custom cursor
- Responsive navigation with scroll spy and theme toggle
- Route-aware single-page navigation (`/`, `/about`, `/projects`, `/contact`)

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

### Configure Contact Form Email (Nodemailer)

Create a `.env.local` file in the project root:

```env
EMAIL_USER=your_gmail_address
EMAIL_PASS=your_gmail_app_password
EMAIL_TO=your_destination_email
```

Notes:
- Use a Gmail App Password (not your normal Gmail password).
- By default, frontend form submits to `/api/contact`.
- `VITE_CONTACT_FORM_ENDPOINT` is optional and only needed if you want an external endpoint.

Optional SMTP variables supported by `api/contact.js`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
CONTACT_TO_EMAIL=your_destination_email
CONTACT_FROM_EMAIL=optional_from_email
```

If these are not provided, fallback keys are used:
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_TO`

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

## Deploy to Vercel

1. Push this repository to GitHub.
2. Go to https://vercel.com and import the GitHub repo.
3. Set environment variables in Vercel:
  - `EMAIL_USER`
  - `EMAIL_PASS`
  - `EMAIL_TO`
4. Deploy.

## Notes

- The contact form sends data to `/api/contact` from `src/sections/Contact.tsx`.
- In Vercel, add `EMAIL_USER`, `EMAIL_PASS`, and `EMAIL_TO` in Project Settings -> Environment Variables before deploying.
- The resume link in the hero section points to `public/Resume.pdf`.
- `pnpm-workspace.yaml` includes `onlyBuiltDependencies: [esbuild]` to avoid ignored build script warnings on pnpm v10.
- Route rewrites in `vercel.json` ensure direct visits to `/about`, `/projects`, and `/contact` load the SPA correctly.

## Customization

- Personal info and social links: `src/sections/Hero.tsx`
- Skills and education data: `src/sections/About.tsx`
- Project cards and modal data: `src/sections/Projects.tsx`
- Contact details and form logic: `src/sections/Contact.tsx`
- Theme variables and global styling: `src/index.css`
