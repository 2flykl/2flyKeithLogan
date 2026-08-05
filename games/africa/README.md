# I Woke Up Ready — Playable Experience

A standalone, responsive HTML/CSS/JavaScript experience for the **I Woke Up in Africa** website.

## Quick setup

1. Upload the entire `i-woke-up-ready-playable` folder to your web host or GitHub repository.
2. Open `index.html` directly, or link to its published URL.
3. Replace the three placeholder links near the bottom of `index.html`:
   - Explore the Story
   - Listen to the Soundtrack
   - Help 2fly Create

## Wix / Wix Studio

The cleanest setup is to host this folder on GitHub Pages, Render, Netlify, or your existing web host, then embed the published page in Wix with an HTML iframe/embed element.

Recommended iframe height:
- Desktop: 900–1100 px
- Mobile: 1100–1400 px

For a full-screen experience, link to it as its own page rather than placing it in a short embed.

## Included features

- Four-stage guided reflection
- Responsive cinematic landscape
- Rising-sun progression
- Subtle optional Web Audio tones
- Press-and-hold “Carry the Light” finale
- Personalized intention
- Downloadable landscape certificate
- Downloadable vertical story card
- Local browser journal storage
- No external libraries or paid services required

## Brand customization

Main colors are at the top of `styles.css`:

```css
:root {
  --forest: #123b32;
  --teal: #087f83;
  --sunrise: #e69b45;
  --clay: #9a4f32;
  --sand: #f1dfc1;
  --gold: #c89a46;
}
```

## Notes

- The downloadable certificate and story card are generated entirely in the browser.
- The user’s prior intentions are stored only in that browser’s local storage.
- No personal information is sent to a server.
- Placeholder links intentionally show a message until you replace their `href="#"` values.
