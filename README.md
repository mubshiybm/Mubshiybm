<<<<<<< HEAD
# M & H

A React/Vite personal planner for study, prayer, meals, rest, reflection, wedding countdowns, and private local chat.

## Run locally

Install Node.js 20 or newer, then from this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. The app routes are:


The shared password is configured in `src/App.jsx`. For a real public deployment, replace the client-only gate with server-side authentication before sharing private information.

## Production build

```bash
npm run build
npm run preview
```

## Git

```bash
git init
git add .
git commit -m "Convert Lumen to React"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/lumen.git
git push -u origin main
```

Do not commit real photos, secrets, or `.env` files. The `.gitignore` excludes dependencies, build output, and environment files.

## Deploy with Vercel

1. Push the repository to GitHub.
2. Go to Vercel and choose **Add New Project**.
3. Import the repository.
4. Framework preset: **Vite**.
5. Build command: `npm run build`.
6. Output directory: `dist`.
7. Deploy.

`vercel.json` keeps React routes working on direct refreshes.

## Deploy with Netlify

1. Push the repository to GitHub.
2. Create a new Netlify site from the repository.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Deploy.

`public/_redirects` keeps React routes working on direct refreshes.

## Important privacy note

The current app stores schedule data, reflections, chat messages, and wedding details in browser storage. The chat page is not cross-device messaging yet. To share messages between two people, add a secure backend such as Supabase or Firebase with authentication, database rules, and protected file storage for voice notes.

## Enable realtime Chat

1. Create a Supabase project.
2. Open **SQL Editor** and run [`supabase/schema.sql`](supabase/schema.sql).
3. Copy `.env.example` to `.env.local`.
4. Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Restart Vite with `npm run dev`.

The React Chat page automatically switches from local mode to realtime mode when both variables are present. Before publishing private conversations, replace the temporary room policies in `supabase/schema.sql` with Supabase Auth-based policies that restrict rows and voice files to the two authenticated users.

The approved app emails are `mubshiybm@gmail.com` and `haleemah@gmail.com`. The current client gate requires one of those emails plus the shared password; production access should enforce the same allowlist with Supabase Auth policies.
=======
## Hi there 👋

<!--
**mubshiybm/Mubshiybm** is a ✨ _special_ ✨ repository because its `README.md` (this file) appears on your GitHub profile.

Here are some ideas to get you started:

- 🔭 I’m currently working on ...
- 🌱 I’m currently learning ...
- 👯 I’m looking to collaborate on ...
- 🤔 I’m looking for help with ...
- 💬 Ask me about ...
- 📫 How to reach me: ...
- 😄 Pronouns: ...
- ⚡ Fun fact: ...
-->
>>>>>>> origin/main
