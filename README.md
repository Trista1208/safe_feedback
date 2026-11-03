# Anonymous Student Feedback — HSLU Applied Data Science & AI

A static feedback page (hosted free on GitHub Pages) that sends answers into a Google Sheet only the team can see. No names, emails, IPs, cookies or analytics are collected, and only the date (not the time) is stored.

**Setup takes about 10 minutes.**

---

## Step 1 — Create the Google Sheet (where answers land)

1. Go to <https://sheets.new> and name the sheet, e.g. `ADS&AI Anonymous Feedback`.
2. Click **Extensions → Apps Script**.
3. Delete what's in the editor and paste the contents of `Code.gs`. Click **Save**.
4. Click **Deploy → New deployment**.
   - Gear icon → **Web app**
   - **Execute as:** `Me`
   - **Who has access:** `Anyone` ← important: *not* "Anyone with a Google account", so students never need to sign in and Google never tells you who they are.
5. Click **Deploy**, approve the permissions (Google warns because it's your own unverified script: *Advanced → Go to project*).
6. Copy the **Web app URL** (it ends in `/exec`).

> Quick check: open that URL in a browser. You should see `{"status":"Feedback endpoint is running"}`.

## Step 2 — Connect the page

Open `index.html`, find this line near the bottom and paste your URL:

```js
const ENDPOINT = "PASTE_YOUR_APPS_SCRIPT_URL_HERE";
```

## Step 3 — Publish on GitHub Pages

1. On GitHub, click **New repository**, e.g. `ads-ai-feedback`, set it to **Public** (needed for free Pages).
2. **Add file → Upload files** → upload `index.html` (and this README). Commit.
3. Go to **Settings → Pages** → *Source:* **Deploy from a branch** → Branch: `main`, folder `/ (root)` → **Save**.
4. After ~1 minute your link is live:
   `https://<your-github-username>.github.io/ads-ai-feedback/`

Share that link (or a QR code of it) with students.

## Step 4 — Test it

Submit a test message on the live page, then check the **Feedback** tab in your Google Sheet.

---

## Good to know

- **Updating the script:** after editing `Code.gs`, use **Deploy → Manage deployments → Edit (pencil) → Version: New version**. This keeps the same URL.
- **Who can read answers:** only people you share the Google Sheet with.
- **Public repo:** the code is visible, but the answers are not — they live only in your private Sheet. The endpoint URL is visible in the code; worst case someone could send spam, which the hidden honeypot field and 5000-character limit help reduce.
- **Small cohorts:** in very small classes, topic + mood + date could still hint at who wrote something. That's why only the date is stored and students are reminded not to include identifying details.
- **Change texts/topics:** edit the `T` object (English & German) and `TOPIC_KEYS` in `index.html`.
