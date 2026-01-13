# Usage Examples

This directory contains ready-to-use examples for integrating the Feedback Widget at different tiers.

## Quick Reference

| Example | Use Case | AI Features | Admin Dashboard |
|---------|----------|-------------|-----------------|
| [basic-tier.tsx](./basic-tier.tsx) | Simple feedback collection | ❌ | ❌ |
| [standard-tier.tsx](./standard-tier.tsx) | Full features without AI | ❌ | ✅ |
| [pro-tier.tsx](./pro-tier.tsx) | AI-powered feedback | ✅ | ✅ |
| [custom-integration.tsx](./custom-integration.tsx) | Advanced customization | Optional | Optional |
| [with-auth.tsx](./with-auth.tsx) | User authentication | Optional | ✅ |

## Getting Started

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Copy the Feedback Module

Copy the `src/feedback/` directory to your project.

### 3. Set Up Supabase

Run the SQL migrations from `supabase/migrations/` in your Supabase project.

### 4. Choose Your Tier

Pick the example that matches your needs and copy the implementation pattern.

## Tier Comparison

### Basic Tier
- ✅ Feedback collection
- ✅ Category selection
- ✅ Anonymous submissions
- ❌ Screenshot capture
- ❌ AI features
- ❌ Admin dashboard

### Standard Tier
- ✅ Everything in Basic
- ✅ Screenshot capture
- ✅ Severity levels
- ✅ Admin dashboard
- ✅ Statistics
- ❌ AI features

### Pro Tier
- ✅ Everything in Standard
- ✅ AI summarization
- ✅ Auto-categorization
- ✅ Developer prompt generation
- ✅ Sentiment analysis

## Need Help?

- [Full Documentation](../README.md)
- [GitHub Issues](https://github.com/thecardsguy/feedback-chatbot/issues)
- [Lovable Discord](https://discord.gg/lovable)
