# MitraVoice — Full-stack prototype

A mobile-first React + Vercel Functions + Neon Postgres prototype based on the MitraVoice build plan.

## Features
- Language selector: English, Hindi, Bengali, Telugu, Tamil and Marathi (some labels translated; topic content is currently English).
- Chat API (`POST /api/chat`) with sample rule-based answers.
- Rights / information hub (`GET /api/topics`) with browser speech output.
- Incident reporting with a 3-level trust ladder:
  - Private: saved only in browser localStorage; never sent to API.
  - Anonymous: sends incident fields without name or phone.
  - Formal: sends report and optional name/phone to the database; it is NOT delivered to an NGO.
- Anonymous feedback API (`POST /api/feedback`).
- Voice input via browser SpeechRecognition where supported.
- Browser speech output via SpeechSynthesis.
- Emergency voice draft saved locally in browser; optional `tel:112` call action.

## Stack
- Frontend: React + Vite
- Backend: Vercel serverless functions in `/api`
- Database: Neon Postgres (`@neondatabase/serverless`)

## 1. Run locally
You need Node.js 20 or newer.

```bash
npm install
cp .env.example .env
```

Create a free Postgres database at https://neon.tech, copy its connection string into `.env` as `DATABASE_URL`, then:

```bash
npm run dev
```

Note: Vite does not automatically run Vercel API functions. To test the complete app locally, install Vercel CLI and use:

```bash
npm install -g vercel
vercel dev
```

Open the local URL printed by Vercel.

## 2. Push to GitHub
Create an empty GitHub repository, then from this folder run:

```bash
git init
git add .
git commit -m "Build MitraVoice full-stack prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

Replace the remote URL with your own GitHub repository URL. Never commit `.env`.

## 3. Deploy on Vercel
1. Sign in at https://vercel.com and choose **Add New → Project**.
2. Import your GitHub repository.
3. Framework preset should detect **Vite**.
4. Build command: `npm run build`; output directory: `dist`.
5. In Project → Settings → Environment Variables, add:
   - Name: `DATABASE_URL`
   - Value: your Neon Postgres connection string
   - Environment: Production (also Preview if desired)
6. Deploy. After adding or changing environment variables, redeploy.
7. Test `https://YOUR-APP.vercel.app/api/health` and then test submitting a demo report.

The tables are created automatically the first time an incident or feedback is submitted. The `/api/health` route confirms whether the environment variable is present; it does not perform a database connectivity check.

## API endpoints
- `GET /api/health`
- `GET /api/topics`
- `POST /api/chat` body: `{ "language": "en", "message": "How do I check my wage slip?" }`
- `POST /api/incidents` body includes `category`, `description`, `date`, `place`, `factoryCode`, `trustLevel` (`anonymous` or `formal`), and optional `contactName` / `contactPhone` for formal reports.
- `POST /api/feedback` body includes `category`, `description`, optional `factoryCode`.

## Important safety and privacy limitations
This is a hackathon / learning prototype, not a secure worker grievance platform.
- Formal complaints are stored in the database only. No NGO, employer, hotline or grievance officer is connected.
- There is no login, user authentication, role-based admin portal, encryption-at-rest configuration managed by this project, audit trail, retention policy, or abuse/rate-limit protection.
- Private logs and emergency voice drafts are stored in browser localStorage. They are not encrypted and may be accessible to someone using the same device/browser. Large audio files can exceed browser storage limits.
- Anonymous reports omit name/phone database fields, but text descriptions and optional factory codes may still identify a person or workplace. Hosting providers may retain technical request logs; do not promise absolute anonymity.
- Do not enter real worker names, phone numbers, sensitive allegations, or evidence into a public deployment until security, consent, access control, legal review, data retention and NGO routing are implemented and tested.
- The chat answers are static sample guidance, not an LLM, legal advice or a verified legal knowledge base.
- Speech recognition depends on browser/device support and may send audio to the browser vendor's speech service.

## Next steps before real-world use
Add authentication and a worker-safe account recovery model, encrypted/private file storage, strict role-based NGO dashboard, verified local legal content, rate limiting, abuse monitoring, secure complaint delivery, consent receipts, retention/deletion workflows, and an independent security review.
