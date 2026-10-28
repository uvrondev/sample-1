# Ivory & Sage Dental Studio

A fictional, multi-page dental studio website built as a portfolio demonstration. The design is original and was developed as a static, hand-coded alternative to the single-page reference site reviewed for direction only. No branding, copy, photography or source code was taken from that reference.

The site is marked `noindex, nofollow` on every page. It is not a real clinic and does not collect, send or store appointment requests.

## Pages

| Page | Purpose |
| --- | --- |
| `index.html` | Homepage: positioning, care areas, approach, treatment overview, studio preview, standards and booking CTA |
| `about.html` | Studio story, principles, visit format and standards |
| `treatments.html` | 14 treatment explanations with category filters and booking CTAs |
| `team.html` | Fictional team profiles with sample-role labels and illustrative portraits |
| `patient-stories.html` | Fictional patient stories and feedback principles |
| `gallery.html` | 13-image filterable gallery with an accessible lightbox |
| `contact.html` | Placeholder contact details and a validated, front-end-only appointment form |
| `privacy-policy.html` | Sample privacy information for the demonstration |

## Technology

- Semantic HTML5, CSS3 and vanilla JavaScript
- No frameworks, build system, package installation or CSS utility library
- GSAP 3.12.5 and ScrollTrigger via CDN for optional entrance and scroll reveals
- Google Fonts: Newsreader (display) and Manrope (UI)
- Inline SVG icon sprite, custom SVG brand mark and favicon
- Shared design system in `assets/css/styles.css`
- No cookies, analytics, tracking scripts or form submission endpoints

## Features

- Responsive layouts tested from 320 px through 1440 px without horizontal overflow
- Accessible mobile navigation with `aria-expanded`, `inert`, focus trapping, Escape to close and body scroll lock
- Treatment category filters and gallery category filters with live status text
- Native `<dialog>` gallery lightbox with previous/next, arrow-key support, Escape, backdrop close, focus restoration and body scroll lock
- Appointment form with inline validation, past-date and Sunday checks, service pre-selection and an exact demo confirmation message
- Optional motion with a fully visible no-GSAP fallback and `prefers-reduced-motion` support
- Skip link, visible focus styles, descriptive alt text and reduced-motion styles

## File structure

```text
1-clinic-sample/
├── index.html
├── about.html
├── treatments.html
├── team.html
├── patient-stories.html
├── gallery.html
├── contact.html
├── privacy-policy.html
├── README.md
└── assets/
    ├── css/
    │   └── styles.css
    ├── js/
    │   ├── main.js
    │   └── animations.js
    └── images/
        ├── icons.svg
        ├── favicon.svg
        ├── hero-care.jpg
        ├── about-reception.jpg
        ├── about-scan.jpg
        ├── about-studio.jpg
        ├── care-close.jpg
        ├── cta-patient.jpg
        ├── gallery-*.jpg
        ├── story-meera.jpg
        └── team-*.jpg
```

## Run locally

From the project folder:

```powershell
cd "C:\Users\Sarin\Desktop\1-clinic-sample"
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

A local server is recommended so that all relative paths, SVG sprite references and externally loaded fonts/scripts behave as they would when deployed. Opening the files directly with `file://` may work for basic viewing, but the local server is the intended method.

## Demo content and contact placeholders

All identity, team, testimonial, scheduling and contact information is fictional sample content:

- **Email:** `hello@ivorysage.example`
- **Phone:** `+91 00000 00000`
- **Address:** `Example Street, Bengaluru, Karnataka — Demo Address`
- **Hours:** `Monday–Saturday, 9:00 AM–7:00 PM`
- **Schedule:** `By appointment — sample schedule`

> Portfolio demonstration only. Clinic identity, contact details, team profiles, testimonials, and operating information are fictional sample content.

The appointment form is a front-end demonstration. It validates entries in the browser and then shows:

> Demo request submitted successfully. This sample website does not send or store appointment requests.

## Images and licences

Photography is illustrative stock imagery from Unsplash and Pexels, selected for a calm, editorial direction and colour-graded with CSS. Images are used under the Unsplash and Pexels licences respectively. Credit is offered as a courtesy to:

- **Karolina Grabowska / Pexels** — `hero-care.jpg`
- **Juliane Monari / Pexels** — `team-leela.jpg`
- Other contributing photographers on Unsplash and Pexels

Team portraits are illustrative and do not depict the fictional people described. Portraits were cropped to remove visible third-party clinic names and logos. Gallery and page imagery do not represent the fictional studio's real premises, team or patients.

The brand mark, icon sprite and favicon are original SVG assets created for this demonstration.

## Accessibility and motion notes

- WCAG A/AA automated checks were run with axe-core across all eight pages with no reported violations at the time of build.
- All eight pages pass W3C Nu HTML validation with no errors or warnings.
- Motion is progressive enhancement. If GSAP or ScrollTrigger fails to load, the `js-motion` class is removed and all content remains visible.
- When `prefers-reduced-motion: reduce` is active, the motion layer does not initialise and reveal content stays visible.
- Keyboard interactions were tested for the mobile menu, filters, form and gallery lightbox.

## Limitations

- This is a static demonstration; there is no CMS, database, booking engine, payment flow or email delivery.
- Contact information, team members, testimonials, prices and availability are placeholders.
- External fonts and GSAP are loaded from CDNs. The site remains usable without them, but visual typography and motion will differ.
- Automated accessibility checks are a baseline, not a substitute for manual testing with assistive technologies.
