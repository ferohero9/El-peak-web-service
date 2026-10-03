# El-Peak — Agency Portfolio Static Website

A complete, production-ready static website for a web agency serving
Halal-compliant local businesses. Pure HTML/CSS/vanilla JavaScript.
No frameworks, no build tools, no databases. Upload to any cPanel
shared host and it works immediately.

Design highlights:

- **Main page** — glassmorphic light/dark design in El-Peak purple with a
  floating pill navbar, ambient background glows and a light/dark toggle.
- **Four demo templates, four distinct identities** — each demo ships with
  its own layout, typography and color scheme:
  | Demo | Identity |
  |------|----------|
  | Restaurant (Al-Noor Kitchen) | Warm terracotta / saffron serif editorial |
  | Electronics (Nile Mobiles) | Neo-brutalist ink / electric-lime retail |
  | Clinic (Noor Dental Clinic) | Airy teal / coral medical, extra-rounded |
  | Contractor (Bunyan Contracting) | Dark charcoal / amber industrial, mono labels |
- **Photos** — all photography in `demos/*/assets/` is AI-generated and
  royalty-free; it carries no third-party licensing restrictions. No
  photo anywhere on the site depicts women, per the owner's content
  policy (people-free product/venue shots or men only).
- **AI-assisted builds** — the main page states clearly that every
  website is designed, written and coded with the help of top-of-the-line
  AI tools, then reviewed line-by-line before sending to client.
- **WhatsApp** — the main portfolio page contains the ONLY real WhatsApp
  integration. Every WhatsApp-style button inside the demos is a dummy
  that shows a preview of the message without sending anything.

## Folder structure

```
agency-portfolio/
├── index.html                  Main agency landing page
├── .htaccess                   Optional Apache rules (gzip, cache, HTTPS)
├── README.md                   This file
├── css/
│   └── style.css               Main stylesheet (light/dark themes)
├── js/
│   └── main.js                 Main interactivity (nav, tabs, modal, forms)
├── assets/
└── demos/
    ├── restaurant/             Al-Noor Kitchen — menu + order cart (dummy WA)
    │   └── assets/             AI-generated food photography (royalty-free)
    ├── electronics/            Nile Mobiles — phones & gadgets shop (dummy WA)
    │   └── assets/             AI-generated product photography (royalty-free)
    ├── clinic/                 Noor Dental Clinic — appointment booking
    │   └── assets/             AI-generated clinic photography (royalty-free)
    └── contractor/             Bunyan Contracting — dark industrial lead page
        └── assets/             AI-generated construction photography
```

## Pricing model (displayed on the main page)

| Item | Price | Notes |
|------|-------|-------|
| Package 1 — Complete Static Website | **1,500 EGP** one-time | Active tier: 1-page mobile-first static site, WhatsApp ordering/inquiry system, category filters, Maps + social links, cPanel-ready |
| Package 2 — Dynamic Admin Portal & Custom Backend | **5,000 EGP** | **Coming-soon tier** — rendered dimmed/faded with a "COMING SOON" badge overlay and a disabled button |
| Annual Hosting & Domain add-on | **500 EGP / year** | Billed separately: cPanel hosting setup, domain registration/renewal, free SSL, custom business email |
| On-Demand Content Updates | **400 EGP / update** | Per iteration: photos, prices, text, banners, add/remove up to 5 items |

## Deployment (cPanel)

1. Log in to cPanel → **File Manager** → open `public_html`.
2. (Optional) If the site lives on a subfolder like `/site`, create it.
3. Upload `agency-portfolio.zip` and click **Extract** — or upload the
   unzipped folder contents directly.
4. Ensure `index.html` sits directly in the folder you want as the
   site root (e.g. `public_html/index.html`).
5. Enable **SSL/TLS Status → Run AutoSSL** for free HTTPS.
6. Visit your domain — done. No Node, no build, no database.

## Customization

| What                    | Where                                                              |
|-------------------------|--------------------------------------------------------------------|
| WhatsApp number         | `index.html` (search `201012464714`) + `js/main.js` → `WHATSAPP_NUMBER` |
| Default WhatsApp text   | `js/main.js` → `DEFAULT_WA_MESSAGE`                                 |
| Email address           | `index.html` → Contact section (`mailto:el-peak@el-peak.cloud`)      |
| Agency name / logo      | `index.html` (header + footer `.logo` blocks — inline SVG peak mark) |
| Colors / light-dark     | `css/style.css` → the `:root` + `[data-theme="dark"]` token blocks  |
| Prices & packages       | `index.html` → Pricing section (Package 1 active card, Package 2 `.soon-wrap` dimmed card, `.addons-grid` callouts) |
| Demo menus / products   | Each demo's `js/*.js` data array at the top of the file (`✏️ EDIT` comment) |
| Demo colors / layout    | Each demo's own `css/*.css` token block                             |

## Ethics note

This site intentionally markets only to permissible, ethical businesses.
It contains no references to alcohol, gambling, tobacco, or
interest-based financial services. Please keep it that way.
