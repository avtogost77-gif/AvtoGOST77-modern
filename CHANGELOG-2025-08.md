# Changelog — August 2025

## 2025-08-07

- Baseline sync: set local `main` to `origin/main`; preserved previous local edits in branch `local/preprod-changes`.
- Calculator safety tag: created `calc-v2-2025-08-07` pointing to commit `dd82959` (smart-calculator-v2.min.js build). Verified latest logic is present in `assets/js/smart-calculator-v2.js` (commit `81241ee`).
- Blog cleanup and SEO fixes:
  - Removed unsafe `AggregateRating` and empty `HowTo` blocks from `blog-1..6`.
  - Added `<link rel="canonical">` to `blog-1..4`, `blog-5`, `blog-6`.
  - Added `BreadcrumbList` JSON‑LD to `blog-5`, `blog-6`.
  - Fixed click-tracking JS quotes in `blog-1..6` (where present).
  - `blog/index.html`: unified org schema (logo/phone/sameAs), corrected links to existing pages.
  - `blog-2`: corrected services link to `dostavka-na-marketpleysy.html`.

Next steps
- Add `BreadcrumbList` to `blog-1..4`.
- Audit remaining pages for canonical consistency and click-tracking snippet.

### Later on 2025-08-07

- Added `BreadcrumbList` JSON‑LD to: `blog-1-carrier-failed.html`, `blog-2-wildberries-delivery.html`, `blog-3-spot-orders.html`, `blog-4-remote-logistics.html`.
- Added `BreadcrumbList` JSON‑LD to: `blog-7-how-to-order-gazelle.html`, `blog-8-cargo-insurance.html`, `blog-9-dangerous-goods.html`, `blog-10-self-employed-logistics.html`.
- Insurance article: added concise legal reference block (GК 796, 259‑FZ, PP 272/2011, CMR 17/23) with links note.
- Dangerous goods article: added UN quick classifier, pre‑dispatch checklist, carrier verification, “don’t do” warnings, ADR reliefs (LQ/1000 points), and legal reference block; strengthened CTA to expert review.
- Remote logistics article: added legal block (перевозка vs экспедирование) and contract "догмы".
- How-to Gazelle article: added legal minimum and practical "догмы" для снижения ошибок/доплат.
- New page: `legal-minimum.html` with concise legal checklists and CTA; added to `blog/index.html`.
- Unified footer links to marketplace services:
  - `blog-2-wildberries-delivery.html`: footer links now point to `dostavka-na-marketpleysy.html`.
  - `blog-6-marketplace-insider.html`: footer links now point to `dostavka-na-marketpleysy.html`.


