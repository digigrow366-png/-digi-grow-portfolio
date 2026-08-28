# head.md — Profile & Brand Seed Data
> Companion context file for the loop prompt. Feed this alongside it so Stage 0 seeds real data instead of empty strings.

---

## Brand
| Field | Value |
|---|---|
| `brand_name` | Digi Grow |
| `full_name` | `[Your Full Name]` |
| `role_title` | `[e.g. Founder & Creative Director]` |
| `tagline` | `[One-line hook — what Digi Grow does]` |
| `bio` | `[2–4 sentences: services offered, e.g. B-Roll/video editing, website design...]` |
| `location` | `[City, Country]` |
| `resume_url` | `[optional]` |

## Avatar
- File: `avatar.jpg` (bundled alongside this file)
- Style: glossy 3D-rendered character portrait, dark wavy hair, mustache + goatee, black hoodie, white background.
- `avatar_url`: `[hosted URL once uploaded to Supabase Storage]`

## Brand Colors — `theme_settings` seed
Not yet specified — build defaults to the retro-editorial palette below, but **every value is admin-editable at runtime** (Theme tab), never hardcoded into components.

| Token | Default | Used for |
|---|---|---|
| `--color-primary` | `#C72E1E` (Signal Crimson) | CTAs, active states, cursor accent, active nav pill |
| `--color-background` | `#080808` (Obsidian Black) | dark sections, hero, cursor blend base |
| `--color-surface` | `#F7F3EB` (Antique Cream) | light sections / bento cards |
| `--color-text` | auto-contrast per surface | body copy |
| `--font-heading` | Inter, 800/900 weight | h1–h3, extrabold, tight tracking |
| `--font-mono` | JetBrains Mono | micro-labels, `01 / 02` badges, uppercase tags |

Replace the hex values whenever real Digi Grow brand colors exist — this is a live edit in the admin, not a redeploy.

## Social Links
| Platform | URL | Active |
|---|---|---|
| `instagram` | `[https://instagram.com/...]` | true |
| `facebook` | `[https://facebook.com/...]` | true |
| `linkedin` | `[https://linkedin.com/in/...]` | true |
| `github` | `[https://github.com/...]` | true |
| `twitter` (X) | `[https://x.com/...]` | true |
| `youtube` | `[https://youtube.com/@...]` | true |
| `discord` | `[https://discord.gg/...]` | true |

## Project Categories (seed for `projects.category`)
Free-text tags, not a rigid enum — add more anytime from the admin:
- `B-Roll & Video Editing`
- `Website Design`
- `[add more as needed]`

## Seed JSON
```json
{
  "brand_name": "Digi Grow",
  "full_name": "",
  "role_title": "",
  "tagline": "",
  "bio": "",
  "avatar_url": "",
  "resume_url": "",
  "location": "",
  "social_links": {
    "instagram": "", "facebook": "", "linkedin": "", "github": "",
    "twitter": "", "youtube": "", "discord": "", "custom_links": []
  },
  "theme": {
    "color_primary": "#C72E1E",
    "color_background": "#080808",
    "color_surface": "#F7F3EB",
    "font_heading": "Inter",
    "font_mono": "JetBrains Mono"
  }
}
```

### Note on external data source
A Gemini share link (`share.gemini.google/OVyycK2Lss9y`) was referenced earlier but sits behind Google sign-in and couldn't be fetched. Paste its content directly if it has data to merge in.
