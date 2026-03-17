# Leo Portfolio — Cloudflare Pages + Headless CMS Setup

## Stack

| Layer | Tool | Why |
|-------|------|-----|
| Hosting | **Cloudflare Pages** | Free, fast global CDN, Git-based deploys |
| CMS | **Keystatic** (local/cloud JSON) | File-based, no database, Astro/Next compatible |
| Framework (optional upgrade) | **Astro** | Static-first, supports MDX, perfect for portfolio |
| Forms | **Formspree** | Free contact form backend, no server needed |

---

## Option A: Pure Static (Simplest — Current Setup)

### Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → Pages → Create project
3. Connect GitHub repo
4. Build settings:
   - **Build command:** *(leave empty — static site)*
   - **Build output directory:** `/` (root)
5. Deploy — done. Your site is live at `yourname.pages.dev`

### Connect Custom Domain
1. Pages → your project → Custom Domains
2. Add `yourdomain.com`
3. Update DNS nameservers to Cloudflare

---

## Option B: With Headless CMS (Keystatic — Recommended)

Keystatic is a file-based CMS that stores content as JSON/Markdown in your repo.
No external database. Edit content in a beautiful admin UI, changes commit to Git.

### 1. Upgrade to Astro

```bash
npm create astro@latest portfolio -- --template minimal
cd portfolio
npx astro add keystatic
```

### 2. Install dependencies

```bash
npm install @keystatic/core @keystatic/astro
```

### 3. Keystatic config (`keystatic.config.ts`)

```typescript
import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: { kind: 'local' }, // or 'github' for cloud editing

  collections: {
    projects: collection({
      label: 'Projects',
      slugField: 'title',
      path: 'src/content/projects/*',
      schema: {
        title:       fields.slug({ name: { label: 'Title' } }),
        category:    fields.select({ label: 'Category', options: [
          { label: 'Web Design',  value: 'web' },
          { label: 'Branding',    value: 'branding' },
          { label: 'App Design',  value: 'app' },
          { label: 'Editorial',   value: 'editorial' },
        ], defaultValue: 'web' }),
        year:        fields.text({ label: 'Year' }),
        description: fields.text({ label: 'Description', multiline: true }),
        coverImage:  fields.image({ label: 'Cover Image', directory: 'public/images/projects' }),
        tags:        fields.array(fields.text({ label: 'Tag' }), { label: 'Tags' }),
        caseStudy:   fields.document({ label: 'Case Study', formatting: true, images: { directory: 'public/images/case-studies' } }),
        featured:    fields.checkbox({ label: 'Featured on Home', defaultValue: false }),
      },
    }),

    ventures: collection({
      label: 'Ventures',
      slugField: 'name',
      path: 'src/content/ventures/*',
      schema: {
        name:        fields.slug({ name: { label: 'Name' } }),
        tagline:     fields.text({ label: 'Tagline' }),
        type:        fields.text({ label: 'Type (e.g. Marketing Agency · Alberta Inc.)' }),
        description: fields.document({ label: 'Description', formatting: true }),
        services:    fields.array(fields.text({ label: 'Service' }), { label: 'Services' }),
        website:     fields.url({ label: 'Website URL' }),
        active:      fields.checkbox({ label: 'Currently Active', defaultValue: true }),
      },
    }),
  },

  singletons: {
    about: singleton({
      label: 'About Page',
      path: 'src/content/about',
      schema: {
        bio:         fields.document({ label: 'Bio', formatting: true }),
        location:    fields.text({ label: 'Location' }),
        status:      fields.text({ label: 'Availability Status' }),
        skills:      fields.array(
          fields.object({
            name:  fields.text({ label: 'Skill Name' }),
            level: fields.integer({ label: 'Level (0-100)' }),
          }),
          { label: 'Skills' }
        ),
      },
    }),
  },
});
```

### 4. Access CMS

- **Local development:** `http://localhost:4321/keystatic`
- **Cloud editing (Cloudflare):** Use `storage: { kind: 'github', repo: 'owner/repo' }` in keystatic.config.ts, then access `/keystatic` on your live domain

---

## Option C: External Headless CMS

If you prefer a hosted CMS with a dashboard, these work great with Cloudflare Pages:

| CMS | Free Tier | Best For |
|-----|-----------|----------|
| **Contentful** | 25k records | Rich structured content |
| **Sanity** | Unlimited content | Complex schemas, real-time |
| **Hygraph** | 2 environments | GraphQL-native |
| **Notion + NotionAPI** | Free | Simple, familiar UI |

---

## Contact Form (Formspree)

1. Sign up at [formspree.io](https://formspree.io)
2. Create new form → get endpoint URL
3. Update the form in `index.html`:

```html
<form action="https://formspree.io/f/YOUR_ID" method="POST">
  <!-- your form fields -->
</form>
```

Or use their AJAX API for the custom JS submit behavior.

---

## Environment Variables (Cloudflare Pages)

Settings → Environment Variables:

```
KEYSTATIC_GITHUB_CLIENT_ID=your_github_oauth_id
KEYSTATIC_GITHUB_CLIENT_SECRET=your_github_oauth_secret
KEYSTATIC_SECRET=random_32_char_string
```

---

## File Structure (Current Static)

```
portfolio/
├── index.html          ← All pages (SPA routing via hash)
├── css/
│   └── style.css       ← Full design system
├── js/
│   └── main.js         ← Interactions, cursor, routing
├── pages/              ← (future: individual page HTML files)
├── public/
│   └── images/         ← Project assets
├── _redirects          ← Cloudflare Pages routing rules
└── README.md
```

---

## `_redirects` (Cloudflare Pages SPA routing)

```
/*  /index.html  200
```

Create this file at the root so Cloudflare serves `index.html` for all paths.

---

## Roadmap

- [ ] Add real project images / screenshots
- [ ] Wire up Formspree contact form
- [ ] Upgrade to Astro + Keystatic for CMS editing
- [ ] Add individual case study pages (`/work/homescapes`, etc.)
- [ ] Add OG meta images for social sharing
- [ ] Add resume PDF download
# portfolio-real
