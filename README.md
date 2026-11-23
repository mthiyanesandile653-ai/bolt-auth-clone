# FSX Global Command Centre

A responsive, neon-style command dashboard inspired by the screenshot supplied in the project conversation.

## Run and test

Serve the repository over HTTPS (GitHub Pages works) or locally:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Working tools

- **Command:** safe, allow-listed page commands (`help`, `time`, `status`, `countries`, `search <query>`, `clear`). This never invokes an operating-system shell.
- **Scanner:** computes a SHA-256 file fingerprint locally in the browser; it does not upload or execute the file.
- **Voice AI:** uses browser speech recognition and speech synthesis where supported and permission is granted.
- **World:** retrieves and filters live country data from REST Countries.
- **Earth:** loads NASA's Astronomy Picture of the Day using the public demo API key (subject to NASA rate limits).
- **Discovery:** searches Wikipedia through its public API.

Live API tools need an internet connection. Browser microphone recognition varies by browser; Chrome on HTTPS or localhost is recommended. File hashing uses the browser Web Crypto API.

## Deployment

The static site is ready for GitHub Pages or another static host. No API credentials or backend secrets are required for the implemented features.
