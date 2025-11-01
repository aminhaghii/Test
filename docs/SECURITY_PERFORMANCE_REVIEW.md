## Pietra Luxe Hub – Security, Stability, and Performance Review

Updated: {{today}}

### Executive Summary
- Overall, the app is in good shape functionally after recent fixes (Contact page crash, favicon 404, duplicate Admin label). Backend and frontend integrate cleanly.
- Security-wise, the largest risk is permissive CORS with credentials enabled and default secrets. CSRF protection and security headers are absent. File upload hardening and rate limiting are also missing.
- Performance-wise, static media is heavy (large images from `ALMAS/` and `DECORED/` served directly), and several heavy animation libraries are included site-wide. Opportunities exist for image optimization, caching headers, and targeted code-splitting.

---

### Notable Fixes Already Applied
- Contact page crash (Send icon) fixed by removing the unused icon.
- Favicon 404 resolved by adding a webp favicon to `index.html`.
- Duplicate Admin labels fixed; now only one clickable Admin chip appears for admin users.
- Contact page simplified per requirements: icons removed, WhatsApp floating button removed, neutral styling applied.
- About page CTA section removed on request.

---

### Critical Issues (High Priority)
1) CORS configuration is overly permissive (backend/server.js)
   - Current: `cors({ origin: true, credentials: true, methods: ..., allowedHeaders: ... })` allows any origin with credentials.
   - Risk: Cross-site request forgery and credential leakage across origins.
   - Action: Restrict `origin` to an explicit allowlist (e.g., `['http://localhost:8080', 'https://yourdomain.com']`) and keep `credentials: true` only if necessary.

2) Secrets defaulting in production
   - `SESSION_SECRET` and `JWT_SECRET` fall back to hardcoded defaults if env vars are missing.
   - Risk: Token/session compromise in non-hardened deployments.
   - Action: Enforce required secrets via startup checks; fail fast if not provided.

3) Missing CSRF protection with credentials
   - Cookies are `httpOnly` (good) but CSRF tokens are not implemented.
   - Risk: State-changing requests can be abused via CSRF when `credentials: true` is enabled.
   - Action: Add CSRF protection (e.g., `csurf`) or switch to stateless auth on frontend-only tokens with same-site cookies (`SameSite=Lax/Strict`).

4) Missing security headers
   - No `helmet` usage.
   - Risk: Clickjacking, MIME sniffing, XSS protections not standardized.
   - Action: Add `helmet()` with CSP tuned for your assets.

---

### High Priority (Security & Correctness)
5) File upload hardening (backend/routes/upload.js)
   - Unreviewed code suggests multer is used; must enforce:
     - Extension/Content-Type allowlist (e.g., jpg, png, webp)
     - Size limits (e.g., 5–10MB)
     - Randomized filenames and path traversal protection
     - Image processing to strip metadata if needed

6) Authentication resilience
   - Login/register endpoints lack:
     - Rate limiting to prevent brute force
     - IP-based throttling or captcha on repeated failures
   - JWT 7d expiry without revoke/list: consider short-lived access + refresh tokens.

7) Input validation (Backend)
   - Minimal validation on backend routes; front-end Zod does not protect the API.
   - Action: Add schema validation (e.g., Zod or Joi) for products, auth, categories, upload.

---

### Medium Priority (Performance & UX)
8) Heavy images served directly
   - `ALMAS/` and `DECORED/` images are served raw; many are large.
   - Action: Add responsive `srcset`/sizes, image compression (webp/avif), and a CDN or image proxy for resizing and caching.

9) Cache headers for static assets
   - Action: Add long-lived cache headers for images and built assets (`Cache-Control: public, max-age=31536000, immutable`) and short-lived for HTML.

10) Large client bundle potential
   - Libraries: Framer Motion, GSAP, Lenis, Shadcn/Radix, Recharts, etc.
   - Action: Ensure code-splitting (already uses lazy components), tree-shake unused icons/components, and scope animation libraries only where necessary.

11) SQLite performance considerations
   - `better-sqlite3` is synchronous; fine for small to medium workloads but not horizontally scalable.
   - Action: Monitor DB size and query times; consider indices on filter columns and potentially a future migration path if scaling.

12) Product filtering
   - Filtering is done at the DB level (good). Confirm indices on `dimension`, `surface`, `body_type`, `category`, and `is_active`.

---

### Low Priority (Hygiene & DX)
13) Error handling consistency
   - You have a global error handler; ensure all routes `next(err)` on caught exceptions.

14) Logging
   - Add structured logging (pino/winston) with proper log levels.

15) Environment handling
   - Add `.env.example` with required keys; validate at startup.

16) Privacy & compliance
   - If collecting user data at scale, document retention, deletion policies, and audit trails.

---

### Concrete Recommendations (Checklist)
- [ ] Restrict CORS `origin` to an allowlist; keep `credentials: true` only if required
- [ ] Enforce required secrets (JWT/Session) and remove hardcoded defaults
- [ ] Add CSRF protection (token-based) when using cookies with credentials
- [ ] Add `helmet()` and configure CSP, HSTS, X-Frame-Options, Referrer-Policy
- [ ] Implement rate limiting (e.g., `express-rate-limit`) on auth and write endpoints
- [ ] Harden file uploads (size/type limits, sanitization, storage path safety)
- [ ] Add backend input validation with Zod/Joi for all API payloads
- [ ] Optimize images (webp/avif), add `srcset`, and consider a CDN or image proxy
- [ ] Add cache headers for static assets
- [ ] Audit and reduce bundle size; keep animations scoped
- [ ] Add DB indices on product filter columns; review query plans
- [ ] Add structured logging and error reporting (Sentry/LogRocket for FE)
- [ ] Provide `.env.example` and startup validation

---

### Quick Wins (can be implemented in <1 day)
1. Add `helmet()` to backend and restrict CORS origins
2. Add `express-rate-limit` to `/api/auth/*` and write routes
3. Enforce `JWT_SECRET` / `SESSION_SECRET` via env-only; fail if missing
4. Add simple upload file filters and size limits in multer
5. Add cache headers for images; compress several heavy hero/background images

---

### Observations on UX and Accessibility
- Recent simplifications (removing extra icons and animations) improved clarity.
- Ensure color contrast meets WCAG AA where text appears over images.
- Provide focus states for buttons/links; current design appears to have hover-only emphasis in some places.

---

### Conclusion
The project is close to production-ready for a controlled environment. Addressing the highlighted security items (CORS, secrets, CSRF, headers, rate limiting, uploads validation) and image/caching optimizations will materially improve security posture and performance without heavy refactoring.


