# Anup Varghese — Personal Brand Website

A cinematic, mobile-first rebuild of anupvarghese.com. The site presents two
connected professional tracks—speaker/counsellor and strategic advisor—along
with an upcoming book, event gallery and enquiry flow.

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Launch checklist

1. Replace the remote hero video and all placeholder photos with approved,
   compressed assets. Keep a 16:9 poster image and mobile-weight video.
2. Replace the placeholder school/institute trust row with approved names or
   logo files.
3. Confirm permission before publishing employer/alumni logos or identifying
   sensitive clients.
4. Update biography, social links, email address and final book copy.
5. Copy `.env.example` to `.env.local` and add a Web3Forms access key.
6. Add hCaptcha or Turnstile to the form before public launch.
7. Deploy to Vercel, connect `anupvarghese.com`, and verify form delivery,
   analytics, metadata and redirects from the old GoDaddy pages.

## Content and performance notes

- The background film is hidden for visitors using reduced-motion settings.
- Images lazy-load and the gallery is keyboard dismissible.
- The current external media is demonstration content only and is not intended
  for production licensing or final brand presentation.
- The contact endpoint validates and truncates input server-side, includes a
  honeypot, and keeps the form provider key out of browser code.
