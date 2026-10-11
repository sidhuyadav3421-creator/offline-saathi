# Offline Saathi v0.2 — source code (MIT)

A bilingual offline-first safety-information PWA for India. No analytics, accounts, network submission, tracking, online maps, or Bluetooth communication.

## CRITICAL SECURITY NOTICE

**Experimental, not independently audited. Do not trust for high-risk evidence or sensitive identities.** New incident notes are encrypted at rest in IndexedDB using Web Crypto AES-256-GCM with a random nonce per note and PBKDF2-HMAC-SHA-256 (310,000 iterations, random salt) to derive a non-exportable in-memory key from the passphrase. All fields inside each record are encrypted, including category and date/time. Encryption DOES NOT protect against a device that is unlocked, malicious browser extensions/scripts, spyware, screenshots, weak passphrases, backups, or forensic remnants. The passphrase cannot be recovered. Existing v0.1 notes remain plaintext until separately deleted. Browser eviction/clearing and reinstalling can erase the vault. Never use incognito mode for storage.

Encrypted backups are downloadable JSON and can be re-imported into the **same vault** only. The passphrase is not included in the export. Backups from a different vault are not supported for importing into an existing vault. Copy your encrypted backup to safe storage; without its passphrase it cannot be recovered. Delete actions do not guarantee forensic erasure.

## Run on Windows (locally, no external Internet required)

1. Extract the ZIP. Open the `offline-saathi-v0.2` folder. In File Explorer, click the address bar, type `cmd`, press Enter.
2. Run `py -m http.server 8001` and visit `http://localhost:8001/` in Chrome. You can leave Wi-Fi disconnected.
3. Create a test vault password (at least 12 characters). Save a fictional note, lock, refresh, unlock and verify it returns.
4. Test offline cache: visit once while the server is running; stop the server with Ctrl+C; reload. The UI should work if the service worker finished precaching.
5. Existing v0.1 notes were at `http://localhost:8000`, which is a **different origin** than port 8001. They won't appear automatically at 8001. See migration instructions below.

## Upgrade v0.1 on the same origin (optional)

Your v0.1 note database is scoped to its exact browser origin (`http://localhost:8000`). If you want to migrate, first EXPORT the plaintext JSON as an external emergency backup from v0.1 (and store safely). Then **back up the original v0.1 folder**. Close Chrome tabs displaying Saathi, replace the CONTENTS of your original `offline-saathi` directory with these v0.2 files (do not delete existing browser site data), and run `py -m http.server 8000` in that directory. On `http://localhost:8000`, reload twice if necessary as service-worker updates activate. Verify version 0.2 in the page heading; open Incident notes, create/unlock a vault, select **Encrypt a copy of old notes**, verify all notes, make an encrypted backup, and only then choose **Delete old plaintext notes**. Never delete browser site data to force a refresh: that may erase the original database. If anything appears wrong, stop and seek help before deleting anything.

## Install on Android/iPhone

A PWA needs a stable public HTTPS URL for ordinary phone installation. `localhost` on your Windows PC cannot be visited as `localhost` from your phone. **No live public URL is included**; deploying/hosting is a separate action.

For a test deployment, upload the complete contents of this folder to a reputable static HTTPS host (e.g. GitHub Pages or Cloudflare Pages). This creates a public site; the files are public open source, but notes stay in each browser's local storage. Review hosting trust, CSP, HTTPS, versioning and security before recommending to other people. Never publicly upload private backup files or incident notes.

- **Android / Chrome:** visit the HTTPS site once online, open Chrome menu (⋮), choose **Install app** or **Add to Home screen**, confirm, open the installed icon, create a vault and test offline by enabling Airplane mode, then reopening.
- **iPhone / Safari:** visit the HTTPS site in Safari, tap **Share**, **Add to Home Screen**, **Add**, then open the added icon. If **Open as Web App** appears, enable it. Create a vault there and test in Airplane mode. Storage for Safari and an installed web app may differ; do not assume their incident notes automatically synchronize. iOS may evict cached resources after long inactivity or storage pressure.
- Always open the app once online after updates; check cache status under Safety & privacy. A service worker can cache files but the browser can evict them.

**No phone Bluetooth chat is implemented.** LocalSend requires shared local Wi-Fi; Briar is Android-only; Bridgefy requires a separate app and is not a secure evidence channel. Offline Saathi does not have bundled street-map data: use Organic Maps and download your region before an outage. Live transport closures cannot be tracked offline.

## Project files

- `index.html` bilingual interface
- `app.js` emergency guides, UI and incident note workflow
- `vault.js` encryption and IndexedDB vault
- `style.css` styling
- `sw.js` service-worker offline cache, version 2
- `manifest.webmanifest` install metadata
- `icon.svg` vector icon
- `LICENSE` MIT License

## Manual acceptance checklist

1. Create strong passphrase and fictional note. Lock: notes disappear; refresh: vault remains locked; unlock with wrong password fails; unlock with correct password reveals note.
2. Export backup and verify the JSON file does NOT contain your plaintext incident text. Import into the same vault should work.
3. Disconnect internet, stop server, reload. Guides and previously stored encrypted notes should still work.
4. Simulate migration only with a backup. Verify copies first; old plaintext is not automatically deleted.
5. Test Android and iPhone separately on a deployed HTTPS origin. Do not assume passing desktop tests implies successful mobile install.
