# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-01-12

### 🔒 Security Hardening

#### Authentication & Authorization
- **Admin access control**: Replaced client-side admin checks with secure server-side `is_admin()` database function using `SECURITY DEFINER`
- **Fail-secure defaults**: Admin access now denied on error - never allows access by default
- **Demo mode disabled**: Production builds now default to `demoMode: false` in AdminGuard and Admin page
- **Input validation**: Added Zod schema validation for login/signup forms with strong password requirements (8+ chars, uppercase, lowercase, number)

#### Edge Functions
- **CORS hardening**: Replaced wildcard CORS (`*`) with explicit `ALLOWED_ORIGINS` whitelist
- **GDPR compliance**: Removed IP address logging from rate limiting to protect user privacy
- **Session fingerprinting**: Implemented privacy-preserving session fingerprint for anonymous rate limiting
- **Rate limit security**: Prioritizes authenticated `user_id` over session fingerprints for rate limiting

#### Database Security
- **RLS policies**: Added secure UPDATE policy for `admin_users` table restricted to existing admins
- **Trigger hardening**: Set explicit `search_path` and `SECURITY DEFINER` on `feedback_update_timestamp()` function
- **SQL injection prevention**: Rate limit queries use parameterized statements

### ✨ New Features

#### PWA Support
- Added Progressive Web App capabilities with `vite-plugin-pwa`
- Created app manifest with proper icons (192x192, 512x512, apple-touch-icon)
- Added `/install` page with installation instructions for all platforms
- Configured offline-capable service worker

#### Screenshot Capture
- Added screenshot capture functionality to feedback form using html2canvas
- Users can capture and attach visual context to their feedback
- Preview thumbnail shown before submission

### 🔧 CI/CD

- Added GitHub Actions workflow (`.github/workflows/ci.yml`)
- Automated linting with ESLint
- TypeScript type checking
- Production build verification
- Build artifact upload for deployment

### 📚 Documentation

- Updated README with security implementation details
- Added setup verification guide
- Documented all three tiers (Basic, Standard, Pro)
- Added quick start guide for both Lovable and self-hosted setups

## [1.0.0] - 2026-01-01

### Initial Release

- Feedback collection widget with element picker
- Admin dashboard for feedback management
- Three-tier configuration (Basic, Standard, Pro)
- AI-powered feedback analysis (Pro tier)
- Supabase integration with RLS
- Demo mode for testing

---

## Upgrade Guide

### From 1.x to 2.0

1. **Security**: Review and update your `ALLOWED_ORIGINS` in edge functions if you have custom domains
2. **Auth forms**: Existing users may need to update passwords to meet new strength requirements
3. **Demo mode**: If you were relying on demo mode being enabled by default, explicitly set `demoMode={true}`

### Environment Variables

Ensure these are set in your deployment:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`

For GitHub Actions, add these as repository secrets.
