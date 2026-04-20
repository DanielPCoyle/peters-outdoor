-  SMS reminders (Twilio). 24h + 2h before tour — meeting location, parking, what to bring. Cuts no-show rate measurably; no-shows are pure margin loss.
- Abandoned-checkout recovery. Stripe payment intents that never succeed → email nudge 1h / 24h later. Usually 5–10% of lost checkouts recoverable.                    
- Loyalty / referral codes. You already have DiscountCode; extend with a per-customer referral code (repeat-guest LTV is high for eco-tours).                          
- Blog on Builder.io. You have the CMS but no /blog. Wildlife/seasonal/"best time to see dolphins" posts are low-cost local-SEO gold.    
Reliability & trust (easy to bundle as a retainer)                                                                                                                                    
- Error monitoring (Sentry) + uptime (BetterStack). ~30 min of setup, ongoing value.                                                                                   
- Admin 2FA + API rate limiting. adminAuth.ts is light; worth hardening before a bot finds /api/admin/login.
- Automated DB backups + restore runbook beyond Supabase defaults.                                                                                                     
- Lighthouse/axe CI on PRs — you're selling to people who care about nature; the site should score 95+.          