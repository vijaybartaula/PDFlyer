# PDFlyer

**A browser-based PDF atelier for document work that respects your privacy.**

Merge, split, compress, convert, watermark, and rotate PDFs without uploading a single file to any server. Everything runs in your browser.

---

## What It Does

PDFlyer is a collection of focused PDF tools built for people who want fast, private, and dependency-free document processing. No accounts. No uploads. No waiting.

---

## Tools

| Tool | Route | Description |
|---|---|---|
| Merge | `/tools/merge` | Combine multiple PDFs into one file |
| Split | `/tools/split` | Extract pages or divide a document into parts |
| Compress | `/tools/compress` | Reduce file size while preserving readability |
| Convert | `/tools/convert` | Transform PDFs to images or other formats |
| Watermark | `/tools/watermark` | Add custom text or image watermarks to pages |
| Rotate | `/tools/rotate` | Correct page orientation across a document |

Each tool has its own route and works identically on localhost and in production.

---

## Design

The interface follows a classical editorial aesthetic: warm archival tones, serif typography for display headings, and tight sans-serif for functional UI text. The design avoids modern software clichés such as gradient fills, decorative blobs, and bento-grid layouts.

Dark and light themes are supported and can be toggled from the navigation bar.

On mobile, the navigation opens as a slide-in side panel from the right.

---

## Tech Stack

- **Framework**: Next.js 16 with App Router (Turbopack)
- **Styling**: Tailwind CSS with a custom archival color palette
- **UI Components**: shadcn/ui (selectively used)
- **Typography**: Newsreader (serif display), Plus Jakarta Sans (UI sans-serif) via Google Fonts
- **PDF Processing**: Client-side, in-browser PDF manipulation via pdf-lib and related libraries
- **Language**: TypeScript throughout
- **Linting**: ESLint (flat config)
- **Package Manager**: npm

---

## Getting Started

### Prerequisites

- Node.js 20.9 or later (minimum supported by Next.js 16)
- npm

### Installation

Clone the repository:

```bash
git clone https://github.com/vijaybartaula/PDFlyer.git
cd PDFlyer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

- `npm run dev` - Start the local development server
- `npm run build` - Build the production bundle
- `npm start` - Start the production server after a build
- `npm run lint` - Run ESLint across the project

> Next.js 16 removed `next lint`, so linting runs through the ESLint CLI (`eslint .`) using the flat config in `eslint.config.mjs`.

---

## Project Structure

```
app/
  page.tsx              Home (Frontispiece)
  layout.tsx            Root layout with font imports and theme provider
  globals.css           Design tokens and base styles
  tools/
    page.tsx            Tools directory listing
    layout.tsx          Shared tools shell layout
    merge/page.tsx
    split/page.tsx
    compress/page.tsx
    convert/page.tsx
    watermark/page.tsx
    rotate/page.tsx
  about/page.tsx
  faq/page.tsx
  contact/page.tsx
  privacy/page.tsx
  terms/page.tsx

components/
  main-nav.tsx          Sticky header with desktop nav and mobile side panel
  site-footer.tsx       Footer with links and colophon
  tools-directory.tsx   Reusable tool grid component
  pdf-merger.tsx
  pdf-splitter.tsx
  pdf-compressor.tsx
  pdf-converter.tsx
  pdf-watermark.tsx
  pdf-rotate.tsx
  pdf-uploader.tsx

lib/
  pdf-utils.ts          Shared PDF processing utilities

eslint.config.mjs       ESLint flat config
next.config.mjs         Next.js configuration (Turbopack)
tailwind.config.ts      Tailwind theme tokens
```

---

## Routing

All tool routes follow the pattern `/tools/[tool-name]` and are handled by Next.js App Router. No hardcoded production URLs are used; the same paths resolve correctly on localhost and on the deployed domain.

Deployed at: [https://pdflyer.netlify.app](https://pdflyer.netlify.app)

---

## Deploying

The project is configured for Netlify. `netlify.toml` runs `npm run build`, pins Node.js 22 (Next.js 16 requires 20.9 or later) and enables the official `@netlify/plugin-nextjs`, so no extra dashboard settings are needed.

Set `NEXT_PUBLIC_APP_URL` to your production origin so the canonical URLs rendered in the interface match your domain. It falls back to `https://pdflyer.netlify.app`.

---

## Privacy

Files are processed entirely in the browser using client-side JavaScript. No file data is sent to any server. No analytics or tracking scripts are included.

---

## Links

- [Live Site](https://pdflyer.netlify.app)
- [Contact](https://bijaybartaula.com.np/#contact)

---

## Notes

This started as a side project that sat untouched in a folder for months. The codebase has since been rebuilt from the ground up with a cleaner architecture, a considered visual identity, and tools that actually work. It is now ready for production use.
