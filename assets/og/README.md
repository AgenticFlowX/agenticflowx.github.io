# Link-preview image

`agenticflowx.png` (1200×630) is the `og:image` and `twitter:image` for every page, used by WhatsApp,
Slack, iMessage, LinkedIn, and X. It is rendered from `card.html`, which reuses the site styles.

Regenerate after changing the hero:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
  --force-device-scale-factor=1 --window-size=1200,630 --virtual-time-budget=3000 \
  --screenshot="$PWD/assets/og/agenticflowx.png" "file://$PWD/assets/og/card.html"
```

Keep the file under about 300 KB so WhatsApp shows the large preview. Messaging apps cache previews,
so an already-shared link may keep the old image for a while.
