# Exact phone installation guide

Offline Saathi v0.2 is currently **source code, not a publicly deployed URL**. Install needs a trustworthy HTTPS link served from a static hosting provider. The simplest deployment is to upload all files together to a static hosting service from your PC while connected to internet. For GitHub Pages, create a public repository, upload the **files inside** `offline-saathi-v0.2` to the repository root, and in Settings > Pages set deployment from the main branch and root. Wait for the provider to show an `https://...github.io/.../` URL; visit it online and make sure the page says v0.2 before installing. Do not upload note backups. Do not treat the host as a trusted security provider without review.

ANDROID — Chrome: Open the HTTPS URL > menu ⋮ > Install app (or Add to Home screen) > Install > launch from home screen > Notes > create passphrase > save fictional note > turn Airplane mode on > launch app > unlock.

iPHONE — Safari: Open the HTTPS URL > Share icon > Add to Home Screen > Add (enable Open as Web App if offered) > launch the icon > Notes > create passphrase > save fictional note > turn Airplane mode on > relaunch app > unlock. If you opened the app in Safari before installing, do not assume Safari notes exist in the standalone icon; each installation has its own storage conditions.

IMPORTANT: Installing from a DIFFERENT origin makes a new separate vault. Your PC's localhost notes do not move to the phone automatically; v0.2 exports are encrypted JSON with no plaintext content, but import only supports a matching vault. There is no cross-device migration UI in v0.2. Do not delete the original installation or browser site data until a tested backup and migration procedure exists.
